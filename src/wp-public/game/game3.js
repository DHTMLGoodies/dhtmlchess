window.chess.isWordPress = true;
chess.WPGame3 = new Class({
    Extends: chess.WPGameTemplate,
    boardSize: undefined,

    initialize: function (config) {
        this.parent(config);
        var w = this.renderTo.width();
        if (ludo.isMobile) {
            this.renderTo.css('height', w + 275 + this.wpm_h);
            this.boardSize = w;
        } else {
            this.boardSize = w * 2 / 3;
            this.renderTo.css('height', w - 150 + 42 + 35 + this.wpm_h);
        }

        this.board = Object.merge({
            boardLayout: undefined,
            id: 'tactics_board',
            type: 'chess.view.board.Board',
            module: this.module,
            overflow: 'hidden',
            pieceLayout: 'svg3',
            boardCss: {
                border: 0
            },
            labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
            labelPos: 'outside', // show labels inside board, default is 'outside'
            layout: {
                weight: 2,
                height: 'wrap'
            },
            plugins: [
                Object.merge({
                    type: 'chess.view.highlight.Arrow'
                }, this.arrow)
            ]
        }, this.board);

        if (this.canRender()) {
            this.render();
        }
    },

    render: function () {
        new chess.view.Chess({
            renderTo: jQuery(this.renderTo),
            cls: this.th,
            layout: {
                type: 'linear', orientation: 'vertical',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: ludo.isMobile ? this.mobileChildren() : this.desktopChildren()
        });

        this.createGameModel();

    },

    mobileChildren: function () {
        return [
            {
                layout: {
                    height: 35
                },
                module: this.module,
                type: 'chess.view.metadata.Game',
                tpl: this.heading_tpl || '{white} - {black}',
                cls: 'metadata',
                css: {
                    'text-align': 'center',
                    'overflow-y': 'auto',
                    'font-size': '1em',
                    'font-weight': 'bold'
                }
            },
            this.board,
            {
                layout: {
                    type: 'linear', orientation: 'horizontal',
                    height: 40,
                    width: this.boardSize
                },
                css: {
                    'margin-top': 5
                },
                children: [
                    {
                        type: 'chess.view.buttonbar.Bar',
                        module: this.module,
                        buttons: ['start','end'],
                        width: 85,
                        buttonSize: function (availSize) {
                            return availSize;
                        }
                    },
                    {
                        weight: 1
                    },
                    {
                        type: 'chess.view.notation.LastMove',
                        width: 80,
                        module: this.module
                    },
                    {
                        type: 'chess.view.buttonbar.Bar',
                        module: this.module,
                        buttons: ['play'],
                        width: 45,
                        buttonSize: function (availSize) {
                            return availSize;
                        }
                    }
                ]
            },
            {
                css:{
                    'margin-top' : 4
                },
                layout: {
                    height: 200
                },
                type: 'chess.view.notation.LastComment',
                module: this.module
            },
            {
                type: 'chess.WPComMessage'
            }

        ]
    },


    desktopChildren: function () {
        return [
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
                    'text-align': 'center',
                    'overflow-y': 'auto',
                    'font-size': '1em',
                    'font-weight': 'bold'
                }
            },

            {
                layout: {
                    type: 'linear', orientation: 'horizontal',
                    height: this.boardSize
                },

                children: [
                    this.board,
                    {
                        id: this.module + '-panel',
                        name: "notation-panel",
                        type: 'chess.view.notation.LastComment',
                        layout: {
                            weight: 1
                        },
                        elCss: {
                            'margin-left': '2px'
                        },
                        module: this.module
                    }
                ]
            },
            {
                layout: {
                    type: 'linear', orientation: 'horizontal',
                    height: 40,
                    width: this.boardSize
                },
                css: {
                    'margin-top': 5
                },
                children: [
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
                        buttons: ['flip'],
                        width: 42,
                        buttonSize: function (availSize) {
                            return availSize;
                        }
                    }
                ]
            },
            {
                type: 'chess.WPComMessage'
            }
        ];
    }

});