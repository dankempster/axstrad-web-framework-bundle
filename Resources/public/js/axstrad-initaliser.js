window.axstrad = window.axstrad || {};
window.axstrad.init = window.axstrad.init || {};

(function($){
    /**
     * This method is invoked on document.ready.
     *
     * It will search the DOM (or context if it is defined) for all elements with an HTML5 data attribute
     * 'data-init="..."'. For each element found, the data-init value is split by spaces, so multiple plugins can be
     * initalised for one elemtent; Each resulting value is used to find an function under the namespace
     * window.axstrad.init or a function by name. If found the function is called with the element as the 'this' value.
     *
     * @return
     */
    window.axstrad.init.all = function(context)
    {
        console.groupCollapsed('Initalising '+window.location.pathname);

        if (typeof context != "undefined") {
            if (typeof context == "string") {
                context = $(context);
            }
            else if (typeof context != "object") {
                console.error('Axstrad.Init.All: context is not an object', context);
                return;
            }

            console.info('Within context', context);
        }


        $('[data-init]', context).each(function() {
            var $el = $(this);
            var initstr = $el.data('init');

            console.group($el);

            if(typeof initstr != 'undefined') {
                var inits = initstr.split(' ');
                console.info('Found Initialisation Strings', inits);

                $.each(inits,function(i,el) {
                    // Is it an init registered with the axstrad.init namespace
                    if(typeof axstrad.init[el] !== 'undefined') {
                        console.groupCollapsed('InitStr '+el+': calling axstrad.init.'+el);
                        axstrad.init[el].call($el);
                        console.groupEnd();
                    }
                    else {
                        // maybe it's a function name
                        if (!axstrad.util || !axstrad.util.strToFunc) {
                            console.error('axstrad.util.strToFunc is required to attempt to initalise '+el);
                        }
                        else {
                            var callback = axstrad.util.strToFunc(el);
                            if (callback !== null) {
                                console.groupCollapsed('InitStr '+el+': calling '+el);
                                callback.call($el);
                                console.groupEnd();
                            }
                            else console.warn('InitStr '+el+': No function found');
                        }
                    }
                });
            }
            else console.warn('Initalisation string is undefined');

            console.groupEnd();
        });

        console.groupEnd();
    };
})(jQuery);

$(document).ready(function(){
    window.axstrad.init.all();
});
