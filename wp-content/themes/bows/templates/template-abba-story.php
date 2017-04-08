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
 * Template Name: Abba Story template
 */

get_header();

?>

<section class="g-c">
	<div class="container container--custom">

		<div class="row">
			<div class="col-xs-12 g-padding-t-b">
				<img src="<?php echo get_template_directory_uri(); ?>/assets/images/logos/logo-mmtp.png" alt="Mamma Mia The Party" width="262" class="mmtp-content-logo" />
			</div>
		</div>

		<div class="row">
			<div class="col-xs-12">
				<?php if( get_field('intro_text') ) the_field('intro_text'); ?>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-12 col-md-offset-0 col-lg-10 col-lg-offset-1 g-padding-top"">

				<div class="row">
					<?php
						// check if the repeater field has rows of data
						if( have_rows('abba_members') ):
						 	// loop through the rows of data
						 	$fade = 500;
						    while ( have_rows('abba_members') ) : the_row();
							$portrait = get_sub_field('portrait');
							$letter = get_sub_field('letter');
					?>

					<div class="col-xs-6 col-sm-3">
						<div class="a-s-image">
							<img src="<?php echo $portrait['url']; ?>" alt="<?php echo $portrait['alt']; ?>">
							<img src="<?php echo $letter['url']; ?>" alt="<?php echo $letter['alt']; ?>" class="a-s-image__fade" data-fade="<?php echo $fade; ?>">
						</div>
						<p class="a-s-name"><?php the_sub_field('name'); ?></p>
					</div>

					<?php
							$fade += 500;
							endwhile;
						endif;
					?>

					<div class="col-xs-12 g-padding-t-b hidden-xs">
						<img src="<?php echo get_template_directory_uri(); ?>/assets/images/generic/abba-story-arrows-1.png" alt="" class="center hidden-sm">
						<img src="<?php echo get_template_directory_uri(); ?>/assets/images/generic/abba-story-arrows-1-sm.png" alt="" class="center visible-sm">
					</div>
				</div>
				
				<?php if( get_field('text') ) the_field('text'); ?>

			</div>
		</div>
		<div class="row">
			<div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-12 col-md-offset-0 col-lg-10 col-lg-offset-1 g-padding-bottom">

				<div class="row">
					<div class="col-xs-12 g-padding-t-b hidden-xs">
						<img src="<?php echo get_template_directory_uri(); ?>/assets/images/generic/abba-story-arrows-2.png" alt="" class="center hidden-sm">
						<img src="<?php echo get_template_directory_uri(); ?>/assets/images/generic/abba-story-arrows-2-sm.png" alt="" class="center visible-sm">
					</div>
				</div>

				<div class="polaroids polaroids--a-story">
					<?php
						// check if the repeater field has rows of data
						if( have_rows('information_blocks') ):
						 	// loop through the rows of data
						    while ( have_rows('information_blocks') ) : the_row();
							$image = get_sub_field('image');
					?>
			
					<div class="polaroid" data-toggle="active-self">
						<div class="polaroid__inner">
							<div class="polaroid__inner-front">
								<img src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>" class="polaroid__img" class="polaroid__image">
								<p class="polaroid__title">Click for more info</p>
							</div>
							<div class="polaroid__inner-back">
								<?php 
									if( have_rows('titles') ):
										$i = 0;
										while ( have_rows('titles') ) : the_row();
							
											if ($i == 0): ?>

											<p class="polaroid__title polaroid__title--blue"><?php the_sub_field('title'); ?></p>

											<?php else: ?>
											
											<p class="polaroid__title"><?php the_sub_field('title'); ?></p>

											<?php endif;

											$i++; 

										endwhile;
									endif;
								?>
								<?php the_sub_field('text'); ?>
							</div>
						</div>									
					</div>

					<?php
							$fade += 500;
							endwhile;
						endif;
					?>
				</div>
			</div>
		</div>

	</div>
</section>

<?php get_footer(); ?>