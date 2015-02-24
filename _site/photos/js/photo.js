jQuery(function ($) {

    $.supersized({

                     // Functionality
                     slide_interval: 4500,		// Length between transitions
                     transition: 3, 			// 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
                     transition_speed: 800,		// Speed of transition

                     // Components
                     slide_links: 'blank',	// Individual links for each slide (Options: false, 'num', 'name', 'blank')
                     slides: [			// Slideshow Images
                         {image: 'http://static.panoramio.com/photos/large/92464426.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/109199040.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/105836333.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/45726915.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/77835780.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/44073402.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/98898327.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/92276721.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/42163218.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/42462727.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/100920022.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/100026344.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/55717739.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/77835786.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/101153731.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/51569735.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/47573960.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''},
                         {image: 'http://static.panoramio.com/photos/large/109199027.jpg', title: 'Image Credit: GuoJunjun', thumb: '', url: ''}
                     ]

                 });
});
