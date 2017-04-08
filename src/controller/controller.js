/**
 Game controller base class. This class acts as the glue between
 game models and views. When something happens in current game, it sends a message/event to the
 controller. The controller delegates this message to the views and all views interested
 @module Controller
 @namespace chess.controller
 @class Controller
 @constructor
 @param {Object} config
 */
chess.controller.Controller = new Class({
    Extends: ludo.controller.Controller,
    models: [],
    applyTo: undefined,
    currentModel: null,
    modelCacheSize: 15,
    views: {},
    disabledEvents: {},
    pgn: undefined,
    debug: false,

    _module: undefined,

    isBusy: false,

    sound: false,
    eventHandler: undefined,

    __construct: function (config) {
        this.applyTo = config.applyTo || ['eventHandler', 'chess', 'user.menuItemNewGame', 'user.saveGame', 'user.menuItemSaveGame'];
        this.parent(config);
        this.__params(config, ['arrowStylesSec', 'debug', 'pgn', 'theme', 'sound']);

        if (config.applyTo != undefined) {
            this._module = config.applyTo[0];
        }
        this.theme = this.theme || chess.THEME || {};

        this.createDefaultViews();
        this.createDefaultModel();

        if (this.sound) {
            var m = ludo._new('chess.sound.Sound');
            m.add(this);
        }
    },

    createDefaultViews: function () {
        if (chess.view.dialog != undefined) {
            if (chess.view.dialog.OverwriteMove) {
                this.createView('chess.view.dialog.OverwriteMove');
            }
            this.createView('chess.view.dialog.Promote');
            if (chess.view.dialog.Comment) {
                this.createView('chess.view.dialog.Comment');
            }
        }

        if (this.views.board) {
            new chess.action.Handler({
                board: this.views.board,
                controller: this,
                arrowStyles:this.arrowStylesSec
            })
        }
    },

    createView: function (type) {
        var c = this.theme[type] || {};
        c.type = type;
        if (this._module != undefined) c.module = this._module;
        return ludo.factory.create(c);
    },


    createDefaultModel: function () {
        var model = this.getNewModel();
        this.models[0] = model;
        this.currentModel = model;
        model.newGame();
        model.setClean();
    },

    addView: function (view) {

        // TODO find a better way to relay events from views.
        if (this.views[view.submodule] !== undefined) {
            if (this.debug) ludo.util.log('submodule ' + view.submodule + ' already registered in controller');
            //return false;
        }
        this.views[view.submodule] = view;
        switch (view.submodule) {
            case window.chess.Views.buttonbar.bar:
                view.on('play', this.playMoves.bind(this));
                view.on('start', this.toStart.bind(this));
                view.on('end', this.toEnd.bind(this));
                view.on('previous', this.previousMove.bind(this));
                view.on('next', this.nextMove.bind(this));
                view.on('pause', this.pauseGame.bind(this));
                view.on('flip', this.flipBoard.bind(this));
                view.on('comp', this.compClick.bind(this));
                break;
            case window.chess.Views.buttonbar.game:
                view.on('play', this.playMoves.bind(this));
                view.on('tostart', this.toStart.bind(this));
                view.on('toend', this.toEnd.bind(this));
                view.on('previous', this.previousMove.bind(this));
                view.on('next', this.nextMove.bind(this));
                view.on('pause', this.pauseGame.bind(this));
                view.on('flip', this.flipBoard.bind(this));
                break;
            case 'list-of-pgn-files':
                view.on('selectPgn', this.selectPgn.bind(this));
                break;
            case 'gameList':
                view.on('selectGame', this.selectGame.bind(this));
                break;
            case 'menuItemSaveGame':
            case 'saveGame':
                view.on('saveGame', function () {
                    this.currentModel.save();
                }.bind(this));
                break;
            case 'dialogNewGame':
                view.on('newGame', function (metadata) {
                    this.currentModel = this.getNewModel({
                        metadata: metadata
                    });
                    this.currentModel.activate();
                }.bind(this));
                break;
            case 'menuItemNewGame':
                view.on('newGame', function () {
                    /**
                     * New game dialog event
                     * @event newGameDialog
                     */
                    this.fireEvent('newGameDialog');
                }.bind(this));
                break;
            case 'commandLine':
                view.on('move', this.addMove.bind(this));
                view.on('setPosition', this.setPosition.bind(this));
                view.on('load', this.selectGame.bind(this));
                view.on('flip', this.flipBoard.bind(this));
                view.on('grade', this.gradeCurrentMove.bind(this));
                break;
            case 'board':
                view.on('move', this.addMove.bind(this));
                view.on('animationStart', this.setBusy.bind(this));
                view.on('animationComplete', this.nextAutoPlayMove.bind(this));
                break;
            case 'notation':
                view.on('setCurrentMove', this.setCurrentMove.bind(this));
                view.on('gradeMove', this.gradeMove.bind(this));
                view.on('commentBefore', this.dialogCommentBefore.bind(this));
                view.on('commentAfter', this.dialogCommentAfter.bind(this));
                view.on('deleteMove', this.deleteMoves.bind(this));
                break;
            case 'dialogOverwriteMove':
                view.on('overwriteMove', this.overwriteMove.bind(this));
                view.on('newVariation', this.newVariation.bind(this));
                view.on('cancelOverwrite', this.cancelOverwrite.bind(this));
                break;
            case 'dialogPromote':
                view.on('promote', this.addMove.bind(this));
                break;
            case 'buttonTacticHint':
                view.on('showHint', this.showHint.bind(this));
                break;
            case 'buttonTacticSolution':
                view.on('showSolution', this.showSolution.bind(this));
                break;
            case 'buttonNextGame':
                view.on('nextGame', this.loadNextGame.bind(this));
                break;
            case 'buttonPreviousGame':
                view.on('previousGame', this.loadPreviousGame.bind(this));
                break;
            case 'eco.VariationTree':
                view.on('selectMove', this.addMove.bind(this));
                break;
            case 'positionSetup':
                view.on('setPosition', this.setPosition.bind(this));
                break;
            case 'dialogComment':
                view.on('commentBefore', this.addCommentBefore.bind(this));
                view.on('commentAfter', this.addCommentAfter.bind(this));
                break;
        }

        return true;
    },

    compClick: function () {

    },

    deleteMoves: function (move) {
        this.currentModel.deleteMove(move);
    },

    /**
     * Load next game in selected database. This method will only work if you have
     * a grid with list of games. The only thing this method does is to fire the "nextGame"
     * event which the list of games grid listens to. The grid will go to next game and fire it's
     * selectGame event
     * @method loadNextGame
     * @return undefined
     */
    loadNextGame: function () {
        /**
         * next game event
         * @event nextGame
         */
        this.fireEvent('nextGame');
    },

    /**
     * Load previous game from selected database. For info, see loadNextGame
     * @method loadPreviousGame
     * @return undefined
     */
    loadPreviousGame: function () {
        this.fireEvent('previousGame');
    },

    showHint: function () {
        var nextMove = this.currentModel.getNextMove();
        if (nextMove) {
            this.views.board.showHint(nextMove);
        }
    },

    showSolution: function () {
        var nextMove = this.currentModel.getNextMove();
        if (nextMove) {
            this.views.board.showSolution(nextMove);
        }
    },

    setPosition: function (fen) {
        this.currentModel.setPosition(fen);
    },

    overwriteMove: function (oldMove, newMove) {
        this.currentModel.overwriteMove(oldMove, newMove);
    },

    newVariation: function (oldMove, newMove) {
        this.currentModel.setCurrentMove(oldMove);
        this.currentModel.newVariation(newMove);
    },

    cancelOverwrite: function () {
        this.currentModel.resetPosition();
    },

    setCurrentMove: function (move) {
        this.currentModel.goToMove(move);
    },
    /**
     * Flip board. The only thing this method does is to fire the flipBoard event.
     * @method flipBoard
     * @return undefined
     */
    flipBoard: function () {
        /**
         * flip event. A board is example of a view listening to this event. When it's fired, the board
         * will be flipped
         * @event flip
         */
        this.fireEvent('flip');
    },

    /**
     * Add a move to current model
     * @method addMove
     * @param {Object} move
     * @return undefined
     */
    addMove: function (move) {
        if(this.eventHandler != undefined){
            this.eventHandler.apply(this, ['boardMove', this.currentModel, this, move]);
        }else{
            this.currentModel.appendMove(move);
        }
    },
    gradeMove: function (move, grade) {
        this.currentModel.gradeMove(move, grade);
    },

    gradeCurrentMove: function (grade) {
        var move = this.currentModel.getCurrentMove();
        if (move) {
            this.currentModel.gradeMove(move, grade);
        }
    },

    dialogCommentBefore: function (move) {
        /**
         * Event fired when the Comment before a move dialog should be shown.
         * @event commentBefore
         * @param {chess.model.Game} currentModel
         * @param {Object} move
         */
        this.fireEvent('commentBefore', [this.currentModel, move]);
    },

    dialogCommentAfter: function (move) {
        /**
         * Event fired when the Comment after a move dialog should be shown.
         * @event commentAfter
         * @param {chess.model.Game} currentModel
         * @param {Object} move
         */
        this.fireEvent('commentAfter', [this.currentModel, move]);
    },
    addCommentBefore: function (comment, move) {
        this.currentModel.setCommentBefore(comment, move);
    },
    addCommentAfter: function (comment, move) {
        this.currentModel.setCommentAfter(comment, move);
    },
    /**
     * Go to start of current game
     * @method toStart
     * @return undefined
     */
    toStart: function () {
        this.pauseGame();
        if (!this.isBusy) this.currentModel.toStart();
    },
    /**
     * Go to end of current game
     * @method toEnd
     * @return undefined
     */
    toEnd: function () {
        this.pauseGame();
        if (!this.isBusy) this.currentModel.toEnd();
    },
    /**
     * Go to previous move
     * @method previousMove
     * @return undefined
     */
    previousMove: function () {
        this.pauseGame();
        if (!this.isBusy) this.currentModel.previousMove();
    },
    /**
     * Go to next move
     * @method nextMove
     * @return undefined
     */
    nextMove: function () {
        this.pauseGame();
        if (!this.isBusy) this.currentModel.nextMove();
    },
    /**
     * Start auto play of moves in current game from current position
     * @method playMoves
     * @return undefined
     */
    playMoves: function () {
        if (!this.isBusy) this.currentModel.startAutoPlay();
    },
    /**
     * Pause auto play of moves
     * @method pauseGame
     * @return undefined
     */
    pauseGame: function () {
        this.currentModel.stopAutoPlay();
    },

    getAnimationDuration: function () {
        return this.views.board.animationDuration;
    },

    setBusy: function () {
        this.isBusy = true;
    },

    nextAutoPlayMove: function () {
        this.fireModelEvent('animationComplete', this.currentModel, undefined);
        this.currentModel.nextAutoPlayMove();
        this.isBusy = false;
    },

    selectGame: function (game, pgn) {


        var model;
        if (model = this.getModelFromCache(game)) {
            this.currentModel = model;
            this.currentModel.activate();
        } else {
            this.currentModel = this.getNewModel(game, pgn);
        }
    },

    selectPgn: function (pgn) {
        this.fireEvent('selectPgn', pgn);
    },

    getModelFromCache: function (game) {
        for (var i = 0; i < this.models.length; i++) {
            if (this.models[i].isModelFor(game)) {
                return this.models[i];
            }
        }
        return null;
    },

    getNewModel: function (game, pgn) {
        game = game || {};
        if (pgn) game.pgn = pgn;
        var model = new chess.model.Game(game);

        this.addEventsToModel(model);
        this.models.push(model);

        if (this.models.length > this.modelCacheSize) {
            this.models[0].removeEvents();
            delete this.models[0];

            for (var i = 0; i < this.models.length - 1; i++) {
                this.models[i] = this.models[i + 1];
            }
            this.models.length = this.models.length - 1;
        }
        return model;
    },

    addEventsToModel: function (model) {
        for (var eventName in window.chess.events.game) {
            if (window.chess.events.game.hasOwnProperty(eventName)) {
                if (this.disabledEvents[eventName] === undefined) {
                    model.addEvent(window.chess.events.game[eventName], this.fireModelEvent.bind(this));
                }
            }
        }
    },

    fireModelEvent: function (event, model, param) {
        if (model.getId() == this.currentModel.getId()) {
            if (this.debug) ludo.util.log(event);
            this.fireEvent(event, [model, param]);
            this.modelEventFired(event, model, param);
        }
    },

    modelEventFired: function (event, model) {
        if(this.eventHandler){
            this.eventHandler.apply(this, [event,model, this]);
        }
    },

    /**
     * Return active game
     * @method getCurrentModel
     * @return object chess.model.Game
     */
    getCurrentModel: function () {
        return this.currentModel;
    },

    /**
     * Load random game from current database
     * @method loadRandomGame
     * @return void
     */
    loadRandomGame: function () {
        this.currentModel.loadRandomGameFromFile(this.pgn);
    },

    loadWordPressGameById: function (pgn, id) {
        this.pgn = pgn;
        this.currentModel.loadWordPressGameById(pgn, id);
    },

    loadWordPressGameByIndex: function (pgn, index) {
        this.pgn = pgn;
        this.currentModel.loadWordPressGameById(pgn, index);
    },

    loadNextWordPressGame: function (pgn) {
        if (arguments.length > 0) this.pgn = pgn;
        this.currentModel.loadNextStaticGame(pgn);
    },

    loadGameFromFile: function (index) {

        if (this.pgn) {
            this.currentModel.loadStaticGame(this.pgn, index);
        }
    },

    loadNextGameFromFile: function () {
        if (this.pgn) {
            this.currentModel.loadNextStaticGame(this.pgn);
        }
    },

    loadPreviousGameFromFile: function () {
        if (this.pgn) {
            this.currentModel.loadPreviousStaticGame(this.pgn);
        }
    }
});