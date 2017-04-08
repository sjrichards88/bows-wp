<?php
// check if the nested repeater field has rows of data
if( get_sub_field('cast_block_title') ):
?>
<div class="row">
	<div class="col-xs-12">
		<h1 class="text-center"><?php the_sub_field('cast_block_title'); ?></h1>
	</div>
</div>
<?php
endif;
// check if the nested repeater field has rows of data
if( have_rows('cast') ):
?>
<div class="row">
	<div class="col-xs-12 g-padding-t-b">
		<div class="polaroids polaroids--team">
		<?php
			// loop through the rows of data
			while ( have_rows('cast') ) : the_row();
			$cast_name = get_sub_field('cast_name');
			$cast_role = get_sub_field('cast_role');
			$cast_actor = get_sub_field('cast_actor');
			$cast_image = get_sub_field('cast_image');
		?>
		<div class="polaroid">
			<div class="polaroid__inner">
				<div class="polaroid__inner-front">
					<img src="<?php echo $cast_image['url']; ?>" alt="<?php echo $cast_image['alt']; ?>" class="header__img" class="polaroid__image">
					<div class="polaroid__title">
						<p class="polaroid__name"><?php echo $cast_name; ?></p>
						<p class="polaroid__role"><?php echo $cast_role; ?></p>
					</div>
				</div>
			</div>
			<div class="polaroid__actor">
				<?php echo $cast_actor; ?>
			</div>								
		</div>
		<?php
			endwhile;
		?>
		</div>
	</div>
</div>
<?php
endif;
?>