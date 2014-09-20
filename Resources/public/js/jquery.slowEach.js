(function($){

    /**
     * Iterates over an array of objects passing each one to callback after interval.
     * Calls doneCallback when complete.
     */

    var version = '1.0';

    $.slowEach = function(objs, interval, callback, doneCallback) {
        if(objs.length>0) {
            var x = 0;
            iterate();
        }

        function iterate() {
            if( callback.call(objs[x], x) !== false ) {
                x++;
                if( objs.length > x ) {
                    setTimeout( iterate, interval );
                }
                else if($.isFunction(doneCallback)) {
                    doneCallback.call(objs);
                }
            }
        }
    };

    $.fn.slowEach = function(interval, callback, doneCallback) {
        $.slowEach(this, interval, callback, doneCallback);
    };

    /**
     * Returns the plug-in's version
     */
    $.slowEach.version = function()
    {
        return version;
    };

})(jQuery);
