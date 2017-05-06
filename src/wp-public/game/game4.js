window.chess.isWordPress = true;
chess.WPGame4 = new Class({
    Extends: chess.WPGameTemplate,
    boardSize: undefined,

    __construct: function (config) {
        this.parent(config);
        var w = this.renderWidth();
        this.renderTo.css('height', w + 40 + 35 + 20);
        this.boardSize = w;

        this.lastButtons = ['flip'];
        this.adjustButtonArray(this.lastButtons);
        this.beforeRender();
    },

    render: function () {
        new chess.view.Chess({
            renderTo: this.renderTo,
            theme : this.themeObject,
            cls: this.th,
            layout: {
                type: 'linear', orientation: 'vertical',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [
                {
                    layout: {
                        height: 35,
                        width: this.boardSize
                    },
                    module: this.module,
                    type: 'chess.view.metadata.Game',
                    tpl: this.heading_tpl || '{white} - {black}',
                    cls: 'metadata',
                    css: {
                        'text-align': 'center'
                    }
                },

                {
                    layout: {
                        type: 'linear', orientation: 'horizontal',
                        height: this.boardSize
                    },

                    children: [
                        Object.merge({
                            boardLayout: undefined,
                            id: this.boardId,
                            type: 'chess.view.board.Board',
                            module: this.module,
                            overflow: 'hidden',
                            pieceLayout: 'svg3',
                            boardCss: {
                                border: 0
                            },
                            labelPos: this.lp, // show labels inside board, default is 'outside'
                            layout: {
                                weight: 1,
                                height: 'wrap'
                            },
                            plugins: [
                                Object.merge({
                                    type: 'chess.view.highlight.Arrow'
                                }, this.arrow)
                            ]
                        }, this.board)
                    ]
                },
                {
                    layout: {
                        type: 'linear', orientation: 'horizontal',
                        height: this.navH,
                        width: this.boardSize
                    },
                    css: {
                        'margin-top': 5
                    },
                    children: this.mobile ?
                        [{
                            type: 'chess.view.buttonbar.Bar',
                            module: this.module,
                            buttons: ['play'],
                            width: 45,
                            buttonSize: function (availSize) {
                                return availSize;
                            }
                        },
                            {
                                type: 'chess.view.notation.LastMove',
                                weight: 1,
                                module: this.module
                            },
                            {
                                type: 'chess.view.buttonbar.Bar',
                                module: this.module,
                                buttons: ['start', 'end', 'flip'],
                                width: 125,
                                buttonSize: function (availSize) {
                                    return availSize;
                                }
                            }] :
                        [
                            {
                                weight: 1
                            },
                            {
                                type: 'chess.view.buttonbar.Bar',
                                module: this.module,
                                buttons: ['start', 'previous'],
                                width: 85,
                                buttonSize: function (availSize) {
                                    return availSize;
                                }
                            },
                            {
                                type: 'chess.view.notation.LastMove',
                                width: 80,
                                module: this.module
                            },
                            {
                                type: 'chess.view.buttonbar.Bar',
                                module: this.module,
                                buttons: ['next', 'end'],
                                width: 85,
                                buttonSize: function (availSize) {
                                    return availSize;
                                }
                            },
                            {
                                weight: 1
                            },
                            {
                                type: 'chess.view.buttonbar.Bar',
                                module: this.module,
                                buttons: this.lastButtons,
                                width: 42 * this.lastButtons.length,
                                buttonSize: function (availSize) {
                                    return availSize;
                                }
                            }
                        ]
                },
                {
                    type: 'chess.WPComMessage',
                    hidden:this._p
                }
            ]
        });
        this.createController();
    }

});