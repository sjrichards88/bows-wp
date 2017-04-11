<?php 
    $image = get_sub_field('image');
    $gallery = get_sub_field('gallery');
    $gal_id = rand().time();
?>
<div class="container-max flexible-block">
    <div class="ci-wrapper">
        <div class="ci-row image-first">                            
            <div class="ci-child ci-width-40 extra-padding bg-primary ci-text">
                <div class="ci-content">
                    <?php the_sub_field('text'); ?>
                    <?php if ($gallery): ?>
                    <br/>
                    <p class="text-center"><button class="btn btn-secondary" data-toggle="modal" data-target="#gallery<?php echo $gal_id; ?>">View gallery</button></p>
                    <?php endif; ?>
                </div>
            </div>
            <?php if (count($image) > 1): // Gallery ?>

                <div class="ci-child ci-width-60 c-bg-carousel">
                    <div class="c-bg-carousel__inner">

                    <?php $count = 0; foreach ($image as $i): ?>
                        
                        <?php if ($count == 0): // Gallery ?>

                            <div class="c-bg-carousel__item" style="background-image: url(<?php echo $i['url']; ?>);"></div>

                        <?php else: ?>
                            
                            <div class="c-bg-carousel__item" data-src="<?php echo $i['url']; ?>"></div>

                        <?php endif; ?>

                    <?php $count++; endforeach; ?>

                    </div>
                    <button class="c-bg-carousel__control prev pink">
                        <i class="fa fa-chevron-left" aria-hidden="true"></i>
                        <span class="sr-only">Previous</span>
                    </button>
                    <button class="c-bg-carousel__control next pink">
                        <i class="fa fa-chevron-right" aria-hidden="true"></i>
                        <span class="sr-only">Next</span>
                    </button>
                </div>

            <?php else: // Static image ?>

                <div class="ci-child ci-width-60" style="background-image: url(<?php echo $image[0]['url']; ?>);"></div>

            <?php endif; ?>
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