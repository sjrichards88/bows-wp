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
 * Template Name: About template
 */

get_header();
?>

<section>

    <div class="container">
        <div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
            <article class="intro-text">
            	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
				<?php the_content(); ?>
				<?php endwhile; endif; ?>
            </article>
        </div>
    </div>

    <div class="container-max flexible-block">
    	<div class="col-xs-12">
    		<article class="script-text">
    			<?php 
    				$image = get_field('about_image');
    			?>
    			<img src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>" class="script-img">
				<?php the_field('about_text'); ?>
    		</article>
    	</div>
    </div>

    <div class="container">
    	<div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
    		<article class="block-text">
				<?php the_field('sub_about_text'); ?>
    		</article>
    	</div>
    </div>
    <p class="center"><a href="/contact" class="btn btn-primary contact">Contact me</a></p>
	
	<?php include(get_template_directory() . '/partials/flexible-blocks.php'); ?>

</section>

<?php get_footer(); ?>