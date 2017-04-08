<?php
/**
 * Include ACF
 *
 * @since Scrictly Come Dancing 1.0
 */

// 1. customize ACF path
add_filter('acf/settings/path', 'nc_acf_settings_path');

function nc_acf_settings_path( $path ) {

	// update path
	$path = get_stylesheet_directory() . '/lib/acf/acf/';

	// return
	return $path;

}


// 2. customize ACF dir
add_filter('acf/settings/dir', 'nc_acf_settings_dir');

function nc_acf_settings_dir( $dir ) {

	// update path
	$dir = get_stylesheet_directory_uri() . '/lib/acf/acf/';

	// return
	return $dir;

}

// Include ACF
include_once( get_stylesheet_directory() . '/lib/acf/acf/acf.php' );

/**
 * Add options page with ACF
 *
 * @since Material Matters 1.0
 */
if ( function_exists('acf_add_options_page') ) {

	acf_add_options_page();

}

//set a key for hte google maps api
function my_acf_init() {

	acf_update_setting('google_api_key', 'AIzaSyDMsvRUDvYhv02Qcj4oUr45r_5_qocO6rY');
}

add_action('acf/init', 'my_acf_init');


