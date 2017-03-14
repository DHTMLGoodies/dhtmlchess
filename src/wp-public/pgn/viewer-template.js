chess.WPViewerTemplate = new Class({
    Extends: chess.WPTemplate,
    createController:function(){
        this.controller = new chess.controller.Controller({
            applyTo: [this.module],
            pgn: this.pgn.id,
            listeners: {}
        });

    }
});