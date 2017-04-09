<?php if ( have_rows('link_block') ): ?>
<div class="container-fluid flexible-block">
    <div class="row display-flex">
        <?php while( have_rows('link_block') ): the_row(); 
            $image = get_sub_field('image');
        ?>
        <div class="col-xs-12 col-sm-3">
            <a href="<?php the_sub_field('link'); ?>" class="home-link-wrap">
                <div class="home-link-block" style="background-image: url(<?php echo $image['url']; ?>);"></div>
                <div class="home-link-button">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/logov2.png" alt="" width="70">
                </div>
                <p><?php the_sub_field('title'); ?></p>
            </a>
        </div>
        <?php endwhile; ?>
    </div>
</div>
<?php endif; ?>