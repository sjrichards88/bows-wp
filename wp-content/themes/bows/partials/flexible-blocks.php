<?php
// check if the flexible content field has rows of data
if( have_rows('content_blocks') ):

 	// loop through the rows of data
    while ( have_rows('content_blocks') ) : the_row();

		// check current row layout
        if( get_row_layout() == 'faq_block' ):

        	include( get_template_directory() . '/partials/flexible-faq-block.php');

        elseif ( get_row_layout() == 'text_full_width' ):

            include( get_template_directory() . '/partials/flexible-text-full-width.php');           

        elseif ( get_row_layout() == 'text_narrow_width' ):

        	include( get_template_directory() . '/partials/flexible-text-narrow-width.php');        

        elseif ( get_row_layout() == 'text_with_image' ):

        	include( get_template_directory() . '/partials/flexible-text-with-image.php');        

        elseif ( get_row_layout() == 'text_with_map' ):

            include( get_template_directory() . '/partials/flexible-text-with-map.php');      

        elseif ( get_row_layout() == 'cast_block' ):

            include( get_template_directory() . '/partials/flexible-cast-block.php');        

        elseif ( get_row_layout() == 'credits_block' ):

        	include( get_template_directory() . '/partials/flexible-credits-block.php');

        endif;

    endwhile;

endif;
?>