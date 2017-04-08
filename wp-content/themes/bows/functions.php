<?php
/**
 * Functions
 *
 * @category Category
 * @package  Package
 * @author   Author
 * @license  License
 * @link     Link
 */

require_once 'functions/func-admin.php';
require_once 'functions/func-menu.php';
require_once 'functions/func-custom-posts.php';
require_once 'functions/func-permalink.php';
require_once 'functions/func-script.php';
require_once 'functions/func-style.php';

//create custom post types
// require_once(__DIR__.'/lib/cpt/people/core.php');
// require_once(__DIR__.'/lib/cpt/events/core.php');
// require_once(__DIR__.'/lib/cpt/exhibitors/core.php');

//Pull in ACF
require_once(__DIR__.'/lib/acf/acf-setup.php');