window.axstrad = window.axstrad || {};
window.axstrad.init = window.axstrad.init || {};
window.axstrad.styleInputs = window.axstrad.styleInputs || {};

(function($){

    window.axstrad.init.styleInputs = function()
    {
        var options = $.extend(
            {
                'preChangeCallback': null,
                'postChangeCallback': null
            },
            this.data('styleInputs')
        );

        if (options.preChangeCallback !== null) {
            options.preChangeCallback = axstrad.util.strToFunc(options.preChangeCallback);
        }
        if (options.postChangeCallback !== null) {
            options.postChangeCallback = axstrad.util.strToFunc(options.postChangeCallback);
        }

        switch (this.prop('tagName')) {
            case 'SELECT':
                console.info('Styling select with options', options);
                window.axstrad.styleInputs.initSelect.call(this, options);
                break;
            case 'INPUT': {
                switch (this.attr('type')) {
                    case 'radio':
                    case 'checkbox':
                        console.info('Styling '+this.attr('type')+' with options', options);
                        window.axstrad.styleInputs.initCheckbox.call(this, options);
                        break;
                    default:
                        console.warn("Unsupported Input type '"+this.attr('type')+"'");
                }
                break;
            }
            default:
                console.warn("Unsupported Tag '"+this.prop('tagName')+"'");
        }
    };

    window.axstrad.styleInputs.initCheckbox = function(options)
    {
        if (this.hasClass('styledInput')) return;

        this.addClass('styledInput');

        var $span = prepareSpan(this, 'styledInput'),
            inputType = this.attr('type')
        ;
        $span.addClass(inputType); // radio or checkbox

        if (inputType=='radio') {
            $span.attr('data-styledinput-name', this.attr('name'));
        }

        // Is the select disabled?
        if(typeof this.attr('disabled') != 'undefined') {
            $span.addClass('styledInput_disabled');
            this.css('display', 'none');
        }
        else {
            if (inputType=='checkbox') {
                this.on('change.styleInputs', {span: $span, input: this, options: options}, checkboxChange);
            }

            // Set up the events to update the span as the checkbox/radio button is altered.
            $span.on(
                {
                    'click.styleInputs': inputType=='checkbox' ? checkboxClicked : radioChange,
                    'mouseover.styleInputs': hovered,
                    'mouseout.styleInputs': blurred
                },
                {span: $span, input: this, options: options}
            );

            // Set the span's state to match the checkbox
            if (this.prop('checked')) {
                $span.addClass('checked');
            }
        }
    };

    window.axstrad.styleInputs.initSelect = function(options)
    {
        if (this.hasClass('styledInput')) return;

        this.addClass('styledInput');

        // Set up the span
        var $span = prepareSpan(this, 'styledInput');
        $span.addClass('select');

        // Is the select disabled?
        if(typeof this.attr('disabled') != 'undefined') {
            $span.addClass('styledInput_disabled');
            this.css('display', 'none');
        }
        else {
            // Set up the events to update the span as the select is altered.
            $span.addClass('styledInput');
            this.on(
                {
                    'change.styleInputs': selectChange,
                    'keyup.styleInputs': selectChange,
                    'focus.styleInputs': focusGained,
                    'blur.styleInputs': focusLost,
                    'mouseover.styleInputs': hovered,
                    'mouseout.styleInputs': blurred
                },
                {span: $span, options: options}
            );
        }

        updateValue.call(this[0], $span);
    };

    function prepareSpan($input, idPrefix)
    {
        var data = $input.data();
        data.styleInputsSpanId = idPrefix+'_'+$input.attr('id');

        var $span = $input.siblings('#'+data.styleInputsSpanId);
        if ($span.length === 0) {
            $input.before($span = $('<span id="'+data.styleInputsSpanId+'" />'));
        }

        var classList = $input.attr('class').split(/\s+/),
            classListLength = classList.length;
        for (var i=0; i<classListLength; i++) {
            $span.addClass(classList[i]);
        }

        $input.data(data);

        return $span;
    }

    function focusGained(e)
    {
        e.data.span.addClass('focus');
    }

    function focusLost(e)
    {
        e.data.span.removeClass('focus');
    }

    function hovered(e)
    {
        e.data.span.addClass('hover');
    }

    function blurred(e)
    {
        e.data.span.removeClass('hover');
    }

    function selectChange(e)
    {
        var $this = $(this),
            $span = e.data.span,
            options = e.data.options
        ;

        if ($.isFunction(options.preChangeCallback)) {
            options.preChangeCallback.call($this, e);
        }

        updateValue.call($this[0], $span);

        if ($.isFunction(options.postChangeCallback)) {
            options.postChangeCallback.call($this, e);
        }
    }

    function checkboxClicked(e)
    {
        var $input = e.data.input;

        if ($input.prop('checked') === true) {
            $input.prop('checked', false);
        }
        else {
            $input.prop('checked', true);
        }

        checkboxChange.call(this, e);
    }

    function checkboxChange(e)
    {
        var $span = e.data.span,
            $input = e.data.input,
            options = e.data.options
        ;

        if ($.isFunction(options.preChangeCallback)) {
            options.preChangeCallback.call($input, e);
        }

        if ($input.prop('checked') === true) {
            $span.addClass('checked');
        }
        else {
            $span.removeClass('checked');
        }
        $input.trigger('styledInputChange');

        if ($.isFunction(options.postChangeCallback)) {
            options.postChangeCallback.call($input, e);
        }
    }

    function radioChange(e)
    {
        var $span = e.data.span,
            $input = e.data.input,
            $form = $input.parents('form'),
            options = e.data.options
        ;

        if ($.isFunction(options.preChangeCallback)) {
            options.preChangeCallback.call($input, e);
        }

        // Remove checked from all radio spans
        $('span[data-styledinput-name="'+$input.attr('name')+'"]', $form).removeClass('checked');

        // Add checked to this input's radio button
        $span.addClass('checked');

        // Check the radio button
        $input.prop('checked', true);

        if ($.isFunction(options.postChangeCallback)) {
            options.postChangeCallback.call($input, e);
        }
    }


    function updateValue($span)
    {
        $(this).find('option').each(function(k, option) {
            if(option.selected === true) {
                var $option = $(option);
                $span.addClass( $option.attr('class') );
                $span.html( $option.html( ) );
                return;
            }
        });
    }
})(jQuery);
