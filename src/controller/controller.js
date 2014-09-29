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
    Extends:ludo.controller.Controller,
    models:[],
    applyTo:['chess', 'user.menuItemNewGame', 'user.saveGame', 'user.menuItemSaveGame'],
    currentModel:null,
    modelCacheSize:15,

    databaseId:undefined,
    views:{},
    disabledEvents:{},
    pgn : undefined,

    ludoConfig:function (config) {
        this.parent(config);
        this.databaseId = config.databaseId || this.databaseId;
        this.pgn = config.pgn || this.pgn;

        this.createDefaultViews();
        this.createDefaultModel();
    },

    createDefaultViews:function () {
        new chess.view.dialog.OverwriteMove();
        new chess.view.dialog.Promote();
        new chess.view.dialog.Comment();
        new chess.view.dialog.NewGame();
        new chess.view.dialog.EditGameMetadata();
    },

    createDefaultModel:function () {
        var model = this.getNewModel();
        this.models[0] = model;
        this.currentModel = model;
        model.newGame();
    },

    addView:function (view) {
        // TODO find a better way to relay events from views.
        if (this.views[view.submodule] !== undefined) {
            ludo.util.log('submodule ' + view.submodule + ' already registered in controller');
            return;
        }
        this.views[view.submodule] = view;
        switch (view.submodule) {
            case window.chess.Views.buttonbar.game:
                view.addEvent('play', this.playMoves.bind(this));
                view.addEvent('tostart', this.toStart.bind(this));
                view.addEvent('toend', this.toEnd.bind(this));
                view.addEvent('previous', this.previousMove.bind(this));
                view.addEvent('next', this.nextMove.bind(this));
                view.addEvent('pause', this.pauseGame.bind(this));
                view.addEvent('flip', this.flipBoard.bind(this));
                break;
            case 'list-of-pgn-files':
                view.addEvent('selectPgn', this.selectPgn.bind(this));
                break;
            case 'gameList':
                view.addEvent('selectGame', this.selectGame.bind(this));
                break;
            case 'menuItemSaveGame':
            case 'saveGame':
                view.addEvent('saveGame', function () {
                    this.currentModel.save();
                }.bind(this));
                break;
            case 'dialogNewGame':
                view.addEvent('newGame', function (metadata) {
                    this.currentModel = this.getNewModel({
                        metadata:metadata
                    });
                    this.currentModel.activate();
                }.bind(this));
                break;
            case 'menuItemNewGame':
                view.addEvent('newGame', function () {
					/**
					 * New game dialog event
					 * @event newGameDialog
					 */
                    this.fireEvent('newGameDialog');
                }.bind(this));
                break;
            case 'commandLine':
				view.addEvent('move', this.addMove.bind(this));
				view.addEvent('setPosition', this.setPosition.bind(this));
				view.addEvent('load', this.selectGame.bind(this));
				view.addEvent('flip', this.flipBoard.bind(this));
				view.addEvent('grade', this.gradeCurrentMove.bind(this));
				break;
            case 'board':
                view.addEvent('move', this.addMove.bind(this));
                view.addEvent('animationComplete', this.nextAutoPlayMove.bind(this));
                break;
            case 'notation':
                view.addEvent('setCurrentMove', this.setCurrentMove.bind(this));
                view.addEvent('gradeMove', this.gradeMove.bind(this));
                view.addEvent('commentBefore', this.dialogCommentBefore.bind(this));
                view.addEvent('commentAfter', this.dialogCommentAfter.bind(this));
                break;
            case 'dialogOverwriteMove':
                view.addEvent('overwriteMove', this.overwriteMove.bind(this));
                view.addEvent('newVariation', this.newVariation.bind(this));
                view.addEvent('cancelOverwrite', this.cancelOverwrite.bind(this));
                break;
            case 'dialogPromote':
                view.addEvent('promote', this.addMove.bind(this));
                break;
            case 'buttonTacticHint':
                view.addEvent('showHint', this.showHint.bind(this));
                break;
            case 'buttonTacticSolution':
                view.addEvent('showSolution', this.showSolution.bind(this));
                break;
            case 'buttonNextGame':
                view.addEvent('nextGame', this.loadNextGame.bind(this));
                break;
            case 'buttonPreviousGame':
                view.addEvent('previousGame', this.loadPreviousGame.bind(this));
                break;
            case 'folder.tree':
                view.addEvent('selectDatabase', this.selectDatabase.bind(this));
                break;
            case 'eco.VariationTree':
                view.addEvent('selectMove', this.addMove.bind(this));
                break;
            case 'positionSetup':
                view.addEvent('setPosition', this.setPosition.bind(this));
                break;
            case 'dialogComment':
                view.addEvent('commentBefore', this.addCommentBefore.bind(this));
                view.addEvent('commentAfter', this.addCommentAfter.bind(this));
                break;
        }
    },

	/**
	 * Select a database
	 * @method selectDatabase
	 * @param {Number} database
	 */
    selectDatabase:function (database) {
        this.databaseId = database.id;
		/**
		 * Select database event
		 * @event selectDatabase
		 * @param {Number} database
		 */
        this.fireEvent('selectDatabase', database);
    },
	/**
	 * Load next game in selected database. This method will only work if you have
	 * a grid with list of games. The only thing this method does is to fire the "nextGame"
	 * event which the list of games grid listens to. The grid will go to next game and fire it's
	 * selectGame event
	 * @method loadNextGame
	 * @return undefined
	 */
    loadNextGame:function () {
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
    loadPreviousGame:function () {
        this.fireEvent('previousGame');
    },

    showHint:function () {
        var nextMove = this.currentModel.getNextMove();
        if (nextMove) {
            this.views.board.showHint(nextMove);
        }
    },

    showSolution:function () {
        var nextMove = this.currentModel.getNextMove();
        if (nextMove) {
            this.views.board.showSolution(nextMove);
        }
    },

    setPosition:function (fen) {
        this.currentModel.setPosition(fen);
    },

    overwriteMove:function (oldMove, newMove) {
        this.currentModel.overwriteMove(oldMove, newMove);
    },

    newVariation:function (oldMove, newMove) {
        this.currentModel.setCurrentMove(oldMove);
        this.currentModel.newVariation(newMove);
    },

    cancelOverwrite:function () {
        this.currentModel.resetPosition();
    },

    setCurrentMove:function (move) {
        this.currentModel.goToMove(move);
    },
	/**
	 * Flip board. The only thing this method does is to fire the flipBoard event.
	 * @method flipBoard
	 * @return undefined
	 */
    flipBoard:function () {
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
    addMove:function (move) {
        this.currentModel.appendMove(move);
    },
    gradeMove:function (move, grade) {
        this.currentModel.gradeMove(move, grade);
    },

	gradeCurrentMove:function(grade){
		var move = this.currentModel.getCurrentMove();
		if(move){
			this.currentModel.gradeMove(move, grade);
		}
	},

    dialogCommentBefore:function (move) {
		/**
		 * Event fired when the Comment before a move dialog should be shown.
		 * @event commentBefore
		 * @param {chess.model.Game} currentModel
		 * @param {Object} move
 		 */
        this.fireEvent('commentBefore', [this.currentModel, move]);
    },

    dialogCommentAfter:function (move) {
		/**
		 * Event fired when the Comment after a move dialog should be shown.
		 * @event commentAfter
		 * @param {chess.model.Game} currentModel
		 * @param {Object} move
 		 */
        this.fireEvent('commentAfter', [this.currentModel, move]);
    },
    addCommentBefore:function (comment, move) {
        this.currentModel.setCommentBefore(comment, move);
    },
    addCommentAfter:function (comment, move) {
        this.currentModel.setCommentAfter(comment, move);
    },
	/**
	 * Go to start of current game
	 * @method toStart
	 * @return undefined
	 */
    toStart:function () {
        this.currentModel.toStart();
    },
	/**
	 * Go to end of current game
	 * @method toEnd
	 * @return undefined
	 */
    toEnd:function () {
        this.currentModel.toEnd();
    },
	/**
	 * Go to previous move
	 * @method previousMove
	 * @return undefined
	 */
    previousMove:function () {
        this.currentModel.previousMove();
    },
	/**
	 * Go to next move
	 * @method nextMove
	 * @return undefined
	 */
    nextMove:function () {
        this.currentModel.nextMove();
    },
	/**
	 * Start auto play of moves in current game from current position
	 * @method playMoves
	 * @return undefined
	 */
    playMoves:function () {
        this.currentModel.startAutoPlay();
    },
	/**
	 * Pause auto play of moves
	 * @method pauseGame
	 * @return undefined
	 */
    pauseGame:function () {
        this.currentModel.stopAutoPlay();
    },

    nextAutoPlayMove:function () {
        this.currentModel.nextAutoPlayMove();
    },

    selectGame:function (game, pgn) {
        var model;
        if (model = this.getModelFromCache(game)) {
            this.currentModel = model;
            this.currentModel.activate();
        } else {
            this.currentModel = this.getNewModel(game, pgn);
        }
    },

    selectPgn:function(pgn){
        this.fireEvent('selectPgn', pgn);
    },

    getModelFromCache:function (game) {
        for (var i = 0; i < this.models.length; i++) {
            if(this.models[i].isModelFor(game)){
                return this.models[i];
            }
        }
        return null;
    },

    getNewModel:function (game, pgn) {

        game = game || {};
		if(pgn)game.pgn = pgn;
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

    addEventsToModel:function (model) {
        for (var eventName in window.chess.events.game) {
            if(window.chess.events.game.hasOwnProperty(eventName)){
                if (this.disabledEvents[eventName] === undefined) {
                    model.addEvent(window.chess.events.game[eventName], this.fireModelEvent.bind(this));
                }
            }
        }
    },

    fireModelEvent:function (event, model, param) {
        if (model.getId() == this.currentModel.getId()) {
            ludo.util.log(event);
            this.fireEvent(event, [model, param]);
            this.modelEventFired(event, model, param);
        }
    },

    modelEventFired:function(){

    },

    /**
     * Return active game
     * @method getCurrentModel
     * @return object chess.model.Game
     */
    getCurrentModel:function () {
        return this.currentModel;
    },

    /**
     * Load random game from current database
     * @method loadRandomGame
     * @return void
     */
    loadRandomGame:function () {
        if(this.databaseId){
            this.currentModel.loadRandomGame(this.databaseId);
        }else if(this.pgn){
            this.currentModel.loadRandomGameFromFile(this.pgn);
        }
    },

    loadGameFromFile:function(index){
        if(this.pgn){
            this.currentModel.loadStaticGame(this.pgn, index);
        }
    },

    loadNextGameFromFile:function(){
        if(this.pgn){
            this.currentModel.loadNextStaticGame(this.pgn);
        }
    }
});