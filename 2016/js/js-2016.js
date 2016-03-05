/**
 * Created by GuoJunjun on 28/02/16. <junjunguo.com>
 *
 */


/**
 * check if client from China
 */
//function clientlocationplugin() {
//    return jQuery.getScript('http://www.geoplugin.net/javascript.gp', function () {
//        var country = geoplugin_countryName();
//        var zone = geoplugin_region();
//        var district = geoplugin_city();
//        console.log("Your location is: " + country + ", " + zone + ", " + district);
//    })();
//}
//console.log("Your location: " + geoplugin_countryName());
/**
 *  * shuffle the list and return a photo addressed list
 * @param list
 * @returns {Array}
 */
function shuffleList(list) { // shuffle nrlist and return a list with objects ready for slides
    var copy = [], n = list.length, index;
    var bgimgaddress;
    if (geoplugin_countryName() == "China") {
        bgimgaddress = './2015/images/bg/';
    } else {
        bgimgaddress = 'http://static.panoramio.com/photos/large/';
    }
    while (n) {
        index = Math.floor(Math.random() * (n--));
        //        var overlay = 'url(".2015/css/images/overlay-black.svg"),'
        copy.push(bgimgaddress + list[index] + '.jpg');
        list.splice(index, 1);
    }
    return copy;
}

/**
 * add the image to #header as background image
 * @param theImg
 */
function addImage(theImg) {
    document.getElementById("first-page").style.backgroundImage = "url('" + theImg + "')";
}
var listh = [			//  Images id numbers for header
    77233663,
    105836333,
    109199045,
    109172199,
    92464442,
    92464435,
    107909681,
    51569735,
    108930464,
    109049207,
    109100961,
    106419102,
    51569745,
    78491829,
    49428516,
    43143230,
    106397984
];
function slideShow() {
    var counter = 0; // to keep track of current slide
    var slides = shuffleList(listh); // a collection of all of the slides

    var showImage = function () {
        // calculates the actual index of the element to show
        var theImage = Math.abs(counter % slides.length);
        addImage(slides[theImage]);
    };

    // add click events to prev &amp; next buttons
    $('.nextslide').on('click', function () {
        document.getElementById('first-page').scrollIntoView();
        counter++;
        showImage();
    });
    $('.prevslide').on('click', function () {
        document.getElementById('first-page').scrollIntoView();
        counter--;
        showImage();
    });
    // logo click
    $('#logo').on('click', function () {
        document.getElementById('first-page').scrollIntoView();
        counter = Math.floor(Math.random() * slides.length);
        showImage();
        console.log("logo clicked");
    });

    showImage();
}

//
var listf = [			//  Images id numbers for footer
    106397977,
    101153731,
    77835780,
    100920022,
    42462727,
    55717739,
    77835786,
    100920020
];
function changeBCP() {

    var bcgslides = shuffleList(listf); // a collection of all of the bcgslides

    var changepic = function () {

        var theimg = bcgslides[Math.floor(Math.random() * bcgslides.length)];

        document.getElementById("footer").style.backgroundImage =
            "url('./2015/css/images/overlay-black.svg'), url('" + theimg + "')";
    };

    // add click events to prev &amp; next buttons
    $('#changebcp').on('click', function () {
        document.getElementById('footer').scrollIntoView()
        changepic();
    });

    changepic();
}


/**
 * set up full page : https://github.com/alvarotrigo/fullPage.js
 */
$(document).ready(function () {
    $('#fullpage').fullpage({
        //Navigation
        //menu:               '#myMenu',
        lockAnchors:        false,
        //anchors:            ['firstPage',
        //                     'secondPage',
        //                     'thirdPage',
        //                     'fourthPage',
        //                     'lastPage'],
        navigation:         true,
        navigationPosition: 'right',
        navigationTooltips: ['main',
                             'individual work',
                             'teamwork',
                             'humor',
                             'quotes',
                             'panoramio',
                             'flickr',
                             'contact'],
        showActiveTooltip:  false,
        slidesNavigation:   true,
        slidesNavPosition:  'bottom',

        //Scrolling
        css3:                              true,
        scrollingSpeed:                    700,
        autoScrolling:                     false,
        fitToSection:                      true,
        fitToSectionDelay:                 1000,
        scrollBar:                         false,
        easing:                            'easeInOutCubic',
        easingcss3:                        'ease',
        loopBottom:                        false,
        loopTop:                           false,
        loopHorizontal:                    true,
        continuousVertical:                false,
        normalScrollElements:              '#element1, .element2',
        scrollOverflow:                    true,
        touchSensitivity:                  15,
        normalScrollElementTouchThreshold: 5,

        //Accessibility
        keyboardScrolling: true,
        animateAnchor:     true,
        recordHistory:     true,

        //Design
        controlArrows:    true,
        verticalCentered: true,
        resize:           false,
        //sectionsColor:    ['#ccc',
        //                   '#fff'],
        paddingTop:       '0em',
        paddingBottom:    '0px',
        fixedElements:    '#header, .footer',
        responsiveWidth:  0,
        responsiveHeight: 0,

        //Custom selectors
        sectionSelector: '.section',
        slideSelector:   '.slide',

        //events
        onLeave:        function (index, nextIndex, direction) {},
        afterLoad:      function (anchorLink, index) {},
        afterRender:    function () {},
        afterResize:    function () {},
        afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {},
        onSlideLeave:   function (anchorLink, index, slideIndex, direction, nextSlideIndex) {}
    });
});


//run the script:

//run slide show
slideShow();
changeBCP();