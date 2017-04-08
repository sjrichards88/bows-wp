<?php
/**
 * Default page template.
 *
 * @category Category
 * @package  Package
 * @author   Author
 * @license  License
 * @link     Link
 */
?>

<?php get_header(); ?>

<header>
	<h1><?php the_title(); ?></h1>
</header>

<?php the_content(); ?>

<?php get_footer();
