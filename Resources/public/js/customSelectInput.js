window.axstrad = window.axstrad || {};
window.axstrad.init = window.axstrad.init || {};
window.axstrad.customSelectInput = window.axstrad.customSelectInput || {};

(function($){

    var defaultOptions = {
        'generateOptionCallback': null
    };

    window.axstrad.init.customSelectInput = function(_opts)
    {
        axstrad.customSelectInput.init.call(this, _opts);
    };

    window.axstrad.customSelectInput.init = function(_opts)
    {
        var $select    = $(this),
            selectOpts = $select.data('customSelectInput'),
            options    = $.extend({}, defaultOptions, selectOpts, _opts),
            $label     = null,
            $handle    = null,
            $menu      = null,
            $container = null
        ;

        if (typeof options.generateOptionCallback == "string") {
            options.generateOptionCallback = axstrad.util.strToFunc(options.generateOptionCallback);
        }

        console.info('Options:', options);


        // Set up the structure of the custom select
        $container = $('<a href="#" class="customSelect-container" />')
            .append(
                $('<span class="customSelect-input" />')
                    .append($label  = $('<span class="customSelect-label" />'))
                    .append($handle = $('<span class="customSelect-handle" />'))
            )
            .append($menu = $('<span class="customSelect-options" />'))
            .insertAfter($select) // place the customSelect next to the selectInput
        ;

        // Use bottom margin to make the selectInput use up as much vertical space as the customInput
        var containerHeight = $container.outerHeight(),
            selectHeight = $select.outerHeight();
        if (containerHeight>selectHeight) {
            $select.css('margin-bottom',
                (parseInt($select.css('margin-bottom'))+(containerHeight-selectHeight))+'px'
            );
        }
        $select.css('outline', 'none');

        // Position the customSelect on top of the selectInput
        var position = $select.position();
        $container.css({
            'position': 'absolute',
            'top': position.top+'px',
            'left': position.left+'px'
        });

        // Set the container's width, taking any padding/border width into
        // account.
        $container.css(
            'width',
            ($select.outerWidth()
                - parseInt($container.css('border-left-width'))
                - parseInt($container.css('border-right-width'))
                - parseInt($container.css('padding-left'))
                - parseInt($container.css('padding-right'))
            ) + 'px'
        );


        // Set up click event for the customSelect label/handle
        (function($container){
            $([$label, $handle]).each(function(k,v){
                v.on('click.customSelectInput', {'$select': $select}, function(e){
                    e.data.$select.focus();
                    toggleMenu.call($container, e);
                });
            });
        })($container);


        // Set up the anchor's event handlers
        $container
            .on('mouseenter.customSelectInput', function(){
                keepMenuOpen.call(this, true);
            })
            .on('mouseleave.customSelectInput', function(){
                keepMenuOpen.call(this, false);
            })
        ;


        // Set up the select's event handlers
        $select
            .on('keypress', {'$container': $container}, selectKeyPress)
            .on('keydown', {'$container': $container}, selectKeyPress)
            .on('keyup', {'$container': $container}, selectKeyPress)
            .on('focusout', {'$container': $container}, function(e){
                closeMenuIfOpenAndAllowed.call(e.data.$container);
            })

            // Update the customSelect label when the select is changed
            .on('change.customSelectInput', {'$label':$label, '$container': $container}, function(e){
                var $select = $(this),
                    $container = e.data.$container,
                    $selectOption = $('option[value="'+$select.val()+'"]', $select),
                    $customOption = $('span[data-value="'+$select.val()+'"]', $container)
                ;

                // Set the option as the current value
                setSelected.call($customOption); // we don't pass $this to avoid an infinite loop

                // Update the label's value
                e.data.$label.html($selectOption.html()).removeClass('disabled');

                $select.focus();
            })
        ;


        // Set up the customSelect options
        var selectOptions = $select.get(0).options,
            optsLength    = selectOptions.length,
            firstOption   = null,
            currValue     = $select.val()
        ;
        for (var x=0; x<optsLength; x++) {
            var selectOption = selectOptions[x],
                label        = selectOption.text,
                value        = (typeof selectOption.value != 'undefined') ? selectOption.value : label,
                $option      = null
            ;

            if ($.isFunction(options.generateOptionCallback)) {
                $option = options.generateOptionCallback.call(this, selectOption);
            }
            else {
                $option   = $('<span>'+label+'</span>');
            }

            // Make sure the option has the required classes and HTML5 data attributes
            $option.addClass('customSelect-option')
                .attr('data-value', value)
            ;

            if (x === 0) {
                firstOption = selectOption;
            }

            if($(selectOption).prop('disabled')) {
                $option.addClass('disabled');
            }

            $menu.append($option);

            if (value==currValue) {
                setSelected.call($option);
            }

            // Set up $option on click event
            (function($select, $option, $container) {
                $option
                    // Update the (custom)Select when an option is clicked
                    .on('click.customSelectInput', function(e){
                        e.preventDefault();
                        setSelected.call($option, $select, e);
                        toggleMenu.call($container);
                    })

                    // move the hover class as options are hovered
                    .hover(setHover)
                ;
            })($select, $option, $container);
        }


        // Finalise the set up setting the span's content to the current option value
        $label.html($('option[value="'+$select.val()+'"]', $select).html());


        // Make sure the customSelect $label has a value
        if ($label.html()=="") {
            $label.html(firstOption.text);
            if ($(firstOption).prop('disabled')) {
                $label.addClass('disabled');
            }
        }
    };


    function keepMenuOpen(keepOpen)
    {
        if (typeof keepOpen == 'undefined') {
            // console.log('keepOpen ', $(this).data('keepOpen'));
            return $(this).data('keepOpen');
        }

        $(this).data('keepOpen', keepOpen === true);
    }


    function toggleMenu(e)
    {
        if (e) e.preventDefault();

        var $this = $(this);
        if ($this.hasClass('showMenu')) {
            $this.removeClass('showMenu');
        }
        else {
            $this.addClass('showMenu');

            var $selected = $('.selected', $this);
            if ($selected.length>0) {
                setHover.call($selected);
            }
        }
    }


    function isMenuOpen()
    {
        var $this = $(this);
        return $this.hasClass('showMenu');
    }



    function closeMenuIfOpenAndAllowed()
    {
        if (keepMenuOpen.call(this) !== true) {
            closeMenuIfOpen.call(this);
        }
    }


    function closeMenuIfOpen()
    {
        if (isMenuOpen.call(this)) {
            toggleMenu.call(this);
        }
    }


    function setSelected($select, e)
    {
        var $this = $(this);

        // ignore if the option is disabled
        if ($this.hasClass('disabled')) {
            if (e) {
                e.stopPropagation();
            }
            return;
        }

        // Mark option as selected
        $this.siblings().removeClass('selected');
        $this.addClass('selected');

        // Mark the option as hover
        setHover.call(this);

        // Update the select
        if ($select) {
            $select
                .val($this.data('value')) // Update the real select's value.
                .trigger('change')        // Trigger the change event which will update the customSelect's label.
            ;
        }
    }


    function setHover()
    {
        var $this = $(this);

        // ignore if the option is disabled
        if ($this.hasClass('disabled')) {
            return;
        }

        $this.siblings().removeClass('hover');
        $this.addClass('hover');
    }


    function selectKeyPress(e){
        // console.log('select '+e.type+' '+e.which);

        var $container = e.data.$container,
            $select    = $(this),
            key        = e.which
        ;

        // what to do if enter, tab or esc is pressed
        if (key == 13) { // enter
            setSelected.call($('span.hover', $container), $select);
            closeMenuIfOpen.call($container);
            return;
        }
        else if (key==27 || key == 9) { // tab / exit
            closeMenuIfOpen.call($container);
            return;
        }

        // Force the label to be updated
        $select.trigger('change');
    }
})(jQuery);
