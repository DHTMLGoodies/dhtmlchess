window.chess.isWordPress = true;

chess.WPTactics2 = new Class({
    Extends: chess.WPTemplate,

    renderTo: undefined,
    pgn: undefined,

    controller: undefined,

    showLabels: undefined,

    module: undefined,

    boardSize: undefined,
    random: false,
    nav: false,

    gameFinished: false,

    startTime: undefined,

    lastGameId: undefined,

    gameIndex: 0,

    storageKey: undefined,

    validateGameData: false,
    storage: undefined,

    initialize: function (config) {
        this.parent(config);

        var r = jQuery(this.renderTo);
        var w = r.width();
        r.css('height', Math.round(w + 164 + this.wpm_h));
        this.boardSize = w;
        if (config.random != undefined) this.random = config.random;

        this.board = config.board || {};
        this.arrow = config.arrow || {};
        this.arrowSolution = config.arrowSolution || {};
        this.hint = config.hint || {};
        this.module = String.uniqueID();

        this.showLabels = !ludo.isMobile;
        if (this.renderTo.substr && this.renderTo.substr(0, 1) != "#") this.renderTo = "#" + this.renderTo;

        var id = String.uniqueID();
        this.avId = 'av' + id;
        this.eloId = 'elo' + id;
        this.nextBtnId = 'btn' + id;
        this.reloadBtnId = 'btn_r' + id;
        this.clockId = 'clk' + id;
        this.iconId = 'icon' + id;
        this.colorViewId = 'clr' + id;
        if (this.canRender()) {
            this.render();
        }
    },


    nextGame: function () {
        this.loadedFromHistory = false;
        if (this.random) {
            this.controller.loadRandomGame();
        } else {
            this.loadNextGame();
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
                            layout: {
                                height: 34
                            },
                            id: this.colorViewId,
                            type: 'chess.ColorView'
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
                            height: 48,
                            cls: 'wpc-user-info-panel',
                            layout: {
                                type: 'linear', orientation: 'horizontal'
                            },
                            children: [
                                {
                                    type: 'chess.UserAvatarView',
                                    id: this.avId,
                                    auto: false,
                                    layout: {
                                        width: 48, height: 'matchParent'
                                    }
                                },
                                {
                                    module: this.module,
                                    type: 'chess.UserElo',
                                    id: this.eloId,
                                    css: {
                                        'line-height': '40px'
                                    },
                                    layout: {
                                        weight: 1, height: 'matchParent'
                                    }
                                },
                                {
                                    id: this.clockId,
                                    type: 'chess.Clock',
                                    layout: {
                                        weight: 1, height: 'matchParent'
                                    }
                                }
                            ]
                        },
                        {
                            layout: {
                                height: 48, type: 'linear', orientation: 'horizontal'
                            },
                            children: [
                                {
                                    id: this.iconId,
                                    type: 'chess.IconView',
                                    layout: {
                                        width: 48,
                                        height: 'matchParent'
                                    }
                                },
                                {
                                    weight: 1
                                },
                                {
                                    id: this.reloadBtnId,
                                    type: 'chess.ImageButton',
                                    img: this.dr + 'images/reload.png',
                                    layout: {
                                        width: 80,
                                        height: 'matchParent'
                                    },
                                    btnVisible: false,
                                    listeners: {
                                        'click': this.reloadGame.bind(this)
                                    }
                                },
                                {
                                    id: this.nextBtnId,
                                    type: 'chess.ImageButton',
                                    img: this.dr + 'images/btn-next.png',
                                    layout: {
                                        width: 80,
                                        height: 'matchParent'
                                    },
                                    btnVisible: false,
                                    listeners: {
                                        'click': this.nextGame.bind(this)
                                    }
                                }

                            ]
                        }
                    ]
                }
            ]
        });

        this.storageKey = 'wpcu_' + this.pgn.id + '_tactics';

        this.controller = new chess.controller.Controller({
            applyTo: [this.module],
            pgn: this.pgnId(),
            sound: this.sound,
            autoMoveDelay: 400,
            noDialogs: true,
            eventHandler: this.eventHandler.bind(this),
            listeners: {
                'loadGame': function (m, model) {


                }.bind(this)
            }
        });

        var index = this.getIndex();

        if (isNaN(index)) index = 0;
        index = Math.max(0, index);

        if (this.random) {
            this.controller.loadRandomGame();
        } else {
            this.loadGame(index);
        }

        this.loadUserInfo();
    },

    loadNextGame: function () {
        this.validateGameData = true;
        this.loadGame(this.getIndex() + 1);
    },

    getIndex: function () {
        return this.storageVal('index', 0);
    },

    loadGame: function (index) {

        jQuery.ajax({
            url: this.url,
            method: 'post',
            cache: false,
            dataType: 'json',
            data: {
                action: 'game_by_index_strict',
                pgn: this.pgnId(),
                index: index
            },
            complete: function (response, success) {
                this.gameFinished = false;
                if (success) {
                    var json = response.responseJSON;

                    if (json.success) {
                        this.onGameLoaded(json.response);
                    }else{
                        var pgnId = this.nextPgnId();

                        this.pgnId(pgnId);
                        this.saveStorageVal('index', 0);
                        this.loadGame(0);
                    }

                }
            }.bind(this)

        });

    },

    onGameLoaded: function (model) {

        var gameId = model.id;
        var pgnId = model.pgn_id;
        var index = model.index;

        this.controller.currentModel.populate(model);

        ludo.$(this.eloId).clearIncs();

        this.saveStorageVal('id', gameId);
        this.pgnId(pgnId);
        this.saveStorageVal('index', index);
    },


    pgnId: function (val) {
        if(arguments.length == 1){
            this.saveStorageVal('pgn', val);
            return;
        }
        return this.storageVal('pgn', this.pgn.id);
    },

    nextPgnId: function () {
        var pgn = this.pgnId();
        var index = 0;
        jQuery.each(this.pgnAll, function (i, pgnObj) {
            if (pgnObj.id == pgn) {
                index = i;
            }
        });

        if (index < this.pgnAll.length - 1) {
            index++;
        } else {
            index = 0;
        }

        return this.pgnAll[index].id;
    },

    reloadGame: function () {

        this.controller.currentModel.toStart();

        ludo.$(this.iconId).animateOut();

        var clk = ludo.$(this.clockId);
        clk.reset();
        clk.start();
    },

    myColor: undefined,


    eventHandler: function (event, model, controller, move) {

        var b = controller.views.board;

        if (event == 'boardMove') {
            controller.currentModel.tryNextMove(move);
        }

        if (event == 'newGame') {
            var result = model.getResult();
            if (result == -1) {
                b.flipToBlack();
                this.myColor = 'black';
            } else {
                b.flipToWhite();
                this.myColor = 'white';
            }

            var clk = ludo.$(this.clockId);
            clk.reset();
            clk.start();


            ludo.$(this.iconId).animateOut();

            ludo.$(this.nextBtnId).hideButton();
            ludo.$(this.reloadBtnId).hideButton();
            ludo.$(this.colorViewId).hideView();
        }

        if (event == 'setPosition' || event == 'nextmove') {
            colorToMove = model.getColorToMove();

            if (colorToMove == this.myColor) {
                b.enableDragAndDrop(model);
            } else {
                model.nextMove.delay(200, model);
            }
        }

        if (event == 'wrongGuess') {
            this.onGameEnd(true);
        }

        if (event === 'endOfBranch') {
            this.onGameEnd();
        }
    },

    getStorage: function () {
        if (this.storage == undefined) {
            var storage = ludo.getLocalStorage().get(this.storageKey);
            this.storage = storage ? storage : {};
        }
        return this.storage;
    },

    saveStorageVal: function (key, val) {
        var s = this.getStorage();
        s[key] = val;
        ludo.getLocalStorage().save(this.storageKey, s);
    },

    storageVal: function (key, defaultVal) {

        var s = this.getStorage();
        return s[key] != undefined ? s[key] : defaultVal;
    },


    onGameEnd: function (wasWrong) {

        var src = wasWrong ? 'incorrect-icon.png' : 'solved-icon.png';
        ludo.$(this.iconId).setIcon(this.dr + 'images/' + src);


        if (this.gameFinished)return;

        var clk = ludo.$(this.clockId);
        clk.stop();

        this.gameFinished = true;

        var moves = this.controller.getCurrentModel().model.moves.length;
        var ms = clk.elapsed();
        var solved = !wasWrong;

        var cv = ludo.$(this.colorViewId);
        cv.showView();
        if (solved) {
            cv.color('#388E3C');
            cv.icon(this.dr + 'images/solved-icon-white.png');
        } else {
            cv.color('#388E3C');
            cv.icon(this.dr + 'images/incorrect-icon-white.png');
        }

        jQuery.ajax({
            url: this.url,
            method: 'post',
            cache: false,
            dataType: 'json',
            data: {
                action: 'wpc_puzzle_complete',
                moves: moves,
                solved: solved ? 1 : 0,
                ms: ms,
                puzzleId: this.controller.currentModel.getId()
            },
            complete: function (response, success) {
                this.gameFinished = false;
                if (success) {
                    var json = response.responseJSON;
                    var elo = json.response;

                    ludo.$(this.eloId).val(elo);

                    ludo.$(this.nextBtnId).showButton();
                    ludo.$(this.reloadBtnId).showButton();
                }
            }.bind(this)
        });

    },

    loadUserInfo: function () {
        jQuery.ajax({
            url: this.url,
            method: 'post',
            cache: false,
            dataType: 'json',
            data: {
                action: 'wpc_userinfo',
                size: 32
            },
            complete: function (response, success) {

                if (success) {
                    var json = response.responseJSON;
                    ludo.$(this.avId).setAvatar(json.response.avatar);
                    // ludo.$(this.userInfoId).html(json.response.nick);
                    ludo.$(this.eloId).val(json.response.puzzleelo);
                } else {
                }

            }.bind(this)
        });
    }
});