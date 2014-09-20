window.axstrad = window.axstrad || {};
window.axstrad.init = window.axstrad.init || {};

(function(){

    window.axstrad.init.fancybox = function()
    {
        var opts = this.data('fancybox');

        console.info('options', opts);

        this.fancybox(opts);
    };
})();
