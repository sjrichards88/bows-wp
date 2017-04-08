<div class="row" id="faqs">
	<div class="col-xs-12 g-padding-t-b">
		<h2 class="text-center"><?php the_sub_field('faq_block_title'); ?></h2>
		<?php the_sub_field('faq_block_text'); ?>
		 	<?php
		 	// check if the nested repeater field has rows of data
		 	if( have_rows('faq') ):
		 	?>
		 	<div class="polaroids">
		 	<?php
			 	// loop through the rows of data
			    while ( have_rows('faq') ) : the_row();
					$title = get_sub_field('faq_title');
					$text = get_sub_field('faq_text');
					$image = get_sub_field('faq_image');
					$thumb_image = $image['sizes'][ 'thumbnail' ];
					?>
					<div class="polaroid" data-toggle="active-self">
						<div class="polaroid__inner">
							<div class="polaroid__inner-front">
								<picture>
									<!--[if IE 9]><video style="display: none;"><![endif]-->
									<source srcset="<?php echo $image['url']; ?>" media="(min-width: 768px)">
										<!--[if IE 9]></video><![endif]-->
										<img src="<?php echo $thumb_image; ?>" alt="<?php echo $image['alt']; ?>" class="polaroid__img" class="polaroid__image">
								</picture>
								<p class="polaroid__title"><?php echo $title; ?></p>
							</div>
							<div class="polaroid__inner-back">
								<svg enable-background="new 0 0 128 128" version="1.1" viewBox="0 0 128 128" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="icon-flip"><path d="M64,12c-28.7,0-52,23.3-52,52s23.3,52,52,52s52-23.3,52-52S92.7,12,64,12z M64,112c-26.5,0-48-21.5-48-48  s21.5-48,48-48s48,21.5,48,48S90.5,112,64,112z" fill="#3B97D3"/><path d="M93.6,44.8c-1.1-0.3-2.2,0.4-2.4,1.5L90,51.1C85.2,41.3,75.2,35,64,35c-16,0-29,13-29,29c0,16,13,29,29,29  c13.2,0,24.8-8.9,28.1-21.7c0.3-1.1-0.4-2.2-1.4-2.4c-1.1-0.3-2.2,0.4-2.4,1.4C85.4,81.3,75.4,89,64,89c-13.8,0-25-11.2-25-25  s11.2-25,25-25c10.4,0,19.6,6.3,23.3,15.9l-7.5-1.8c-1.1-0.3-2.2,0.4-2.4,1.5c-0.3,1.1,0.4,2.2,1.5,2.4L90,59.7  c0.2,0,0.3,0.1,0.5,0.1c0.9,0,1.7-0.6,1.9-1.5l2.7-10.9C95.3,46.2,94.7,45.1,93.6,44.8z" fill="#2C3E50"/></svg>
								<p class="polaroid__title"><?php echo $title; ?></p>
								<?php echo $text; ?>
							</div>
						</div>									
					</div>
					<?php
				endwhile;
			?>
			<div>
			<?php
			endif;
			?>
	</div>
</div>