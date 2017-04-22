/**
 * Created by alfmagne1 on 22/04/2017.
 */
wpchess = {};
wpchess.WPScriptQueueInitialized = false;
wpchess.WpScriptQueue = new Class({

    initialize: function () {
        var fns = window.wpchess_snippets;
        if (fns !== undefined && chess != undefined) {
            jQuery.each(fns, function (i, fn) {
                fn.call();

            });
            window.wpchess_snippets = [];
        }

        if (!wpchess.WPScriptQueueInitialized) {
            wpchess.WPScriptQueueInitialized = true;
            jQuery(document).ready(function () {
                new wpchess.WpScriptQueue();

            });
        }
    }

});
new wpchess.WpScriptQueue();
