window.axstrad = window.axstrad || {};
window.axstrad.init = window.axstrad.init || {};

(function($){
    /**
     * Initalises an anchor to open in a new window/tab
     *
     * Usage:
     * Add the attribute 'data-init="extLink"' to the anchor.
     *
     * Example:
     * <a href="http://www.example.com/" data-init="extLink">Example Site</a>
     *
     * @return void
     */
    window.axstrad.init.extLink = function()
    {
        var $el = $(this);

        $el.on('click.axstradExtLink', function(e){
            e.preventDefault();
            window.open($el.attr('href'), '_blank');
        });
    };

    /**
     * Turn any element into a anchor.
     *
     * Usage:
     * Add the following attributes to the element
     *  - data-init="linkable"
     *  - data-linkable='{"href":"http://www.example.com/"}'
     *
     * Basic Example:
     * <div data-init="linkable" data-linkable="http://www.example.com/">Some Content</div>
     * <div data-init="linkable" data-linkable='{"href":"http://www.example.com/"}'>Some Content</div>
     *
     * New Tab/Window Example:*
     * <div data-init="linkable" data-linkable='{"href":"http://www.example.com/", "ext":true}'>Some Content</div>
     *
     * @return void
     */
    window.axstrad.init.linkable = function()
    {
        var initalised = false;

        (function($el){
            var data = $el.data('linkable'),
                settings = {
                    "href": "",
                    "ext": false
                }
            ;

            if (typeof data == 'string') {
                settings.href = data;
            }
            else {
                settings = $.extend(settings, data);
            }

            if (settings.href == "") {
                console.error('No HRef found within settings');
                return;
            }

            $el.on('click.axstradLinkable', function(){
                window.open(settings.href, settings.ext ? '_blank' : '_self');
            });
        })($(this));


        // Change cursor to a pointer for all 'linkable' elements
        if (!initalised && $.isFunction(window.axstrad.util.createCssSelector)) {
            window.axstrad.util.createCssSelector('[data-linkable]', 'cursor:pointer;');
        }
        initalised = true;
    };

    /**
     * Easy method to set up simple AJAX calls
     *
     * Usage:
     * Add the following attributes to the element
     *  - data-init="ajax"
     *  - data-ajax='{...}' - Accepts any options allowed by jQuery.ajax()
     *
     * @return void
     */
    window.axstrad.init.ajax = function()
    {
        var funcSettings = ["beforeSend", "complete", "error", "success", "xhr"];

        (function($el){
            var settings = $.extend(
                {
                    'url': null,
                    'complete': null
                },
                $el.data('ajax')
            );

            console.info('Raw Settings', settings);


            for (var key in funcSettings) {
                key = funcSettings[key];
                if (settings[key] && typeof settings[key]=='string') {
                    var funcRef = axstrad.util.strToFunc(settings[key]);
                    if (funcRef===null) {
                        console.error("Unable to convert '"+settings[key]+"' into a function reference. Does it exist?");
                        return;
                    }
                    settings[key] = funcRef;
                }
            }

            console.info('Processed Settings', settings);

            if (settings.url === null || settings.url == "") {
                if ($el.prop('tagName')=='A') {
                    settings.url = $el.attr('href');
                }
                else console.error("No URL defined in settings.");
            }

            $el.on('click.axstradAjax', function(e) {
                e.preventDefault();
                $.ajax(settings);
            });
        })(this);
    }


    window.axstrad.init.submitForm = function()
    {
        this.on('click.submitForm', function(e) {
            e.preventDefault();

            var formTarget = $(this).data('submitForm'),
                $form = $(formTarget)
            ;

            if ($form.length === 0) {
                console.error('No form found using selector \''+formTarget+'\'');
            }
            else {
                $form.submit();
            }
        });
    };
})(jQuery);


// Add trim methods to String object if they don't already exist
if (!String.prototype.trim) {
    String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g, ''); };
}
if (!String.prototype.ltrim) {
    String.prototype.ltrim = function(){ return this.replace(/^\s+/,''); };
}
if (!String.prototype.rtrim) {
    String.prototype.rtrim = function(){ return this.replace(/\s+$/,''); };
}
if (!String.prototype.fulltrim) {
    String.prototype.fulltrim = function(){ return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' '); };
}
if (!Number.prototype.format) {
    Number.prototype.format = function numberWithCommas() {
        var parts = this.toString().split(".");
        parts[0]= parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,",");
        return parts.join(".");
    };
}
