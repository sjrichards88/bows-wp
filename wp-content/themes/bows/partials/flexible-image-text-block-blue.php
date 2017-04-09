<?php 
$image = get_sub_field('image');
$gallery = get_sub_field('gallery');
$gal_id = rand().time();
?>
<div class="container-max flexible-block">
    <div class="ci-wrapper">
        <div class="ci-row">
            <div class="ci-child ci-width-70" style="background-image: url(<?php echo $image['url']; ?>);"></div>
            <div class="ci-child ci-width-30 extra-padding bg-secondary ci-text">
                <div class="ci-content">
                    <?php the_sub_field('text'); ?>
                    <?php if ($gallery): ?>
                    <br/>
                    <p class="text-center"><button class="btn btn-primary" data-toggle="modal" data-target="#gallery<?php echo $gal_id; ?>">View gallery</button></p>
                    <?php endif; ?>
                </div>
            </div>
        </div>                       
    </div>
</div>
<?php if ($gallery): ?>
<!-- Modal -->
<div class="modal fade modal-custom gallery" id="gallery<?php echo $gal_id; ?>" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <!-- <h4 class="modal-title" id="myModalLabel">Wedding name here</h4> -->
                </div>
                <div id="modal-gallery<?php echo $gal_id; ?>" class="carousel" data-ride="carousel" data-interval="0">
                    <!-- Slider -->
                    <div class="carousel-inner" role="listbox">
                        <?php $count = 0; foreach( $gallery as $image ): 
                            if ($count == 0) $src = 'src';
                            else $src = 'data-src';
                        ?>
                        <div class="item <?php if ($count ==  0) echo 'active'; ?>">
                            <img <?php echo $src; ?>="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>">
                        </div>
                        <?php $count++; endforeach; ?>
                    </div>
                    <!-- Controls -->
                    <a class="left carousel-control" href="#modal-gallery<?php echo $gal_id; ?>" role="button" data-slide="prev">
                        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="right carousel-control" href="#modal-gallery<?php echo $gal_id; ?>" role="button" data-slide="next">
                        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                    <!-- Indicators -->
                    <ul class="carousel-control-grid carousel-indicators">
                        <?php $count = 0; foreach( $gallery as $image ): ?>
                        <li data-target="#modal-gallery<?php echo $gal_id; ?>" data-slide-to="<?php echo $count; ?>" <?php if ($count ==  0) echo 'class="active"'; ?>>
                            <img src="<?php echo $image['sizes']['thumbnail']; ?>" alt="<?php echo $image['alt']; ?>">
                        </li>
                        <?php $count++; endforeach; ?>                                          
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
<?php endif; ?>