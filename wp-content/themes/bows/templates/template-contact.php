<?php
/**
 * Template
 *
 * Template Name: Contact template
 */

get_header();
?>
<div id="fb-root"></div>
<script>(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.8&appId=320051568030180";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));</script>

 <section>
    <div class="container">
		
		<?php if ( get_field('intro_text') ): ?>
      	<div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 flexible-block">
            <article class="intro-text">
            	<?php the_field('intro_text'); ?>
            </article>
        </div>
    	<?php endif; ?>

        <div class="col-xs-12 gen-padding-bottom">
            <h2 class="text-center gen-padding-bottom">Contact form</h2>

            <form method="post">
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Name*</label>
                            <input type="text" class="form-control" name="name" id="name" placeholder="Name">
                        </div>                    
                        <div class="form-group">
                            <label for="email">Email*</label>
                            <input type="email" class="form-control" name="email" id="email" placeholder="Email">
                        </div>
                        <div class="form-group">
                            <label for="wedding_date">Preferred wedding date or period*</label>
                            <input type="text" class="form-control" name="wedding_date" id="wedding_date" placeholder="Preferred wedding date">
                        </div>
                        <div class="form-group">
	                        <label for="ceremony">Type of Ceremony</label>
	                        <select class="form-control" name="ceremony">
	                        	<option value="Civil">Civil</option>
	                        	<option value="Catholic Church">Catholic Church</option>
	                        	<option value="Symbolic">Symbolic</option>
	                        	<option value="Other">Other - please specify</option>
	                        </select>
                        </div>
                        <div class="form-group">
                            <label for="ceremony_other_specify">If other please specify</label>
                            <input type="text" class="form-control" name="ceremony_other_specify" id="ceremony_other_specify">
                        </div>                       
                        <div class="form-group">
                            <label for="guests">Approx number of guests*</label>
                            <input type="text" class="form-control" name="guests" id="guests">
                        </div>                        
                      	<div class="form-group">
	                        <label for="ceremony">Groom nationality*</label>
	                        <select class="form-control" name="groom_nationality">
	                        	<option value="British">British</option>
	                        	<option value="Irish">Irish</option>
	                        	<option value="American">American</option>
	                        	<option value="Australian">Australian</option>
	                        	<option value="Australian">Canadian</option>
	                        	<option value="Other">Other - please specify</option>
	                        </select>
                        </div>
                        <div class="form-group">
                            <label for="groom_other_specify">If other please specify</label>
                            <input type="text" class="form-control" name="groom_other_specify" id="groom_other_specify">
                        </div> 
                    </div>
                    <div class="col-xs-12 col-sm-6">
                        <div class="form-group">
	                        <label for="groom_civil_status">Groom civil status</label>
	                        <select class="form-control" name="groom_civil_status">
	                        	<option value="Single">Single</option>
	                        	<option value="Divorced">Divorced</option>
	                        	<option value="Widowed">Widowed</option>
	                        </select>
                        </div>                    
                      	<div class="form-group">
	                        <label for="bride_nationality">Bride nationality*</label>
	                        <select class="form-control" name="bride_nationality">
	                        	<option value="British">British</option>
	                        	<option value="Irish">Irish</option>
	                        	<option value="American">American</option>
	                        	<option value="Australian">Australian</option>
	                        	<option value="Canadian">Canadian</option>
	                        	<option value="Other">Other - please specify</option>
	                        </select>
                        </div>
                        <div class="form-group">
                            <label for="bride_other_specify">If other please specify</label>
                            <input type="text" class="form-control" name="bride_other_specify" id="bride_other_specify">
                        </div>
                        <div class="form-group">
	                        <label for="residence">Country of Permanent Residence*</label>
	                        <select class="form-control" name="residence">
	                        	<option value="United Kingdom">United Kingdom</option>
	                        	<option value="Ireland">Ireland</option>
	                        	<option value="USA">USA</option>
	                        	<option value="Australia">Australia</option>
	                        	<option value="Canada">Canada</option>
	                        	<option value="Other">Other - please specify</option>
	                        </select>
                        </div> 
                        <div class="form-group">
                            <label for="residence_other_specify">If other please specify</label>
                            <input type="text" class="form-control" name="residence_other_specify" id="residence_other_specify">
                        </div>                         
                        <div class="form-group">
                            <label for="message">Additional message</label>
                            <textarea class="form-control" rows="3" name="message"></textarea>
                        </div>               
                    </div>
                    <div class="col-xs-12">
                        <button type="submit" class="btn btn-primary">Submit</button>                   
                     </div>                    
                </div>
            </form> 

        </div>

		<div class="col-xs-12 col-sm-6 gen-padding-t-b">

			
			
            <?php
			$email = get_field( 'email', 'option' );
			$phone = get_field( 'phone', 'option' );
			$fax = get_field( 'fax', 'option' );
			$address = get_field( 'address', 'option' );
			?>

			<?php if ( $address ) the_field( 'address', 'option' ); ?>

			<?php if ( $email ): ?>
            <p><strong>Email:</strong> <a href="mailto:<?php echo $email; ?>"><?php echo $email; ?></a><br/>
            <?php endif; ?>
            <?php if ( $phone ): ?>
            <strong>Phone:</strong> <a href="tel:<?php echo $phone; ?>"><?php echo $phone; ?></a><br/>
        	<?php endif; ?>
            <?php if ( $fax ): ?>
            <strong>Fax:</strong> <a href="fax:<?php echo $fax; ?>"><?php echo $fax; ?></a><br/>
        	<?php endif; ?>
            </p>

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
		<div class="col-xs-12 col-sm-6 gen-padding-t-b">
		    <div class="fb-page" data-href="https://www.facebook.com/facebook" data-tabs="timeline" data-width="500" data-height="300" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true"><blockquote cite="https://www.facebook.com/facebook" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/facebook">Facebook</a></blockquote></div>
		</div>
	</div>
</section>

<?php get_footer(); ?>
