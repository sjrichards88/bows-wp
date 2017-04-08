<div class="row">
	<div class="col-xs-12 col-md-7 col-md-push-5 g-padding-bottom">
		<?php 
			$image = get_sub_field('image');
		?>
		<img src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>" />
	</div>
	<div class="col-xs-12 col-md-5 col-md-pull-7 g-padding-bottom">
		<?php the_sub_field('text'); ?>
	</div>
</div>
