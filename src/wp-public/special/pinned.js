chess.WPPinned = new Class({
   Extends: chess.WPTemplate,

    renderTo:undefined,
    pgn:undefined,
    controller:undefined,

    module:undefined,
    random:false,

    color:undefined,
    parser:undefined,

    pinnedMsgId:undefined,

    initialize: function (config) {
        this.parent(config);

        this.renderTo = config.renderTo;
        var r = jQuery(this.renderTo);
        var w = r.width();
        r.css('height', Math.round(w + 130));
        this.boardSize = w;
        if (config.random != undefined)this.random = config.random;

        this.pgn = config.pgn;
        this.board = config.board || {};
        this.arrow = config.arrow || {};
        this.arrowSolution = config.arrowSolution || {};
        this.hint = config.hint || {};
        this.module = String.uniqueID();

        this.boardId = 'dc-' + String.uniqueID();
        this.pinnedMsgId = 'dc-' + String.uniqueID();

        this.showLabels = !ludo.isMobile;
        if (this.renderTo.substr && this.renderTo.substr(0, 1) != "#")this.renderTo = "#" + this.renderTo;
        if (this.canRender()) {
            this.render();
        }


    },

    render: function () {

        new chess.view.Chess({
            cls: this.th,
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'fill',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [
                {
                    layout: {
                        type: 'linear', orientation: 'vertical'
                    },


                    children: [
                        {
                            id: this.pinnedMsgId,
                            module:this.module,
                            css: {
                                'text-align': 'center',
                                'line-height': '30px'
                            },
                            layout: {
                                height: 30
                            }
                        },
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
                            labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
                            labelPos: 'outside', // show labels inside board, default is 'outside'
                            layout: {
                                height: this.boardSize
                            }
                        }, this.board),
                        {
                            layout: {height: 30, type: 'linear', orientation: 'horizontal'},
                            children: [
                                {weight: 1},
                                {
                                    type: 'form.Button',
                                    value: 'Submit Solution',
                                    listeners: {
                                        'click': sendSolution
                                    }
                                },
                                {
                                    type: 'form.Button',
                                    value: chess.getPhrase('Show Hint'),
                                    listeners: {
                                        'click': showHint
                                    }
                                },
                                {weight: 1}
                            ]
                        }
                    ]
                }
            ]
        });

        var storageKey = 'wp_' + this.pgn.id + '_pinned';

        new chess.view.message.TacticsMessage({
            renderTo: document.body,
            module:this.module,
            showIntro:false,
            hidden: true,
            autoHideWelcomeAfterMs: 20,
            css: {
                'background-color': '#eee',
                'border-radius': 5
            },
            layout: {
                width: 200, height: 50,
                centerIn: ludo.$('chess-board-pinned-pieces')
            }
        });

        this.controller = new chess.controller.Controller({
            applyTo: [this.module],
            pgn: this.pgn.id,
            gameEndHandler: function (controller) {
                if (this.random) {
                    controller.loadRandomGame();
                } else {
                    controller.loadNextGameFromFile();
                }
            }.bind(this),
            listeners: {
                'loadGame': function () {
                    this.findPinned.bind(this)
                },
                'startOfGame': function () {
                    ludo.getLocalStorage().save(storageKey, this.controller.getCurrentModel().getGameIndex());
                }.bind(this)
            }
        });

        var index = ludo.getLocalStorage().get(storageKey, 0);
        if (isNaN(index)) index = 0;
        index = Math.max(0, index);
        if (index != undefined) {
            this.controller.getCurrentModel().setGameIndex(index);
        } else {
            index = 0;
        }


        if (this.random) {
            this.controller.loadRandomGame();
        } else {
            this.controller.loadGameFromFile(index);
        }

        this.hPool = new chess.view.board.HighlightPool({
            board: ludo.$(this.boardId)
        });

        this.interaction = new chess.view.board.BoardInteraction({
            board: ludo.$(this.boardId)
        });
        this.interaction.on('click', function (square) {
            this.hPool.toggle(square, '#D32F2F');
        }.bind(this));


    },

    findPinned:function(){
        if (this.parser == undefined) {
            this.parser = new chess.parser.FenParser0x88();
        }

        this.parser.setFen(controller.currentModel.fen());
        var c = this.parser.getColor();
        this.color = c == 'white' ? 'black' : 'white';
        this.hPool.hideAll();
        var pinned = parser.getPinnedSquares(color);
        if (pinned.length == 0) {
            controller.loadGameFromFile();
        } else {
            ludo.$(this.boardId).flipTo(c);
            this.showIntroDialog();
        }
    },

    sendSolution:function(){
        var solution = this.parser.getPinnedSquares(color);
        var user = hPool.getSquares();

        var correct = true;

        if (solution.length != user.length) {
            correct = false;
        }

        if (!correct) {
            solution.sort(sort);
            user.sort(sort);
            for (var i = 0; i < solution.length; i++) {
                if (correct && solution[i] != user[i]) {
                    correct = false;
                }
            }
        }

        if (!correct) {
            controller.fireEvent('wrongGuess');
        } else {
            showSolvedDialog();
        }

    },

    showIntroDialog:function(){
        if (introDialog == undefined) {
            introDialog = new ludo.dialog.Alert({
                autoRemove: false,
                css: {
                    'font-size': '1.1em',
                    'text-align': 'center',
                    'padding': 10
                },
                layout: {
                    width: 300, height: 200,
                    centerIn: ludo.$('chess-board-pinned-pieces')
                },
                title: chess.getPhrase('Find pinned pieces')
            });
        }

        introDialog.html('Click on all ' + color + '\'s pinned pieces');
        introDialog.show();

        ludo.$(this.pinnedMsgId).html('Click on all ' + color + '\'s pinned pieces');
    },

    showHint:function(){
        if (this.toast == undefined) {
            this.toast = new ludo.Notification({
                autoRemove: false,
                renderTo: document.body,
                layout: {
                    width: 300,
                    height: 30,
                    centerIn: ludo.$('chess-board-pinned-pieces')
                }
            });
        }
        var pinned = this.parser.getPinnedSquares(color);
        this.toast.html(chess.getPhrase('There are {0} pinned pieces'.replace('{0}', pinned.length)));
        this.toast.show();

    }


});