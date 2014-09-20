/**
 * Prepares placeholder text for browsers that don't support HTML5 input
 * placeholders.
 *
 * Requires Modernizr to detect if the current browsers supports HTML5
 * placeholders.
 */
window.axstrad = window.axstrad || {};
window.axstrad.init = window.axstrad.init || {};

(function($, Modernizr) {
    window.axstrad.init.placeholder = function()
    {
        // Skip if the browser supports placeholder text natively
        if (Modernizr.input.placeholder) {
            return;
        }


        $('[placeholder]:input:not([data-oldbrwsr-ignore-placeholder])').on('focus', function() {
            var $input = $(this);
            if ($input.val() == $input.attr('placeholder')) {
                $input.val('');
                $input.removeClass('showPlaceholderText');
            }
        }).on('blur', function() {
            var $input = $(this);
            if ($input.val() === '' || $input.val() == $input.attr('placeholder')) {
                $input.addClass('showPlaceholderText');
                $input.val($input.attr('placeholder'));
            }
        }).trigger('blur');

        $('[placeholder]:input').parents('form').on('submit', function() {
            var $form = $(this);
            $('[placeholder]:input', $form).each(function() {
                var $input = $(this);
                if ($input.val() == $input.attr('placeholder')) {
                    $input.val('');
                }
            });
        });
    };

    window.axstrad.init.placeholderLabel = function()
    {
        var $form = $(this);

        $('input, textarea', $form).each(function(k,v){
            var $input = $(v),
                $label = $input.siblings('label');

            // Skip the input if it doesn't have a label or it already has a
            // placeholder attribute value
            if ($label.length === 0 || (
                typeof $input.attr('placeholder') != "undefined" &&
                $input.attr('placeholder') !== ""
            )) {
                return;
            }

            $input
                .attr('placeholder', $label.html())
                .attr(
                    'data-init',
                    ($input.attr('data-init')+' placeholder').trim()
                )
            ;

            axstrad.init.placeholder.call($input[0]);
        });
    };
})(jQuery, Modernizr);

