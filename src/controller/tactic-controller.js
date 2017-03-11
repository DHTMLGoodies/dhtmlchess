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
    Extends: chess.controller.Controller,
    /**
     * Delay before playing opponents piece in milliseconds
     * @config autoMoveDelay
     * @type {Number}
     * @default 200
     */
    autoMoveDelay: 200,
    disabledEvents: {
        overwriteOrVariation: 1
    },
    dialog: {},
    /**
     * True to always play starting color in game. Otherwise, you will play black
     * if black is the winning color and white if white is the winning color. If
     * no winner is registered in the game(result or by calculating final position),
     * you will play white
     * @config alwaysPlayStartingColor
     * @type {Boolean}
     * @default false
     */
    alwaysPlayStartingColor: false,
    startingColor: undefined,
    myColor: 'white',

    __construct: function (config) {
        this.parent(config);
        if (!config.noDialogs)this.dialog.puzzleComplete = this.getDialogPuzzleComplete();
        if (config.alwaysPlayStartingColor !== undefined) {
            this.alwaysPlayStartingColor = config.alwaysPlayStartingColor;
        }
        if (config.autoMoveDelay != undefined)this.autoMoveDelay = config.autoMoveDelay;
        if(config.gameEndHandler != undefined)this.gameEndHandler = config.gameEndHandler;
    },

    getDialogPuzzleComplete: function () {

        var c = {
            autoRemove: false,
            layout: {
                centerIn: this.views.board
            },
            hidden: true,
            listeners: {
                'ok': function () {
                    if (this.gameEndHandler != undefined) {
                        this.gameEndHandler.apply(this, [this]);
                    } else {
                        this.loadRandomGame();
                    }
                }.bind(this)
            }
        };

        if (this.theme['chess.view.dialog.PuzzleSolved'] != undefined) {
            c = Object.merge(c, this.theme['chess.view.dialog.PuzzleSolved']);

        }
        return new chess.view.dialog.PuzzleSolved(c);
    },

    addViewFeatures: function () {

    },

    addMove: function (move) {
        this.currentModel.tryNextMove(move);
    },
    modelEventFired: function (event, model) {
        var colorToMove, result;
        var m = this.currentModel.getMoves();

        if (m.length == 0)return;

        if (event === 'newGame') {
            var c;
            result = model.getResult();
            if (this.alwaysPlayStartingColor) {
                c = model.getColorToMove();
            } else if (result != 0) {
                c = result == -1 ? 'black' : 'white';
            } else {
                var r = m.length == 1 ? 0 : Math.random();
                if (r > 0.5) {
                    c = 'black';
                } else {
                    c = 'white';
                }
            }

            if (c == 'white') {
                this.views.board.flipToWhite();
            } else {
                this.views.board.flipToBlack();
            }
            this.myColor = c;

        }
        if (event === 'setPosition' || event === 'nextmove') {
            colorToMove = model.getColorToMove();

            if (colorToMove == this.myColor) {
                this.views.board.enableDragAndDrop(model);
            } else {
                model.nextMove.delay(this.autoMoveDelay, model);
            }
        }
        if (event === 'wrongGuess') {
            model.resetPosition.delay(200, model);
        }
    },

    shouldAutoPlayNextMove: function (colorToMove, result) {
        return colorToMove != this.myColor;
    }
});