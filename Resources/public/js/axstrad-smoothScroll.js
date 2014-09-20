window.axstrad = window.axstrad || {};
window.axstrad.smoothScroll = window.axstrad.smoothScroll || {};

(function($){

    window.axstrad.init.smoothScroll = function()
    {
        this.on('click.smoothScroll', anchorHash);
    };

    /**
     * Searches the whole page for a[href*=#]:not([href=#]) and adds a click event.
     *
     * If you're only adding smooth scroll to a couple of anchors it's best to use axstrad.init by adding
     * 'data-init="smoothScroll"' to the anchors you want to smooth scroll.
     *
     * @return void
     */
    window.axstrad.smoothScroll.init = function()
    {
        $('a[href*=#]:not([href=#])').on('click.smoothScroll', anchorHash);
    };

    /**
     * Scroll the user to $target
     *
     * @param  object  $target  The element to scroll the user to
     * @param  integer duration A string or number determining how long the animation will run. Default: 1000.
     * @return object           A jQuery deferred object which will resolve when the scrolling is complete, or it's
     *                          rejected if $target variable is empty.
     */
    window.axstrad.smoothScroll.to = function($target, duration )
    {
        var scroll = $.Deferred();

        if ($target.length) {
            if (typeof duration  == 'undefined') {
                duration  = 1000;
            }

            $('html,body').animate(
                {
                    'scrollTop': $target.offset().top
                },
                {
                    'duration': duration,
                    'done': function(){ scroll.resolve(); },
                    'fail': function(){ scroll.fail(); }
                }
            );
        }
        else {
            scroll.reject();
        }

        return scroll.promise();
    };

    function anchorHash(e)
    {
        e.preventDefault();

        var $target = $(this.hash);
        $target = $target.length ? $target : $('[name=' + this.hash.slice(1) +']');

        axstrad.smoothScroll.to($target);
    }
})(jQuery);
