<?php
// check if the flexible content field has rows of data
if( have_rows('content_blocks') ):

 	// loop through the rows of data
    while ( have_rows('content_blocks') ) : the_row();

		// check current row layout
        if( get_row_layout() == 'text_block' ):

        	include( get_template_directory() . '/partials/flexible-text-block.php');  

        elseif ( get_row_layout() == 'image_text_block_blue' ):

            include( get_template_directory() . '/partials/flexible-image-text-block-blue.php');        

        elseif ( get_row_layout() == 'image_text_block_pink' ):

            include( get_template_directory() . '/partials/flexible-image-text-block-pink.php');         

        elseif ( get_row_layout() == 'link_block_grid' ):

            include( get_template_directory() . '/partials/flexible-link-block-grid.php'); 

        endif;

    endwhile;

endif;
?>