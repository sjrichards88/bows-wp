//Js Revealing module pattern
var core = function($) {

    var init = function() {
    	//List functions here
    	initNavScroll();
		initHomeCarousel();
		initScrollUp();
		initScrollTo();
		initGallery();
		initBackgroundImageCarousel();
    };

    var initNavScroll = function() {

    	function navFunction() {
    		if ($(window).scrollTop() > 0) {
    			$('header .navbar-default').addClass('scrolled');
    		} else {
    			$('header .navbar-default').removeClass('scrolled');
    		}
    	}

    	window.addEventListener('scroll', navFunction);
    	window.addEventListener('load', navFunction);

    };

    var initHomeCarousel = function() {
    	$("#home-carousel").owlCarousel({
    		items: 1,
    		singleItem: true,
    		autoPlay: true,
    		transitionStyle : "fade"
    	});
    };

    var initScrollUp = function() {

    	var scrollUpElement = $('.scroll-up');

    	function scrollUp() {

    		if ( $(window).scrollTop() > $(window).height() / 1.5 ) {
    			scrollUpElement.fadeIn();
    		} else {
    			scrollUpElement.fadeOut();
    		}

    	}

    	scrollUpElement.on('click', function(e) {
    		e.preventDefault();
    		$('body, html').animate({ 
    			scrollTop: '0px' 
    		}, 600);
    	});

    	window.addEventListener('scroll', scrollUp);
    	window.addEventListener('load', scrollUp);

    };

    var initScrollTo = function() {

    	$('.scroll-down').on('click', function() {
    		var target = $(this).attr('href');
    		$('html, body').animate({
    			scrollTop: $(target).offset().top - 50
    		}, 500)
    	});

    };

    var initGallery = function() {

    	// Lazy load images
    	$('.modal-custom .carousel').each(function() {
	    	$(this).on('slid.bs.carousel', function () {
	    		var nextImage = $('.item.active').next('.item').find('img');
	    		var prevImage = $('.item.active').prev('.item').find('img');

	    		if (nextImage.length > 0) {
	    			nextImage.attr('src', nextImage.attr('data-src'));
	    		}	    		

	    		if (prevImage.length > 0) {
	    			prevImage.attr('src', prevImage.attr('data-src'));
	    		}

			});
    	});

    	$('.modal-custom.gallery').each(function() {
    		$(this).on('show.bs.modal', function (e) {
    			var nextImage = $('.item.active').next('.item').find('img');
    			var prevImage = $('.item.active').prev('.item').find('img');

    			if (nextImage.length > 0) {
    				nextImage.attr('src', nextImage.attr('data-src'));
    			}	    		

    			if (prevImage.length > 0) {
    				prevImage.attr('src', prevImage.attr('data-src'));
    			}
    		});
    	});

    	// Carousel indicators, load image from data-src
    	$('.carousel-control-grid li').on('click', function() {
    		var img = $($(this).attr('data-target') + ' .carousel-inner .item')
    			.eq($(this).attr('data-slide-to'))
    			.children('img');
    		img.attr('src', img.attr('data-src'));
    		// $(this).siblings().removeClass('active');
    		// $(this).addClass('active');
    	});
	};

    // Simple custom carousel thats positioned abosolutey and fills relative parent
	var initBackgroundImageCarousel = function() {

		var settings = {
			containerClass: '.c-bg-carousel',
			carouselItemClass: '.c-bg-carousel__item',
			transitionSpeed: 2000,
			interval: 5000,
			auto: false
		};

		$(settings.containerClass).each(function() {

			// Grab array of images 
			var $this = $(this),
				items = $this.find(settings.carouselItemClass);

			// Check if items exist
			if (items.length > 0) {

				// Set first item opacity to 1
				items.css('opacity', '0');
				items.eq(0).css('opacity', '1').addClass('active');
				// Preload last image incase previous button clicked first
				items.eq(items.length-1).css('background-image', 'url('+items.eq(items.length-1).attr('data-src')+')');
				// Preload next image
				items.eq(1).css('background-image', 'url('+items.eq(items.length-1).attr('data-src')+')');
				// Set transition and speed
				items.css({
					'transition': 'opacity '+(settings.transitionSpeed / 1000)+'s ease-in-out',
					'-webkit-transition': 'opacity '+(settings.transitionSpeed / 1000)+'s ease-in-out',
					'-moz-transition': 'opacity '+(settings.transitionSpeed / 1000)+'s ease-in-out',
					'-ms-transition': 'opacity '+(settings.transitionSpeed / 1000)+'s ease-in-out'
				});

				if (settings.auto !== false) {

					// Set var i = 1 skipping first item
					var i = 1;
					// Continuously loop with interval speed and change items opacity
					setInterval(function() {
						items.eq(i-1).css('opacity', '0');
						items.eq(i).css('opacity', '1');
						i++;
						if (i >= items.length) i = 0;
					}, settings.interval + settings.transitionSpeed)

				} else {

					// Update slide when click arrows
					$this.find('.c-bg-carousel__control').on('click', function(e) {
						e.preventDefault();
						var activeItem = $this.find(settings.carouselItemClass+'.active');
						if ($(this).hasClass('next')) {
							// Show next slide and set to active slide
							var nextSlide = activeItem.next();
							if (nextSlide.length == 0) var nextSlide = items.eq(0);
							activeItem.removeClass('active').css('opacity', '0');
							nextSlide.addClass('active').css('opacity', '1');

							// Load next slide image worked out from new active
							var nextNextSlide = nextSlide.next();
							
							if (nextNextSlide.css('background-image') == 'none') {
								nextNextSlide.css('background-image', 'url('+nextNextSlide.attr('data-src')+')');
							}	 

						} else {
							// Show previous slide and set to active slide
							var prevSlide = activeItem.prev();
							if (prevSlide.length == 0) var prevSlide = items.eq(items.length-1);
							activeItem.removeClass('active').css('opacity', '0');
							prevSlide.addClass('active').css('opacity', '1');

							// Load previous slide image worked out from new active
							var prevPrevSlide = prevSlide.prev();
							if (prevPrevSlide.css('background-image') == 'none') {
								prevPrevSlide.css('background-image', 'url('+prevPrevSlide.attr('data-src')+')');
							}
						}
					});

				}
			}
		});

	};

    return {
    	init: init
    };

} (jQuery);

jQuery(function() { 
	core.init(); 
});