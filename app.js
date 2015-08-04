window.onload = function() {
    var scroller = document.getElementById('scroller'),
        content = document.querySelector('.content'),
        clone = content.cloneNode(true);

    // Dupe the content we want to infintely scroll so we have a target to scroll to
    scroller.insertBefore(clone, content.nextSibling);

    var leftScroll = document.getElementById('left-scroll'),
        rightScroll = document.getElementById('right-scroll'),
        scrollingRight = false,
        scrollingLeft = false;

    // -----------------------------------------------------------------
    // Configuration for scroller speed
    // -----------------------------------------------------------------
    var pixelsPerSecond = 600;

    // -----------------------------------------------------------------
    // Animation Functions
    // -----------------------------------------------------------------
    var stopAnimation = function() {
        Velocity(clone, 'stop');
        Velocity(content, 'stop');
        scrollingRight = scrollingLeft = false;
    };

    var animateRight = function() {
        // We want to animate a full content's worth of width
        // at a constant speed so we calculate the duration based on the
        // amount we still have to scroll
        var duration = 1000 * Math.round(
            (content.scrollWidth - scroller.scrollLeft) / pixelsPerSecond
        );

        // Just in case the amount left to scroll is 0, we reset
        if (scroller.scrollLeft === content.scrollWidth) {
            scroller.scrollLeft = 0;
        }

        // Do the scrolling
        scrollingRight = true;
        Velocity(clone, 'scroll', {
            axis: 'x',
            container: scroller,
            duration: duration,
            easing: 'linear'
        });
    };

    var animateLeft = function() {
        // Same logic as animateRight but scrolling in the other direction
        var duration = 1000 * Math.round(scroller.scrollLeft / pixelsPerSecond);
        if (scroller.scrollLeft === 0) {
            scroller.scrollLeft = content.scrollWidth;
        }
        scrollingLeft = true;
        Velocity(content, 'scroll', {
            axis: 'x',
            container: scroller,
            duration: duration,
            easing: 'linear'
        });
    };

    // -----------------------------------------------------------------
    // Hover Handlers
    // -----------------------------------------------------------------
    var rightScrollHandler = function() {
        if (!scrollingRight) {
            animateRight();
        }
    };

    var leftScrollHandler = function() {
        if (!scrollingLeft) {
            animateLeft();
        }
    };

    // -----------------------------------------------------------------
    // Scroll Handler
    // -----------------------------------------------------------------
    // We reset the scroll positions depending on the
    // direction we are scrolling.
    //
    // Scrolling Right: When we've scrolled one "content's worth", we reset
    // scrolling back to 0 to start again.
    //
    // Scrolling Left: When we've reached 0 in our scroll, we offset the
    // scrollbar back to "content's width"
    // -----------------------------------------------------------------

    var scrollHandler = function() {
        var scrollWidth = content.scrollWidth;
        if (scrollingRight) {
            if (scroller.scrollLeft >= scrollWidth) {
                stopAnimation();
                scroller.scrollLeft = 0;
                animateRight();
            }
        }

        if (scrollingLeft) {
            var scrollWidth = content.scrollWidth;
            if (scroller.scrollLeft === 0) {
                stopAnimation();
                scroller.scrollLeft = scrollWidth;
                animateLeft();
            }
        }
    };

    scroller.addEventListener('scroll', scrollHandler);
    rightScroll.addEventListener('mouseenter', rightScrollHandler);
    rightScroll.addEventListener('mouseleave', stopAnimation);
    leftScroll.addEventListener('mouseenter', leftScrollHandler);
    leftScroll.addEventListener('mouseleave', stopAnimation);

};
