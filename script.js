    jQuery.fn.gdlr_core_flexslider = function( filter_elem ){

        if( typeof(filter_elem) == 'undefined' ){
            var elem = $(this).find('.gdlr-core-flexslider');
        }else{
            var elem = filter_elem.filter('.gdlr-core-flexslider');
        }

        elem.each(function(){

            var flex_attr = {
                useCSS: false,
                animation: 'fade',
                animationLoop: true,
                prevText: '<i class="arrow_carrot-left"></i>',
                nextText: '<i class="arrow_carrot-right"></i>'
            };

            if( $(this).attr('data-start-at') && $(this).attr('data-start-at') > 1 ){
                flex_attr.startAt = $(this).attr('data-start-at') - 1;
            }

            if( $(this).find('.gdlr-core-flexslider').length > 0 ){
                $(this).children('ul.slides').addClass('parent-slides');
                flex_attr.selector = '.parent-slides > li';
            }

            // variable settings
            if( $(this).attr('data-disable-autoslide') ){
                flex_attr.slideshow = false;
            }
            if( $(this).attr('data-pausetime') ){
                flex_attr.slideshowSpeed = parseInt($(this).attr('data-pausetime'));
            }
            if( $(this).attr('data-slidespeed') ){
                flex_attr.animationSpeed = parseInt($(this).attr('data-slidespeed'));
            }else{
                flex_attr.animationSpeed = 500;
            }

            // for carousel
            if( $(this).attr('data-type') == 'carousel' ){
                flex_attr.move = $(this).attr('data-move')? parseInt($(this).attr('data-move')): 1;
                flex_attr.animation = 'slide';

                // determine the spaces
                var column_num = parseInt($(this).attr('data-column'));
                flex_attr.itemMargin = 2 * parseInt($(this).children('ul.slides').children('li:first-child').css('margin-right'));
                flex_attr.itemWidth = (($(this).width() + flex_attr.itemMargin) / column_num) - (flex_attr.itemMargin);

                flex_attr.minItems = column_num;
                flex_attr.maxItems = column_num;

                var t = $(this);
                $(window).on('resize gdlr-core-element-resize', function(){
                    if( t.data('goodlayers_flexslider') ){
                        var newWidth = ((t.width() + flex_attr.itemMargin) / column_num) - (flex_attr.itemMargin);
                        t.data('goodlayers_flexslider').editItemWidth(newWidth);
                    }
                });

            }else if( $(this).attr('data-effect') ){
                if( $(this).attr('data-effect') == 'kenburn' ){
                    flex_attr.animation = 'fade';
                }else{
                    flex_attr.animation = $(this).attr('data-effect');
                }
            }

            // for navigation
            var data_nav = ['both', 'navigation', 'navigation-outer-plain-round', 'navigation-top', 'navigation-bottom', 'navigation-inner', 'navigation-outer'];
            if( !$(this).attr('data-nav') || data_nav.indexOf($(this).attr('data-nav')) != -1 ){
                if( !$(this).hasClass('gdlr-core-bottom-nav-1') ){ /* old style fallback */
                    if( $(this).attr('data-nav-parent') ){
                        if( $(this).attr('data-nav-parent') == 'self' ){
                            flex_attr.customDirectionNav = $(this).find('.flex-prev, .flex-next');
                        }if( $(this).attr('data-nav-type') == 'custom' ){
                            flex_attr.customDirectionNav = $(this).closest('.' + $(this).attr('data-nav-parent')).find('.flex-prev, .flex-next');
                        }else{
                            $(this).closest('.' + $(this).attr('data-nav-parent')).each(function(){
                                var flex_nav = $('<ul class="flex-direction-nav">' +
                                                '<li class="flex-nav-prev"><a class="flex-prev" href="#"><i class="arrow_carrot-left"></i></a></li>' +
                                                '<li class="flex-nav-next"><a class="flex-next" href="#"><i class="arrow_carrot-right"></i></a></li>' +
                                            '</ul>');

                                var flex_nav_position = $(this).find('.gdlr-core-flexslider-nav');
                                if( flex_nav_position.length ){
                                    flex_nav_position.append(flex_nav);
                                    flex_attr.customDirectionNav = flex_nav.find('.flex-prev, .flex-next');
                                }
                            });
                        }
                    }
                }
            }else{
                flex_attr.directionNav = false;
            }
            if( $(this).attr('data-nav') == 'both' || $(this).attr('data-nav') == 'bullet' ){
                flex_attr.controlNav = true;
            }else{
                flex_attr.controlNav = false;
            }

            // for thumbnail
            if( $(this).attr('data-thumbnail') ){
                var thumbnail_slide = $(this).siblings('.gdlr-core-sly-slider');

                flex_attr.manualControls = thumbnail_slide.find('ul.slides li')
                flex_attr.controlNav = true;
            }

            // center the navigation
            // add active class for kenburn effects
            if( $(this).attr('data-vcenter-nav') ){
                flex_attr.start = function(slider){
                    $(slider).children('.gdlr-core-flexslider-custom-nav.gdlr-core-style-navigation-outer').each(function(){
                        $(this).insertAfter($(slider).children('.flex-viewport'));
                    });
                    if( slider.directionNav ){
                        $(window).on('resize gdlr-core-element-resize', function(){
                            slider.directionNav.each(function(){
                                var margin = -(slider.height() + $(this).outerHeight()) / 2;
                                $(this).css('margin-top', margin);
                            });
                        });
                    }
                    if( typeof(slider.slides) != 'undefined' ){
                        $(window).trigger('gdlr-core-element-resize');
                        slider.slides.filter('.flex-active-slide').addClass('gdlr-core-active').siblings().removeClass('gdlr-core-active');
                    }
                };
            }else{
                flex_attr.start = function(slider){
                    if( typeof(slider.slides) != 'undefined' ){

                        if( $(slider).attr('data-controls-top-margin') ){
                            $(slider).find('.flex-control-nav').css({ 'margin-top': $(slider).attr('data-controls-top-margin') });
                        }

                        $(slider).children('.gdlr-core-flexslider-custom-nav.gdlr-core-style-navigation-bottom').each(function(){
                            $(this).insertAfter($(slider).children('.flex-viewport'));
                        });

                        $(window).trigger('gdlr-core-element-resize');
                        slider.slides.filter('.flex-active-slide').addClass('gdlr-core-active').siblings().removeClass('gdlr-core-active');
                    }
                }
            }

            // add the action for class
            flex_attr.after = function(slider){
                slider.slides.filter('.flex-active-slide').addClass('gdlr-core-active').siblings().removeClass('gdlr-core-active');
            }

            // add outer frame class
            if( $(this).find('.gdlr-core-outer-frame-element').length > 0 ){
                $(this).addClass('gdlr-core-with-outer-frame-element');
            }

            $(this).goodlayers_flexslider(flex_attr);
        });

        return $(this);

    } // gdlr-core-flexslier


jQuery(document).ready(function() {
    jQuery('.flexslider').flexslider({
        animation: "fade",
        touch: true,
        useCSS: false,
        animationLoop: true
    });
});