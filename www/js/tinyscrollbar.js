/*globals define*/
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd)
    {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object')
    {
        // Node/CommonJS
        factory(require('jquery'));
    } else
    {
        // Browser globals
        factory(jQuery);
    }
}(function ($)
{
    $.tiny = $.tiny || { };

    $.tiny.scrollbar = {
        options: {
                axis         : 'y'    // vertical or horizontal scrollbar? ( x || y ).
            ,   wheel        : true   // enable or disable the mousewheel;
            ,   wheelSpeed   : 40     // how many pixels must the mouswheel scroll at a time.
            ,   wheelLock    : true   // return mouswheel to browser if there is no more content.
            ,   scrollInvert : false  // Enable invert style scrolling
            ,   trackSize    : false  // set the size of the scrollbar to auto or a fixed number.
            ,   thumbSize    : false  // set the size of the thumb to auto or a fixed number.
            ,   minThumSize  : 15     // set the minimum size of thum
        }
    };

    $.fn.tinyscrollbar = function(params)
    {        
        if ( $(this).data().tsb ) {
            var tsb_instance = $(this).data().tsb;
            tsb_instance.update('relative');
            console.log("tinyscrollbar refreshed");
        } else {
            var options = $.extend( {}, $.tiny.scrollbar.options, params );

            this.each(function()
            {
                $(this).data('tsb', new Scrollbar( $( this ), options ) );
            });
            
            console.log("tinyscrollbar initalized");
        }

        return this;
    };

    $.fn.tinyscrollbar_update = function(sScroll)
    {
        return $( this ).data( 'tsb' ).update( sScroll );
    };

    function Scrollbar($container, options)
    {
        var self        = this
        ,   $viewport   = $container.find(".viewport")
        ,   $overview   = $container.find(".overview")
        ,   $scrollbar  = $container.find(".scrollbar")
        ,   $track      = $scrollbar.find(".track")
        ,   $thumb      = $scrollbar.find(".thumb")

        ,   viewportSize    = 0
        ,   contentSize     = 0
        ,   contentPosition = 0
        ,   contentRatio    = 0
        ,   trackSize       = 0
        ,   trackRatio      = 0
        ,   thumbSize       = 0
        ,   thumbPosition   = 0
        ,   mousePosition   = 0

        ,   isHorizontal   = options.axis === 'x'
        ,   hasTouchEvents = "ontouchstart" in document.documentElement

        ,   sizeLabel = isHorizontal ? "width" : "height"
        ,   posiLabel = isHorizontal ? "left" : "top"
        
        ,   viewPortBottom = 0
        ,   scrollEnabled = true // Flag used to disable scroll until this.update is called.
        ;

        function initialize()
        {
            self.update();
            setEvents();

            return self;
        }

        this.update = function(scrollTo)
        {
            sizeLabelCap    = sizeLabel.charAt(0).toUpperCase() + sizeLabel.slice(1).toLowerCase();
            viewportSize    = $viewport[0]['offset'+ sizeLabelCap];
            contentSize     = $overview[0]['scroll'+ sizeLabelCap];
            contentRatio    = viewportSize / contentSize;
            trackSize       = options.trackSize || viewportSize;
            thumbSize       = Math.min(trackSize, Math.max(options.minThumSize, (options.thumbSize || (trackSize * contentRatio))));
            trackRatio      = (contentSize - viewportSize) / (trackSize - thumbSize);
            
            /*
            For some reason, original formula for trackRation does not work:
            trackRatio = options.thumbSize ? (contentSize - viewportSize) / (trackSize - thumbSize) : (contentSize / trackSize);
            
            When many pages are loaded, the scrolling starts to slowly ends before the last item, to the point that last item
            no longer show even if thum reaches the end of the track.
            */
            
            viewPortBottom  = viewportSize + parseInt($viewport.offset().top, 10);

            $scrollbar.toggleClass("disable", contentRatio >= 1);

            switch (scrollTo)
            {
                case "bottom":
                    contentPosition = contentSize - viewportSize;
                    break;

                case "relative":
                    contentPosition = Math.min(contentSize - viewportSize, Math.max(0, contentPosition));
                    break;

                default:
                    contentPosition = parseInt(scrollTo, 10) || 0;
            }

            setSize();
            logUpdate();
            
            // Re-enable triggering of scroll event disabled in moveScroll()
            scrollEnabled = true;
            console.log("tinyscrollbar update called", viewPortBottom);
        };

        function setSize()
        {
            $thumb.css(posiLabel, contentPosition / trackRatio);
            $overview.css(posiLabel, -contentPosition);
            mousePosition = $thumb.offset()[posiLabel];

            $scrollbar.css(sizeLabel, trackSize);
            $track.css(sizeLabel, trackSize);
            $thumb.css(sizeLabel, thumbSize);
        }

        function setEvents()
        {
            if(hasTouchEvents)
            {
                $viewport[0].ontouchstart = function(event)
                {
                    if(1 === event.touches.length)
                    {
                        start(event.touches[0]);
                        event.stopPropagation();
                    }
                };
            }
            else
            {
                $thumb.bind("mousedown", start);
                $track.bind("mouseup", drag);
            }

            if(options.wheel && window.addEventListener)
            {
                $container[0].addEventListener("DOMMouseScroll", wheel, false );
                $container[0].addEventListener("mousewheel", wheel, false );
            }
            else if(options.wheel)
            {
                $container[0].onmousewheel = wheel;
            }
        }

        function start(event)
        {
            $("body").addClass("noSelect");

            mousePosition = isHorizontal ? event.pageX : event.pageY;
            thumbPosition = parseInt($thumb.css(posiLabel), 10) || 0;

            if(hasTouchEvents)
            {
                document.ontouchmove = function(event)
                {
                    event.preventDefault();
                    drag(event.touches[0]);
                };
                document.ontouchend = end;
            }
            else
            {
                $(document).bind("mousemove", drag);
                $(document).bind("mouseup", end);
                $thumb.bind("mouseup", end);
            }
        }

        /* ################
        Update Log
        */
        function logUpdate(thum_pos) {
            var lastItemOffsetTop = parseInt($('#last-item').offset().top, 10);
            $('#viewportOTop').val($('.viewport').offset().top);
            $('#viewPortBottom').val(viewPortBottom);
            $('#viewportSize').val(viewportSize);
            
            $('#overviewOTop').val($('.overview').offset().top);
            $('#overviewPos').val(-contentPosition);
            $('#overviewSize').val($overview.height());
            
            // $('#lastItemOTop').val($('#last-item').offset().top);
            $('#lastItemOTop').val(lastItemOffsetTop);
            $('#lastItemTop').val($('#last-item').position().top);
            $('#lastItemSize').val($('#last-item').height());
            
            $('#thumPos').val(thum_pos);
            $('#thumSize').val(thumbSize);
            $('#trackRatio').val(trackRatio);
            
            
            /*
            var end_pos = contentSize - viewportSize,
                end_ratio = contentPosition / end_pos;
            console.log("[" + source + "] now: " + contentPosition + "; end: " + end_pos + "; ratio: " + end_ratio);
            */
        }
        
        function moveScroll(thum_pos, source) {

            $thumb.css(posiLabel, thum_pos);
            $overview.css(posiLabel, -contentPosition);
            
            var lastItemOffsetTop = parseInt($('#last-item').offset().top, 10);
            if (scrollEnabled && lastItemOffsetTop && lastItemOffsetTop < viewPortBottom) {
                // Disable triggering of scroll event, allowing update to recalc scroller which will enable it again
                scrollEnabled = false;
                console.log("SCROLL");
                $(window).trigger('scroll');
            }
            
            
            /*
            console.log("thum_pos: " + posiLabel + "=" + thum_pos);
            console.log("overview: " + posiLabel + "=" + -contentPosition);
            */
            logUpdate(thum_pos);
        }
        
        
        function wheel(event)
        {
            if(contentRatio < 1)
            {
                var eventObject     = event || window.event
                ,   wheelSpeedDelta = eventObject.wheelDelta ? eventObject.wheelDelta / 120 : -eventObject.detail / 3
                ;

                contentPosition -= wheelSpeedDelta * options.wheelSpeed;
                contentPosition = Math.min((contentSize - viewportSize), Math.max(0, contentPosition));
                
                /*
                $thumb.css(posiLabel, contentPosition / trackRatio);
                $overview.css(posiLabel, -contentPosition);
                */
                moveScroll(contentPosition / trackRatio, "wheel");
                
                if(options.wheelLock || (contentPosition !== (contentSize - viewportSize) && contentPosition !== 0))
                {
                    eventObject = $.event.fix(eventObject);
                    eventObject.preventDefault();
                }
            }
        }

        function drag( event )
        {
            if(contentRatio < 1)
            {
                mousePositionNew   = isHorizontal ? event.pageX : event.pageY;
                thumbPositionDelta = mousePositionNew - mousePosition;

                if(options.scrollInvert)
                {
                    thumbPositionDelta = mousePosition - mousePositionNew;
                }

                thumbPositionNew = Math.min((trackSize - thumbSize), Math.max(0, thumbPosition + thumbPositionDelta));
                contentPosition  = thumbPositionNew * trackRatio;

                /*
                $thumb.css(posiLabel, thumbPositionNew);
                $overview.css(posiLabel, -contentPosition);
                */
                moveScroll(thumbPositionNew, "drag");
            }
        }

        function end()
        {
            $("body").removeClass("noSelect");
            $(document).unbind("mousemove", drag);
            $(document).unbind("mouseup", end);
            $thumb.unbind("mouseup", end);
            document.ontouchmove = document.ontouchend = null;
        }

        return initialize();
    }
}));