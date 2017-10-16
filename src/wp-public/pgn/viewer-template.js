chess.WPViewerTemplate = new Class({
    Extends: chess.WPTemplate,
    pgn:undefined,

    createController:function(){

        this.controller = new chess.controller[this.controllerType()]({
            applyTo: [this.module],
            sound:this.sound,
            pgn: this.pgn.id,
            stockfish: ludo.config.getDocumentRoot() + '/stockfish-js/stockfish.js',
            listeners: {}
        });

        this.parent();

    },

    __construct:function(config){
        this.parent(config);


    }
});