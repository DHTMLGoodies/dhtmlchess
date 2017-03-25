chess.WPFen = new Class({
    Extends: chess.WPTemplate,
    fen: undefined,
    nav: false,

    highlight: undefined,
    arrows: undefined,
    buttonHeight:35,
    initialize: function (config) {
        this.parent(config);
        var w = this.renderTo.width();
        var eh = this.comp ? this.buttonHeight : 0;
        this.renderTo.css('height', w + eh + this.wpm_h);
        this.fen = config.fen;

        if (config.highlight != undefined) {
            this.highlight = config.highlight;
        }
        if (config.arrows != undefined) {
            this.arrows = config.arrows;
        }

        if (this.canRender()) {
            this.render();
        }
    },

    render: function () {
        new chess.view.Chess({
            cls: this.th,
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'linear',orientation:'vertical'
            },
            children: [
                {
                    module:this.module,
                    type: 'chess.view.board.Board',
                    id: this.boardId,
                    fen: this.fen,
                    layout: {width: 'matchParent', weight: 1}
                },
                {
                    height:this.buttonHeight,
                    hidden: !this.compToggle,
                    module:this.module,
                    type: 'chess.view.buttonbar.Bar',
                    buttons:['flip','comp']
                },
                {
                    type:'chess.WPComMessage',
                    hidden:this._p
                }

            ]
        });

        if (this.highlight != undefined) {
            var hPool = new chess.view.highlight.SquarePool({
                board: ludo.$(this.boardId)
            });
            var squares = this.highlight.split(/\,/g);
            var color = undefined;
            jQuery.each(squares, function (i, square) {
                var tokens = square.split(/;/g);
                if(tokens.length > 0){
                    color = tokens[1];
                }
                hPool.show(tokens[0], color);
            });
        }

        if(this.arrows != undefined){
            var arrowPool = new chess.view.highlight.ArrowPool({
                board: ludo.$(this.boardId)
            });

            var arrows = this.arrows.split(/,/g);
            var styling;
            jQuery.each(arrows, function(i, arrow){
                var tokens = arrow.split(/;/g);
                if(tokens.length > 1){
                    if(styling == undefined)styling = {};
                    styling.fill = styling.stroke = tokens[1];
                }

                var f = tokens[0].substr(0,2);
                var t = tokens[0].substr(2,2);
                arrowPool.show(f,t, styling);
            });

        }

        if(this.compToggle){
            this.createController();
        }


    },

    createController:function(){
        this.controller = new chess.controller[this.controllerType()]({
            applyTo: [this.module],
            stockfish: ludo.config.getDocumentRoot() + '/stockfish-js/stockfish.js',
            sound:this.sound
        });
        this.parent();

        this.controller.setPosition(this.fen);
    }

});