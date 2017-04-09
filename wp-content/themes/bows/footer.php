<?php
/**
 * Footer template.
 *
 * @category Category
 * @package  Package
 * @author   Author
 * @license  License
 * @link     Link
 */
?>
   </main>

    <footer class="footer">
        <div class="container">       
            <div class="col-xs-12 col-sm-3">
                <h4>Menu</h4>
                <nav>
                    <ul>
		                <?php
		                //retrieve Wordpress primary navigation.
		                $menu_name = 'footer';
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
		                            $menu_list .= '<li><a href="' . $menu_item->url . '">' . $menu_item->title . '</a></li> ';
		                        }
		                    }
		                    echo $menu_list;
		                }
		                ?>
                    </ul>
                </nav>
            </div>            
            <div class="col-xs-12 col-sm-3">
                <h4>Contact</h4>
                <nav>
                	<ul>
                	<?php
						$email = get_field( 'email', 'option' );
						$phone = get_field( 'phone', 'option' );
						$fax = get_field( 'fax', 'option' );
						if ($email): 
					?>
                    <li><a href="mailto:<?php echo $email; ?>">Email: <?php echo $email; ?></a></li>
                    <?php endif; ?>
                    <?php if ($phone): ?>
                    <li><a href="tel:<?php echo $phone; ?>">Phone: <?php echo $phone; ?></a></li>
                    <?php endif; ?>
                    <?php if ($fax): ?>
                    <li><a href="fax:<?php echo $fax; ?>">Fax: <?php echo $fax; ?></a></li>
                    <?php endif; ?>
                    </ul>
                </nav>
            </div>
            <div class="col-xs-12 col-sm-3">
                <h4>Social</h4>
                <ul class="social">
		            <?php
						$facebook = get_field( 'facebook', 'option' );
						$twitter = get_field( 'twitter', 'option' );
						$youtube = get_field( 'youtube', 'option' );
						$instagram = get_field( 'instagram', 'option' );
						if ($facebook): 
					?>
                    <li><a href="<?php echo $facebook; ?>" class="fa fa-facebook" target="_blank" rel="noopener noreferrer" title="Facebook"></a></li>
                    <?php endif; ?>
                    <?php if ($twitter): ?>
                    <li><a href="<?php echo $twitter; ?>" class="fa fa-twitter" target="_blank" rel="noopener noreferrer" title="Twitter"></a></li>
                    <?php endif; ?>
                    <?php if ($youtube): ?>
                    <li><a href="<?php echo $youtube; ?>" class="fa fa-youtube" target="_blank" rel="noopener noreferrer" title="Youtube"></a></li>
                    <?php endif; ?>
                    <?php if ($instagram): ?>
                    <li><a href="<?php echo $instagram; ?>" class="fa fa-instagram" target="_blank" rel="noopener noreferrer" title="Instagram"></a></li>
                    <?php endif; ?>
                </ul> 
            </div>
            <div class="col-xs-12 col-sm-3">
                <p>&copy; Bouquets &amp; Bows 2004 - <?php echo date('Y'); ?> <br/>All rights reserved</p>
                <p>Website by <a href="http://sjrdesigns.com" target="blank" rel="noopener noreferrer">SJRdesigns</a></p>
            </div>     
        </div>
    </footer>

<?php wp_footer(); ?>

</body>
</html>
