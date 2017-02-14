chess.WPTemplate = new Class({
    Extends: Events,
    renderTo:undefined,
    module:undefined,

    initialize:function(config){
        this.renderTo = jQuery(config.renderTo);
        this.module = String.uniqueID();

        chess.THEME_OVERRIDES = undefined;
        
        if (config.docRoot) {
            ludo.config.setDocumentRoot(config.docRoot);
        }

        if(config.theme){
            jQuery('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: ludo.config.getDocumentRoot() + '/themes/' + theme + '.css'
            });

            jQuery.ajax({
                url: ludo.config.getDocumentRoot() + '/themes/' + theme + '.js',
                dataType: "script"
            });
        }
    }


});