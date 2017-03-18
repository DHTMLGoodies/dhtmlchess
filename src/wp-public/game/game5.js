window.chess.isWordPress = true;
chess.WPGame5 = new Class({
    Extends: chess.WPGameTemplate,
    boardSize: undefined,
    buttonSize: 45,

    boardWeight: 1,
    notationWeight: 1,

    initialize: function (config) {
        this.parent(config);
        var r = this.renderTo;
        var w = r.width();
        if (ludo.isMobile) {
            this.notationWeight = 0;
        }
        this.boardSize = (w / (this.boardWeight + this.notationWeight));
        if (ludo.isMobile) {
            r.css('height', w + 275 + this.wpm_h);
        } else {
            r.css('height', this.boardSize + this.buttonSize + this.wpm_h);

        }
        r.css('position', 'relative');

        this.buttons = ludo.isMobile ? ['start', 'previous', 'next', 'end'] : ['flip', 'start', 'previous', 'next', 'end'];
        this.configure();
        if (this.canRender()) {
            this.render();
        }
    },

    configure: function () {


        this.board = Object.merge({
            boardLayout: undefined,
            vAlign: top,
            id: this.boardId,
            type: 'chess.view.board.Board',
            module: this.module,
            overflow: 'hidden',
            pieceLayout: 'svg_bw',
            background: {
                borderRadius: 0
            },
            boardCss: {
                border: 0
            },
            labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
            labelPos: 'outside', // show labels inside board, default is 'outside'
            layout: {
                weight: this.boardWeight,
                height: 'wrap'
            },
            plugins: [
                Object.merge({
                    type: 'chess.view.highlight.Arrow'
                }, this.arrow)
            ]
        }, this.board);

        chess.THEME_OVERRIDES = {

            'chess.view.board.Board': {
                background: {
                    borderRadius: '1%'
                }
            },
            'chess.view.buttonbar.Bar': {
                borderRadius: '10%',
                styles: {
                    button: {
                        'fill-opacity': 0,
                        'stroke-opacity': 0
                    },
                    image: {
                        fill: '#777'
                    },
                    buttonOver: {
                        'fill-opacity': 0,
                        'stroke-opacity': 0
                    },
                    imageOver: {
                        fill: '#555'
                    },
                    buttonDown: {
                        'fill-opacity': 0,
                        'stroke-opacity': 0
                    },
                    imageDown: {
                        fill: '#444'
                    },
                    buttonDisabled: {
                        'fill-opacity': 0,
                        'stroke-opacity': 0
                        // , 'fill-opacity': 0.3
                    },
                    imageDisabled: {
                        fill: '#555',
                        'fill-opacity': 0.3
                    }
                }
            }

        };
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


    desktopChildren: function () {
        return [
            {
                layout: {
                    height: this.boardSize,
                    type: 'linear',
                    orientation: 'horizontal'
                },

                children: ludo.isMobile ? [this.board] : [

                    this.board,
                    {
                        id: this.module + '-panel',
                        name: "notation-panel",
                        type: 'chess.view.notation.Panel',
                        layout: {
                            weight: this.notationWeight,
                            height: 'matchParent'
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
                    height: this.buttonSize
                },
                elCss: {
                    'margin-top': 10
                },
                children: ludo.isMobile ? [
                    {weight: 1},
                    {
                        anchor: [0.5, 0.5],
                        type: 'chess.view.buttonbar.Bar',
                        buttons: ['start', 'previous'],
                        module: this.module,
                        layout: {
                            width: (this.buttonSize) * 3
                        },
                        buttonSize: function (ofSize) {
                            return ofSize * 0.9;
                        }
                    },
                    {
                        type: 'chess.view.notation.LastMove',
                        module: this.module,
                        layout: {

                            width: this.buttonSize * 2

                        },
                        css: {
                            border: 'none'
                        }
                    },
                    {
                        anchor: [0.5, 0.5],
                        type: 'chess.view.buttonbar.Bar',
                        buttons: ['next', 'end'],
                        module: this.module,
                        layout: {
                            width: (this.buttonSize) * 2
                        },
                        buttonSize: function (ofSize) {
                            return ofSize * 0.9;
                        }
                    },
                    {weight: 1}

                ] :
                    [
                        {
                            weight: 1
                        },
                        {
                            anchor: [1, 0.5],
                            type: 'chess.view.buttonbar.Bar',
                            buttons: this.buttons,
                            module: this.module,
                            layout: {
                                width: (this.buttonSize - 10) * 5
                            },
                            buttonSize: function (ofSize) {
                                return ofSize * 0.9;
                            }
                        }

                    ]
            },
            {
                type: 'chess.WPComMessage'
            }

        ];

    },

    mobileChildren: function () {
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
                    'font-size': '1em',
                    'font-weight': 'bold'
                }
            },

            Object.merge({
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
                    weight: 1,
                    height: 'wrap'
                },
                plugins: [
                    Object.merge({
                        type: 'chess.view.highlight.Arrow'
                    }, this.arrow)
                ]
            }, this.board),
            {
                type: 'chess.view.buttonbar.Bar',
                layout: {
                    height: 40,
                    width: this.boardSize
                },
                module: this.module
            },
            {
                id: this.module + '-panel',
                name: "notation-panel",
                type: 'chess.view.notation.Panel',
                layout: {
                    height: 200
                },
                elCss: {
                    'margin-left': '2px'
                },
                module: this.module

            },
            {
                type: 'chess.WPComMessage'
            }
        ]

    }

});