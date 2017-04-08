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

get_header();

?>

<section class="h-c height-fix">
	
	<div class="alerts">
		<div class="alert alert-dismissible fade in" role="alert"> 
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true" class="icon icon-close"></span>
			</button> 
			<h4>We use cookies</h4> 
			<p>This website uses cookies to ensure you get the best experience, <a href="#">find out more</a> or close this panel to accept.</p> 
		</div>					
	</div>

	<button class="btn btn-blue h-c__watch-trailer" data-toggle="modal" data-target="#watch-trailer-modal">Watch Trailer</button>
	

	<div class="h-c__links">
		<?php

			// check if the repeater field has rows of data
			if( have_rows('home_links') ):

			 	// loop through the rows of data
			    while ( have_rows('home_links') ) : the_row();

		?>
				<a href="<?php the_sub_field('link_url') ?>" class="btn btn-white h-c__link">
					<?php the_sub_field('link_text'); ?>
				</a>
		<?php

			    endwhile;

			endif;

		?>
	</div>

</section>

<?php get_footer(); ?>