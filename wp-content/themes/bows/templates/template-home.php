<?php
/**
 * Template
 *
 * @category Category
 * @package  Package
 * @author   Author
 * @license  License
 * @link     Link
 *
 * Template Name: Home template
 */

get_header('home');

?>

<section>
	
	<?php include(get_template_directory() . '/partials/flexible-blocks.php'); ?>

</section>

<?php get_footer(); ?>