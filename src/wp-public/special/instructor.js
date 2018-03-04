chess.WPInstructor = new Class({
    Extends: chess.WPTemplate,
    controller: undefined,

    __construct: function (config) {
        this.parent(config);
        if (this.canRender()) {
            this.render();
        }
    },


    render: function () {

        var w = this.renderTo.width();
        this.renderTo.css('height', w + 210);

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
                            type: 'chess.view.buttonbar.Bar',
                            buttons: ['previous', 'next', 'flip', 'comp'],
                            module: this.module,
                            width: 180
                        }
                    ]
                },
                {
                    height: 170,
                    module: this.module,
                    type: 'chess.wordpress.ComputerEval',
                    hideButton: true,
                    showNodes: false
                }
            ]
        });


        this.controller = new chess.controller.DummyController({
            applyTo: [this.module],
            stockfish: ludo.config.getDocumentRoot() + '/stockfish-js/stockfish.js',
            sound: this.sound
        });
    }


});