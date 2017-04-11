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
 * Template Name: Ceremony template
 */

get_header();
?>

<section>
	
	<?php include(get_template_directory() . '/partials/flexible-blocks.php'); ?>

	<?php

		$args = array(
		    'post_type'      => 'page',
		    'posts_per_page' => -1,
		    'post_parent'    => wp_get_post_parent_id( $post->ID ),
		    'order'          => 'ASC',
		    'orderby'        => 'menu_order'
		);

		$parent = new WP_Query( $args );

		if ( $parent->have_posts() ) : ?>
		
		<div class="container-fluid">
	        <div class="row display-flex">

		    <?php while ( $parent->have_posts() ) : $parent->the_post(); $image = get_field('featured_image');  
                $image = get_field('featured_image');
		    ?>
	            
                <div class="col-xs-6 col-sm-4 col-lg-2">
                    <a href="" class="internal-link-wrap">
                        <div class="home-link-block" style="background-image: url(<?php echo $image['url']; ?>);"></div>
                        <p><?php the_title(); ?></p>
                    </a>
                </div>
                
		    <?php endwhile; ?>

  	        </div>
        </div>

	<?php endif; wp_reset_query(); ?>

</section>

<?php get_footer(); ?>