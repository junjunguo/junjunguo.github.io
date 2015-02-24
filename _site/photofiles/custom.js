/*
	Easy plugin to get element index position
	Author: Peerapong Pulpipatnan
	http://themeforest.net/user/peerapong
*/

var $j = jQuery.noConflict();

/* jquery.imagefit 
 *
 * Version 0.2 by Oliver Boermans <http://www.ollicle.com/eg/jquery/imagefit/>
 *
 * Extends jQuery <http://jquery.com>
 *
 */
(function($) {
	$.fn.imagefit = function(options) {
		var fit = {
			all : function(imgs){
				imgs.each(function(){
					fit.one(this);
					})
				},
			one : function(img){
				$(img)
					.width('100%').each(function()
					{
						$(this).height(Math.round(
							$(this).attr('startheight')*($(this).width()/$(this).attr('startwidth')))
						);
					})
				}
		};
		
		this.each(function(){
				var container = this;
				
				// store list of contained images (excluding those in tables)
				var imgs = $('img', container).not($("table img"));
				
				// store initial dimensions on each image 
				imgs.each(function(){
					$(this).attr('startwidth', $(this).width())
						.attr('startheight', $(this).height())
						.css('max-width', $(this).attr('startwidth')+"px");
				
					fit.one(this);
				});
				// Re-adjust when window width is changed
				$(window).bind('resize', function(){
					fit.all(imgs);
				});
			});
		return this;
	};
})(jQuery);


$j.fn.getIndex = function(){
	var $jp=$j(this).parent().children();
    return $jp.index(this);
}
 
jQuery.fn.extend({
  slideRight: function() {
    return this.each(function() {
    	jQuery(this).show();
    });
  },
  slideLeft: function() {
    return this.each(function() {
    	jQuery(this).hide();
    });
  },
  slideToggleWidth: function() {
    return this.each(function() {
      var el = jQuery(this);
      if (el.css('display') == 'none') {
        el.slideRight();
      } else {
        el.slideLeft();
      }
    });
  }
});

$j.fn.setNav = function(){
	$j('#main_menu li ul').css({display: 'none'});

	$j('#main_menu li').each(function()
	{	
		var $jsublist = $j(this).find('ul:first');
		
		$j(this).hover(function()
		{	
			$jsublist.css({opacity: 1});
			
			$jsublist.stop().css({overflow:'hidden', height:'auto', display:'none'}).fadeIn(200, function()
			{
				$j(this).css({overflow:'visible', height:'auto', display: 'block'});
			});	
		},
		function()
		{	
			$jsublist.stop().css({overflow:'hidden', height:'auto', display:'none'}).fadeOut(200, function()
			{
				$j(this).css({overflow:'hidden', display:'none'});
			});	
		});	
		
	});
	
	$j('#main_menu li').each(function()
	{
		
		$j(this).hover(function()
		{	
			$j(this).find('a:first').addClass('hover');
		},
		function()
		{	
			$j(this).find('a:first').removeClass('hover');
		});	
		
	});
	
	$j('#menu_wrapper .nav ul li ul').css({display: 'none'});

	$j('#menu_wrapper .nav ul li').each(function()
	{	
		
		var $jsublist = $j(this).find('ul:first');
		
		$j(this).hover(function()
		{	
			$jsublist.css({opacity: 1});
			
			$jsublist.stop().css({overflow:'hidden', height:'auto', display:'none'}).fadeIn(200, function()
			{
				$j(this).css({overflow:'visible', height:'auto', display: 'block'});
			});	
		},
		function()
		{	
			$jsublist.stop().css({overflow:'hidden', height:'auto', display:'none'}).fadeOut(200, function()
			{
				$j(this).css({overflow:'hidden', display:'none'});
			});	
		});	
		
	});
	
	$j('#menu_wrapper .nav ul li').each(function()
	{
		
		$j(this).hover(function()
		{	
			$j(this).find('a:first').addClass('hover');
		},
		function()
		{	
			$j(this).find('a:first').removeClass('hover');
		});	
		
	});
}

