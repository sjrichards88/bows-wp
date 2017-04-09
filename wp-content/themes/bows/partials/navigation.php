<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#mobile-nav" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <div class="tagline-wrapper"><p class="tagline"><?php the_field('menu_strapline', 'option'); ?></p></div>
            <a class="navbar-brand" href="#"><img src="<?php echo get_template_directory_uri(); ?>/assets/images/logov2.png" alt="Bouquets and Bows"></a>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="mobile-nav">
            <ul class="nav navbar-nav">
                <?php
                //retrieve Wordpress primary navigation.
                $menu_name = 'primary';
                global $post;
                $current_post_id = $post->ID;
                if ( ( $locations = get_nav_menu_locations() ) && isset( $locations[ $menu_name ] ) ) {
                    $menu = wp_get_nav_menu_object( $locations[ $menu_name ] );
                    $menu_items = wp_get_nav_menu_items($menu->term_id);
                    $menu_list = '';
                    foreach ( (array) $menu_items as $menu_item ) {

                        //only print the item out if it is not a child item
                        if ($menu_item->menu_item_parent==0) {

                            //add current menu item to menu
                            $menu_list .= '<li';
                            if ($current_post_id == $menu_item->object_id) {
                                $menu_list .= ' class="active"';
                            }
                            $menu_list .= '><a href="' . $menu_item->url . '">' . $menu_item->title;
                            if ($current_post_id == $menu_item->object_id) {
                                $menu_list .= ' <span class="sr-only">(current)</span>';
                            }
                            $menu_list .= '</a></li> ';
                        }
                    }
                    echo $menu_list;
                }
                ?>
            </ul>
        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
</nav>