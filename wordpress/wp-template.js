chess.WPTemplate = new Class({
    Extends: Events,
    renderTo:undefined,
    module:undefined,

    initialize:function(config){
        this.renderTo = jQuery(config.renderTo);
        this.module = String.uniqueID();

        if (config.docRoot) {
            ludo.config.setDocumentRoot(config.docRoot);
        }
    }


});