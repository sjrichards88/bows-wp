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
 * Template Name: Ceremonies template
 */

get_header();
?>

<section>
	<div class="container">

	<?php

		$args = array(
		    'post_type'      => 'page',
		    'posts_per_page' => -1,
		    'post_parent'    => $post->ID,
		    'order'          => 'ASC',
		    'orderby'        => 'menu_order'
		 );

		$parent = new WP_Query( $args );

		if ( $parent->have_posts() ) : ?>

		    <?php while ( $parent->have_posts() ) : $parent->the_post(); $image = get_field('featured_image'); ?>

		        <div class="col-xs-12 ceremony">
                    <a href="<?php the_permalink(); ?>" class="ceremony__link">
                        <article>
                        	<?php 
                        		$image = get_field('featured_image');
                        	?>
                            <img src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>">
                            <h2><?php the_title(); ?></h2>
                        </article>
                    </a>
                </div> 
                
		    <?php endwhile; ?>

	<?php endif; wp_reset_query(); ?>

	</div>

</section>

<?php get_footer(); ?>