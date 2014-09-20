window.axstrad = window.axstrad || {};
window.axstrad.util = window.axstrad.util || {};

(function($){
    /**
    * Equalise the heights of the given elements.
    * Each element may be specified alone, or as a container-resizer pair.
    *
    * @param    Array       List of elements for height equalisation
    * @return   void
    */
    window.axstrad.util.matchHeights = function(elements) {

        // Validate input
        if (!$.isArray(elements)) {
            console.warn('axstrad.util.matchHeights(): Element list should be provided as an array');
            return;
        }

        // Initialise function-wide variables
        var maxHeight = 0;
        var jobList = [];

        // Iterate over input elements; Determine max-height and produce a job-list
        $.each(elements, function(i, iIn) {
            var iJob = {};

            // If element has been specified as a container-resizer pair...
            if ($.isPlainObject(iIn)) {
                if (typeof iIn.container == 'undefined') {
                    console.warn('axstrad.util.matchHeights(): Container not defined');
                    return;
                }
                iJob.container = $(iIn.container);
                iJob.resizer = (typeof iIn.resizer != 'undefined') ? $(iIn.resizer) : iJob.container;
            }

            // Otherwise, if element has been specified alone...
            else {
                iJob.container = iJob.resizer = $(iIn);
            }

            // Push elements and height to job-list
            // iJob.height = iJob.container.outerHeight();
            iJob.height = iJob.container.innerHeight();
            // console.debug(iJob.container, iJob.container.height(), iJob.container.innerHeight(), iJob.container.outerHeight(), iJob.height);
            maxHeight = Math.max(maxHeight, iJob.height);
            jobList.push(iJob);
        });

        // Iterate over job-list; Apply minimum heights
        $.each(jobList, function(i, iJob) {
            if (iJob.height < maxHeight) {
                // var addHeight = maxHeight - iJob.height;
                // iJob.resizer.css('min-height', Math.round(iJob.resizer.height() + addHeight));
                iJob.resizer.css('min-height', maxHeight);
            }
        });
    };

    /**
    * Equalise the heights of the given elements.
    * Each element may be specified alone, or as a container-resizer pair.
    *
    * @param    Array       List of elements for height equalisation
    * @return   void
    */
    window.axstrad.util.matchWidths = function(elements) {
        // Validate input
        if (!$.isArray(elements)) {
            elements = $.makeArray(elements);
            console.info(
                'axstrad.util.matchHeights elements list should be an array, auto converted using $.makeArray',
                elements
            );
        }

        // Initialise function-wide variables
        var maxWidth = 0;
        var jobList = [];

        // Iterate over input elements; Determine max-width and produce a job-list
        $.each(elements, function(i, iIn) {
            var iJob = {};

            // If element has been specified as a container-resizer pair...
            if ($.isPlainObject(iIn)) {
                if (typeof iIn.container == 'undefined') {
                    console.warn('axstrad.util.matchWidths(): Container not defined');
                    return;
                }
                iJob.container = $(iIn.container);
                iJob.resizer = (typeof iIn.resizer != 'undefined') ? $(iIn.resizer) : iJob.container;
            }

            // Otherwise, if element has been specified alone...
            else {
                iJob.container = iJob.resizer = $(iIn);
            }

            // Push elements and width to job-list
            iJob.width = iJob.container.outerWidth();
            maxWidth = Math.max(maxWidth, iJob.width);
            jobList.push(iJob);
        });

        // console.debug('Job list', jobList);

        // Iterate over job-list; Apply minimum widths
        $.each(jobList, function(i, iJob) {
            if (iJob.width < maxWidth) {
                var addWidth = maxWidth - iJob.width;
                iJob.resizer.css('min-width', Math.round(iJob.resizer.width() + addWidth));
            }
        });
    };

    /**
     * @return
     */
    window.axstrad.util.strToFunc = function(str)
    {
        if (typeof str != 'string' || str=="") {
            return null;
        }

        var parts = str.split('.'),
            partsLength = parts.length;
            func = null;
        for (var x=0; x<partsLength; x++) {
            if (func !== null && func[parts[x]]) {
                func = func[parts[x]];
            }
            else if (func===null && window[parts[x]]) {
                func = window[parts[x]];
            }
            else {
                return null;
            }
        }

        return func;
    };

    /**
     * @param  object|element form Either a jQuery object or the form elemtent
     * @return object              An object containing all the form's element names and values.
     */
    window.axstrad.util.serializeForm = function(form) {
        var data = {};
        if(typeof form != 'object') {
            form = $(form);
        }

        // Build an array of all elements.
        var elements = { };
        $(':input', form).filter(':not([type="submit"],[type="button"])').each(function(k, ele) {
            var $ele = $(ele),
                eleName = $ele.attr('name')
            ;

            if(typeof elements[eleName] == 'undefined') {
                elements[eleName] = [];
                elements[eleName][0] = $ele;
            }
            else {
                elements[eleName][elements[eleName].length] = $ele;
            }
        });

        data = {};
        for(var name in elements) {
            var value = null,
                namedElements = elements[name]
            ;

            switch(namedElements.length) {
                case 2: {
                    if(namedElements[0].is(':input[type="hidden"]') && namedElements[1].is(':input[type="checkbox"]')) {
                        value = namedElements[namedElements[1].is(':checked') ? 1 : 0].val( );
                        break;
                    }
                }
                case 1:
                default: {
                    if(namedElements[0].is(':input[type="checkbox"]')) {
                        value = namedElements[0].is(':checked') ? namedElements[0].val( ) : null;
                    }
                    else {
                        value = namedElements[0].val( );
                    }
                }
            }

            var nameIndex = name.indexOf('[]');
            if (nameIndex > -1) {
                name = name.substring(0, nameIndex);
                if (!(name in data)) {
                    data[name] = { };
                }
                data[name].push(value);
            }
            else {
                data[name] = value;
            }
        }

        return data;
    }

    /**
     * Adds a CSS selector and style to the document at runtime,
     *
     * @param  string selector
     * @param  string style
     * @return void
     */
    window.axstrad.util.createCssSelector = function(selector, style) {
        if(!document.styleSheets) {
            console.debug('axstrad.util.createCssSelector: document.styleSheets doesn\'t exist');
            return;
        }

        if(document.getElementsByTagName("head").length == 0) {
            console.debug('axstrad.util.createCssSelector: head element is empty');
            return;
        }

        var stylesheet, mediaType;

        if(document.styleSheets.length > 0) {
            for( i = 0; i < document.styleSheets.length; i++) {
                if(document.styleSheets[i].disabled) {
                    continue;
                }
                var media = document.styleSheets[i].media;
                mediaType = typeof media;

                switch (mediaType) {
                    case "string":
                        if (media == "" || (media.indexOf("screen") != -1)) {
                            styleSheet = document.styleSheets[i];
                        }
                    break;

                    case "object":
                        if (media.mediaText == "" || (media.mediaText.indexOf("screen") != -1)) {
                            styleSheet = document.styleSheets[i];
                        }
                    break;
                }

                if (typeof styleSheet != "undefined") {
                    break;
                }
            }
        }


        if (typeof styleSheet == "undefined") {
            var styleSheetElement = document.createElement("style");
            styleSheetElement.type = "text/css";

            document.getElementsByTagName("head")[0].appendChild(styleSheetElement);

            for (var i = 0; i < document.styleSheets.length; i++) {
                if(document.styleSheets[i].disabled) {
                    continue;
                }
                styleSheet = document.styleSheets[i];
            }

            var media = styleSheet.media;
            mediaType = typeof media;
        }

        switch (mediaType) {
            case "string":
                for (var i = 0; i < styleSheet.rules.length; i++) {
                    if (styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                        styleSheet.rules[i].style.cssText = style;
                        return;
                    }
                }

                styleSheet.addRule(selector, style);
                break;

            case "object":
                for (var i = 0; i < styleSheet.cssRules.length; i++) {
                    if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                        styleSheet.cssRules[i].style.cssText = style;
                        return;
                    }
                }

                styleSheet.insertRule(selector + "{" + style + "}", 0);
                break;
        }
    };
})(jQuery);
