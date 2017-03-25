chess.WPViewerTemplate = new Class({
    Extends: chess.WPTemplate,
    createController:function(){
        this.controller = new chess.controller[this.controllerType()]({
            applyTo: [this.module],
            sound:this.sound,
            pgn: this.pgn.id,
            stockfish: ludo.config.getDocumentRoot() + '/stockfish-js/stockfish.js',
            listeners: {}
        });

        this.parent();

    }
});