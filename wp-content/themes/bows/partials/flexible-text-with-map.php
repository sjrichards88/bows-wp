<div class="row">
	<div class="col-xs-12 col-md-7 col-md-push-5 g-padding-bottom g-map">
		<?php
		$location = get_sub_field('map');
		if ( !empty($location) ) {
			?>
			<div class="acf-map">
				<div class="marker" data-lat="<?php echo $location['lat']; ?>" data-lng="<?php echo $location['lng']; ?>"></div>
			</div>
			<?php
		}
		?>
		<a href="https://www.google.com/maps/place/<?php echo $location['address']; ?>"" class="btn btn-blue light-hover" target="blank" rel="noopener noreferrer">View on google maps</a>
	</div>
	<div class="col-xs-12 col-md-5 col-md-pull-7 g-padding-bottom">
		<?php the_sub_field('text'); ?>
	</div>
</div>