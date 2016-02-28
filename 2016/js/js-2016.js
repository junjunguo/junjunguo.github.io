/**
 * Created by GuoJunjun on 28/02/16. <junjunguo.com>
 *
 */

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
        navigation:         false,
        navigationPosition: 'right',
        navigationTooltips: ['firstSlide',
                             'secondSlide'],
        showActiveTooltip:  false,
        slidesNavigation:   true,
        slidesNavPosition:  'bottom',

        //Scrolling
        css3:                              true,
        scrollingSpeed:                    700,
        autoScrolling:                     true,
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
        scrollOverflow:                    false,
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
        sectionsColor:    ['#ccc',
                           '#fff'],
        paddingTop:       '3em',
        paddingBottom:    '10px',
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