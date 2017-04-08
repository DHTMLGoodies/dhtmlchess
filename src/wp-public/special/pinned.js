chess.WPPinned = new Class({
    Extends: chess.WPTemplate,

    renderTo: undefined,
    pgn: undefined,
    controller: undefined,

    module: undefined,
    random: false,

    color: undefined,
    parser: undefined,

    pinnedMsgId: undefined,

    arrowPool: undefined,

    solved:false,

    initialize: function (config) {
        this.parent(config);

        this.renderTo = config.renderTo;
        var r = jQuery(this.renderTo);
        r.addClass('ludo-twilight');
        var w = r.width();
        r.css('height', Math.round(w + 65 + this.wpm_h));
        this.boardSize = w;
        if (config.random != undefined) this.random = config.random;

        this.board = config.board || {};
        this.arrow = config.arrow || {};
        this.arrowSolution = config.arrowSolution || {};
        this.hint = config.hint || {};
        this.module = String.uniqueID();

        this.pinnedMsgId = 'dc-' + String.uniqueID();

        this.showLabels = !ludo.isMobile;
        if (this.renderTo.substr && this.renderTo.substr(0, 1) != "#") this.renderTo = "#" + this.renderTo;
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
                            module: this.module,
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
                            labelPos: this.lp, // show labels inside board, default is 'outside'
                            layout: {
                                height: this.boardSize
                            }
                        }, this.board),
                        {
                            css: {
                                'padding-top': 5
                            },
                            layout: {height: 35, type: 'linear', orientation: 'horizontal'},
                            children: [
                                {weight: 1},
                                {
                                    type: 'form.Button',
                                    value: 'Solve',
                                    listeners: {
                                        'click': this.sendSolution.bind(this)
                                    }
                                },
                                {
                                    type: 'form.Button',
                                    value: chess.__('Hint'),
                                    listeners: {
                                        'click': this.showHint.bind(this)
                                    }
                                },
                                {
                                    type: 'form.Button',
                                    value: chess.__('Next'),
                                    listeners: {
                                        'click': function () {
                                            this.controller.loadNextGameFromFile();
                                        }.bind(this)
                                    }
                                },
                                {weight: 1}
                            ]
                        },
                        {
                            type: 'chess.WPComMessage',
                            hidden:this._p
                        }
                    ]
                }
            ]
        });

        var storageKey = 'wp_' + this.pgn.id + '_pinned';

        new chess.view.message.TacticsMessage({
            renderTo: document.body,
            module: this.module,
            showIntro: false,
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
                'loadGame': this.findPinned.bind(this),
                'startOfGame': function () {
                    ludo.getLocalStorage().save(storageKey, this.controller.getCurrentModel().getGameIndex());
                }.bind(this)
            }
        });

        var ctrl = this.controller;
        var index = ludo.getLocalStorage().get(storageKey, 0);
        if (isNaN(index)) index = 0;
        index = Math.max(0, index);
        if (index != undefined) {
            ctrl.getCurrentModel().setGameIndex(index);
        } else {
            index = 0;
        }


        if (this.random) {
            this.controller.loadRandomGame();
        } else {
            this.controller.loadGameFromFile(index);
        }

        this.hPool = new chess.view.highlight.SquarePool({
            board: ludo.$(this.boardId)
        });

        this.interaction = new chess.view.board.BoardInteraction({
            board: ludo.$(this.boardId)
        });
        this.interaction.on('click', function (square) {
            this.hPool.toggle(square, undefined);
        }.bind(this));

        this.arrowPool = new chess.view.highlight.ArrowPool({
            board: ludo.$(this.boardId)
        });
    },

    findPinned: function () {
        if (this.parser == undefined) {
            this.parser = new chess.parser.FenParser0x88();
        }

        this.parser.setFen(this.controller.currentModel.fen());
        var c = this.parser.getColor();
        this.color = c == 'white' ? 'black' : 'white';
        this.hPool.hideAll();
        var pinned = this.parser.getPinnedSquares(this.color);
        if (pinned.length == 0) {
            controller.loadGameFromFile();
        } else {
            ludo.$(this.boardId).flipTo(c);
            this.showIntroDialog();
        }
    },

    sendSolution: function () {
        var solution = this.parser.getPinnedSquares(this.color) || [];
        var user = this.hPool.getSquares() || [];

        var correct = true;

        if (solution.length != user.length) {
            correct = false;
        }

        if(user.length == 0){
            this.showToast();
        }
        if (!correct) {
            var sort = function (a, b) {
                return a < b ? -1 : 1;
            };
            solution.sort(sort);
            user.sort(sort);
            for (var i = 0; i < solution.length; i++) {
                if (correct && solution[i] != user[i]) {
                    correct = false;
                }
            }
        }

        if (!correct) {
            this.controller.fireEvent('wrongGuess');
        } else {
            this.showSolvedDialog();
        }
    },

    toast:undefined,

    getToast:function(){
        if(this.toast == undefined){
            this.toast = new ludo.Notification({
                autoRemove:false,
                duration:2,
                layout:{
                    centerIn: this.boardId,
                    height:30
                },
                css:{
                    'text-align' : 'center'
                },
                html : chess.__("Click squares to solve the puzzles")
            })
        }
        return this.toast;
    },

    showToast:function(){
        this.getToast().show(chess.__("Click squares to solve the puzzles"));
    },

    showIntroDialog: function () {
        this.solved = false;
        this.arrowPool.hideAll();
        var msg = chess.__('Click on all ' + this.color + '\'s pinned pieces');
        this.getToast().show(msg);
        ludo.$(this.pinnedMsgId).html(msg);
    },

    showHint: function () {
        if(this.solved)return;
        var pinned = this.parser.getPinnedSquares(this.color);
        this.getToast().show(chess.__('There are {0} pinned pieces'.replace('{0}', pinned.length)));

    },

    overlay: undefined,

    showSolvedDialog: function () {
        this.solved = true;
        if (this.overlay == undefined) {
            this.overlay = jQuery('<div class="dhtml_chess_game_solved"><div class="dhtml_chess_game_solved_overlay"></div><div class="dhtml_chess_game_solved_image"></div></div>');
            ludo.$(this.boardId).boardEl().append(this.overlay);
        }

        this.overlay.css('opacity', 1);
        this.overlay.show();
        this.hideOverlay.delay(2000, this);

        var fromAndTo = this.parser.getPinnedReadable(this.color);

        jQuery.each(fromAndTo, function (i, squares) {
            this.arrowPool.show(squares.by, squares.king);
        }.bind(this));


    },

    hideOverlay: function () {
        this.overlay.animate({
            opacity: 0
        }, {
            duration: 700,
            complete: function () {
                this.overlay.hide();
            }.bind(this)
        });

    }


});