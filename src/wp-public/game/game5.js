window.chess.isWordPress = true;
chess.WPGame5 = new Class({
    Extends: chess.WPGameTemplate,
    boardSize: undefined,
    buttonSize: 45,

    boardWeight: 1,
    notationWeight: 1,

    __construct: function (config) {


        this.parent(config);
        var r = this.renderTo;
        var w = this.renderWidth();
        if (this.mobile) {
            this.notationWeight = 0;
        }
        this.boardSize = (w / (this.boardWeight + this.notationWeight));
        if (this.mobile) {
            r.css('height', w + 235 + this.navH + this.wpm_h);
        } else {
            r.css('height', this.boardSize + this.buttonSize + this.wpm_h + 30);

        }
        r.css('position', 'relative');

        if (!this.buttons) {
            if (!config.admPreview) {
                this.buttons = this.mobile ? ['start', 'previous', 'next', 'end'] : ['start', 'previous', 'next', 'end', 'flip'];
            } else {
                this.buttons = ['start', 'previous', 'play', 'next', 'end', 'flip', 'comp']
            }
        }

        this.adjustButtonArray(this.buttons);
        this.configure();
        this.beforeRender();
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
            labelPos: this.lp, // show labels inside board, default is 'outside'
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


        if (!this.custom) {
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

        }


    },

    render: function () {

        new chess.view.Chess({
            renderTo: this.renderTo,
            cls: this.th,
            theme: this.themeObject,
            layout: {
                type: 'linear', orientation: 'vertical',
                height: 'matchParent',
                width: 'matchParent'
            },

            children: this.mobile ? this.mobileChildren() : this.desktopChildren()
        });

        this.createController();
    },


    desktopChildren: function () {
        return [
            {
                module: this.module,
                type: 'chess.view.metadata.Game',
                tpl: '{white} - {black}',
                cls: 'metadata',
                css: {
                    'text-align' : 'center',
                    'font-weight' : 'bold'
                },
                height: 30
            },
            {
                layout: {
                    height: this.boardSize,
                    type: 'linear',
                    orientation: 'horizontal'
                },

                children: this.mobile ? [this.board] : [

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
                children: [
                    {
                        weight: 1
                    },
                    {
                        anchor: [1, 0.5],
                        type: 'chess.view.buttonbar.Bar',
                        buttons: this.buttons,
                        module: this.module,
                        layout: {
                            width: (this.buttonSize - 10) * this.buttons.length
                        },
                        buttonSize: function (ofSize) {
                            return ofSize * 0.9;
                        }
                    }

                ]
            },
            {
                type: 'chess.WPComMessage',
                hidden: this._p
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
                    'text-align': 'center'
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
                labels: !this.mobile, // show labels for ranks, A-H, 1-8
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
            }, this.board),
            {
                layout: {type: 'linear', orientation: 'horizontal', height: this.navH, width: this.boardSize},
                children: [
                    {
                        type: 'chess.view.buttonbar.Bar',
                        layout: {
                            height: this.navH,
                            weight: 1

                        },
                        module: this.module
                    }
                ]
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
                type: 'chess.WPComMessage',
                hidden: this._p
            }
        ]

    }

});