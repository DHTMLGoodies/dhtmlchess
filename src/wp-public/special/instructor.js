chess.WPInstructor = new Class({
    Extends: chess.WPTemplate,
    controller: undefined,
    _pers: true,
    __construct: function (config) {

        this.parent(config);
        if(config.persistent !== undefined)this._pers = config.persistent;
        if (this.canRender()) {
            this.render();
        }
    },


    render: function () {

        var w = this.renderTo.width();
        this.renderTo.css('height', w + 200);

        new chess.view.Chess({
            cls: this.th,
            theme: this.themeObject,
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'linear',
                orientation: 'vertical',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [
                {
                    module: this.module,
                    type: 'chess.view.board.Board',
                    id: this.boardId,
                    fen: this.fen,
                    layout: {width: 'matchParent', weight: 1},
                    plugins: [
                        'chess.view.highlight.Square'
                    ]
                },
                {
                    layout: {
                        type: "linear", orientation: "horizontal"
                    },
                    height: 40,
                    children: [
                        {
                            type: 'chess.view.metadata.FenField',
                            module: this.module,
                            name: 'fenField',
                            layout: {
                                weight: 1
                            }
                        },
                        {
                            name:'fenNav',
                            type: 'chess.view.buttonbar.Bar',
                            buttons: ['enter'],
                            module: this.module,
                            width: 60
                        }
                    ]
                },
                {
                    height: 40,
                    type: 'chess.view.buttonbar.Bar',
                    buttons: ['board','start','previous', 'next', 'end', 'flip', 'comp'],
                    module: this.module
                },
                {
                    height: 170,
                    module: this.module,
                    showBar: false,
                    type: 'chess.wordpress.ComputerEval',
                    hideButton: true,
                    showNodes: false
                }
            ]
        });


        this.controller = new chess.controller.DummyController({
            applyTo: [this.module],
            stockfish: ludo.config.getDocumentRoot() + '/stockfish-js/stockfish.js',
            sound: this.sound,
            persistent: this._pers
        });
    }


});