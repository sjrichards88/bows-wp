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
 * Template Name: The Party template
 */

get_header();

?>

<div class="custom-video">
	<video muted="" class="fw-video" id="the-party-video">
		<source src="<?php echo get_template_directory_uri(); ?>/assets/videos/party-bg.mp4" type="video/mp4">
		<source src="<?php echo get_template_directory_uri(); ?>//assets/videos/party-bg.webm" type="video/webm">
		<source src="<?php echo get_template_directory_uri(); ?>//assets/videos/party-bg.ogg" type="video/ogg">
		<img src="" alt="">
	</video>
	<img src="<?php echo get_template_directory_uri(); ?>/assets/images/backgrounds/bg-the-party-video.jpg" alt="" class="custom-video__poster">
</div>

<section class="g-c">
	<div class="container container--custom">
		<h1><img src="<?php echo get_template_directory_uri(); ?>/assets/images/logos/logo-mmtp.png" alt="<?php wp_title('', '', 'left'); ?>" width="262" class="mmtp-content-logo" /></h1>

		<?php include(get_template_directory() . '/partials/flexible-blocks.php'); ?>

	</div>
</section>

<?php get_footer(); ?>