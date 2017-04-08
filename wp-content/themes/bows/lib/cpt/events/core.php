<?php
if ( $_SERVER['SCRIPT_FILENAME'] == __FILE__ ) {
	die("Access denied.");
}

if ( !class_exists('Events') ) {

	/**
	 * A class that adds a cpt for People items
	 *
	 * @package StrictlyComeDancing
	 */
	class Events
	{
		const VERSION		= '1.0';
		const PREFIX		= 'scde_';
		const POST_TYPE		= 'events';
		const TAXONOMY		= 'scde-venue';

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
							'label'					=> 'Venue',
							'labels'				=> array( 'name' => 'Venues', 'singular_name' => 'Venue' ),
							'hierarchical'			=> true,
							'public'				=> true,
							'update_count_callback'	=> '_update_post_term_count'
						)
					);
				}

				$labels = array
				(
					'name'					=> __( 'Events' ),
					'singular_name'			=> __( 'Event' ),
					'add_new'				=> __( 'Add New Event' ),
					'add_new_item'			=> __( 'Add New Event' ),
					'edit'					=> __( 'Edit Event' ),
					'edit_item'				=> __( 'Edit Event' ),
					'new_item'				=> __( 'Add New Event' ),
					'view'					=> __( 'View Event' ),
					'view_item'				=> __( 'View Event' ),
					'search_items'			=> __( 'Search Events' ),
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
						'menu_icon' 		=> 'dashicons-tickets',
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
						'events',
						get_template_directory_uri() . '/lib/cpt/events/css/events.css',
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
			//add a custom image size for event images
			add_image_size( 'events', 727, 350, true );
			add_image_size( 'events2', 300, 150, true );
			add_image_size( 'carousel', 800, 500, true );
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

	} // end Events

	//create an instance of the class
	if ( class_exists('Events') ) {
		$events = new Events();
	}
}


