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



	INCLUDE_COMMENT_MOVES:1,

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
		this.gameReader.addEvent('load', this.populate.bind(this));
		this.gameReader.addEvent('newMove', this.appendRemoteMove.bind(this));
		this.gameReader.addEvent('saved', this.updateGameFromServer.bind(this));
		this.setDefaultModel();
		if (config.id) {
			this.loadGame(config.id);
		} else {
			this.setDirty();
		}
		if (config.metadata !== undefined) {
			this.setMetadata(config.metadata);
		}

		if (config.databaseId !== undefined)this.databaseId = config.databaseId;
	},

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
	/**
	 * Load a random game from selected database
	 * @method loadRandomGame
	 * @param {Number} databaseId
	 */
	loadRandomGame:function (databaseId) {
		this.gameReader.loadRandomGame(databaseId);
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

	populate:function (gameData) {
		this.setDefaultModel();
		this.model.id = gameData.id || gameData.metadata.id || this.model.id;
		this.model.metadata.fen = gameData.fen || gameData.metadata.fen;
		this.model.result = this.getResult();
		this.model.moves = gameData.moves || [];
		this.model.metadata = gameData.metadata || {};
		this.databaseId = gameData.databaseId;
		this.currentBranch = this.model.moves;
		this.currentMove = null;
		this.registerMoves(this.model.moves, this.model.metadata.fen);
		this.fire('newGame');
		this.toStart();
	},

	getModel:function () {
		return this.model;
	},

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
			move.id = 'move-' + String.uniqueID();
			this.moveCache[move.id] = move;
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

	registerPreviousMap:function (move, previous) {
		this.movePreviousMap[move.id] = previous;
	},

	registerParentMap:function (move, parent) {
		this.moveParentMap[move.id] = parent;
	},

	registerBranchMap:function (move, branch) {
		this.moveBranchMap[move.id] = branch;
	},

	getBranch:function (move) {
		return this.moveBranchMap[move.id];
	},

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
	 @method setMetadata
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
	 * Return all game metadata info
	 * @method getMetadata
	 * @return {Object}
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
	canClaimDraw:function(){
		return this.moveParser.hasThreeFoldRepetition(this.getAllFens());
	},

	/**
	 * Returns array of all FEN's in main line(Not variations)
	 * @method getAllFens
	 * @return {Array}
	 */
	getAllFens:function(){
		var moves = this.getMoves();
		var ret = [];
		for(var i=0;i<moves.length;i++){
			if(moves[i].fen !== undefined)ret.push(moves[i].fen);
		}
		return ret;
	},

	/**
	 * Return last move in game
	 * @method getLastMoveInGame
	 * @return {chess.model.Move} move
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
		if (nextOf.variations.length > 0) {
			for (var i = 0; i < nextOf.variations.length; i++) {
				var move = nextOf.variations[i][0];
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
		if(ludo.util.isString(move)){
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

	overwriteMove:function (oldMove, newMove) {
		var move = this.findMove(oldMove);
		if (move) {
			this.deleteMove(oldMove);
			this.appendMove(newMove);
		}
	},

	getValidMove:function (move, pos) {
		if (this.moveParser.isValid(move, pos)) {
			return this.moveParser.getMoveConfig(move, pos);
		}
		return null;
	},

	/**
	 * Add a new move as a variation. If current move is allready first move in variation it will go to this move
	 * and not create a new variation.
	 * @method newVariation
	 * @param {chess.model.Move} move
	 * @return undefined
	 */
	newVariation:function (move) {
		if (this.isDuplicateVariationMove(move)) {
			this.goToMove(this.getNextMove(this.currentMove));
			return false;
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

	isDuplicateVariationMove:function (move) {
		return this.getDuplicateVariationMove(move) ? true : false;
	},

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
		return null;
	},

	newVariationBranch:function () {
		this.currentMove.variations = this.currentMove.variations || [];
		var variation = [];
		this.currentMove.variations.push(variation);
		this.currentBranch = variation;
	},

	getCurrentPosition:function () {
		if (this.currentMove && this.currentMove.fen) {
			return this.currentMove.fen;
		}
		return this.model.metadata.fen;
	},

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
	 * Delete a move
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
				if (!this.hasMovesInBranch(move)) {
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
		if(parent !== undefined){
			var branch = this.getBranch(move);
			if(branch.length === 0)return true;
			if(move === branch[0])return true;
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
		return this.currentMove && this.currentMove.id == this.model.moves[this.model.moves.length - 1].id;
	},

	hasMovesInBranch:function (branch) {
		if (branch.length === 0) {
			return true;
		}
		for (var i = 0; i < branch.length; i++) {
			if (branch[i].m) {
				return true;
			}
		}
		return false;
	},

	clearMovesInBranch:function (branch, fromIndex) {
		for (var i = fromIndex; i < branch.length; i++) {
			delete this.moveCache[branch[i].id];
		}
		branch.length = fromIndex;
	},

	findMove:function (moveToFind) {
		return this.moveCache[moveToFind.id] ? this.moveCache[moveToFind.id] : null;
	},

	clearCurrentMove:function () {
		this.currentMove = null;
		this.currentBranch = this.model.moves;
		this.fire('clearCurrentMove');
	},

	goToMove:function (move) {
		if (this.setCurrentMove(move)) {
			this.fire('setPosition', move);
		}
	},

	backward:function(numberOfMoves){
		if(!this.currentMove)return;
		numberOfMoves = numberOfMoves || 1;
		var branch = this.currentBranch;
		var index = branch.indexOf(this.currentMove);
		var currentMove;
		while(index >=0 && numberOfMoves>0){
			index--;
			if(index < 0 && numberOfMoves>0){
				var parent = this.getParentMove(move);
				if(parent){
					move = parent;
					branch = this.getBranch(move);
					index = branch.indexOf(move);
					index--;
				}
			}
			if(index >=0){
				var move = branch[index];
				if(this.isChessMove(move)){
					currentMove = move;
					numberOfMoves--;
				}
			}

		}
		if(this.isChessMove(currentMove)){
			return this.setCurrentMove(currentMove);
		}
	},

	getMove:function (move) {
		return this.findMove(move);
	},

	resetPosition:function () {
		if (this.currentMove) {
			this.goToMove(this.currentMove);
		} else {
			this.toStart();
		}
	},

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

	getColorToMove:function () {
		var fens = this.getCurrentPosition().split(' ');
		var colors = {'w':'white', 'b':'black'};
		return colors[fens[1]];
	},

	getCurrentMove:function () {
		return this.currentMove;
	},

	getCurrentBranch:function () {
		return this.getCurrentBranch();
	},

	previousMove:function () {
		var move = this.getPreviousMove(this.currentMove);
		if (move) {
			this.setCurrentMove(move);
			this.fire('setPosition', move);
		} else {
			this.toStart();
		}
	},

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

	toEnd:function () {
		if (this.model.moves.length > 0) {
			this.currentMove = this.model.moves[this.model.moves.length - 1];
			this.fire('setPosition');
			this.fire('endOfBranch');
			this.fire('notStartOfGame');
			this.fire('endOfGame');
		}
	},
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

	hasCurrentMove:function () {
		return this.currentMove ? true : false;
	},

	getFirstMoveInGame:function () {
		for (var i = 0; i < this.model.moves.length; i++) {
			var move = this.model.moves[i];
			if (this.isChessMove(move)) {
				return move;
			}
		}
		return null;
	},

	getParentMove:function (move) {
		move = this.findMove(move);
		if (move) {
			return this.moveParentMap[move.id];
		}
		return undefined;
	},

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

	getPreviousMove:function (move, includeComments) {
		includeComments = includeComments || false;
		move = this.findMove(move);
		if (move) {
			var pr = this.movePreviousMap[move.id];
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
				pr = this.movePreviousMap[move.id];
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
	 * @return {chess.model.Move} next move
	 */
	getNextMove:function (nextOf) {
		if (!nextOf && this.currentMove) {
			nextOf = this.currentMove;
		}
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

	registerMove:function (move, atIndex) {
		move.id = 'move-' + String.uniqueID();
		this.moveCache[move.id] = move;
		this.registerBranchMap(move, this.currentBranch);

		if (atIndex) {
			move.index = atIndex;
			this.createSpaceForAction();
			this.currentBranch[atIndex] = move;
		} else {
			move.index = this.currentBranch.length;
			this.currentBranch.push(move);
		}
		if (this.isChessMove(move)) {
			this.setCurrentMove(move);
		}
	},

	createSpaceForAction:function () {
		var index = this.currentMove.index + 1;
		var newLength = this.currentBranch.length;

		for (var i = newLength; i > index; i--) {
			this.currentBranch[i] = this.currentBranch[i - 1];
			this.currentBranch[i].index++;
		}
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
				this.createEmptySpaceAtStartOfBranch(branch);
				branch[0] = {
					comment:comment,
					index:0,
					id:'move-' + String.uniqueID()
				};
				this.moveCache[move.id] = move;
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

	createEmptySpaceAtStartOfBranch:function (branch) {
		for (var i = branch.length; i >= 1; i--) {
			branch[i] = branch[i - 1];
			branch[i].index++;
		}
	},

	setComment:function (move, comment) {
		move.comment = comment;
		this.fire('updateMove', move);
	},

	isChessMove:function (move) {
		return ((move.from && move.to) || (move.m && move.m == '--')) ? true : false
	},

	fire:function (eventName, param) {
		if (eventName === 'updateMove' || eventName == 'newMove' || eventName == 'updateMetadata') {
			this.setDirty();
		}
		var event = chess.events.game[eventName];
		this.fireEvent(event, [event, this, param]);
	},

	/**
	 * Start autoplay of moves
	 * @method startAutoPlay
	 */
	startAutoPlay:function () {
		this.state.autoplay = true;
		this.fire('startAutoplay');
		this.nextAutoPlayMove();
	},
	/**
	 * Stop autoplay of moves
	 * @method startAutoPlay
	 */
	stopAutoPlay:function () {
		this.state.autoplay = false;
		this.fire('stopAutoplay');
	},

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

	getDatabaseId:function () {
		return this.databaseId;
	},

	setDirty:function () {
		this.dirty = true;
		/**
		 * Event fired when model is changed but not saved
		 * @event dirty
		 * @param {chess.model.Game} this
		 */
		this.fireEvent('dirty', this);
	},

	setClean:function () {
		this.dirty = false;
		/**
		 * Event fired when model is clean, i.e. right after being saved to the server.
		 * @event dirty
		 * @param {chess.model.Game} this
		 */
		this.fireEvent('clean', this);
	},

	isDirty:function () {
		return this.dirty;
	},

	/**
	 * Save model to server
	 * @method save
	 */
	save:function () {
		this.gameReader.save(this.model);
		this.setClean();
	},

	updateGameFromServer:function (data) {
		if (data.id) {
			this.model.id = data.id;
		}
	}
});

