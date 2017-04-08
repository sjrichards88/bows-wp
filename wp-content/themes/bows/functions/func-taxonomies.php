<?php
/**
 * Custom taxonomies
 *
 * @category Category
 * @package  Package
 * @author   Author
 * @license  License
 * @link     Link
 */

// hook into the init action and call create_book_taxonomies when it fires
add_action( 'init', 'create_press_taxonomies', 0 );

// create two taxonomies, genres and writers for the post type "book"
function create_press_taxonomies() {
	// Add new taxonomy, make it hierarchical (like categories)
	$labels = array(
		'name'              => _x( 'Press releases', 'taxonomy general name', 'textdomain' ),
		'singular_name'     => _x( 'Press release', 'taxonomy singular name', 'textdomain' ),
		'search_items'      => __( 'Search Press releases', 'textdomain' ),
		'all_items'         => __( 'All Press releases', 'textdomain' ),
		'parent_item'       => __( 'Parent Press release', 'textdomain' ),
		'parent_item_colon' => __( 'Parent Press release:', 'textdomain' ),
		'edit_item'         => __( 'Edit Press release', 'textdomain' ),
		'update_item'       => __( 'Update Press release', 'textdomain' ),
		'add_new_item'      => __( 'Add New Press release', 'textdomain' ),
		'new_item_name'     => __( 'New Press release Name', 'textdomain' ),
		'menu_name'         => __( 'Press release', 'textdomain' ),
	);

	$args = array(
		'hierarchical'      => true,
		'labels'            => $labels,
		'show_ui'           => true,
		'show_admin_column' => true,
		'query_var'         => true,
		'rewrite'           => array( 'slug' => 'press-release' ),
	);

	register_taxonomy( 'press-release', array( 'press' ), $args );

	// Add new taxonomy, NOT hierarchical (like tags)
	$labels = array(
		'name'                       => _x( 'Latest News', 'taxonomy general name', 'textdomain' ),
		'singular_name'              => _x( 'Latest New', 'taxonomy singular name', 'textdomain' ),
		'search_items'               => __( 'Search Latest News', 'textdomain' ),
		'popular_items'              => __( 'Popular Latest News', 'textdomain' ),
		'all_items'                  => __( 'All Latest News', 'textdomain' ),
		'parent_item'                => null,
		'parent_item_colon'          => null,
		'edit_item'                  => __( 'Edit Latest News', 'textdomain' ),
		'update_item'                => __( 'Update Latest News', 'textdomain' ),
		'add_new_item'               => __( 'Add New Latest News', 'textdomain' ),
		'new_item_name'              => __( 'New Latest New Name', 'textdomain' ),
		'separate_items_with_commas' => __( 'Separate latest news with commas', 'textdomain' ),
		'add_or_remove_items'        => __( 'Add or remove latest news', 'textdomain' ),
		'choose_from_most_used'      => __( 'Choose from the most used latest news', 'textdomain' ),
		'not_found'                  => __( 'No latest news found.', 'textdomain' ),
		'menu_name'                  => __( 'Latest News', 'textdomain' ),
	);

	$args = array(
		'hierarchical'          => false,
		'labels'                => $labels,
		'show_ui'               => true,
		'show_admin_column'     => true,
		'update_count_callback' => '_update_post_term_count',
		'query_var'             => true,
		'rewrite'               => array( 'slug' => 'latest-news' ),
	);

	register_taxonomy( 'latest-news', 'press', $args );
}
?>