<?php if ( have_rows('gallery_block') ): ?>

<div class="container-fluid flexible-block">
    <div class="row display-flex">
        <?php while( have_rows('gallery_block') ): the_row(); 
            $image = get_sub_field('image');
            $title = get_sub_field('title');
            $text = get_sub_field('text');
            $gallery = get_sub_field('gallery');
            $gal_id = rand().time();
        ?>
        <div class="col-sm-3">
            <a href="#" class="home-link-wrap no-logo" data-toggle="modal" data-target="#modal<?php echo $gal_id; ?>">
                <div class="home-link-block" style="background-image: url(<?php echo $image['url']; ?>);"></div>
                <p><?php echo $title; ?></p>
            </a>
            <div class="gallery-text">
                <?php echo $text; ?>  
            </div>

            <!-- Modal -->
            <div class="modal fade modal-custom gallery" id="modal<?php echo $gal_id; ?>" tabindex="-1" role="dialog" aria-labelledby="<?php echo str_replace(' ', '', $title); ?>">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 class="modal-title" id="<?php echo str_replace(' ', '', $title); ?>"><?php echo $title; ?></h4>
                            </div>
                            <div id="gallery<?php echo $gal_id; ?>" class="carousel" data-ride="carousel" data-interval="0">

                               
                                <div class="carousel-inner" role="listbox">
                                        
                                    <?php $count = 0;  foreach( $gallery as $image ): 
                                        if ($count == 0):
                                    ?>
                                    <div class="item active">
                                        <img src="<?php echo $image['url']; ?>">
                                    </div>
                                    <?php else: ?>
                                    <div class="item">
                                        <img data-src="<?php echo $image['url']; ?>">
                                    </div>    
                                    <?php endif; ?>
                                                
                                    <?php $count++; endforeach; ?>

                                </div>

                               
                                <a class="left carousel-control" href="#gallery<?php echo $gal_id; ?>" role="button" data-slide="prev">
                                    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                                    <span class="sr-only">Previous</span>
                                </a>
                                <a class="right carousel-control" href="#gallery<?php echo $gal_id; ?>" role="button" data-slide="next">
                                    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                                    <span class="sr-only">Next</span>
                                </a>
                                <ul class="carousel-control-grid carousel-indicators">
                                    <?php $count = 0;  foreach( $gallery as $image ): ?>
                                    <li data-target="#gallery<?php echo $gal_id; ?>" data-slide-to="<?php echo $count; ?>" <?php if ($count == 0) echo 'class="active"'; ?>>
                                        <img src="<?php echo $image['sizes']['thumbnail']; ?>" alt="<?php $image['alt']; ?>">
                                    </li>
                                    <?php $count; endforeach; ?>                                         
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php endwhile; ?>
    </div>
</div>

<?php endif; ?>