window.axstrad = window.axstrad || {};
window.axstrad.init = window.axstrad.init || {};

(function($){
    var defaults = {};

    /**
     * @return
     */
    window.axstrad.init.bxSlider = function()
    {
        var $slider = $(this),
            settings = $.extend({}, defaults, $(this).data('bxslider'));

        console.info('Settings', settings);

        $slider.bxSlider(settings);
    };
})(jQuery);
