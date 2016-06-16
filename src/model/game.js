/**
 * Chess game model
 * @module Model
 * @namespace chess.model
 * @class Game
 * @uses {chess.parser.Move0x88}
 * @uses {chess.remote.GameReader}
 *
 */
chess.model.Game = new Class({
    Extends:Events,
    /**
     * @attribute {chess.parser.FenParser0x88} moveParser
     */
    moveParser:undefined,
    model:{ },
    currentMove:null,
    currentBranch:[],
    moveCache:{},
    defaultFen:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    gameReader:null,
    dirty:false,

    moveBranchMap:{},
    moveParentMap:{},
    movePreviousMap:{},

    gameIndex : -1,
    countGames:-1,

    INCLUDE_COMMENT_MOVES:true,

    state:{
        autoplay:false
    },

    /**
     * id of initial game to load from server.
     * @config id
     * @type {Number}
     * @default undefined
     * @optional
     */
    id:undefined,

    initialize:function (config) {
        config = config || {};
        this.moveParser = new chess.parser.Move0x88();
        this.gameReader = new chess.remote.GameReader();
        this.gameReader.addEvent('beforeLoad', this.beforeLoad.bind(this));
        this.gameReader.addEvent('load', this.afterLoad.bind(this));
        this.gameReader.addEvent('load', this.populate.bind(this));
        this.gameReader.addEvent('newMove', this.appendRemoteMove.bind(this));
        this.gameReader.addEvent('saved', this.gameSaved.bind(this));
        this.setDefaultModel();

        if (config.id || config.pgn) {
            if (config.pgn) {
                this.loadStaticGame.delay(20, this, [config.pgn, config.gameIndex]);
            } else {
                this.loadGame.delay(20, this, config.id);
            }
        } else {
            this.setDirty();
        }
        if (config.metadata !== undefined) {
            this.setMetadata(config.metadata);
        }

        if (config.databaseId !== undefined)this.databaseId = config.databaseId;
    },


    beforeLoad:function () {
        this.fire('beforeLoad');
    },

    afterLoad:function () {
        this.fire('afterLoad');
    },

    /**
     * Returns game id
     * @method getId
     * @return {String}
     */
    getId:function () {
        return this.model.id;
    },

    /**
     * Load a game from server
     * @method loadGame
     * @param {Number} gameId
     */
    loadGame:function (gameId) {
        this.gameReader.loadGame(gameId);
    },

    loadStaticGame:function (pgn, index) {
        this.gameReader.loadStaticGame(pgn, index);
    },

    loadNextStaticGame:function(pgn){
        if(this.gameIndex == -1)this.gameIndex = 0; else this.gameIndex++;
        this.gameReader.loadStaticGame(pgn, this.gameIndex);
    },

    getGameIndex:function(){
        return this.gameIndex;
    },

    setGameIndex:function(index){
        this.gameIndex = index;
    },

    /**
     * Load a random game from selected database
     * @method loadRandomGame
     * @param {Number} databaseId
     */
    loadRandomGame:function (databaseId) {
        this.gameReader.loadRandomGame(databaseId);
    },

    loadRandomGameFromFile:function (pgnFile) {
        this.gameReader.loadRandomGameFromFile(pgnFile);
    },

    getEngineMove:function () {
        var pos = this.getLastPositionInGame();
        this.gameReader.getEngineMove(pos);
    },

    appendRemoteMove:function (move) {
        this.toEnd();
        this.appendMove(move);
    },

    /**
     * Returns true if this model is model for given game object
     * @method isModelFor
     * @param {Object} game
     */
    isModelFor:function (game) {
        if (game.gameIndex)return game.gameIndex === this.model.gameIndex;
        if (game.id)return game.id === this.model.id;
        return false;
    },

    /**
     * Empty model and reset to standard position
     * @method newGame
     */
    newGame:function () {
        this.setPosition(this.defaultFen);
    },
    /**
     * Activate model. This will fire newGame and setPosition events
     * @method activate
     */
    activate:function () {
        /**
         * new game event. Fired when a new model is created or an old model is activated
         * @event newGame
         * @param {String} eventName
         * @param {chess.model.Game} model
         */
        this.fire('newGame');
        /**
         * Fired when current chess position is changed, example by moving to a different move
         * @event setPosition
         * @param {String} eventName
         * @param {chess.model.Game} model
         */
        this.fire('setPosition');
    },

    /**
     * Create new game from given fen position
     * @method setPosition
     * @param {String} fen
     */
    setPosition:function (fen) {
        this.setDefaultModel();
        this.model.metadata.fen = fen;
        /**
         * Fired when there are no moves in the game
         * @event noMoves
         * @param {String} eventName
         * @param {chess.model.Game} model
         */
        this.fire('noMoves');
        this.fire('newGame');
        this.fire('setPosition');
    },

    /**
     * Populate game model by JSON game object. This method will create a new game.
     * @method populate
     * @param {Object} gameData
     * @private
     */
    populate:function (gameData) {
        this.setDefaultModel();
        gameData = this.getValidGameData(gameData);
        this.model.id = gameData.id || gameData.metadata.id || this.model.id;
        this.model.gameIndex = gameData.gameIndex || undefined;
        this.model.metadata.fen = gameData.fen || gameData.metadata.fen;
        this.model.result = this.getResult();
        this.model.moves = gameData.moves || [];
        this.model.metadata = gameData.metadata || {};
        this.databaseId = gameData.databaseId;
        this.currentBranch = this.model.moves;
        this.currentMove = null;
        this.registerMoves(this.model.moves, this.model.metadata.fen);
        if(gameData.games != undefined){
            this.countGames = gameData.games['c'];
            this.gameIndex = gameData.games['i'];
        }
        this.fire('newGame');
        this.toStart();
    },

    reservedMetadata:["event", "site", "date", "round", "white", "black", "result",
        "annotator", "termination", "fen", "plycount", "database_id", "id"],
    // TODO refactor this to match server
    /**
     * Move metadata into metadata object
     * @method getValidMetadata
     *
     */
    getValidGameData:function (gameData) {
        gameData.metadata = gameData.metadata || {};
        for (var i = 0; i < this.reservedMetadata.length; i++) {
            var key = this.reservedMetadata[i];
            if (gameData[key] !== undefined) {
                gameData.metadata[key] = gameData[key];
                delete gameData[key];
            }
        }

        return gameData;
    },

    /**
     * Return game data
     * @method getModel
     * @return {Object}
     * @private
     */
    getModel:function () {
        return this.model;
    },

    /**
     * Parse and index moves received from the server, i.e. the populate method
     * @method registerMoves
     * @param {Object} moves
     * @param {String} pos
     * @param {chess.model.Move} parent
     * @optional
     * @private
     */
    registerMoves:function (moves, pos, parent) {
        var move;
        moves = moves || [];
        for (var i = 0; i < moves.length; i++) {
            move = moves[i];
            if (this.isChessMove(move)) {
                move = this.getValidMove(move, pos);
                if (move.variations && move.variations.length > 0) {
                    for (var j = 0; j < move.variations.length; j++) {
                        this.registerMoves(move.variations[j], pos, move);
                    }
                }
                pos = move.fen;
            }
            move.uid = 'move-' + String.uniqueID();
            this.moveCache[move.uid] = move;
            move.index = i;
            if (parent) {
                this.registerParentMap(move, parent);
            }
            this.registerBranchMap(move, moves);
            if (i > 0) {
                this.registerPreviousMap(move, moves[i - 1]);
            }
            moves[i] = move;
        }
    },

    /**
     * Store internal reference to previous move
     * @method registerPreviousMap
     * @param {chess.model.Move} move
     * @param {chess.model.Move} previous
     * @private
     */
    registerPreviousMap:function (move, previous) {
        this.movePreviousMap[move.uid] = previous;
    },
    /**
     * Store internal reference to parent move
     * @method registerParentMap
     * @param {chess.model.Move} move
     * @param {chess.model.Move} parent
     * @private
     */
    registerParentMap:function (move, parent) {
        this.moveParentMap[move.uid] = parent;
    },

    /**
     * Store internal link between move and a branch of moves(Main line or variation)
     * @method registerBranchMap
     * @param {chess.model.Move} move
     * @param {Object} branch
     * @private
     */
    registerBranchMap:function (move, branch) {
        this.moveBranchMap[move.uid] = branch;
    },

    /**
     * Return branch/line of current move, i.e. main line or variation
     * @method getBranch
     * @param {chess.model.Move} move
     * @return {Array}
     * @private
     */
    getBranch:function (move) {
        return this.moveBranchMap[move.uid];
    },

    /**
     * Reset model data to default, blank game
     * @method setDefaultModel
     */
    setDefaultModel:function () {
        this.moveCache = {};
        this.model = {
            "id":'temp-id-' + String.uniqueID(),
            "metadata":{
                fen:this.defaultFen
            },
            "moves":[]
        };
        this.currentBranch = this.model.moves;
        this.currentMove = null;

    },

    /**
     Update game information
     @method setMetadata
     @param {Object} metadata
     @example
     model.setMetadata({white:'John','black:'Jane'});
     */
    setMetadata:function (metadata) {
        for (var key in metadata) {
            if (metadata.hasOwnProperty(key)) {
                this.setMetadataValue(key, metadata[key]);
            }
        }
    },
    /**
     Update particular info about the game
     @method setMetadataValue
     @param {String} key
     @param {String} value
     @example
     model.setMetadataValue('white','John');
     */
    setMetadataValue:function (key, value) {
        this.model.metadata[key] = value;
        /**
         * Fired when metadata is updated
         * @event updateMetadata
         * @param {String} eventName
         * @param {chess.model.Game} model
         * @param {Object} metadata, example {key:'white','value':'John'}
         */
        this.fire('updateMetadata', { key:key, value:value});

    },

    /**
     Return all game metadata info
     @method getMetadata
     @return {Object}
     @example
     var m = model.getMetadata();
     returns an object like
     @example
     { "white": "Magnus Carlsen", "black": "Levon Aronian", "Result" : "1-0" }
     */
    getMetadata:function () {
        return this.model.metadata;
    },
    /**
     Return a specific metadata key
     @method getMetadataValue
     @param {String} key
     @return {String} value
     @example
     var whitePlayer = model.getMetadataValue('white');
     */
    getMetadataValue:function (key) {
        return this.model.metadata[key];
    },

    /**
     * Return array of moves in game
     * @method getMoves
     * @return {Array}
     */
    getMoves:function () {
        return this.model.moves || [];
    },

    /**
     * Return start position of game
     * @method getStartPosition
     * @return {String} position
     */
    getStartPosition:function () {
        return this.model.metadata.fen;
    },

    /**
     * Try to guess next move in a game
     @method tryNextMove
     @param {Object} move
     @return {Boolean} correctMove
     @example
     var correctMove = model.tryNextMove({
	 		from:'e7',
	 		to:'e8',
	 		promoteTo:'queen'
	 	});
     */
    tryNextMove:function (move) {
        var pos = this.getCurrentPosition();
        if (!move.promoteTo && this.moveParser.isPromotionMove(move, pos)) {
            this.fire('verifyPromotion', move);
            return true;
        }
        var nextMoves = this.getAllNextMoves(this.currentMove);
        for (var i = 0; i < nextMoves.length; i++) {
            if (this.isCorrectGuess(move, nextMoves[i])) {
                if (nextMoves[i].promoteTo) {
                    move.promoteTo = nextMoves[i].promoteTo;
                }
                this.fire('correctGuess', nextMoves[i]);
                if (i === 0) {
                    this.nextMove();
                } else {
                    this.goToMove(nextMoves[i]);
                }
                return true;
            }
        }
        this.fire('wrongGuess');
        return false;
    },

    /**
     * Returns true if passed guess matches next move
     * @method isCorrectGuess
     * @param {Object} guess
     * @param {Object} nextMove
     * @return {Boolean}
     * @private
     */
    isCorrectGuess:function (guess, nextMove) {
        if (nextMove.from == guess.from && nextMove.to == guess.to) {
            return !(guess.promoteTo && !this.isMovePromotedTo(nextMove, guess.promoteTo));
        }
        return false;
    },

    isMovePromotedTo:function (move, promotedTo) {
        var moves = move.moves;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].promoteTo && moves[i].promoteTo == promotedTo) {
                return true;
            }
        }
        return false;
    },
    /**
     * Return result of game, either from metadata("result") or by trying to calculate final
     * position. Return value will be 1 for white win, -1 for black win. 0.5 for draw and 0 for
     * undecided.
     * @method getResult
     * @return {Number}
     */
    getResult:function () {
        if (this.model.result !== undefined && this.model.result !== 0) {
            return this.model.result;
        }
        var result = this.getMetadataValue('result');
        if (result == '1-0') {
            this.model.result = 1;
            return 1;
        }
        if (result == '0-1') {
            this.model.result = -1;
            return -1;
        }
        var lastMove = this.getLastMoveInGame();
        if (lastMove) {
            var parser = new chess.parser.FenParser0x88();
            parser.setFen(lastMove.fen);
            var moveObj = parser.getValidMovesAndResult();
            this.model.result = moveObj.result;
            return moveObj.result;
        }
        return 0;
    },

    /**
     * Returns true if user can claim draw in current position
     * @method canClaimDraw
     * @return {Boolean} can claim draw
     */
    canClaimDraw:function () {
        return this.moveParser.hasThreeFoldRepetition(this.getAllFens());
    },

    /**
     * Returns array of all FEN's in main line(Not variations)
     * @method getAllFens
     * @return {Array}
     */
    getAllFens:function () {
        var moves = this.getMoves();
        var ret = [];
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].fen !== undefined)ret.push(moves[i].fen);
        }
        return ret;
    },

    /**
     * Return last move in game
     * @method getLastMoveInGame
     * @return {chess.model.Move|undefined} move
     */
    getLastMoveInGame:function () {
        if (this.model.moves.length > 0) {
            return this.model.moves[this.model.moves.length - 1];
        }
        return undefined;
    },

    /**
     * Return last position in game
     * @method getLastPositionInGame
     * @return {String} fen
     */
    getLastPositionInGame:function () {
        if (this.model.moves.length > 0) {

            return this.model.moves[this.model.moves.length - 1].fen;
        }
        return this.model.metadata.fen;
    },

    /**
     * Returns array of remaining moves
     * @method getAllNextMoves
     * @param {chess.model.Move} nextOf
     * @return {Array}
     */
    getAllNextMoves:function (nextOf) {
        nextOf = nextOf || this.currentMove;
        if (!nextOf) {
            return [this.model.moves[0]];
        }
        var ret = [];
        var nextMove = this.getNextMove(nextOf);
        if (nextMove) {
            ret.push(nextMove);
        }
        if (nextMove.variations.length > 0) {
            for (var i = 0; i < nextMove.variations.length; i++) {
                var move = nextMove.variations[i][0];
                ret.push(move);
            }
        }
        return ret;

    },

    /**
     Append move to the model
     @method appendMove
     @param {chess.model.Move|String} move
     @return {Boolean} success
     @example
     var model = new chess.model.Game();
     model.appendMove({ 'from': 'e2', 'to' : 'e4' }); // Using objects
     model.appendMove('e7'); // Using notation
     alert(model.getCurrentPosition());
     */
    appendMove:function (move) {
        var pos = this.getCurrentPosition();
        if (ludo.util.isString(move)) {
            move = this.moveParser.getMoveByNotation(move, pos);
        }
        if (!move.promoteTo && this.moveParser.isPromotionMove(move, pos)) {
            /**
             * verify promotion event. This event is fired when you try to append a promotion move
             * where the promoteTo info is missing
             * @event verifyPromotion
             * @param {String} eventName
             * @param {chess.model.Game} model
             * @param {chess.model.Move} appendedMove
             */
            this.fire('verifyPromotion', move);
            return false;
        }

        var nextMove = this.getNextMove(this.currentMove);
        if (nextMove) {
            if (move.from !== nextMove.from || move.to != nextMove.to) {
                var duplicateVariationMove;
                if (duplicateVariationMove = this.getDuplicateVariationMove(move)) {
                    this.goToMove(duplicateVariationMove);
                    return false;
                }
                if (move = this.getValidMove(move, pos)) {
                    /**
                     Fired when appending a move in the middle of a game. This method sends a message to the controller
                     saying that it needs to know if appended move should be added as variation or if it should overwrite
                     current next move
                     @event overwriteOrVariation
                     @param {String} eventName
                     @param {chess.model.Game} model
                     @param {Object} newMove, nextMove
                     */
                    this.fire('overwriteOrVariation', { newMove:move, oldMove:nextMove });
                    return false;
                }
            } else {
                this.nextMove();
                return false;
            }
        }

        if (move = this.getValidMove(move, pos)) {
            this.registerMove(move);
            /**
             Fired when a new move is appended to the game.
             @event newMove
             @param {String} eventName
             @param {chess.model.Game} model
             @param {chess.model.Move} appendedMove
             */
            this.fire('newMove', move);
            /**
             Fired when current move is last move in branch, either last move in game or last move inside a variation.
             @event endOfBranch
             @param {String} eventName
             @param {chess.model.Game} model
             */
            this.fire('endOfBranch');
            if (this.isAtEndOfGame()) {
                /**
                 Fired when current move is last move in game.
                 @event endOfBranch
                 @param {String} eventName
                 @param {chess.model.Game} model
                 */
                this.fire('endOfGame');
            }
            return true;
        } else {
            /**
             Fired when you try to append an invalid move to the game
             @event endOfBranch
             @param {String} eventName
             @param {chess.model.Game} model
             @param {chess.model.Move} move
             */
            this.fire('invalidMove', move);

            return false;
        }
    },

    /**
     * Overwrite a move with a different move. oldMove has to be a
     * move in the game. When found, this move and all following move will be deleted
     * and the new move will be appended.
     * @method overwriteMove
     * @param {chess.model.Move} oldMove
     * @param {chess.model.Move} newMove
     */
    overwriteMove:function (oldMove, newMove) {
        var move = this.findMove(oldMove);
        if (move) {
            this.deleteMove(oldMove);
            this.appendMove(newMove);
        }
    },

    /**
     * Returns valid chess.model.Move object for a move
     * @method getValidMove
     * @param {Object|chess.model.Move} move
     * @param {String} pos
     * @return {chess.model.Move}
     * @private
     */
    getValidMove:function (move, pos) {
        if (this.moveParser.isValid(move, pos)) {
            return this.moveParser.getMoveConfig(move, pos);
        } else {
            if (window.console != undefined) {
                console.log("Parse error on move");
                console.log(move);
            }
        }
        return null;
    },

    /**
     * Add a new move as a variation. If current move is already first move in variation it will go to this move
     * and not create a new variation. This method will
     * fire the events "newVariation", "newMove" and "endOfBranch" on success.
     * "invalidMove" will be fired on invalid move.
     * @method newVariation
     * @param {chess.model.Move} move
     * @return undefined
     */
    newVariation:function (move) {
        if (this.isDuplicateVariationMove(move)) {
            this.goToMove(this.getNextMove(this.currentMove));
            return undefined;
        }
        var previousPosition = this.getPreviousPosition();
        if (previousPosition) {
            if (move = this.getValidMove(move, previousPosition)) {
                this.newVariationBranch();

                var prMove = this.getPreviousMove(this.currentMove);
                this.registerMove(move);

                this.registerParentMap(move, this.currentMove);
                this.registerPreviousMap(move, prMove);

                /**
                 Fired after creating a new variation
                 @event newVariation
                 @param {String} eventName
                 @param {chess.model.Game} model
                 @param {chess.model.Move} parentMove
                 */
                this.fire('newVariation', this.getParentMove(move));

                this.fire('newMove', move);
                this.fire('endOfBranch');
            } else {
                this.fire('invalidMove', move);
            }
        }
    },

    /**
     * Returns true when trying to create variation and passed move is next move in line
     * @method isDuplicateVariationMove
     * @param {chess.model.Move} move
     * @return {Boolean}
     */
    isDuplicateVariationMove:function (move) {
        return this.getDuplicateVariationMove(move) ? true : false;
    },

    /**
     * Returns true if current move already has a variation starting with given move
     * @method getDuplicateVariationMove
     * @param {chess.model.Move} move
     * @return {chess.model.Move|undefined}
     */
    getDuplicateVariationMove:function (move) {
        var nextMove;
        if (nextMove = this.getNextMove(this.currentMove)) {
            var variations = nextMove.variations;
            for (var i = 0; i < variations.length; i++) {
                var variationMove = variations[i][0];
                if (variationMove.from === move.from && variationMove.to === move.to) {
                    return variationMove;
                }
            }
        }
        return undefined;
    },

    /**
     * Create new variation branch
     * @method newVariationBranch
     * @private
     */
    newVariationBranch:function () {
        this.currentMove.variations = this.currentMove.variations || [];
        var variation = [];
        this.currentMove.variations.push(variation);
        this.currentBranch = variation;
    },

    /**
     * Returns fen of current move or start of game fen
     * @method getCurrentPosition
     * @return {String}
     */
    getCurrentPosition:function () {
        if (this.currentMove && this.currentMove.fen) {
            return this.currentMove.fen;
        }
        return this.model.metadata.fen;
    },

    /**
     * Returns fen of previous move or start of game fen
     * @method getPreviousPosition
     * @return {String}
     */
    getPreviousPosition:function () {
        if (this.currentMove) {
            var previous = this.getPreviousMove(this.currentMove);
            if (previous) {
                return previous.fen;
            } else {
                return this.model.metadata.fen;
            }
        }
        return this.model.metadata.fen;
    },

    /**
     * Delete a move. This method will fire the deleteMove and endOfBranch events. If deleted move is in
     * main line, the endOfGame event will also be fired. The event "noMoves" will be fired if the deleted move
     * is the first move in the game. "deleteVariation" will be fired if the deleted move is the first move
     * in a variation.
     * @method deleteMove
     * @param {chess.model.Move} moveToDelete
     */
    deleteMove:function (moveToDelete) {
        var move = this.findMove(moveToDelete);
        if (move) {
            var previousMove = this.getPreviousMove(move);
            var isLastInVariation = this.isLastMoveInVariation(move);
            this.clearMovesInBranch(this.getBranch(move), move.index);
            if (moveToDelete.action) {
                /**
                 Special event not yet implemented. Supporting for adding info to games such as video links, automatic start and stop
                 of auto play for lecture purpose will be added as actions later.
                 @event deleteAction
                 @param {String} eventName
                 @param {chess.model.Game} model
                 @param {chess.model.Move} move
                 */
                this.fire('deleteAction', move);
            } else {
                /**
                 Fired when a move is deleted. It will only be fired for one move and not the following moves which of course
                 also will be deleted.
                 @event deleteMove
                 @param {String} eventName
                 @param {chess.model.Game} model
                 @param {chess.model.Move} deleted move
                 */
                this.fire('deleteMove', move);
                this.fire('endOfBranch');
                if (this.isAtEndOfGame()) {
                    this.fire('endOfGame');
                } else {
                    /**
                     Fired when going to a move which is not last move in game
                     @event notEndOfGame
                     @param {String} eventName
                     @param {chess.model.Game} model
                     */
                    this.fire('notEndOfGame');
                }
                if (!this.hasMovesInBranch(this.getBranch(move))) {
                    this.fire('noMoves');
                }
                if (previousMove) {
                    this.setCurrentMove(previousMove);
                } else {
                    this.clearCurrentMove();
                }
                if (isLastInVariation) {
                    this.fire('deleteVariation', move);
                }
            }
        }
    },

    /**
     * true if given move is last move in current variation, i.e. the variation active on the board
     * @method isLastMoveInVariation
     * @param {chess.model.Move} move
     * @return {Boolean}
     */
    isLastMoveInVariation:function (move) {
        var parent = this.getParentMove(move);
        if (parent !== undefined) {
            var branch = this.getBranch(move);
            if (branch.length === 0)return true;
            if (move === branch[0])return true;
        }
        return false;
    },

    /**
     * true if move displayed on board, i.e. current model move is last move in game.
     * @method isAtEndOfGame
     * @return {Boolean}
     */
    isAtEndOfGame:function () {
        if (this.model.moves.length === 0) {
            return true;
        }
        return this.currentMove && this.currentMove.uid == this.model.moves[this.model.moves.length - 1].uid;
    },

    /**
     * Returns true if there are moves left in branch
     * @method hasMovesInBranch
     * @param {Array} branch
     * @return {Boolean}
     * @private
     */
    hasMovesInBranch:function (branch) {
        if (branch.length === 0) {
            return false;
        }
        for (var i = 0; i < branch.length; i++) {
            if (branch[i].m) {
                return true;
            }
        }
        return false;
    },

    /**
     * Delete moves from branch, i.e. main line or variation
     * @method clearMovesInBranch
     * @param {Array} branch
     * @param {Number} fromIndex
     * @private
     */
    clearMovesInBranch:function (branch, fromIndex) {
        for (var i = fromIndex; i < branch.length; i++) {
            delete this.moveCache[branch[i].uid];
        }
        branch.length = fromIndex;
    },

    /**
     * @method findMove
     * @param {chess.model.Move} moveToFind
     * @return {chess.model.Move}
     */
    findMove:function (moveToFind) {
        return this.moveCache[moveToFind.uid] ? this.moveCache[moveToFind.uid] : null;
    },

    /**
     * Delete current move reference. This method is called when creating a new game and when first
     * move in the game is deleted
     * @method clearCurrentMove
     * @private
     */
    clearCurrentMove:function () {
        this.currentMove = null;
        this.currentBranch = this.model.moves;
        this.fire('clearCurrentMove');
    },

    /**
     * Go to a specific move.
     * @method goToMove
     * @param {chess.model.Move} move
     */
    goToMove:function (move) {
        if (this.setCurrentMove(move)) {
            this.fire('setPosition', move);
        }
    },

    /**
     * Back up x number of moves
     * @method back
     * @param {Number} numberOfMoves
     * @return {Boolean}
     */
    back:function (numberOfMoves) {
        if (!this.currentMove)return undefined;
        numberOfMoves = numberOfMoves || 1;
        var branch = this.currentBranch;
        var index = branch.indexOf(this.currentMove);
        var currentMove;
        var move = {};
        var parent;
        while (index >= 0 && numberOfMoves > 0) {
            index--;
            if (index < 0 && numberOfMoves > 0) {
                parent = this.getParentMove(move);
                if (parent) {
                    move = parent;
                    branch = this.getBranch(move);
                    index = branch.indexOf(move);
                    index--;
                }
            }
            if (index >= 0) {
                move = branch[index];
                if (this.isChessMove(move)) {
                    currentMove = move;
                    numberOfMoves--;
                }
            }

        }
        if (this.isChessMove(currentMove)) {
            return this.setCurrentMove(currentMove);
        }
        return false;
    },

    getMove:function (move) {
        return this.findMove(move);
    },

    /**
     * Call goToMove for current move and trigger the events. This method is called when
     * overwrite of move is cancelled from game editor and when you're guessing the wrong move
     * in a tactic puzzle
     * @method resetPosition
     */
    resetPosition:function () {
        if (this.currentMove) {
            this.goToMove(this.currentMove);
        } else {
            this.toStart();
        }
    },
    /**
     * @method setCurrentMove
     * @param {chess.model.Move} newCurrentMove
     * @return {Boolean} success
     * @private
     */
    setCurrentMove:function (newCurrentMove) {
        var move = this.findMove(newCurrentMove);
        if (move) {
            this.currentMove = move;
            this.currentBranch = this.getBranch(move);
            this.fire('notStartOfGame');
            if (this.getNextMove(move)) {
                this.fire('notEndOfBranch');
                this.fire('notEndOfGame');
            } else {
                this.fire('endOfBranch');
                if (this.isAtEndOfGame()) {
                    this.fire('endOfGame');
                }
            }

            return true;
        }
        return false;
    },

    /**
     * Return color to move, "white" or "black"
     * @method getColorToMove
     * @return {String}
     */
    getColorToMove:function () {
        var fens = this.getCurrentPosition().split(' ');
        var colors = {'w':'white', 'b':'black'};
        return colors[fens[1]];
    },

    /**
     * Returns current move, i.e. last played move
     * @method getCurrentMove
     * @return {chess.model.Move}
     */
    getCurrentMove:function () {
        return this.currentMove;
    },

    /**
     * Return branch, i.e. main line or variation of current move
     * @method getCurrentBranch
     * @return {Array}
     */
    getCurrentBranch:function () {
        return this.getCurrentBranch();
    },

    /**
     * Go to previous move
     * @method previousMove
     */
    previousMove:function () {
        var move = this.getPreviousMove(this.currentMove);
        if (move) {
            this.setCurrentMove(move);
            this.fire('setPosition', move);
        } else {
            this.toStart();
        }
    },

    /**
     * Go to next move
     * @method nextMove
     */
    nextMove:function () {
        var move;
        if (this.hasCurrentMove()) {
            move = this.getNextMove(this.currentMove);
        } else {
            move = this.getFirstMoveInGame();
        }
        if (move) {
            this.setCurrentMove(move);
            this.fire('nextmove', move);
        }
    },

    /**
     * Go to start of game
     * @method toStart
     */
    toStart:function () {
        this.fire('startOfGame');
        this.clearCurrentMove();
        this.fire('setPosition');
        if (this.model.moves.length > 0) {
            this.fire('notEndOfBranch');
            this.fire('notEndOfGame');
        } else {
            this.fire('endOfBranch');
            this.fire('endOfGame');
        }
    },

    /**
     * Go to last move in game
     * @method toEnd
     */
    toEnd:function () {
        if (this.model.moves.length > 0) {
            this.currentMove = this.model.moves[this.model.moves.length - 1];
            this.fire('setPosition');
            this.fire('endOfBranch');
            this.fire('notStartOfGame');
            this.fire('endOfGame');
        }
    },
    /**
     * Go to last move in current branch, i.e. main line or variation
     * @method toEndOfCurrentBranch
     */
    toEndOfCurrentBranch:function () {
        if (this.currentBranch.length > 0) {
            this.currentMove = this.currentBranch[this.currentBranch.length - 1];
            this.fire('setPosition');
            this.fire('endOfBranch');
            this.fire('notStartOfGame');
            if (this.isAtEndOfGame()) {
                this.fire('endOfGame');
            }
        }
    },

    /**
     * Returns rue if current move is set
     * @method hasCurrentMove
     * @return {Boolean}
     */
    hasCurrentMove:function () {
        return this.currentMove ? true : false;
    },

    /**
     * Return first move in game
     * @method getFirstMoveInGame
     * @return {chess.model.Move}
     */
    getFirstMoveInGame:function () {
        for (var i = 0; i < this.model.moves.length; i++) {
            var move = this.model.moves[i];
            if (this.isChessMove(move)) {
                return move;
            }
        }
        return null;
    },

    /**
     * Return parent move of given move, i.e. parent move of a move in a variation.
     * @method getParentMove
     * @param {chess.model.Move|Object} move
     * @return {chess.model.Move|undefined}
     */
    getParentMove:function (move) {
        move = this.findMove(move);
        if (move) {
            return this.moveParentMap[move.uid];
        }
        return undefined;
    },

    /**
     * Returns previous move in same branch/line or undefined
     * @method getPreviousMoveInBranch
     * @param {chess.model.Move} move
     * @return {chess.model.Move|undefined}
     * @private
     */
    getPreviousMoveInBranch:function (move) {
        if (move.index > 0) {
            var index = move.index - 1;
            var branch = this.getBranch(move);
            var previousMove = branch[index];

            while (!this.isChessMove(previousMove) && index > 0) {
                index--;
                previousMove = branch[index];
            }
            if (this.isChessMove(previousMove)) {
                return previousMove;
            }

        }
        return null;
    },

    /**
     * Returns previous move in same branch or parent branch
     * @method getPreviousMove
     * @param {chess.model.Move} move
     * @param {Boolean} includeComments
     * @optional
     * @return {chess.model.Move|undefined}
     */
    getPreviousMove:function (move, includeComments) {
        includeComments = includeComments || false;
        move = this.findMove(move);
        if (move) {
            var pr = this.movePreviousMap[move.uid];
            if (pr) {
                if (includeComments && pr.comment) {
                    return pr;
                }
                if (!pr.from) {
                    return this.getPreviousMove(pr);
                }
                return pr;
            }
            if (move.index > 0) {
                var branch = this.getBranch(move);
                var previousMove = branch[move.index - 1];
                pr = this.movePreviousMap[move.uid];
                if (includeComments && pr && pr.comment) {
                    return pr;
                }
                if (!previousMove.from && !includeComments) {
                    return this.getPreviousMove(previousMove);
                }
                return branch[move.index - 1];
            }
            var parent = this.getParentMove(move);
            if (parent) {
                return this.getPreviousMove(parent);
            }
        }
        return undefined;
    },

    /**
     * Get next move of
     * @method getNextMove
     * @param {chess.model.Move} nextOf
     * @return {chess.model.Move|undefined} next move
     */
    getNextMove:function (nextOf) {
        nextOf = nextOf || this.currentMove;
        if (!nextOf) {
            if (!this.currentMove && this.model.moves.length > 0) {
                nextOf = this.model.moves[0];
                if (!this.isChessMove(nextOf)) {
                    return this.getNextMove(nextOf);
                }
                return this.model.moves[0];
            }
            return null;
        }
        nextOf = this.findMove(nextOf);
        if (nextOf) {
            var branch = this.getBranch(nextOf);
            if (nextOf.index < branch.length - 1) {
                return branch[nextOf.index + 1];
            }
        }
        return undefined;
    },

    /**
     * Add action as a move. Actions are not fully implemented. When implemented, it will add supports for
     * interactive chess games, example: start and stop autoplay. Display comments, videos or audio etc.
     * @method addAction
     * @param {chess.model.Move} action
     */
    addAction:function (action) {
        action = Object.clone(action);
        if (this.currentMove) {
            var index = this.currentMove.index + 1;
            this.registerMove(action, index);
        } else {
            this.registerMove(action);
        }
        this.fire('newaction');
    },

    /**
     Grade a move
     @method gradeMove
     @param move
     @param grade
     @example
     model.gradeMove(model.getCurrentMove(), '!');
     ...
     ...
     model.gradeMove(model.getCurrentMove(), '??');
     */
    gradeMove:function (move, grade) {
        move = this.findMove(move);
        if (move) {
            move.m = move.m.replace(/[!\?]/g, '');
            move.lm = move.lm.replace(/[!\?]/g, '');
            grade = grade.replace(/[^!\?]/g, '');
            if (grade || grade == '') {
                move.m = move.m + grade;
                move.lm = move.lm + grade;
                this.fire('updateMove', move);
            }
        }
    },

    /**
     * Internally index a move
     * @method registerMove
     * @param {chess.model.Move} move
     * @param {Number} atIndex
     * @optional
     * @private
     */
    registerMove:function (move, atIndex) {
        move.uid = 'move-' + String.uniqueID();
        this.moveCache[move.uid] = move;
        this.registerBranchMap(move, this.currentBranch);

        if (atIndex) {
            move.index = atIndex;
            this.insertSpacerInBranch(this.currentBranch, atIndex);
            // this.createSpaceForAction();
            this.currentBranch[atIndex] = move;
        } else {
            move.index = this.currentBranch.length;
            this.currentBranch.push(move);
        }
        if (this.isChessMove(move)) {
            this.setCurrentMove(move);
        }
    },

    /**
     * Insert space for new move in a branch at index
     * @method insertSpacerInBranch
     * @param {Array} branch
     * @param {Number} atIndex
     */
    insertSpacerInBranch:function (branch, atIndex) {
        atIndex = atIndex || 0;

        for (var i = atIndex; i < branch.length; i++) {
            branch[i].index++;
        }
        branch.splice(atIndex, 0, "");

    },


    /**
     * Return comment before move, i.e. get comment of previous move
     * @method getCommentBefore
     * @param {chess.model.Move} move
     * @return {String} comment
     */
    getCommentBefore:function (move) {
        move = this.findMove(move);
        if (move) {
            var previousMove;
            if (previousMove = this.getPreviousMove(move, this.INCLUDE_COMMENT_MOVES)) {
                return previousMove.comment ? previousMove.comment : '';
            }
        }
        return '';
    },
    /**
     * Get comment of current move
     * @method getCommentAfter
     * @param {chess.model.Move} move
     * @return {String} comment
     */
    getCommentAfter:function (move) {
        move = this.findMove(move);
        if (move) {
            return move.comment ? move.comment : '';
        }
        return '';
    },

    /**
     * Set comment before a move, i.e. set comment of previous move, or in case of first move in game, set "commment" attribute of
     * game metadata.
     * @method setCommentBefore
     * @param {String} comment
     * @param {chess.model.Move} move
     */
    setCommentBefore:function (comment, move) {
        move = this.findMove(move);
        if (move) {
            var previousMove = this.getPreviousMove(move, this.INCLUDE_COMMENT_MOVES);
            if (previousMove) {
                this.setComment(previousMove, comment);
            } else {
                move = this.findMove(move);
                var branch = this.getBranch(move);
                this.insertSpacerInBranch(branch, 0);
                branch[0] = {
                    comment:comment,
                    index:0,
                    uid:'move-' + String.uniqueID()
                };
                this.moveCache[move.uid] = move;
                this.registerPreviousMap(move, branch[0]);
                this.fire('updateMove', branch[0]);
            }
        }
    },
    /**
     * Set comment after a move
     * @method setCommentAfter
     * @param {String} comment
     * @param {chess.model.Move} move
     */
    setCommentAfter:function (comment, move) {
        move = this.findMove(move);
        if (move) {
            this.setComment(move, comment);
        }
    },

    /**
     * Set comment property of a move
     * @method setComment
     * @param {chess.model.Move} move
     * @param {String} comment
     */
    setComment:function (move, comment) {
        move.comment = comment;
        this.fire('updateMove', move);
    },

    /**
     * Returns true if passed move is a valid chess move
     * @method isChessMove
     * @param {Object} move
     * @return {Boolean}
     * @private
     */
    isChessMove:function (move) {
        return ((move.from && move.to) || (move.m && move.m == '--')) ? true : false
    },

    /**
     * @method fire
     * @param {String} eventName
     * @param {Object|chess.model.Move} param
     * @optional
     * @private
     */
    fire:function (eventName, param) {
        if (eventName === 'updateMove' || eventName == 'newMove' || eventName == 'updateMetadata') {
            this.setDirty();
        }
        var event = chess.events.game[eventName] || eventName;
        this.fireEvent(event, [event, this, param]);
    },

    /**
     * Start auto play of moves
     * @method startAutoPlay
     */
    startAutoPlay:function () {
        this.state.autoplay = true;
        this.fire('startAutoplay');
        this.nextAutoPlayMove();
    },
    /**
     * Stop auto play of moves
     * @method startAutoPlay
     */
    stopAutoPlay:function () {
        this.state.autoplay = false;
        this.fire('stopAutoplay');
    },

    /**
     * Auto play next move
     * @method nextAutoPlayMove
     * @private
     */
    nextAutoPlayMove:function () {
        if (this.state.autoplay) {
            var nextMove = this.getNextMove(this.currentMove);
            if (nextMove) {
                this.nextMove.delay(1000, this);
            } else {
                this.stopAutoPlay();
            }
        }
    },

    /**
     * Returns true if in auto play mode
     * @method isInAutoPlayMode
     * @return {Boolean}
     */
    isInAutoPlayMode:function () {
        return this.state.autoplay;
    },

    /**
     * Return database id of game
     * @method getDatabaseId
     * @return {Number}
     */
    getDatabaseId:function () {
        return this.databaseId;
    },

    /**
     * Set dirty flag to true, i.e. game has been changed but not saved.
     * @method setDirty
     * @private
     */
    setDirty:function () {
        this.dirty = true;
        /**
         * Event fired when model is changed but not saved
         * @event dirty
         * @param {chess.model.Game} this
         */
        this.fireEvent('dirty', this);
    },
    /**
     * Set dirty flag to false, i.e. game has been changed and saved
     * @method setClean
     * @private
     */
    setClean:function () {
        this.dirty = false;
        /**
         * Event fired when model is clean, i.e. right after being saved to the server.
         * @event dirty
         * @param {chess.model.Game} this
         */
        this.fireEvent('clean', this);
    },

    /**
     * Return dirty flag. dirty flag is set to true when game has been changed, but not saved.
     * @method isDirty
     * @return {Boolean}
     */
    isDirty:function () {
        return this.dirty;
    },

    /**
     * Save model to server
     * @method save
     */
    save:function () {
        this.gameReader.save(this.toValidServerModel(this.toValidServerModel(this.model)));
        this.setClean();
    },
    /**
     * Convert to valid server model, i.e. reserved metadata moved from metadata object
     * @method toValidServerModel
     * @param {Object} gameData
     * @return {Object}
     * @private
     */
    toValidServerModel:function (gameData) {
        gameData = Object.clone(gameData);
        gameData.metadata = gameData.metadata || {};
        for (var i = 0; i < this.reservedMetadata.length; i++) {
            var key = this.reservedMetadata[i];
            if (gameData.metadata[key] !== undefined) {
                gameData[key] = gameData.metadata[key];
                delete gameData.metadata[key];
            }
        }
        return gameData;
    },

    /**
     * Receive game update from server
     * @method gameSaved
     * @param {Object} data
     * @private
     */
    gameSaved:function (data) {
        new ludo.Notification({
            html:chess.getPhrase('Game saved successfully'),
            duration:1,
            effectDuration:.5
        });
        if (data.id) {
            this.model.id = data.id;
        }
        this.fire('gameSaved', this.model);
    },

    getMobility:function () {
        return this.moveParser.getMobility(this.getCurrentPosition());
    }
});

