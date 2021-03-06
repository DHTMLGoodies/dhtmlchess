window.chess.isWordPress = true;

chess.WPComp1 = new Class({

    Extends: chess.WPTemplate,

    boardId: undefined,
    boardSize: undefined,

    isPreview: false,
    nav: false,

    initialize: function (config) {
        this.parent(config);
        var r = this.renderTo;
        var w = r.width();
        var ratio = (w + 50) / (w + 200 + this.wpm_h);
        var h = this.mobile ? w + 150 + this.wpm_h : w * ratio;
        r.css('height', Math.round(h));

        if (config.isPreview) this.isPreview = config.isPreview;
        this.boardSize = this.mobile ? w : w - 200;

        this.boardId = 'dhtml-chess-' + String.uniqueID();

        if (this.canRender()) {
            this.render();
        }
    },

    render: function () {

        new chess.view.Chess({
            cls: this.th,
            theme: this.themeObject,
            renderTo: jQuery(this.renderTo),
            layout: {
                width: 'matchParent',
                height: 'matchParent',
                type: 'linear',
                orientation: 'vertical'
            },
            children: [
                {
                    hidden: !this.mobile,
                    type: 'chess.computer.ClockView',
                    module: this.module,
                    color: 'white',
                    pos: 'top',
                    css: {
                        'text-align': 'center'
                    },
                    layout: {
                        height: 50,
                        width: 150,
                        anchor: 0.5,
                        alignTop: 'board',
                        rightOf: 'board'
                    }
                },
                {
                    layout: {
                        weight: 1,
                        type: 'linear',
                        orientation: 'horizontal'
                    },
                    children: [
                        Object.merge({
                            id: this.boardId,
                            type: 'chess.view.board.Board',
                            animationDuration: this.animationDuration,
                            pieceLayout: 'svg3',
                            boardLayout: undefined,
                            module: this.module,
                            padding: this.mobile ? '1%' : '2.5%',
                            labels: !this.mobile,
                            labelPos: this.lp, // show labels inside board, default is 'outside'
                            background: {
                                borderRadius: '1%',
                                paint: {
                                    fill: '#444'
                                }
                            },
                            layout: {
                                height: 'matchParent',
                                weight: 1
                            },
                            plugins: [
                                {
                                    type: 'chess.view.highlight.Arrow'
                                }
                            ]

                        }, this.board),
                        {
                            width: 205,
                            hidden: this.mobile,
                            css: {
                                'margin-left': 5
                            },
                            layout: {
                                type: 'linear', orientation: 'vertical'
                            },
                            children: [

                                {
                                    id: 'clockTop',
                                    module: this.module,
                                    type: 'chess.computer.ClockView',
                                    color: 'white',
                                    pos: 'top',
                                    layout: {
                                        height: 50,
                                        alignTop: 'board',
                                        rightOf: 'board'
                                    }
                                },
                                {
                                    weight: 1
                                },
                                {
                                    id: 'clockBottom',
                                    module: this.module,
                                    type: 'chess.computer.ClockView',
                                    color: 'black',
                                    pos: 'bottom',
                                    layout: {
                                        height: 50,
                                        alignBottom: 'board',
                                        rightOf: 'board'
                                    }
                                }
                            ]
                        }

                    ]
                },
                {
                    hidden: !this.mobile,
                    type: 'chess.computer.ClockView',
                    module: this.module,
                    color: 'white',
                    pos: 'bottom',
                    css: {
                        'text-align': 'center'
                    },
                    layout: {
                        anchor: 0.5,
                        height: 50,
                        width: 150,
                        alignTop: 'board',
                        rightOf: 'board'
                    }
                },
                {

                    css: {
                        'margin-top': 5
                    },
                    layout: {
                        height: 35,
                        width: this.boardSize,
                        type: 'linear', orientation: 'horizontal'
                    },
                    children: [
                        { weight: 1 },
                        {
                            type: 'form.Button',
                            module: this.module,
                            value: 'Draw',
                            listeners: {
                                click: function () {
                                    this.controller.claimDraw();
                                }.bind(this)
                            }
                        },
                        {
                            type: 'chess.view.notation.LastMove',
                            module: this.module,
                            css: {
                                'border-radius': '999px',
                                'background-color': '#ddd',
                                color: '#444',
                                'border-color': '1px solid ' + ludo.$C('border')
                            },
                            layout: {
                                width: 100,
                                height: 40
                            }
                        },
                        {
                            type: 'form.Button', value: 'Resign',
                            module: this.module,
                            listeners: {
                                'click': function () {
                                    this.controller.resign();
                                }.bind(this)
                            }
                        },
                        { weight: 1 }
                    ]
                },
                {
                    module: this.module,
                    submodule: 'message',
                    layout: {
                        height: 30
                    }
                },
                {
                    type: 'chess.WPComMessage',
                    hidden: this._p
                }
            ]
        });

        this.controller = new chess.controller.PlayStockFishController({
            applyTo: [this.module],
            sound: this.sound,
            stockfish: ludo.config.getDocumentRoot() + '/stockfish-js/stockfish.js',
            playerColor: 'white',    // Human color
            listeners: {
                'start': this.onNewGame.bind(this),
                'engineupdate': this.updateMove.bind(this)

            },
            'thinkingTime': 3000 // Computers pondering time in 1/1000 seconds
        });

        if (!this.isPreview) {
            new chess.computer.GameOverDialog({
                module: this.module,
                layout: {
                    centerIn: ludo.$(this.boardId)
                },
                movable: false, resizable: false
            });

            new chess.computer.GameDialog({
                module: this.module,
                hidden: true,
                layout: {
                    centerIn: ludo.$(this.boardId)
                },
                movable: false,
                resizable: false
            });


            var sd = new chess.computer.ComputerStatusDialog({
                module: this.module,
                layout: {
                    centerIn: ludo.$(this.boardId)
                },
                movable: false,
                resizable: false
            });

            sd.show();
        }
    },

    setThinkingTime: function (thinkingTime) {
        this.controller.setThinkingTime(thinkingTime);
    },

    updateMove: function (move) {
        // silent
    },

    onNewGame: function (myColor) {
        var b = ludo.get(this.boardId);
        if (myColor == 'black') {
            b.flipToBlack();
        } else {
            b.flipToWhite();
        }
    }

});