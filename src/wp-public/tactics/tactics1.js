window.chess.isWordPress = true;

chess.WPTactics1 = new Class({
    Extends: chess.WPTemplate,

    renderTo: undefined,
    pgn: undefined,

    controller: undefined,

    showLabels: undefined,

    module: undefined,

    boardSize: undefined,
    random: false,
    nav: false,

    history: undefined,
    historySize: 20,
    historyKey: undefined,
    historyIndexKey: undefined,
    historyIndex: 0,
    loadedFromHistory: false,
    previousButtonId: undefined,

    __construct: function (config) {
        this.parent(config);
        var r = this.renderTo;
        var w = this.renderWidth();
        r.css('height', Math.round(w + 165 + this.wpm_h));
        this.boardSize = w;
        if (config.random !== undefined) this.random = config.random;
        this.previousButtonId = 'dc-' + String.uniqueID();
        this.historyKey = 'tactics-history-' + this.pgn.id;
        this.historyIndexKey = 'tactics-history-index' + this.pgn.id;
        var hist = ludo.getLocalStorage().get(this.historyKey, '');
        this.history = hist.length > 0 ? hist.split(/,/g) : [];
        this.historyIndex = ludo.getLocalStorage().get(this.historyIndexKey, 0) / 1;

        this.showLabels = !this.mobile;
        if (this.renderTo.substr && this.renderTo.substr(0, 1) !== "#") this.renderTo = "#" + this.renderTo;

        var id = String.uniqueID();

        this.colorViewId = 'clr' + id;

        this.beforeRender();
    },

    previousGame: function () {
        this.loadedFromHistory = true;
        if (this.random) {
            if (this.history.length > 1 && this.historyIndex > 0) {
                this.historyIndex--;
                this.loadFromHistory();
            }
        } else {
            this.controller.loadPreviousGameFromFile(this.pgn);
        }

    },

    nextGame: function () {
        this.loadedFromHistory = false;
        if (this.random) {
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.loadFromHistory();
            } else {
                this.controller.loadRandomGame();
            }
        } else {
            this.controller.loadNextGameFromFile();
        }
    },

    loadFromHistory: function () {
        this.loadedFromHistory = true;
        this.saveHistoryIndex();
        var id = this.history[this.historyIndex];
        this.controller.loadWordPressGameById(this.pgn.id, id);
    },

    render: function () {

        new chess.view.Chess({
            cls: this.th,
            theme: this.themeObject,
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
                            height: 35,
                            module: this.module,
                            type: 'chess.view.metadata.Game',
                            tpl: this.heading_tpl || '#{index} - {white}',
                            cls: 'metadata',
                            css: {
                                'text-align': 'center'
                            }
                        },

                        {
                            layout: {
                                type: 'linear',
                                orientation: 'horizontal'
                            },
                            css: {
                                'margin-top': 2
                            },

                            height: 30,
                            children: [
                                {
                                    weight: 1
                                },
                                {
                                    module: this.module,
                                    layout: { width: this.mobile ? 40 : 80 },
                                    type: 'chess.view.button.TacticHint',
                                    value: this.mobile ? '?' : chess.__('Hint')
                                },
                                {
                                    module: this.module,
                                    hidden: this.mobile,
                                    layout: { width: 80 },
                                    type: 'chess.view.button.TacticSolution',
                                    value: chess.__('Solution')
                                }, {
                                    module: this.module,
                                    layout: { width: 80 },
                                    type: 'form.Button',
                                    value: chess.__('Next'),
                                    listeners: {
                                        click: this.nextGame.bind(this)
                                    }
                                }, {
                                    id: this.previousButtonId,
                                    module: this.module,
                                    layout: { width: 80 },
                                    type: 'form.Button',
                                    value: chess.__('Previous'),
                                    listeners: {
                                        click: this.previousGame.bind(this)
                                    }
                                },
                                {
                                    weight: 1
                                }
                            ]
                        },
                        Object.merge({
                            boardLayout: undefined,
                            animationDuration: this.animationDuration,
                            id: this.boardId,
                            type: 'chess.view.board.Board',
                            module: this.module,
                            overflow: 'hidden',
                            pieceLayout: 'svg3',
                            boardCss: {
                                border: 0
                            },
                            labelPos: this.lp,
                            layout: {
                                height: this.boardSize
                            },
                            plugins: [
                                Object.merge({
                                    type: 'chess.view.highlight.Arrow'
                                }, this.arrow),
                                Object.merge({
                                    type: 'chess.view.highlight.ArrowTactic'
                                }, this.arrowSolution),
                                Object.merge({
                                    type: 'chess.view.highlight.SquareTacticHint'
                                }, this.hint)
                            ]
                        }, this.board),
                        {
                            height: 50,
                            module: this.module,
                            comments: false,
                            figurines: 'svg_egg', // Figurines always starts with svg - it is the prefix of images inside the dhtmlchess/images folder
                            type: 'chess.view.notation.TacticPanel'
                        },
                        {
                            layout: {
                                height: 34
                            },
                            id: this.colorViewId,
                            type: 'chess.ColorView'
                        },
                        {
                            type: 'chess.WPComMessage',
                            hidden: this._p
                        }
                    ]
                }
            ]
        });

        var storageKey = 'wp_' + this.pgn.id + '_tactics';

        new chess.view.message.TacticsMessage({
            renderTo: jQuery(document.body),
            module: this.module,
            autoHideAfterMs: 1000,
            hidden: true,
            autoHideWelcomeAfterMs: 1000,
            css: {
                'background-color': '#fff',
                'border-radius': '5px',
                'line-height': '50px'
            },
            layout: {
                centerIn: this.boardId,
                width: 300, height: 50
            }
        });

        this.controller = new chess.controller.TacticControllerGui({
            applyTo: [this.module],
            pgn: this.pgn.id,
            sound: this.sound,
            autoMoveDelay: 400,
            showDialog: false,
            gameEndHandler: this.gameEndHandler.bind(this),
            listeners: {
                'loadGame': function () {
                    var id = this.controller.getCurrentModel().model.id;
                    var index = this.controller.getCurrentModel().getGameIndex();
                    ludo.getLocalStorage().save(storageKey, index);
                    if (!this.loadedFromHistory && this.random) {
                        this.addToHistory(id);
                    }

                    if (this.random && this.historyIndex == 0) {
                        ludo.$(this.previousButtonId).disable();
                    } else {
                        ludo.$(this.previousButtonId).enable();

                    }


                }.bind(this)
            }
        });

        var index = ludo.getLocalStorage().get(storageKey, 0);

        if (isNaN(index)) index = 0;
        index = Math.max(0, index);
        if (index !== undefined) {
            this.controller.getCurrentModel().setGameIndex(index);
        } else {
            index = 0;
        }

        if (this.random) {
            if (this.history.length > 0) {
                this.loadFromHistory();
            } else {
                this.controller.loadRandomGame();
            }
        } else {
            this.controller.loadGameFromFile(index);
        }
    },

    /**
     * Triggered 1000ms after game end
     */
    gameEndHandler: function () {

        var cv = ludo.$(this.colorViewId);
        cv.showView();
        cv.colorCls('wpc-tactics-solved');
        cv.icon(this.dr + 'images/solved-icon-white.png');

        ludo.$(this.colorViewId).hideView();
        this.nextGame();
    },

    addToHistory: function (gameId) {
        this.history.push(gameId);
        if (this.history.length > this.historySize) {
            this.history.shift();
        }
        this.historyIndex = this.history.length - 1;
        this.saveHistory();
    },

    saveHistory: function () {
        ludo.getLocalStorage().save(this.historyKey, this.history.join(','));
    },

    saveHistoryIndex: function () {
        ludo.getLocalStorage().save(this.historyIndexKey, this.historyIndex);
    }
});