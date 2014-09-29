/**
 Chess game controller for tactic puzzles, i.e. boards where you make a move
 in a a game and the next move is auto played.
 @namespace chess.controller
 @class TacticController
 @extends chess.controller.Controller
 @constructor
 @param {Object} config
 @example
	 var controller = new chess.controller.TacticController({
		 databaseId:4,
		 alwaysPlayStartingColor:true
	 });
	 controller.loadRandomGame();
 */
chess.controller.TacticController = new Class({
	Extends:chess.controller.Controller,
    /**
     * Delay before playing opponents piece in milliseconds
     * @config autoMoveDelay
     * @type {Number}
     * @default 200
     */
    autoMoveDelay : 200,
	disabledEvents:{
		overwriteOrVariation:1
	},
	dialog:{

	},
	/**
	 * True to always play starting color in game. Otherwise, you will play black
	 * if black is the winning color and white if white is the winning color. If
	 * no winner is registered in the game(result or by calculating final position),
	 * you will play white
	 * @config alwaysPlayStartingColor
	 * @type {Boolean}
	 * @default false
	 */
	alwaysPlayStartingColor:false,
	startingColor:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		this.dialog.puzzleComplete = this.getDialogPuzzleComplete();
		if (config.alwaysPlayStartingColor !== undefined) {
			this.alwaysPlayStartingColor = config.alwaysPlayStartingColor;
		}
        if(config.autoMoveDelay != undefined)this.autoMoveDelay = config.autoMoveDelay;
	},

	addViewFeatures:function () {

	},

	addMove:function (move) {
		this.currentModel.tryNextMove(move);
	},
	modelEventFired:function (event, model) {
		var colorToMove, result;
		if (event === 'newGame') {
			if (this.alwaysPlayStartingColor) {
				colorToMove = this.startingColor = model.getColorToMove();
				if (colorToMove === 'black') {
					this.views.board.flipToBlack();
				} else {
					this.views.board.flipToWhite();
				}
			} else {
				result = model.getResult();
				if (result === -1) {
					this.views.board.flipToBlack();
				} else {
					this.views.board.flipToWhite();
				}
			}

		}
		if (event === 'setPosition' || event === 'nextmove') {
			colorToMove = model.getColorToMove();
			if (this.alwaysPlayStartingColor) {
				if (colorToMove == this.startingColor) {
					this.views.board.enableDragAndDrop(model);
				} else {
					model.nextMove.delay(this.autoMoveDelay, model);
				}

			} else {
				result = model.getResult();
				if (this.shouldAutoPlayNextMove(colorToMove, result)) {
					model.nextMove.delay(this.autoMoveDelay, model);
				}
				if ((result >= 0 && colorToMove === 'white') || (result === -1 && colorToMove == 'black')) {
					this.views.board.enableDragAndDrop(model);
				}
			}
		}
		if (event === 'wrongGuess') {
			model.resetPosition.delay(200, model);
		}
	},

	shouldAutoPlayNextMove:function (colorToMove, result) {
		if (result >= 0 && colorToMove === 'black') {
			return true;
		}
		return (result == -1 && colorToMove == 'white');
	}
});