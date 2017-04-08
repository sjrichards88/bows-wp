<?php
/**
 * Menus
 *
 * @category Category
 * @package  Package
 * @author   Author
 * @license  License
 * @link     Link
 */

/**
 * Register nav menus
 */
function gulp_wp_register_menus() {
	register_nav_menus(
		array(
			'primary' => __( 'Primary' ),
			'footer' => __( 'Footer' )
		)
	);
}
add_action( 'init', 'gulp_wp_register_menus' );
