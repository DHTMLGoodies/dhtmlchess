/**
 Chess position parser
 @module Parser
 @namespace chess.parser
 @class FenParser0x88
 @constructor
 @param {String} fen
 @example
 	var parser = new chess.parser.FenParser0x88('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
 	console.log(parser.getValidMovesAndResult('white'));

 */
chess.parser.FenParser0x88 = new Class({
	initialize:function (fen) {
		if (fen) {
			this.setFen(fen);
		}
	},

	/**
	 * Set a new position
	 * @method setFen
	 * @param {String} fen
	 */
	setFen:function (fen) {
		this.cache = {
			'board':[],
			'white':[],
			'black':[],
			'whiteSliding':[],
			'blackSliding':[],
			'king':{ 'white':undefined, 'black':'undefined'}
		};
		this.fen = fen;
		this.updateFenArray(fen);
		this.parseFen();
	},

	updateFenArray:function () {
		var fenParts = this.fen.split(' ');

		var castleCode = 0;
		for (var i = 0; i < fenParts[2].length; i++) {
			castleCode += Board0x88Config.castle[fenParts[2].substr(i, 1)];
		}

		this.fenParts = {
			'pieces':fenParts[0],
			'color':fenParts[1],
			'castle':fenParts[2],
			'castleCode':castleCode,
			'enPassant':fenParts[3],
			'halfMoves':fenParts[4],
			'fullMoves':fenParts[5]
		};
	},

	parseFen:function () {
		var pos = 0;

		var squares = Board0x88Config.fenSquares;

		for (var i = 0, len = this.fenParts['pieces'].length; i < len; i++) {
			var token = this.fenParts['pieces'].substr(i, 1);

			if (Board0x88Config.fenPieces[token]) {

				var index = Board0x88Config.mapping[squares[pos]];
				var type = Board0x88Config.pieces[token];
				var piece = {
					t:type,
					s:index
				};
				// Board array
				this.cache['board'][index] = type;

				// White and black array
				this.cache[Board0x88Config.colorMapping[token]].push(piece);

				// King array
				if (Board0x88Config.typeMapping[type] == 'king') {
					this.cache['king' + (piece.t & 0x8 ? 'black' : 'white')] = piece;
				}
				pos++;
			} else if (i < len - 1 && Board0x88Config.numbers[token]) {
				var token2 = this.fenParts['pieces'].substr(i + 1, 1);
				if (token2.match(/[0-9]/)) {
					token = token + '' + token2;
				}
				pos += parseInt(token);
			}
		}

	},

	getPieces:function () {
		return this.cache['white'].append(this.cache['black']);
	},

	getKing:function (color) {
		return this.cache['king' + color];
	},

	getPiecesOfAColor:function (color) {
		return this.cache[color]
	},

	getEnPassantSquare:function () {
		var enPassant = this.fenParts['enPassant'];
		if (enPassant != '-') {
			return enPassant;
		}
		return null;
	},
	setEnPassantSquare:function (square) {
		this.fenParts['enPassant'] = square;
	},

	getSlidingPieces:function (color) {
		return this.cache[color + 'Sliding'];
	},

	getHalfMoves:function () {
		return this.fenParts['halfMoves'];
	},

	getFullMoves:function () {
		return this.fenParts['fullMoves'];
	},

	canCastleKingSide:function (color) {
		var code = color === 'white' ? Board0x88Config.castle['K'] : Board0x88Config.castle['k'];
		return this.fenParts.castleCode & code;
	},

	canCastleQueenSide:function (color) {
		var code = color === 'white' ? Board0x88Config.castle['Q'] : Board0x88Config.castle['q'];
		return this.fenParts.castleCode & code;
	},

	getColor:function () {
		return Board0x88Config.colorAbbreviations[this.fenParts['color']];
	},

	getColorCode:function () {
		return this.fenParts['color'];
	},

	getPieceOnSquare:function (square) {
		var piece = this.cache['board'][square];
		if (piece) {
			return {
				square:Board0x88Config.numberToSquareMapping[square],
				type:Board0x88Config.typeMapping[piece],
				color:piece & 0x8 ? 'black' : 'white',
				sliding:piece & 0x4
			}
		}
		return null;
	},

	getPieceTypeOnSquare:function (square) {
		return this.cache['board'][square];
	},
	/**
	 * Returns true if two squares are on the same rank. Squares are in the 0x88 format, i.e.
	 * a1=0,a2=16. You can use Board0x88Config.mapping to get a more readable code.
	 @method isOnSameRank
	 @param {Number} square1
	 @param {Number} square2
	 @return {Boolean}
	 */
	isOnSameRank:function (square1, square2) {
		return (square1 & 240) === (square2 & 240);
	},

	/**
	 * Returns true if two squares are on the same file. Squares are in the 0x88 format, i.e.
	 * a1=0,a2=16. You can use Board0x88Config.mapping to get a more readable code.
	 @method isOnSameFile
	 @param {Number} square1
	 @param {Number} square2
	 @return {Boolean}
	 */
	isOnSameFile:function (square1, square2) {
		return (square1 & 15) === (square2 & 15);
	},

	/**
	 * Returns valid moves and results for the position according to the 0x88 chess programming
	 * algorithm where position on the board is numeric (A1=0,H1=7,A2=16,H2=23,A3=32,A4=48).
	 * First rank is numbered 0-7. Second rank starts at first rank + 16, i.e. A2 = 16. Third
	 * rank starts at second rank + 16, i.e. A3 = 32 and so on.
	 * @method getValidMovesAndResult
	 * @param color
	 * @return {Object}
	 */
	getValidMovesAndResult:function (color) {
		if (!color) {
			color = this.getColor();
		}
		var ret = {}, directions;
		var enPassantSquare = this.getEnPassantSquare();
		if (enPassantSquare) {
			enPassantSquare = Board0x88Config.mapping[enPassantSquare];
		}

		var kingSideCastle = this.canCastleKingSide(color);
		var queenSideCastle = this.canCastleQueenSide(color);
		var oppositeColor = color === 'white' ? 'black' : 'white';

		var WHITE = color === 'white';

		var protectiveMoves = this.getCaptureAndProtectiveMoves(oppositeColor);
		var checks;
		checks = this.getCountChecks(color, protectiveMoves);
		var validSquares = null;
		var pinned = [], pieces;
		if (checks === 2) {
			pieces = [this.getKing(color)];
		} else {
			pieces = this.cache[color];
			pinned = this.getPinned(color);
			if (checks === 1) {
				validSquares = this.getValidSquaresOnCheck(color);
			}
		}
		var totalCountMoves = 0, a, square;
		for (var i = 0; i < pieces.length; i++) {
			var piece = pieces[i];
			var paths = [];

			switch (piece.t) {
				// pawns
				case 0x01:
					if (!pinned[piece.s] || (pinned[piece.s] && this.isOnSameFile(piece.s, pinned[piece.s].by) )) {
						if (!this.cache['board'][piece.s + 16]) {
							paths.push(piece.s + 16);
							if (piece.s < 32) {
								if (!this.cache['board'][piece.s + 32]) {
									paths.push(piece.s + 32);
								}
							}
						}
					}
					if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s + 15)) {
						if (enPassantSquare == piece.s + 15 || (this.cache['board'][piece.s + 15]) && this.cache['board'][piece.s + 15] & 0x8) {
							paths.push(piece.s + 15);
						}
					}
					if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s + 17)) {
						if (enPassantSquare == piece.s + 17 || (this.cache['board'][piece.s + 17]) && this.cache['board'][piece.s + 17] & 0x8) {
							paths.push(piece.s + 17);
						}
					}
					break;
				case 0x09:
					if (!pinned[piece.s] || (pinned[piece.s] && this.isOnSameFile(piece.s, pinned[piece.s].by) )) {
						if (!this.cache['board'][piece.s - 16]) {
							paths.push(piece.s - 16);
							if (piece.s > 87) {
								if (!this.cache['board'][piece.s - 32]) {
									paths.push(piece.s - 32);
								}
							}
						}
					}
					if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s - 15)) {
						if (enPassantSquare == piece.s - 15 || (this.cache['board'][piece.s - 15]) && !(this.cache['board'][piece.s - 15] & 0x8)) {
							paths.push(piece.s - 15);
						}
					}
					if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s - 17)) {
						if (enPassantSquare == piece.s - 17 || (this.cache['board'][piece.s - 17]) && !(this.cache['board'][piece.s - 17] & 0x8)) {
							paths.push(piece.s - 17);
						}
					}

					break;
				// Sliding pieces
				case 0x05:
				case 0x07:
				case 0x06:
				case 0x0D:
				case 0x0E:
				case 0x0F:
					directions = Board0x88Config.movePatterns[piece.t];
					if (pinned[piece.s]) {
						if (directions.indexOf(pinned[piece.s].direction) >= 0) {
							directions = [pinned[piece.s].direction, pinned[piece.s].direction * -1];
						} else {
							directions = [];
						}
					}
					for (a = 0; a < directions.length; a++) {
						square = piece.s + directions[a];
						while ((square & 0x88) === 0) {
							if (this.cache['board'][square]) {
								if ((WHITE && this.cache['board'][square] & 0x8) || (!WHITE && !(this.cache['board'][square] & 0x8))) {
									paths.push(square);
								}
								break;
							}
							paths.push(square);
							square += directions[a];
						}
					}
					break;
				// Knight
				case 0x02:
				case 0x0A:
					if (pinned[piece.s]) {
						break;
					}
					directions = Board0x88Config.movePatterns[piece.t];

					for (a = 0; a < directions.length; a++) {
						square = piece.s + directions[a];
						if ((square & 0x88) === 0) {
							if (this.cache['board'][square]) {
								if ((WHITE && this.cache['board'][square] & 0x8) || ( !WHITE && !(this.cache['board'][square] & 0x8))) {
									paths.push(square);
								}
							} else {
								paths.push(square);
							}
						}
					}
					break;
				// White king
				// Black king
				case 0X03:
				case 0X0B:
					directions = Board0x88Config.movePatterns[piece.t];
					for (a = 0; a < directions.length; a++) {
						square = piece.s + directions[a];
						if ((square & 0x88) === 0) {
							if (protectiveMoves.indexOf(Board0x88Config.keySquares[square]) == -1) {
								if (this.cache['board'][square]) {
									if ((WHITE && this.cache['board'][square] & 0x8) || ( !WHITE && !(this.cache['board'][square] & 0x8))) {
										paths.push(square);
									}
								} else {
									paths.push(square);
								}
							}
						}
					}
					if (kingSideCastle && protectiveMoves.indexOf(Board0x88Config.keySquares[piece.s]) == -1 && protectiveMoves.indexOf(Board0x88Config.keySquares[piece.s + 1]) == -1 && protectiveMoves.indexOf(Board0x88Config.keySquares[piece.s + 2]) == -1) {
						paths.push(piece.s + 2);
					}
					if (queenSideCastle && protectiveMoves.indexOf(Board0x88Config.keySquares[piece.s]) == -1 && protectiveMoves.indexOf(Board0x88Config.keySquares[piece.s - 1]) == -1 && protectiveMoves.indexOf(Board0x88Config.keySquares[piece.s - 2]) == -1) {
						paths.push(piece.s - 2);
					}
					break;
			}
			if (validSquares && piece.t != 0x03 && piece.t != 0x0B) {
				paths = this.excludeInvalidSquares(paths, validSquares);
			}
			ret[piece.s] = paths;
			totalCountMoves += paths.length;
		}
		var result = 0;
		if (checks && !totalCountMoves) {
			result = color === 'black' ? 1 : -1;
		}
		else if (!checks && !totalCountMoves) {
			result = .5;
		}
		return { moves:ret, result:result, check:checks };
	},

	excludeInvalidSquares:function (squares, validSquares) {
		var ret = [];
		for (var i = 0; i < squares.length; i++) {
			if (validSquares.indexOf(squares[i]) >= 0) {
				ret.push(squares[i]);
			}
		}
		return ret;
	},

	/* This method returns a commaseparated string of moves since it's faster to work with than arrays*/
	getCaptureAndProtectiveMoves:function (color) {
		var ret = [], directions, square, a;

		var pieces = this.cache[color];
		var oppositeKingSquare = this.getKing(color === 'white' ? 'black' : 'white').s;

		for (var i = 0; i < pieces.length; i++) {
			var piece = pieces[i];
			switch (piece.t) {
				// pawns
				case 0x01:
					if (((piece.s + 15) & 0x88) === 0) ret.push(piece.s + 15);
					if (((piece.s + 17) & 0x88) === 0) ret.push(piece.s + 17);
					break;
				case 0x09:
					if (((piece.s - 15) & 0x88) === 0) ret.push(piece.s - 15);
					if (((piece.s - 17) & 0x88) === 0) ret.push(piece.s - 17);
					break;
				// Sliding pieces
				case 0x05:
				case 0x07:
				case 0x06:
				case 0x0D:
				case 0x0E:
				case 0x0F:
					directions = Board0x88Config.movePatterns[piece.t];
					for (a = 0; a < directions.length; a++) {
						square = piece.s + directions[a];
						while ((square & 0x88) === 0) {
							if (this.cache['board'][square] && square !== oppositeKingSquare) {
								ret.push(square);
								break;
							}
							ret.push(square);
							square += directions[a];
						}
					}
					break;
				// knight
				case 0x02:
				case 0x0A:
					// White knight
					directions = Board0x88Config.movePatterns[piece.t];
					for (a = 0; a < directions.length; a++) {
						square = piece.s + directions[a];
						if ((square & 0x88) === 0) {
							ret.push(square);
						}
					}
					break;
				// king
				case 0X03:
				case 0X0B:
					directions = Board0x88Config.movePatterns[piece.t];
					for (a = 0; a < directions.length; a++) {
						square = piece.s + directions[a];
						if ((square & 0x88) === 0) {
							ret.push(square);
						}
					}
					break;
			}

		}
		return ',' + ret.join(',') + ',';
	},

	getSlidingPiecesAttackingKing:function (color) {
		var ret = [];
		var king = this.cache['king' + (color === 'white' ? 'black' : 'white')];
		var pieces = this.cache[color];
		for (var i = 0; i < pieces.length; i++) {
			var piece = pieces[i];
			if (piece.t & 0x4) {
				var numericDistance = king.s - piece.s;
				var boardDistance = (king.s - piece.s) / this.getDistance(king.s, piece.s);

				switch (piece.t) {
					// Bishop
					case 0x05:
					case 0x0D:
						if (numericDistance % 15 === 0 || numericDistance % 17 === 0) {
							ret.push({ s:piece.s, p:boardDistance});
						}
						break;
					// Rook
					case 0x06:
					case 0x0E:
						if (numericDistance % 16 === 0) {
							ret.push({ s:piece.s, p:boardDistance});
						}
						else if ((piece.s & 240) == (king.s & 240)) {
							ret.push({ s:piece.s, p:numericDistance > 0 ? 1 : -1})
						}
						break;
					// Queen
					case 0x07:
					case 0x0F:
						if (numericDistance % 15 === 0 || numericDistance % 17 === 0 || numericDistance % 16 === 0) {
							ret.push({ s:piece.s, p:boardDistance});
						}
						else if ((piece.s & 240) == (king.s & 240)) {
							ret.push({ s:piece.s, p:numericDistance > 0 ? 1 : -1})
						}
						break;
				}
			}
		}
		return ret;
	},

	/**
	 * Return array of the squares where pieces are pinned, i.e. cannot move.
	 * Squares are in the 0x88 format. You can use Board0x88Config.numberToSquareMapping
	 * to translate to readable format, example: Board0x88Config.numberToSquareMapping[16] will give you 'a2'
	 * @method getPined
	 * @param {String} color
	 * @return {Array}
	 */
	getPinned:function (color) {
		var ret = {};
		var pieces = this.getSlidingPiecesAttackingKing((color === 'white' ? 'black' : 'white'));
		var WHITE = color === 'white';
		var king = this.cache['king' + color];
		var i = 0;
		while (i < pieces.length) {
			var piece = pieces[i];
			var square = piece.s + piece.p;
			var countPieces = 0;

			var pinning = '';
			while (square !== king.s && countPieces < 2) {

				if (this.cache['board'][square]) {
					countPieces++;
					if ((!WHITE && this.cache['board'][square] & 0x8) || (WHITE && !(this.cache['board'][square] & 0x8))) {

						pinning = square;
					} else {
						break;
					}
				}
				square += piece.p;
			}
			if (countPieces === 1) {
				ret[pinning] = { 'by':piece.s, 'direction':piece.p };
			}
			i++;
		}
		if (ret.length === 0) {
			return null;
		}
		return ret;
	},

	getValidSquaresOnCheck:function (color) {
		var ret = [], checks;
		var king = this.cache['king' + color];
		var pieces = this.cache[color === 'white' ? 'black' : 'white'];


		for (var i = 0; i < pieces.length; i++) {
			var piece = pieces[i];

			switch (piece.t) {
				case 0x01:
					if (king.s === piece.s + 15 || king.s === piece.s + 17) {
						return [piece.s];
					}
					break;
				case 0x09:
					if (king.s === piece.s - 15 || king.s === piece.s - 17) {
						return [piece.s];
					}
					break;
				// knight
				case 0x02:
				case 0x0A:
					if (this.getDistance(piece.s, king.s) === 2) {
						var directions = Board0x88Config.movePatterns[piece.t];
						for (var a = 0; a < directions.length; a++) {
							var square = piece.s + directions[a];
							if (square === king.s) {
								return [piece.s];
							}
						}
					}
					break;
				// Bishop
				case 0x05:
				case 0x0D:
					checks = this.getBishopCheckPath(piece, king);
					if (checks) {
						return checks;
					}
					break;
				// Rook
				case 0x06:
				case 0x0E:
					checks = this.getRookCheckPath(piece, king);
					if (checks) {
						return checks;
					}
					break;
				case 0x07:
				case 0x0F:
					checks = this.getRookCheckPath(piece, king);
					if (checks) {
						return checks;
					}
					checks = this.getBishopCheckPath(piece, king);
					if (checks) {
						return checks;
					}
					break;
			}

		}

		return ret;
	},

	getBishopCheckPath:function (piece, king) {
		if ((king.s - piece.s) % 15 === 0 || (king.s - piece.s) % 17 === 0) {
			var direction = (king.s - piece.s) / this.getDistance(piece.s, king.s);
			var square = piece.s + direction;
			var pieceFound = false;
			var squares = [piece.s];
			while (square !== king.s && !pieceFound) {
				squares.push(square);
				if (this.cache['board'][square]) {
					pieceFound = true;
				}
				square += direction;
			}
			if (!pieceFound) {
				return squares;
			}
		}
		return null;
	},

	getRookCheckPath:function (piece, king) {
		var direction = null;
		if (this.isOnSameFile(piece.s, king.s)) {
			direction = (king.s - piece.s) / this.getDistance(piece.s, king.s);
		} else if (this.isOnSameRank(piece.s, king.s)) {
			direction = king.s > piece.s ? 1 : -1;
		}
		if (direction) {
			var square = piece.s + direction;
			var pieceFound = false;
			var squares = [piece.s];
			while (square !== king.s && !pieceFound) {
				squares.push(square);
				if (this.cache['board'][square]) {
					pieceFound = true;
				}
				square += direction;
			}
			if (!pieceFound) {
				return squares;
			}
		}
		return undefined;
	},


	getCountChecks:function (kingColor, moves) {
		var king = this.cache['king' + kingColor];
		var index = moves.indexOf(Board0x88Config.keySquares[king.s]);
		if (index > 0) {
			if (moves.indexOf(Board0x88Config.keySquares[king.s], index + 3) >= 0) {
				return 2;
			}
			return 1;
		}
		return 0;
	},

	/**
	 * Returns distance between two sqaures
	 * @method getDistance
	 * @param {Number} sq1
	 * @param {Number} sq2
	 * @return {Number} distance
	 */
	getDistance:function (sq1, sq2) {
		return Board0x88Config.distances[sq2 - sq1 + (sq2 | 7) - (sq1 | 7) + 240];
	},


	getPiecesInvolvedInMove:function (move) {
		var ret = [
			{ from:move.from, to:move.to }
		];
		var square;
		move = {
			from:Board0x88Config.mapping[move.from],
			to:Board0x88Config.mapping[move.to],
			promoteTo:move.promoteTo
		};

		var color = (this.cache['board'][move.from] & 0x8) ? 'black' : 'white';

		if (this.isEnPassantMove(move)) {
			if (color == 'black') {
				square = move.to + 16;

			} else {
				square = move.to - 16;
			}
			ret.push({ capture:Board0x88Config.numberToSquareMapping[square]})
		}

		if (this.isCastleMove(move)) {
			if ((move.from & 15) < (move.to & 15)) {
				ret.push({
					from:'h' + (color == 'white' ? 1 : 8),
					to:'f' + (color == 'white' ? 1 : 8)
				});
			} else {
				ret.push({
					from:'a' + (color == 'white' ? 1 : 8),
					to:'d' + (color == 'white' ? 1 : 8)
				});
			}
		}

		if (move.promoteTo) {
			ret.push({
				promoteTo:move.promoteTo, square:Board0x88Config.numberToSquareMapping[move.to]
			});
		}
		return ret;
	},

	/**
	  Returns true if a move is an "en passant" move. Move is given in this format:
	  @method isEnPassantMove
	  @param {Object} move
	  @return {Boolean}
	  @example
	 	var move = {
	 		from: Board0x88Config.mapping['e5'],
	 		to: Board0x88Config.mapping['e6']
	 	}
	 	console.log(parser.isEnPassantMove(move);

	 Move is an object and requires properties "from" and "to" which is a numeric square(according to a 0x88 board).
	 */
	isEnPassantMove:function (move) {
		if ((this.cache['board'][move.from] === 0x01 || this.cache['board'][move.from] == 0x09)) {
			if (
				!this.cache['board'][move.to] &&
					((move.from - move.to) % 17 === 0 || (move.from - move.to) % 15 === 0)) {
				return true;
			}
		}
		return false;
	},

	/**
	  Returns true if a move is a castle move. This method does not validate if the king is allowed
	  to move to the designated square.
	  @method isCastleMove
	  @param {Object} move
	  @return {Boolean}
	 */
	isCastleMove:function (move) {
		if ((this.cache['board'][move.from] === 0x03 || this.cache['board'][move.from] == 0x0B)) {
			if (this.getDistance(move.from, move.to) === 2) {
				return true;
			}
		}
		return false;
	},

	/**
	  Make a move by notation
	  @method makeMoveByNotation
	  @param {String} notation
	  @return undefined
	  @example
	 	var parser = new chess.parser.FenParser0x88('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
		parser.makeMoveByNotation('e4');
	 	console.log(parser.getFen());
	 */
	makeMoveByNotation:function (notation) {
		this.makeMove(this.getFromAndToByNotation(notation));
	},

	/**
	 Make a move by an object
	 @method makeMove
	 @param {Object} move
	 @example
	 	var parser = new chess.parser.FenParser0x88('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
	 	parser.makeMove({from:'e2',to:'e4'});
	 	console.log(parser.getFen());
	 */
	makeMove:function (move) {
		this.updateBoardData(move);
		this.fen = undefined;
	},

	/**
	 * Returns true when last position in the game has occured 2 or more times, i.e. 3 fold
	 * repetition.(if 2, it will be 3 fold after the next move, a "claimed" draw).
	 * @method hasThreeFoldRepetition
	 * @param fens
	 * @return {Boolean}
	 */
	hasThreeFoldRepetition :function(fens){
		if(fens === undefined || fens.length === 0)return false;
		var shortenedFens = {};
		for(var i=0;i<fens.length;i++){
			var fen = this.getTruncatedFenWithColorAndCastle(fens[i]);
			if(shortenedFens[fen] === undefined){
				shortenedFens[fen]  = 0;
			}
			shortenedFens[fen] ++;
		}
		var lastFen = this.getTruncatedFenWithColorAndCastle(fens[fens.length-1]);
		return shortenedFens[lastFen] >= 2;
 	},

	getTruncatedFenWithColorAndCastle:function(fen){
		return fen.split(/\s/g).slice(0,3).join(' ');
	},

	getPromoteByNotation:function (notation) {
		if (notation.indexOf('=') > 0) {
			var piece = notation.replace(/^.*?=([QRBN]).*$/, '$1');
			return Board0x88Config.pieceAbbr[piece];
		}
		if (notation.match(/[a-h][18][NBRQ]/)) {
			notation = notation.replace(/[^a-h18NBRQ]/g, '');
			return Board0x88Config.pieceAbbr[notation.substr(notation.length - 1, 1)];
		}
		return '';
	},

	getFromAndToByNotation:function (notation) {
		var ret = { promoteTo:this.getPromoteByNotation(notation)};
		var color = this.getColor();
		var offset = 0;
		if (color === 'black') {
			offset = 112;
		}
		var validMoves = this.getValidMovesAndResult().moves;

		var foundPieces = [], offsets, sq, i;
		if(notation === 'OO')notation = 'O-O';
		if(notation === 'OOO')notation = 'O-O-O';
		if (notation.length === 2) {
			var square = Board0x88Config.mapping[notation];
			ret.to = Board0x88Config.mapping[notation];
			var direction = color === 'white' ? -16 : 16;
			if (this.cache['board'][square + direction]) {
				foundPieces.push(square + direction);
			} else {
				foundPieces.push(square + (direction * 2));
			}

		} else {
			var fromRank = this.getFromRankByNotation(notation);
			var fromFile = this.getFromFileByNotation(notation);

			notation = notation.replace(/=[QRBN]/, '');
			notation = notation.replace(/[\+#!\?]/g, '');
			notation = notation.replace(/^(.*?)[QRBN]$/g, '$1');
			var pieceType = this.getPieceTypeByNotation(notation, color);

			ret.to = this.getToSquareByNotation(notation);

			switch (pieceType) {
				case 0x01:
				case 0x09:
					if (color === 'black') {
						offsets = [15, 17, 16];
						if (ret.to > 48) {
							offsets.push(32);
						}
					} else {
						offsets = [-15, -17, -16];
						if (ret.to < 64) {
							offsets.push(-32);
						}
					}
					for (i = 0; i < offsets.length; i++) {
						sq = ret.to + offsets[i];
						if (this.cache['board'][sq] && this.cache['board'][sq] === pieceType && validMoves[sq].indexOf(ret.to) >= 0) {
							foundPieces.push(sq);
						}
					}


					break;
				case 0x03:
				case 0x0B:

					if (notation === 'O-O') {
						foundPieces.push(offset + 4);
						ret.to = offset + 6;
					} else if (notation === 'O-O-O') {
						foundPieces.push(offset + 4);
						ret.to = offset + 2;
					} else {
						foundPieces.push(this.getKing(color).s);
					}
					break;
				case 0x02:
				case 0x0A:
					var pattern = Board0x88Config.movePatterns[pieceType];
					for (i = 0; i < pattern.length; i++) {
						sq = ret.to + pattern[i];
						if (!(sq & 0x88)) {
							if (this.cache['board'][sq] && this.cache['board'][sq] === pieceType && validMoves[sq].indexOf(ret.to) >= 0) {
								foundPieces.push(sq);
								if (fromRank === null && fromFile === null) {
									break;
								}
							}
						}
					}

					break;
				// Sliding pieces
				default:
					var patterns = Board0x88Config.movePatterns[pieceType];

					for (i = 0; i < patterns.length; i++) {
						sq = ret.to + patterns[i];
						while (!(sq & 0x88)) {
							if (this.cache['board'][sq] && this.cache['board'][sq] === pieceType && validMoves[sq].indexOf(ret.to) >= 0) {
								foundPieces.push(sq);
								if (fromRank === null && fromFile === null) {
									break;
								}
							}
							sq += patterns[i];
						}
					}
					break;
			}
		}

		if (foundPieces.length === 1) {
			ret.from = foundPieces[0];
		} else {

			if (fromRank >= 0 && fromRank !== null) {
				for (i = 0; i < foundPieces.length; i++) {
					if (this.isOnSameRank(foundPieces[i], fromRank)) {
						ret.from = foundPieces[i];
						break;
					}
				}
			}
			else if (fromFile >= 0 && fromFile !== null) {
				for (i = 0; i < foundPieces.length; i++) {
					if (this.isOnSameFile(foundPieces[i], fromFile)) {
						ret.from = foundPieces[i];
						break;
					}
				}
			}
		}
		ret.from = Board0x88Config.numberToSquareMapping[ret.from];
		ret.to = Board0x88Config.numberToSquareMapping[ret.to];

		return ret;
	},
	/**
	  Get from rank by notation, 0 is first rank, 16 is second rank, 32 is third rank etc.
	  @method getFromRankByNotation
	  @param {String} notation
	  @return {Number}
	 */
	getFromRankByNotation:function (notation) {
		notation = notation.replace(/^.+([0-9]).+[0-9].*$/g, '$1');
		if (notation.length > 1) {
			return null;
		}
		return (notation - 1) * 16;
	},

	/**
	 * Get from rank by notation. 0 is first file(a), 1 is second file(b), 2 is third file etc.
	 * @method getFromFileByNotation
	 * @param {String} notation
	 * @return {Number}
	 */
	getFromFileByNotation:function (notation) {
		notation = notation.replace(/^.*([a-h]).*[a-h].*$/g, '$1');
		if (notation.length > 1) {
			return null;
		}
		return Board0x88Config.files[notation];
	},
	/**
	 * Return numeric destination square by notation.
	 * @method getToSquareByNotation
	 * @param {String} notation
	 * @return {Number} square
	 */
	getToSquareByNotation:function (notation) {
		return Board0x88Config.mapping[notation.replace(/.*([a-h][1-8]).*/g, '$1')];
	},

	getPieceTypeByNotation:function (notation, color) {
		notation = notation.replace(/=[NBRQ]/, '');
		if (notation === 'O-O-O' || notation === 'O-O') {
			notation = 'K';
		} else {
			notation = notation.replace(/.*?([NRBQK]).*/g, '$1');
			if (!notation || notation.length > 1) {
				notation = 'P';
			}
		}

		notation = Board0x88Config.pieces[notation];
		if (color === 'black') {
			notation += 8;
		}

		return notation;
	},

	move:function (move) {
		if(ludo.util.isString(move)){
			move = this.getFromAndToByNotation(move);
		}
		if (!move.promoteTo && move.m && move.m.indexOf('=') >= 0) {
			move.promoteTo = this.getPromoteByNotation(move.m);
		}
		this.fen = undefined;
		this.piecesInvolved = this.getPiecesInvolvedInMove(move);
		this.notation = this.getNotationForAMove(move);
		this.longNotation = this.getLongNotationForAMove(move, this.notation);
		this.updateBoardData(move);

		var config = this.getValidMovesAndResult();

		if (config.result === 1 || config.result === -1) {
			this.notation += '#';
			this.longNotation += '#';
		} else {
			if (config.check) {
				this.notation += '+';
				this.longNotation += '+';
			}
		}
	},

	setNewColor:function () {
		this.fenParts['color'] = (this.fenParts['color'] == 'w') ? 'b' : 'w';

	},

	setCastle:function (castle) {
		if (!castle) {
			castle = '-';
		}
		this.fenParts['castle'] = castle;
	},
	getCastle:function () {
		return this.fenParts['castle'];
	},

	updateBoardData:function (move) {
		move = {
			from:Board0x88Config.mapping[move.from],
			to:Board0x88Config.mapping[move.to],
			promoteTo:move.promoteTo
		};
		var movedPiece = this.cache['board'][move.from];
		var color = (movedPiece & 0x8) ? 'black' : 'white';
		var enPassant = '-';

		var incrementHalfMoves = this.cache['board'][move.to] ? false : true;

		if ((this.cache['board'][move.from] === 0x01 || this.cache['board'][move.from] == 0x09)) {
			incrementHalfMoves = false;
			if (this.isEnPassantMove(move)) {
				if (color == 'black') {
					this.cache['board'][move.to + 16] = undefined;
				} else {
					this.cache['board'][move.to - 16] = undefined;
				}
			}

			if ((move.from & 15) == (move.to & 15) && this.getDistance(move.from, move.to) == 2) {
				if (this.cache['board'][move.to - 1] || this.cache['board'][move.to + 1]) {
					if (color === 'white') {
						enPassant = Board0x88Config.numberToSquareMapping[move.from + 16];
					} else {
						enPassant = Board0x88Config.numberToSquareMapping[move.from - 16];
					}
				}
			}
		}

		this.setEnPassantSquare(enPassant);
		var castleNotation, pieceType, offset;
		if (this.isCastleMove({ from:move.from, to:move.to })) {
			var castle = this.getCastle();
			if (color == 'white') {
				castleNotation = new RegExp('[KQ]', 'g');
				pieceType = 0x06;
				offset = 0;
			} else {
				castleNotation = new RegExp('[kq]', 'g');
				pieceType = 0x0E;
				offset = 112;
			}

			if (move.from < move.to) {
				this.cache['board'][7 + offset] = undefined;
				this.cache['board'][5 + offset] = pieceType;

			} else {
				this.cache['board'][0 + offset] = undefined;
				this.cache['board'][3 + offset] = pieceType;
			}
			castle = castle.replace(castleNotation, '');
			this.setCastle(castle);
		} else {
			this.updateCastleForMove(movedPiece, move.from);
		}

		if (color === 'black') {
			this.incrementFullMoves();
		}
		if (incrementHalfMoves) {
			this.incrementHalfMoves();
		} else {
			this.resetHalfMoves();
		}
		this.cache['board'][move.to ] = this.cache['board'][move.from ];
		this.cache['board'][move.from ] = undefined;
		if (move.promoteTo) {
			this.cache['board'][move.to] = Board0x88Config.typeToNumberMapping[move.promoteTo];
			if (color === 'black') {
				this.cache['board'][move.to] += 8;
			}
		}
		this.setNewColor();
		this.updatePieces();
	},

	updateCastleForMove:function (movedPiece, from) {
		switch (movedPiece) {
			case 0x03:
				this.setCastle(this.getCastle().replace(/[KQ]/g, ''));
				break;
			case 0x0B:
				this.setCastle(this.getCastle().replace(/[kq]/g, ''));
				break;
			case 0x06:
				if (from === 0) {
					this.setCastle(this.getCastle().replace(/[Q]/g, ''));
				}
				if (from === 7) {
					this.setCastle(this.getCastle().replace(/[K]/g, ''));
				}
				break;
			case 0x0E:
				if (from === 112) {
					this.setCastle(this.getCastle().replace(/[q]/g, ''));
				}
				if (from === 119) {
					this.setCastle(this.getCastle().replace(/[k]/g, ''));
				}
				break;
		}

	},

	updatePieces:function () {
		this.cache['white'] = [];
		this.cache['black'] = [];
		var piece = null;
		for (var i = 0; i < 120; i++) {
			if (i & 0x88) {
				i += 8;
			}
			if (piece = this.cache['board'][i]) {
				var color = piece & 0x8 ? 'black' : 'white';
				var obj = {
					t:piece,
					s:i
				};
				this.cache[color].push(obj);

				if (piece == 0x03 || piece == 0x0B) {
					this.cache['king' + color] = obj;
				}
			}
		}
	},

	incrementFullMoves:function () {
		this.fenParts['fullMoves']++;
	},
	incrementHalfMoves:function () {
		this.fenParts['halfMoves']++;
	},
	resetHalfMoves:function () {
		this.fenParts['halfMoves'] = 0;
	},

	getPiecesInvolvedInLastMove:function () {
		return this.piecesInvolved;
	},

	getNotation:function () {
		return this.notation;
	},
	getLongNotation:function () {
		return this.longNotation;
	},
	/**
	 * Return current fen position
	 * @method getFen
	 * @return {String} fen
	 */
	getFen:function () {
		if (!this.fen) {
			this.fen = this.setNewFen();
		}
		return this.fen;
	},

	/**
	 * Return long notation for a move
	 * @method getLongNotationForAMove
	 * @param {Object} move
	 * @param {String} shortNotation
	 * @return {String} long notation
	 */
	getLongNotationForAMove:function (move, shortNotation) {
		if (shortNotation.indexOf('O-') >= 0) {
			return shortNotation;
		}
		var fromSquare = move.from;
		var toSquare = move.to;


		var type = this.cache['board'][Board0x88Config.mapping[move.from]];
		type = Board0x88Config.typeMapping[type];
		var separator = shortNotation.indexOf('x') >= 0 ? 'x' : '-';

		var ret = chess.language.pieces[type] + fromSquare + separator + toSquare;

		if (move.promoteTo) {
			ret += '=' + chess.language.pieces[move.promoteTo];
		}
		return ret;
	},

	/**
	 Return short notation for a move
	 @method getNotationForAMove
	 @param {Object} move
	 @return {String}
	 @example
	 	alert(parser.getNotationForAMove({from:'g1',to:'f3'});
	 */
	getNotationForAMove:function (move) {
		move = {
			from:Board0x88Config.mapping[move.from],
			to:Board0x88Config.mapping[move.to],
			promoteTo:move.promoteTo
		};

		var type = this.cache['board'][move.from];

		var ret = chess.language.pieces[Board0x88Config.typeMapping[this.cache['board'][move.from]]];

		switch (type) {
			case 0x01:
			case 0x09:
				if (this.isEnPassantMove(move) || this.cache['board'][move.to]) {
					ret += Board0x88Config.fileMapping[move.from & 15] + 'x';
				}

				ret += Board0x88Config.fileMapping[move.to & 15] + '' + Board0x88Config.rankMapping[move.to & 240];

				if (move.promoteTo) {
					ret += '=' + chess.language.pieces[move.promoteTo];
				}
				break;
			case 0x02:
			case 0x05:
			case 0x06:
			case 0x07:
			case 0x0A:
			case 0x0D:
			case 0x0E:
			case 0x0F:
				var config = this.getValidMovesAndResult();
				for (var square in config.moves) {
					if (square != move.from && this.cache['board'][square] === type) {
						if (config.moves[square].indexOf(move.to) >= 0) {
							if ((square & 15) != (move.from & 15)) {
								ret += Board0x88Config.fileMapping[move.from & 15];
							}
							else if ((square & 240) != (move.from & 240)) {
								ret += Board0x88Config.rankMapping[move.from & 240];
							}
						}
					}
				}
				if (this.cache['board'][move.to]) {
					ret += 'x';
				}
				ret += Board0x88Config.fileMapping[move.to & 15] + '' + Board0x88Config.rankMapping[move.to & 240];
				break;
			case 0x03:
			case 0x0B:
				if (this.isCastleMove(move)) {
					if (move.to > move.from) {
						ret = 'O-O';
					} else {
						ret = 'O-O-O';
					}
				} else {
					if (this.cache['board'][move.to]) {
						ret += 'x';
					}
					ret += Board0x88Config.fileMapping[move.to & 15] + '' + Board0x88Config.rankMapping[move.to & 240];
				}
				break;

		}
		return ret;
	},

	setNewFen:function () {
		var board = this.cache['board'];
		var fen = '';
		var emptyCounter = 0;

		for (var rank = 7; rank >= 0; rank--) {

			for (var file = 0; file < 8; file++) {
				var index = (rank * 8) + file;

				if (board[Board0x88Config.numericMapping[index]]) {
					if (emptyCounter) {
						fen += emptyCounter;
					}
					fen += Board0x88Config.pieceMapping[board[Board0x88Config.numericMapping[index]]];
					emptyCounter = 0;
				} else {
					emptyCounter++;
				}
			}
			if (rank) {
				if (emptyCounter) {
					fen += emptyCounter;
				}
				fen += '/';
				emptyCounter = 0;
			}
		}

		if (emptyCounter) {
			fen += emptyCounter;
		}

		return [fen, this.getColorCode(), this.getCastle(), this.fenParts['enPassant'], this.getHalfMoves(), this.getFullMoves()].join(' ');
	}
});