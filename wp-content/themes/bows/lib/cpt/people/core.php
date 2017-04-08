<?php
if ( $_SERVER['SCRIPT_FILENAME'] == __FILE__ ) {
	die("Access denied.");
}

if ( !class_exists('People') ) {

	/**
	 * A class that adds a cpt for People items
	 *
	 * @package StrictlyComeDancing
	 */
	class People
	{
		const VERSION		= '1.0';
		const PREFIX		= 'scdp_';
		const POST_TYPE		= 'people';
		const TAXONOMY		= 'scdp-cat';

		/**
		 * Constructor
		 */
		public function __construct()
		{
			// Register actions, filters
			add_action( 'init',									array( $this, 'createPostType') );
			add_action( 'after_setup_theme', 					array( $this, 'addImageSizes' ), 11 );
			add_action( 'admin_menu', 							array( $this, 'addReOrderMenu') );
			add_action( 'admin_enqueue_scripts',				array( $this, 'loadAdminResources' ) );
			add_action( 'wp_ajax_update-'.self::POST_TYPE.'-order',
																array( $this, 'saveAjaxOrder') );

			//for removing links to view the post on the frontend
			add_action( 'wp_before_admin_bar_render', 			array( $this, 'removeViewButtonFromAdminBar') );
			add_filter( 'pre_get_shortlink',					array($this, 'removeShortlinkField'), '', 4);
			add_filter( 'post_row_actions', 					array($this, 'removeViewLinkFromAdminList'), 10, 1 );
			add_filter( 'post_updated_messages', 				array($this, 'updateMessages') );
			add_filter( 'get_sample_permalink_html',			array($this, 'removePermalinkField'), '', 4);

		}

		/**
		 * Registers the custom post type
		 */
		public function createPostType()
		{
			if ( !post_type_exists( self::POST_TYPE ) )
			{
				//Registers the category taxonomy
				if ( !taxonomy_exists( self::TAXONOMY ) ) {
					register_taxonomy(
						self::TAXONOMY,
						self::POST_TYPE,
						array(
							'label'					=> 'Category',
							'labels'				=> array( 'name' => 'Category', 'singular_name' => 'Category' ),
							'hierarchical'			=> true,
							'public'				=> true,
							'update_count_callback'	=> '_update_post_term_count'
						)
					);
				}

				$labels = array
				(
					'name'					=> __( 'People' ),
					'singular_name'			=> __( 'Person' ),
					'add_new'				=> __( 'Add New Person' ),
					'add_new_item'			=> __( 'Add New Person' ),
					'edit'					=> __( 'Edit Person' ),
					'edit_item'				=> __( 'Edit Person' ),
					'new_item'				=> __( 'Add New Person' ),
					'view'					=> __( 'View Person' ),
					'view_item'				=> __( 'View Person' ),
					'search_items'			=> __( 'Search People' ),
					'not_found'				=> __( 'No entries found' ),
					'not_found_in_trash'	=> __( 'No entries found in Trash' )
				);

				register_post_type(
					self::POST_TYPE,
					array
					(
						'labels'			=> $labels,
						'singular_label'	=> 'Person',
						'public'			=> true,
						'exclude_from_search' => true,
						'has_archive' 		=> false,
						'menu_position'		=> 6.1,
						'hierarchical'		=> false,
						'menu_icon' 		=> 'dashicons-groups',
						'supports'			=> array('title','thumbnail','editor','revisions'),
					)
				);
			}
		}

		/**
		 * Load CSS and JavaScript files
		 */
		public function loadAdminResources()
		{
			global $typenow;

			if ($typenow==self::POST_TYPE) {
				wp_enqueue_script('jquery-ui-sortable');

				wp_enqueue_style(
						'people',
						get_template_directory_uri() . '/lib/cpt/people/css/people.css',
						false,
						false,
						'screen');
			}
		}

		/**
		 * Registers the custom post type
		 */
		public function addImageSizes()
		{
			//add a custom image size for leadership images
			//this size is the post thumbnail size now as it's also used on other custom post types
			add_image_size( 'people', 400, 220, true );
		}

		/**
		 * Gets the published entries from the database
		 * @param mixed $categories null for all, or an array with category slugs to include only those categories
		 * @return array
		 */
		public function getEntries($args = array())
		{
			$args['post_type'] = self::POST_TYPE;
			$args['orderby']   = 'menu_order';
			$args['order'] 	   = 'ASC';

			if (!isset($args['numberposts'])) {
				$args['numberposts'] = -1;//all posts
			}

			return get_posts( $args );
		}




		//concerned with removing the option to view the post on the frontend:

		/**
		 * Removes the 'view' link in the admin bar
		 *
		 */
		function removeViewButtonFromAdminBar()
		{
			global $wp_admin_bar;
			if ( get_post_type() === self::POST_TYPE) {
				$wp_admin_bar->remove_menu('view');
			}
		}

		/**
		 * Remove the get shortlink button for this post type, as we can't view single items anywhere
		 */
		function removeShortlinkField($false, $post_id)
		{
			return self::POST_TYPE === get_post_type( $post_id ) ? '' : $false;
		}

		/**
		 * Removes the 'view' button in the posts list page
		 *
		 * @param $actions
		 */
		function removeViewLinkFromAdminList( $actions ) {

			if ( get_post_type() === self::POST_TYPE ) {
				unset( $actions['view'] );
			}
			return $actions;
		}

		/**
		 * Remove the permalink area for this post type, as we can't view single items anywhere
		 */
		function removePermalinkField($return, $id, $new_title, $new_slug)
		{
			global $post;

			if (strpos($return, self::POST_TYPE) !==FALSE ) {
				$return = '';
			}

			return $return;
		}

		/**
		 * update messages.
		 *
		 * See /wp-admin/edit-form-advanced.php
		 *
		 * @param array $messages Existing post update messages.
		 *
		 * @return array Amended post update messages with new CPT update messages.
		 */
		function updateMessages( $messages ) {
			$post             = get_post();
			$post_type        = get_post_type( $post );
			$post_type_object = get_post_type_object( $post_type );
			$singular 		  = $post_type_object->labels->singular_name;

			$messages[self::POST_TYPE] = array(
					0 => '', // Unused. Messages start at index 1.
					1 => __($singular.' updated.'),
					2 => __('Custom field updated.'),
					3 => __('Custom field deleted.'),
					4 => __($singular.' updated.'),
					5 => isset($_GET['revision']) ? sprintf( __($singular.' restored to revision from %s'), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
					6 => __($singular.' published.'),
					7 => __('Page saved.'),
					8 => sprintf( __($singular.' submitted. <a target="_blank" href="%s">Preview '.strtolower($singular).'</a>'), esc_url( add_query_arg( 'preview', 'true', get_permalink($post_ID) ) ) ),
					9 => sprintf( __($singular.' scheduled for: <strong>%1$s</strong>. <a target="_blank" href="%2$s">Preview '.strtolower($singular).'</a>'), date_i18n( __( 'M j, Y @ G:i' ), strtotime( $post->post_date ) ), esc_url( get_permalink($post_ID) ) ),
					10 => sprintf( __($singular.' draft updated. <a target="_blank" href="%s">Preview '.strtolower($singular).'</a>'), esc_url( add_query_arg( 'preview', 'true', get_permalink($post_ID) ) ) ),
			);
			return $messages;
		}

		/*concerned with reorder submenu item*/
		/**
		 * Add the Re Order menu page to the backend sidebar
		 */
		public function addReOrderMenu()
		{
			add_submenu_page('edit.php?post_type='.self::POST_TYPE, 'Re Order', 'Re Order', 'edit_others_posts', 'order-post-types-'.self::POST_TYPE, array( $this, 'SortPage') );
		}

		/**
		 * markup for the Re Order page
		 */
		function SortPage()
		{
			global $typenow;
			$post_type_object = get_post_type_object($typenow);
			$singular 		  = $post_type_object->labels->singular_name;
			?>
		    <div class="wrap">
                <h2><?php echo $singular; ?> Re Order</h2>

		        <div id="ajax-response"></div>

		        <noscript>
			        <div class="errormessage">
				        <p>This plugin can't work without javascript, because it's use drag and drop and AJAX.</p>
			        </div>
		        </noscript>

		        <div id="order-post-type">
			        <ul id="sortable" class="sortablelist">
				        <?php
				        //list the pages according to menu order
				        $entries = self::getEntries();
				        if (is_array($entries)) {
					        foreach ($entries as $entry) {
					        	?><li id="item_<?php
					        	echo $entry->ID; ?>"><span><?php
					        	echo $entry->post_title; ?></span></li><?php
					        }
				        }
				        ?>
			        </ul>

			        <div class="clear"></div>
		        </div>

		        <p class="submit">
			        <a href="#" id="save-order" class="button-primary">Update</a>
		        </p>

		        <script type="text/javascript">
			        jQuery(document).ready(function() {
				        jQuery("#sortable").sortable({
					        'tolerance':'intersect',
					        'cursor':'pointer',
					        'items':'li',
					        'placeholder':'placeholder',
					        'nested': 'ul'
				        });

				        jQuery("#sortable").disableSelection();
				        jQuery("#save-order").bind( "click", function() {
					        jQuery.post( ajaxurl, { action:'update-<?php echo self::POST_TYPE; ?>-order', order:jQuery("#sortable").sortable("serialize") }, function() {
						        jQuery("#ajax-response").html('<div class="message updated fade"><p>Items Order Updates</p></div>');
						        jQuery("#ajax-response div").delay(3000).hide("slow");
					        });
				        });
			        });
		        </script>

	        </div>
	        <?php
        }

        /**
         * save the new order when the user clicks update on the re order page
         * This request comes in via ajax
         */
        public function saveAjaxOrder()
        {
		    global $wpdb;
        	parse_str($_POST['order'], $data);

        	if (is_array($data)) {
        		foreach ($data as $key => $values ) {
        			if ( $key == 'item' ) {
        				foreach( $values as $position => $id ) {
        					$wpdb->update( $wpdb->posts, array('menu_order' => $position, 'post_parent' => 0), array('ID' => $id) );
        				}
        			}
        		}
        	}
        }

	} // end People

	//create an instance of the class
	if ( class_exists('People') ) {
		$people = new People();
	}
}


