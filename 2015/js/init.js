(function ($) {

    var settings = {

        // Full screen header?
        fullScreenHeader: true,

        // Parallax background effect?
        parallax: true,

        // Parallax factor (lower = more intense, higher = less intense).
        parallaxFactor: 10

    };

    skel.init({
        reset: 'full',
        breakpoints: {
            'global': { range: '*', href: '2015/css/style.css', containers: 1140, grid: { gutters: 40 } },
            'wide': { range: '-1680', href: '2015/css/style-wide.css', containers: 960 },
            'normal': { range: '-1080', href: '2015/css/style-normal.css', containers: '95%', viewport: { scalable: false } },
            'narrow': { range: '-840', href: '2015/css/style-narrow.css', grid: { gutters: 30 } },
            'mobile': { range: '-736', href: '2015/css/style-mobile.css', containers: '95%!', grid: { collapse: true, gutters: 20 } }
        }
    });

    $(function () {

        var $window = $(window),
            $body = $('body');

        if (skel.vars.isTouch) {

            settings.parallax = false;
            $body.addClass('is-scroll');

        }

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load', function () {
            $body.removeClass('is-loading');
        });

        // CSS polyfills (IE<9).
        if (skel.vars.IEVersion < 9)
            $(':last-child').addClass('last-child');

        // Forms (IE<10).
        var $form = $('form');
        if ($form.length > 0) {

            $form.find('.form-button-submit')
                .on('click', function () {
                    $(this).parents('form').submit();
                    return false;
                });

            if (skel.vars.IEVersion < 10) {
                $.fn.n33_formerize = function () {
                    var _fakes = new Array(), _form = $(this);
                    _form.find('input[type=text],textarea').each(function () {
                        var e = $(this);
                        if (e.val() == '' || e.val() == e.attr('placeholder')) {
                            e.addClass('formerize-placeholder');
                            e.val(e.attr('placeholder'));
                        }
                    }).blur(function () {
                        var e = $(this);
                        if (e.attr('name').match(/_fakeformerizefield$/)) return;
                        if (e.val() == '') {
                            e.addClass('formerize-placeholder');
                            e.val(e.attr('placeholder'));
                        }
                    }).focus(function () {
                        var e = $(this);
                        if (e.attr('name').match(/_fakeformerizefield$/)) return;
                        if (e.val() == e.attr('placeholder')) {
                            e.removeClass('formerize-placeholder');
                            e.val('');
                        }
                    });
                    _form.find('input[type=password]').each(function () {
                        var e = $(this);
                        var x = $($('<div>').append(e.clone()).remove().html().replace(/type="password"/i,
                            'type="text"').replace(/type=password/i, 'type=text'));
                        if (e.attr('id') != '') x.attr('id', e.attr('id') + '_fakeformerizefield');
                        if (e.attr('name') != '') x.attr('name', e.attr('name') + '_fakeformerizefield');
                        x.addClass('formerize-placeholder').val(x.attr('placeholder')).insertAfter(e);
                        if (e.val() == '') e.hide(); else x.hide();
                        e.blur(function (event) {
                            event.preventDefault();
                            var e = $(this);
                            var x = e.parent().find('input[name=' + e.attr('name') + '_fakeformerizefield]');
                            if (e.val() == '') {
                                e.hide();
                                x.show();
                            }
                        });
                        x.focus(function (event) {
                            event.preventDefault();
                            var x = $(this);
                            var e = x.parent().find('input[name=' + x.attr('name').replace('_fakeformerizefield', '') +
                                ']');
                            x.hide();
                            e.show().focus();
                        });
                        x.keypress(function (event) {
                            event.preventDefault();
                            x.val('');
                        });
                    });
                    _form.submit(function () {
                        $(this).find('input[type=text],input[type=password],textarea').each(function (event) {
                            var e = $(this);
                            if (e.attr('name').match(/_fakeformerizefield$/)) e.attr('name', '');
                            if (e.val() == e.attr('placeholder')) {
                                e.removeClass('formerize-placeholder');
                                e.val('');
                            }
                        });
                    }).bind("reset", function (event) {
                        event.preventDefault();
                        $(this).find('select').val($('option:first').val());
                        $(this).find('input,textarea').each(function () {
                            var e = $(this);
                            var x;
                            e.removeClass('formerize-placeholder');
                            switch (this.type) {
                                case 'submit':
                                case 'reset':
                                    break;
                                case 'password':
                                    e.val(e.attr('defaultValue'));
                                    x = e.parent().find('input[name=' + e.attr('name') + '_fakeformerizefield]');
                                    if (e.val() == '') {
                                        e.hide();
                                        x.show();
                                    } else {
                                        e.show();
                                        x.hide();
                                    }
                                    break;
                                case 'checkbox':
                                case 'radio':
                                    e.attr('checked', e.attr('defaultValue'));
                                    break;
                                case 'text':
                                case 'textarea':
                                    e.val(e.attr('defaultValue'));
                                    if (e.val() == '') {
                                        e.addClass('formerize-placeholder');
                                        e.val(e.attr('placeholder'));
                                    }
                                    break;
                                default:
                                    e.val(e.attr('defaultValue'));
                                    break;
                            }
                        });
                        window.setTimeout(function () {
                            for (x in _fakes) _fakes[x].trigger('formerize_sync');
                        }, 10);
                    });
                    return _form;
                };
                $form.n33_formerize();
            }

        }

        // Scrolly links.
        $('.scrolly').scrolly(1000, function () {
            return (skel.isActive('mobile') ? 70 : 190);
        });

        // Full screen header.
        if (settings.fullScreenHeader) {

            var $header = $('#header');

            if ($header.length > 0) {

                var $header_header = $header.find('header');

                $window
                    .on('resize.overflow_fsh', function () {

                        if (skel.isActive('mobile'))
                            $header.css('padding', '');
                        else {

                            var p = Math.max(192, ($window.height() - $header_header.outerHeight()) / 2);
                            $header.css('padding', p + 'px 0 ' + p + 'px 0');

                        }

                    })
                    .trigger('resize.overflow_fsh');

                $window.load(function () {
                    $window.trigger('resize.overflow_fsh');
                });

            }

        }

//        //---------------------------------------------------------------------------------------------------------
//        // .
//        $('#header').each(function () {
//            var nrlist = [			//  Images id numbers
//                77233663, 105836333, 109199045, 109172199, 92464442, 92464435, 55717739, 77835786, 107909681, 51569735,
//                108930464, 109049207, 109100961, 106397977, 92401424
//            ]
//
//            function shuffleList(list) { // shuffle nrlist and return a list with objects ready for slides
//                var copy = [], n = list.length, index;
//                while (n) {
//                    index = Math.floor(Math.random() * (n--));
//                    copy.push({'image': 'http://static.panoramio.com/photos/large/' + list[index] +
//                        '.jpg', 'title': 'Image Credit: GuoJunjun', 'thumb': '', 'url': ''});
//                    list.splice(index, 1);
//                }
//                return copy;
//            }
//
//            var $t = $(this),
//                $forward = $('<span class="forward"></span>'),
//                $backward = $('<span class="backward"></span>'),
//                $reel = $t.children('#header'),
//                $items = $reel.children(shffleList(nrlist));
//
//            var pos = 0,
//                leftLimit,
//                rightLimit,
//                itemWidth,
//                reelWidth,
//                timerId;
//
//            // Items.
//            if (settings.carousels.fadeIn) {
//
//                $items.addClass('loading');
//
//                $t.onVisible(function () {
//                    var timerId,
//                        limit = $items.length - Math.ceil($window.width() / itemWidth);
//
//                    timerId = window.setInterval(function () {
//                        var x = $items.filter('.loading'), xf = x.first();
//
//                        if (x.length <= limit) {
//
//                            window.clearInterval(timerId);
//                            $items.removeClass('loading');
//                            return;
//
//                        }
//
//                        if (skel.vars.IEVersion < 10) {
//
//                            xf.fadeTo(750, 1.0);
//                            window.setTimeout(function () {
//                                xf.removeClass('loading');
//                            }, 50);
//
//                        }
//                        else
//                            xf.removeClass('loading');
//
//                    }, settings.carousels.fadeDelay);
//                }, 50);
//            }
//
//            // Main.
//            $t._update = function () {
//                pos = 0;
//                rightLimit = (-1 * reelWidth) + $window.width();
//                leftLimit = 0;
//                $t._updatePos();
//            };
//
//            if (skel.vars.IEVersion < 9)
//                $t._updatePos = function () {
//                    $reel.css('left', pos);
//                };
//            else
//                $t._updatePos = function () {
//                    $reel.css('transform', 'translate(' + pos + 'px, 0)');
//                };
//
//            // Forward.
//            $forward
//                .appendTo($t)
//                .hide()
//                .mouseenter(function (e) {
//                    timerId = window.setInterval(function () {
//                        pos -= settings.carousels.speed;
//
//                        if (pos <= rightLimit) {
//                            window.clearInterval(timerId);
//                            pos = rightLimit;
//                        }
//
//                        $t._updatePos();
//                    }, 10);
//                })
//                .mouseleave(function (e) {
//                    window.clearInterval(timerId);
//                });
//
//            // Backward.
//            $backward
//                .appendTo($t)
//                .hide()
//                .mouseenter(function (e) {
//                    timerId = window.setInterval(function () {
//                        pos += settings.carousels.speed;
//
//                        if (pos >= leftLimit) {
//
//                            window.clearInterval(timerId);
//                            pos = leftLimit;
//
//                        }
//
//                        $t._updatePos();
//                    }, 10);
//                })
//                .mouseleave(function (e) {
//                    window.clearInterval(timerId);
//                });
//
//            // Init.
//            $window.load(function () {
//
//                reelWidth = $reel[0].scrollWidth;
//
//                skel.change(function () {
//
//                    if (skel.vars.isTouch) {
//
//                        $reel
//                            .css('overflow-y', 'hidden')
//                            .css('overflow-x', 'scroll')
//                            .scrollLeft(0);
//                        $forward.hide();
//                        $backward.hide();
//
//                    }
//                    else {
//
//                        $reel
//                            .css('overflow', 'visible')
//                            .scrollLeft(0);
//                        $forward.show();
//                        $backward.show();
//
//                    }
//
//                    $t._update();
//                });
//
//                $window.resize(function () {
//                    reelWidth = $reel[0].scrollWidth;
//                    $t._update();
//                }).trigger('resize');
//
//            });
//
//        });
        //---------------------------------------------------------------------------------------------------------


        // Parallax background.

        // Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
        if (skel.vars.browser == 'ie'
            || skel.vars.isMobile)
            settings.parallax = false;

        if (settings.parallax) {

            var $dummy = $(), $bg;

            $window
                .on('scroll.overflow_parallax', function () {

                    // Adjust background position.
                    $bg.css('background-position',
                            'center ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');

                })
                .on('resize.overflow_parallax', function () {

                    // If we're in a situation where we need to temporarily disable parallax, do so.
                    if (!skel.isActive('wide')
                        || skel.isActive('narrow')) {

                        $body.css('background-position', '');
                        $bg = $dummy;

                    }

                    // Otherwise, continue as normal.
                    else
                        $bg = $body;

                    // Trigger scroll handler.
                    $window.triggerHandler('scroll.overflow_parallax');

                })
                .trigger('resize.overflow_parallax');

        }

        // Poptrox.
        $('.gallery').poptrox({
            useBodyOverflow: false,
            usePopupEasyClose: false,
            overlayColor: '#0a1919',
            overlayOpacity: (skel.vars.IEVersion < 9 ? 0 : 0.75),
            usePopupDefaultStyling: false,
            usePopupCaption: true,
            popupLoaderText: '',
            windowMargin: 10,
            usePopupNav: true
        });

    });

})(jQuery);