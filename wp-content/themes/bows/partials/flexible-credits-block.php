<?php if( get_sub_field('credits_block_title') ): ?>
<div class="row">
	<h2 class="text-center g-padding-bottom"><?php the_sub_field('credits_block_title'); ?></h2>
</div>
<?php endif; ?>

<?php if ( have_rows('credit_block') ): ?>
	
	<?php while ( have_rows('credit_block') ): the_row(); ?>
		
		<div class="g-padding-bottom">

			<?php if ( have_rows('credit') ): ?>

				<?php while ( have_rows('credit') ): the_row(); ?>

					<div class="row">
						<div class="col-xs-6 credit-title"><?php the_sub_field('credit_role'); ?></div>
						<div class="col-xs-6 credit-text">
							<?php the_sub_field('credit_name'); ?>
						</div>						
					</div>

				<?php endwhile; ?>

			<?php endif; ?>

		</div>

	<?php endwhile; ?>

<?php endif; ?>