$j(document).ready(function(){ 

	$j(document).setNav();

	$j('.pp_gallery a').fancybox({ 
		padding: 0,
		overlayColor: '#000', 
		transitionIn: 'elastic',
		transitionOut: 'elastic',
		overlayOpacity: .8
	});
	
	$j('a[rel=gallery]').fancybox({ 
		padding: 0,
		overlayColor: '#000', 
		transitionIn: 'elastic',
		transitionOut: 'elastic',
		overlayOpacity: .8
	});
	
	$j('.img_frame').fancybox({ 
		padding: 0,
		overlayColor: '#000', 
		overlayOpacity: .8
	});
	
	$j.validator.setDefaults({
		submitHandler: function() { 
		    var actionUrl = $j('#contact_form').attr('action');
		    
		    $j.ajax({
  		    	type: 'GET',
  		    	url: actionUrl,
  		    	data: $j('#contact_form').serialize(),
  		    	success: function(msg){
  		    		$j('#contact_form').hide();
  		    		$j('#reponse_msg').html(msg);
  		    	}
		    });
		    
		    return false;
		}
	});
		    
		
	$j('#contact_form').validate({
		rules: {
		    your_name: "required",
		    email: {
		    	required: true,
		    	email: true
		    },
		    message: "required"
		},
		messages: {
		    your_name: "Please enter your name",
		    email: "Please enter a valid email address",
		    agree: "Please enter some message"
		}
	});	
	
	var photoItems = $j('#content_wrapper .inner .card').length;
	var scrollArea = parseInt($j('#gallery_width').val())+330;
	var scrollWidth = $j('#wrapper').width();
	
	$j('#content_wrapper').css({width: scrollWidth+'px'});

	
	$j("#content_wrapper .inner").css('width', scrollArea);
	$j("#content_wrapper").attr({scrollLeft: 0});					   
	
	$j("#content_wrapper").css({"overflow":"hidden"});
	
	$j("#move_next").click( 
    	function() {
    	    var speed = parseInt($j('#slider_speed').val());
		    var slider = $j('#content_slider');
		    var sliderCurrent = slider.slider("option", "value");
		    sliderCurrent += speed; // += and -= directions of scroling with MouseWheel
		    
		    if (sliderCurrent > slider.slider("option", "max")) sliderCurrent = slider.slider("option", "max");
		    else if (sliderCurrent < slider.slider("option", "min")) sliderCurrent = slider.slider("option", "min");
		    
		    slider.slider("value", sliderCurrent);
    	}
    );
    $j("#move_prev").click(
    	function() {
    	    var speed = parseInt($j('#slider_speed').val());
		    var slider = $j('#content_slider');
		    var sliderCurrent = slider.slider("option", "value");
		    sliderCurrent -= speed; // += and -= directions of scroling with MouseWheel
		    
		    if (sliderCurrent > slider.slider("option", "max")) sliderCurrent = slider.slider("option", "max");
		    else if (sliderCurrent < slider.slider("option", "min")) sliderCurrent = slider.slider("option", "min");
		    
		    slider.slider("value", sliderCurrent);
    	}
    );
	
	var auto_scroll = $j('#pp_gallery_auto_scroll').val();
	
	if(auto_scroll != 0)
	{
		$j("#move_next").mouseenter( 
    		function() {
    	    	timerId = setInterval(function() { 
    	    	
    	    		var speed = parseInt($j('#slider_speed').val());
					var slider = $j('#content_slider');
					var sliderCurrent = slider.slider("option", "value");
					sliderCurrent += speed; // += and -= directions of scroling with MouseWheel
					
					if (sliderCurrent > slider.slider("option", "max")) sliderCurrent = slider.slider("option", "max");
					else if (sliderCurrent < slider.slider("option", "min")) sliderCurrent = slider.slider("option", "min");
					
					slider.slider("value", sliderCurrent);
    	    	
    	    	}, 100);
    	    	
    	    	//$j(this).find('img').animate({ opacity: 1 }, 300);
    		}
    	);
    	$j("#move_next").mouseleave( 
    		function() { 
    			clearInterval(timerId); 
    		}
		);
		
		$j("#move_prev").mouseenter(
    		function() {
    	    	timerId = setInterval(function() { 
    	    	
    	    		var speed = parseInt($j('#slider_speed').val());
					var slider = $j('#content_slider');
					var sliderCurrent = slider.slider("option", "value");
					sliderCurrent -= speed; // += and -= directions of scroling with MouseWheel
					
					if (sliderCurrent > slider.slider("option", "max")) sliderCurrent = slider.slider("option", "max");
					else if (sliderCurrent < slider.slider("option", "min")) sliderCurrent = slider.slider("option", "min");
					
					slider.slider("value", sliderCurrent);
    	    	
    	    	}, 100);
    	    	
    	    	//$j(this).find('img').animate({ opacity: 1 }, 300);
    		}
    	);
    	$j("#move_prev").mouseleave(
    		function() { 
    			clearInterval(timerId); 
    		}
		);
	}
	
	$j('#content_slider').slider({
		animate: 'slow',
		change: changeSlide,
		slide: doSlide
	});
	
	function changeSlide(e, ui)
	{
		var maxScroll = $j("#content_wrapper").attr("scrollWidth") - $j("#content_wrapper").width();
		var currentScroll = (ui.value * (maxScroll / 100))-65;
		$j("#content_wrapper").stop().animate({scrollLeft: currentScroll}, 1200);
	}

	function doSlide(e, ui)
	{
		var maxScroll = $j("#content_wrapper").attr("scrollWidth") - $j("#content_wrapper").width();
		var currentScroll = (ui.value * (maxScroll / 100))-65;
		$j("#content_wrapper").stop().attr({scrollLeft: currentScroll});
	}
	
	$j('#menu_mini_state').mouseenter(
    	function() {
 			$j('#menu_wrapper').animate({"left": "0px"}, { duration: 300 });
 			$j(this).css('display', 'none');
    	}
    );
    
    $j('#menu_wrapper').mouseleave(
    	function() {
    		$j('#menu_wrapper').animate({"left": "-400px"}, { duration: 300 });
 			$j('#menu_mini_state').css('display', 'block');
    	}
    );
	
	Cufon.replace('h1.cufon');
	Cufon.replace('h2.cufon');
	Cufon.replace('h2.quote');
	Cufon.replace('h2.widgettitle');
	Cufon.replace('h3.cufon');
	Cufon.replace('h4.cufon');
	Cufon.replace('h5.cufon');
	Cufon.replace('h6.cufon');
	Cufon.replace('#searchform label');
	Cufon.replace('.dropcap1');
	Cufon.replace('.ui-accordion-header');
	Cufon.replace('.nav', {hover: true});
	
	$j('#content_slider_wrapper').fadeOut();
	$j('#move_next').fadeOut();
	$j('#move_prev').fadeOut();
 	
	var viewportHeight = $j(document).height();
	var viewportWidth = $j(document).width();
 	$j('#menu_wrapper').css('height', viewportHeight);
 	$j('#main_bg').css('height', viewportHeight);
 	$j('#menu_mini_state').css('height', viewportHeight);
 	
 	$j(window).resize(function() {
 		var viewportHeight = $j(document).height();
		var viewportWidth = $j(document).width();
 		
 		$j('#menu_wrapper').css('height', viewportHeight);
 		$j('#menu_mini_state').css('height', viewportHeight);
	});
	
	VideoJS.setupAllWhenReady({
      controlsBelow: false, // Display control bar below video instead of in front of
      controlsHiding: true, // Hide controls when mouse is not over the video
      defaultVolume: 0.85, // Will be overridden by user's last volume if available
      flashVersion: 9, // Required flash version for fallback
      linksHiding: true // Hide download links when video is supported
    });
    
    $j('.img_nofade').hover(function(){  
			$j(this).animate({opacity: .5}, 300);
 		}  
  		, function(){  
  			$j(this).animate({opacity: 1}, 300);
  		}  
  		
	);

});
