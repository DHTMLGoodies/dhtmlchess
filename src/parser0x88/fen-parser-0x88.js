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

    madeMoves:[],

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
            fenParts: {},
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
        this.madeMoves = [];
	},

	updateFenArray:function () {
		var fenParts = this.fen.split(' ');

		this.cache.fenParts = {
			'pieces':fenParts[0],
			'color':fenParts[1],
			'castleCode':Board0x88Config.castleToNumberMapping[fenParts[2]],
			'enPassant':fenParts[3],
			'halfMoves':fenParts[4],
			'fullMoves':fenParts[5]
		};
	},

	/**
	 * Parses current fen and stores board information internally
	 * @method parseFen
	 */
	parseFen:function () {
		var pos = 0;

		var squares = Board0x88Config.fenSquares;
		var index, type, piece;
		for (var i = 0, len = this.cache.fenParts['pieces'].length; i < len; i++) {
			var token = this.cache.fenParts['pieces'].substr(i, 1);

			if (Board0x88Config.fenPieces[token]) {
				index = Board0x88Config.mapping[squares[pos]];
				type = Board0x88Config.pieces[token];
				piece = {
					t:type,
					s:index
				};
				// Board array
				this.cache['board'][index] = type;

				// White and black array
				this.cache[Board0x88Config.colorMapping[token]].push(piece);

				// King array
				if (Board0x88Config.typeMapping[type] == 'king') {
					this.cache['king' + ((piece.t & 0x8) > 0 ? 'black' : 'white')] = piece;
				}
				pos++;
			} else if (i < len - 1 && Board0x88Config.numbers[token]) {
				var token2 = this.cache.fenParts['pieces'].substr(i + 1, 1);
				if (!isNaN(token2)) {
					token = [token, token2].join('');
				}
				pos += parseInt(token);
			}
		}

	},

	/**
	 * Return all pieces on board
	 * @method getPieces
	 * @return {Array} pieces
	 */
	getPieces:function () {
		return this.cache['white'].append(this.cache['black']);
	},

	/**
	 Return king of a color
	 @method getKing
	 @param color
	 @return {Object} king
	 @example
		var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		console.log(parser.getKing('white'));
	 returns an object containing the properties s for square and t for type.
	 both are numeric according to the 0x88 board.
	 */
	getKing:function (color) {
		return this.cache['king' + color];
	},

	/**
	 Returns pieces of a color
	 @method getPiecesOfAColor
	 @param color
	 @return {Array}
	 @example
	 	var parser = new chess.parser.FenParser0x88('5k2/8/8/3pP3/8/8/8/7K w - d6 0 1');
	 	var pieces = parser.getPiecesOfAColor('white');
	 	console.log(pieces);
	 each piece is represented by an object like this:
	 @example
	 	{
	 		s : 112,
	 		t : 14
	 	}
	 where s is square and type is type. s is numeric according to the 0x88 chess board where
	 a1 is 0, a2 is 16, b2 is 17, a3 is 32, i.e. a 128x64 square board.

	 t is a numeric representation(4 bits).
	 @example
		 P : 0001
		 N : 0010
		 K : 0011
		 B : 0101
		 R : 0110
		 Q : 0111
		 p : 1001
		 n : 1010
		 k : 1011
		 b : 1101
		 r : 1100
		 q : 1100

	 As you can see, black pieces all have the first bit set to 1, and all the sliding pieces
	 (bishop, rook and queen) has the second bit set to 1. This makes it easy to to determine color
	 and sliding pieces using the bitwise & operator.
	 */
	getPiecesOfAColor:function (color) {
		return this.cache[color]
	},

	/**
	 @method getEnPassantSquare
	 @return {String|null}
	 @example
	 	var fen = '5k2/8/8/3pP3/8/8/8/7K w - d6 0 1';
	 	var parser = new chess.parser.FenParser0x88(fen);
	 	alert(parser.getEnPassantSquare()); // alerts 'd6'
	 */
	getEnPassantSquare:function () {
		var enPassant = this.cache.fenParts['enPassant'];
		if (enPassant != '-') {
			return enPassant;
		}
		return undefined;
	},
	setEnPassantSquare:function (square) {
		this.cache.fenParts['enPassant'] = square;
	},

	getSlidingPieces:function (color) {
		return this.cache[color + 'Sliding'];
	},

	getHalfMoves:function () {
		return this.cache.fenParts['halfMoves'];
	},

	getFullMoves:function () {
		return this.cache.fenParts['fullMoves'];
	},

	canCastleKingSide:function (color) {
		var code = color === 'white' ? Board0x88Config.castle['K'] : Board0x88Config.castle['k'];
		return this.cache.fenParts.castleCode & code;
	},

	canCastleQueenSide:function (color) {
		var code = color === 'white' ? Board0x88Config.castle['Q'] : Board0x88Config.castle['q'];
		return this.cache.fenParts.castleCode & code;
	},

	getColor:function () {
		return Board0x88Config.colorAbbreviations[this.cache.fenParts['color']];
	},

	getColorCode:function () {
		return this.cache.fenParts['color'];
	},

	/**
	 Return information about piece on square in human readable format
	 @method getPieceOnSquare
	 @param {Number} square
	 @return {Object}
	 @example
	 	var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
	 	var parser = new chess.parser.FenParser0x88(fen);
	 	console.log(parser.getPieceOnSquare(Board0x88Config.mapping['e2']));
	 will return an object like this:
	 @example
	 	{
	 		"square": "e2",
	 		"type": "pawn",
	 		"color": "white",
	 		"sliding": 0
	 	}
	 */
	getPieceOnSquare:function (square) {
		var piece = this.cache['board'][square];
		if (piece) {
			return {
				square:Board0x88Config.numberToSquareMapping[square],
				type:Board0x88Config.typeMapping[piece],
				color:(piece & 0x8) > 0 ? 'black' : 'white',
				sliding:(piece & 0x4) > 0
			}
		}
		return undefined;
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
	 @example
	 	var parser = new chess.parser.FenParser0x88();
	 	console.log(parser.isOnSameSquare(0,16)); // a1 and a2 -> false
	 	console.log(parser.isOnSameSquare(0,1)); // a1 and b1 -> true
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
	 @example
	 	var parser = new chess.parser.FenParser0x88();
	 	console.log(parser.isOnSameFile(0,16)); // a1 and a2 -> true
	 	console.log(parser.isOnSameFile(0,1)); // a1 and b1 -> false
	 */
	isOnSameFile:function (square1, square2) {
		return (square1 & 15) === (square2 & 15);
	},

	/**
	 Returns valid moves and results for the position according to the 0x88 chess programming
	 algorithm where position on the board is numeric (A1=0,H1=7,A2=16,H2=23,A3=32,A4=48).
	 First rank is numbered 0-7. Second rank starts at first rank + 16, i.e. A2 = 16. Third
	 rank starts at second rank + 16, i.e. A3 = 32 and so on.
	 @method getValidMovesAndResult
	 @param color
	 @return {Object}
	 @example
	 	 var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
	 	 var parser = new chess.parser.FenParser0x88(fen)
	 	 console.log(parser.getValidMovesAndResult());
	 returns an object containing information about number of checks(0,1 or 2 for double check),
	 valid moves and result(0 for undecided, .5 for stalemate, -1 for black win and 1 for white win).
	 moves are returend in the following format:
	 	numeric square : [array of valid squares to move]
	 example for knight on b1:
	 @example
	 	1 : [32,34]
	 since it's located on b1(numeric value 1) and can move to either a3 or c3(32 and 34).
	 */
	getValidMovesAndResult:function (color) {
		color = color || this.getColor();
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
		var checks = this.getCountChecks(color, protectiveMoves);
		var pinned = [], pieces, validSquares;
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
						if (enPassantSquare == piece.s + 15 || (this.cache['board'][piece.s + 15]) && (this.cache['board'][piece.s + 15] & 0x8) > 0) {
							paths.push(piece.s + 15);
						}
					}
					if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s + 17)) {
						if (enPassantSquare == piece.s + 17 || (this.cache['board'][piece.s + 17]) && (this.cache['board'][piece.s + 17] & 0x8) > 0) {
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
						if (enPassantSquare == piece.s - 15 || (this.cache['board'][piece.s - 15]) && (this.cache['board'][piece.s - 15] & 0x8) === 0) {
							paths.push(piece.s - 15);
						}
					}
					if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s - 17)) {
						if (enPassantSquare == piece.s - 17 || (this.cache['board'][piece.s - 17]) && (this.cache['board'][piece.s - 17] & 0x8) === 0) {
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
								if ((WHITE && (this.cache['board'][square] & 0x8) > 0) || (!WHITE && (this.cache['board'][square] & 0x8) === 0)) {
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
								if ((WHITE && (this.cache['board'][square] & 0x8) > 0) || ( !WHITE && (this.cache['board'][square] & 0x8) === 0)) {
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
							if (protectiveMoves.indexOf(square) == -1) {
								if (this.cache['board'][square]) {
									if ((WHITE && (this.cache['board'][square] & 0x8) > 0) || ( !WHITE && (this.cache['board'][square] & 0x8) === 0)) {
										paths.push(square);
									}
								} else {
									paths.push(square);
								}
							}
						}
					}
					if (kingSideCastle && !this.cache['board'][piece.s + 1] && !this.cache['board'][piece.s + 2] && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s + 2) == -1) {
						paths.push(piece.s + 2);
					}
					if (queenSideCastle && !this.cache['board'][piece.s - 1] && !this.cache['board'][piece.s - 2] && !this.cache['board'][piece.s - 3] && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s - 1) == -1 && protectiveMoves.indexOf(piece.s - 2) == -1) {
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

    getMovesAndResultLinear:function(color){
        color = color || this.getColor();
        var directions;
        var enPassantSquare = this.getEnPassantSquare();
        if (enPassantSquare) {
            enPassantSquare = Board0x88Config.mapping[enPassantSquare];
        }

        var kingSideCastle = this.canCastleKingSide(color);
        var queenSideCastle = this.canCastleQueenSide(color);
        var oppositeColor = color === 'white' ? 'black' : 'white';

        var WHITE = color === 'white';

        var protectiveMoves = this.getCaptureAndProtectiveMoves(oppositeColor);
        var checks = this.getCountChecks(color, protectiveMoves);
        var pinned = [], pieces, validSquares;
        if (checks === 2) {
            pieces = [this.getKing(color)];
        } else {
            pieces = this.cache[color];
            pinned = this.getPinned(color);
            if (checks === 1) {
                validSquares = this.getValidSquaresOnCheck(color);
            }
        }
        var a, square;
        var paths = [];

        for (var i = 0; i < pieces.length; i++) {
            var piece = pieces[i];

            switch (piece.t) {
                // pawns
                case 0x01:
                    if (!pinned[piece.s] || (pinned[piece.s] && this.isOnSameFile(piece.s, pinned[piece.s].by) )) {
                        if (!this.cache['board'][piece.s + 16]) {
                            paths.push([piece.s, piece.s + 16]);
                            if (piece.s < 32) {
                                if (!this.cache['board'][piece.s + 32]) {
                                    paths.push([piece.s, piece.s + 32]);
                                }
                            }
                        }
                    }
                    if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s + 15)) {
                        if (enPassantSquare == piece.s + 15 || (this.cache['board'][piece.s + 15]) && (this.cache['board'][piece.s + 15] & 0x8) > 0) {
                            paths.push([piece.s, piece.s + 15]);
                        }
                    }
                    if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s + 17)) {
                        if (enPassantSquare == piece.s + 17 || (this.cache['board'][piece.s + 17]) && (this.cache['board'][piece.s + 17] & 0x8) > 0) {
                            paths.push([piece.s, piece.s + 17]);
                    }
                    }
                    break;
                case 0x09:
                    if (!pinned[piece.s] || (pinned[piece.s] && this.isOnSameFile(piece.s, pinned[piece.s].by) )) {
                        if (!this.cache['board'][piece.s - 16]) {
                            paths.push([piece.s, piece.s - 16]);
                            if (piece.s > 87) {
                                if (!this.cache['board'][piece.s - 32]) {
                                    paths.push([piece.s, piece.s - 32]);
                                }
                            }
                        }
                    }
                    if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s - 15)) {
                        if (enPassantSquare == piece.s - 15 || (this.cache['board'][piece.s - 15]) && (this.cache['board'][piece.s - 15] & 0x8) === 0) {
                            paths.push([piece.s, piece.s - 15]);
                        }
                    }
                    if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s - 17)) {
                        if (enPassantSquare == piece.s - 17 || (this.cache['board'][piece.s - 17]) && (this.cache['board'][piece.s - 17] & 0x8) === 0) {
                            paths.push([piece.s, piece.s - 17]);
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
                                if ((WHITE && (this.cache['board'][square] & 0x8) > 0) || (!WHITE && (this.cache['board'][square] & 0x8) === 0)) {
                                    paths.push([piece.s, square]);
                                }
                                break;
                            }
                            paths.push([piece.s, square]);
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
                                if ((WHITE && (this.cache['board'][square] & 0x8) > 0) || ( !WHITE && (this.cache['board'][square] & 0x8) === 0)) {
                                    paths.push([piece.s, square]);
                                }
                            } else {
                                paths.push([piece.s, square]);
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
                            if (protectiveMoves.indexOf(square) == -1) {
                                if (this.cache['board'][square]) {
                                    if ((WHITE && (this.cache['board'][square] & 0x8) > 0) || ( !WHITE && (this.cache['board'][square] & 0x8) === 0)) {
                                        if(!validSquares || validSquares.indexOf(square) >=0)paths.push([piece.s, square]);
                                    }
                                } else {
                                    if(!validSquares || validSquares.indexOf(square) >=0)paths.push([piece.s, square]);
                                }
                            }
                        }
                    }
                    if (kingSideCastle && !this.cache['board'][piece.s + 1] && !this.cache['board'][piece.s + 2] && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s + 2) == -1) {
                        if(!validSquares || validSquares.indexOf(square) >=0)paths.push([piece.s, piece.s + 2]);
                    }
                    if (queenSideCastle && !this.cache['board'][piece.s - 1] && !this.cache['board'][piece.s - 2] && !this.cache['board'][piece.s - 3] && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s - 1) == -1 && protectiveMoves.indexOf(piece.s - 2) == -1) {
                        if(!validSquares || validSquares.indexOf(square) >=0)paths.push([piece.s, piece.s - 2]);
                    }
                    break;
            }
        }
        var result = 0;
        if (checks && !paths.length > 0) {
            result = color === 'black' ? 1 : -1;
        }
        else if (!checks && paths.length === 0) {
            result = .5;
        }
        return { moves:paths, result:result, check:checks };

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

	/* This method returns a comma separated string of moves since it's faster to work with than arrays*/
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
        return ret;
	},

	/**
	 Returns array of sliding pieces attacking king
	 @method getSlidingPiecesAttackingKing
	 @param {String} color
	 @return {Array}
	 @example
	 	fen = '6k1/Q5n1/4p3/8/8/8/B7/5KR1 b - - 0 1';
		parser = new chess.parser.FenParser0x88(fen);
	 	pieces = parser.getSlidingPiecesAttackingKing('white');
	 	console.log(pieces);
	 will return
	 @example
	 	[ { "s" : 16, "p": 17 }, { "s": 6, "p": 16 }]
	 where "s" is the 0x88 board position of the piece and "p" is the sliding path to the king
	 of opposite color. A bishop on a1 and a king on h8 will return { "s": "0", "p": 17 }
	 This method returns pieces even when the sliding piece is not checking king.
	 */
	getSlidingPiecesAttackingKing:function (color) {
		var ret = [];
		var king = this.cache['king' + (color === 'white' ? 'black' : 'white')];
		var pieces = this.cache[color];
		for (var i = 0; i < pieces.length; i++) {
			var piece = pieces[i];
			if ((piece.t & 0x4) > 0) {
				var numericDistance = king.s - piece.s;
				var boardDistance = (king.s - piece.s) / this.getDistance(king.s, piece.s);

				switch (piece.t) {
					// Bishop
					case 0x05:
					case 0x0D:
						if (numericDistance % 15 === 0 || numericDistance % 17 === 0) {
							ret.push({ s:piece.s, direction:boardDistance});
						}
						break;
					// Rook
					case 0x06:
					case 0x0E:
						if (numericDistance % 16 === 0) {
							ret.push({ s:piece.s, direction:boardDistance});
						}
						// Rook on same rank as king
						else if (this.isOnSameRank(piece.s, king.s)) {
							ret.push({ s:piece.s, direction:numericDistance > 0 ? 1 : -1})
						}
						break;
					// Queen
					case 0x07:
					case 0x0F:
						if (numericDistance % 15 === 0 || numericDistance % 17 === 0 || numericDistance % 16 === 0) {
							ret.push({ s:piece.s, direction:boardDistance});
						}
						else if (this.isOnSameRank(piece.s, king.s)) {
							ret.push({ s:piece.s, direction:numericDistance > 0 ? 1 : -1})
						}
						break;
				}
			}
		}
		return ret;
	},

	/**
	 Return array of the squares where pieces are pinned, i.e. cannot move.
	 Squares are in the 0x88 format. You can use Board0x88Config.numberToSquareMapping
	 to translate to readable format, example: Board0x88Config.numberToSquareMapping[16] will give you 'a2'
	 @method getPinned
	 @param {String} color
	 @return {Object}
	 @example
	 	var fen = '6k1/Q5n1/4p3/8/8/1B6/B7/5KR1 b - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
	 	var pinned = parser.getPinned('black');
	 	console.log(pinned);
	 will output
	 @example
 		{
	 		84: { "by": 33, "direction": 17 }, // pawn on e6(84) is pinned by bishop on b3(33).
	 		102 : { "by": "6", "direction": 16 } // knight on g7 is pinned by rook on g1
	 	}
	 direction is the path to king which can be
	 @example
	 	15   16   17
	 	-1         1
	 	17  -16  -15
	 i.e. 1 to the right, -1 to the left, 17 for higher rank and file etc.
	 */
	getPinned:function (color) {
		var ret = {};
		var pieces = this.getSlidingPiecesAttackingKing((color === 'white' ? 'black' : 'white'));
		var WHITE = color === 'white';
		var king = this.cache['king' + color];
		var i = 0;
		while (i < pieces.length) {
			var piece = pieces[i];
			var square = piece.s + piece.direction;
			var countPieces = 0;

			var pinning = '';
			while (square !== king.s && countPieces < 2) {
				if (this.cache['board'][square]) {
					countPieces++;
					if ((!WHITE && (this.cache['board'][square] & 0x8) > 0) || (WHITE && (this.cache['board'][square] & 0x8) === 0)) {
						pinning = square;
					} else {
						break;
					}
				}
				square += piece.direction;
			}
			if (countPieces === 1) {
				ret[pinning] = { 'by':piece.s, 'direction':piece.direction };
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
        var index = moves.indexOf(king.s);
		if (index >= 0) {
			if (moves.indexOf(king.s, index+1 ) >= 0) {
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

		if (this.isEnPassantMove(move.from, move.to)) {
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
	 @param {Number} from
	 @param {Number} to
	 @return {Boolean}
	 @example
	 	var move = {
	 		from: Board0x88Config.mapping['e5'],
	 		to: Board0x88Config.mapping['e6']
	 	}
	 console.log(parser.isEnPassantMove(move);

	 Move is an object and requires properties "from" and "to" which is a numeric square(according to a 0x88 board).
	 */
	isEnPassantMove:function (from, to) {
		if ((this.cache['board'][from] === 0x01 || this.cache['board'][from] == 0x09)) {
			if (
				!this.cache['board'][to] &&
					((from - to) % 17 === 0 || (from - to) % 15 === 0)) {
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
		this.makeMoveByObject(this.getFromAndToByNotation(notation));
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
	makeMoveByObject:function (move) {
        this.makeMove(
            Board0x88Config.mapping[move.from],
            Board0x88Config.mapping[move.to],
            move.promoteTo ? Board0x88Config.typeToNumberMapping[move.promoteTo] : undefined
        );
		this.fen = undefined;
	},



	/**
	 Returns true when last position in the game has occured 2 or more times, i.e. 3 fold
	 repetition.(if 2, it will be 3 fold after the next move, a "claimed" draw).
	 @method hasThreeFoldRepetition
	 @param {Array} fens
	 @return {Boolean}
	 This method is called from the game model where the fen of the last moves is sent.
	 */
	hasThreeFoldRepetition:function (fens) {
		if (!fens || fens.length === 0)return false;
		var shortenedFens = {};
		for (var i = 0; i < fens.length; i++) {
			var fen = this.getTruncatedFenWithColorAndCastle(fens[i]);
			if (shortenedFens[fen] === undefined) {
				shortenedFens[fen] = 0;
			}
			shortenedFens[fen]++;
		}
		var lastFen = this.getTruncatedFenWithColorAndCastle(fens[fens.length - 1]);
		return shortenedFens[lastFen] >= 2;
	},

	getTruncatedFenWithColorAndCastle:function (fen) {
		return fen.split(/\s/g).slice(0, 3).join(' ');
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
		if (notation === 'OO')notation = 'O-O';
		if (notation === 'OOO')notation = 'O-O-O';
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
						if ((sq & 0x88) === 0) {
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
						while ((sq & 0x88) === 0) {
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
		if (ludo.util.isString(move)) {
			move = this.getFromAndToByNotation(move);
		}
		if (!move.promoteTo && move.m && move.m.indexOf('=') >= 0) {
			move.promoteTo = this.getPromoteByNotation(move.m);
		}
		this.fen = undefined;
		this.piecesInvolved = this.getPiecesInvolvedInMove(move);
		this.notation = this.getNotationForAMove(move);
		this.longNotation = this.getLongNotationForAMove(move, this.notation);

        this.makeMove(
            Board0x88Config.mapping[move.from],
            Board0x88Config.mapping[move.to],
            move.promoteTo ? Board0x88Config.typeToNumberMapping[move.promoteTo] : undefined
        );

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
		this.cache.fenParts['color'] = (this.cache.fenParts['color'] == 'w') ? 'b' : 'w';

	},

	getCastle:function () {
		return Board0x88Config.castleMapping[this.cache.fenParts['castleCode']];
	},

    historyCurrentMove:[],

    getCopyOfColoredPieces:function(color){
        var ret = [];
        for(var i=0;i<this.cache[color].length;i++){
            ret.push({ s : this.cache[color][i].s, t: this.cache[color][i].t });
        }
        return ret;
        /*
        var ret = this.cache[color].concat(0);
        ret.pop();
        return ret;*/
    },


    /**
     * Used on comp eval. Valid from and to is assumed
     * @param {Number} from
     * @param {Number} to
     * @param {String} promoteTo
     */
    makeMove:function(from, to, promoteTo){
        this.historyCurrentMove = [
            { key : "white", value : this.getCopyOfColoredPieces('white')},
            { key : "black", value : this.getCopyOfColoredPieces('black')},
            { key : "castle", value:  this.cache.fenParts['castleCode'] },
            { key : "halfMoves", value: this.getHalfMoves() },
            { key : "fullMoves", value: this.getFullMoves() },
            { key : "color", value: this.cache.fenParts['color'] },
            { key : "enPassant", value : this.cache.fenParts['enPassant'] }
        ];

        if (!this.cache['board'][to] && (this.cache['board'][from] !== 0x01 && this.cache['board'][from]!== 0x09)) {
            this.incrementHalfMoves();
        }else{
            this.resetHalfMoves();
        }

        var enPassant = '-';

        switch(this.cache['board'][from]){
            case 0x03:
            case 0x0B:
                var rook,offset;
                this.disableCastle(from);

                this.cache['king' + Board0x88Config.numberToColorMapping[this.cache['board'][from]]].s = to;
                if(this.getDistance(from,to) > 1){
                    if (this.cache['board'][from] === 0x03) {
                        rook = 0x06;
                        offset = 0;
                    } else {
                        rook = 0x0E;
                        offset = 112;
                    }
                    if (from < to) {
                        this.updatePiece(7 + offset, 5 + offset);
                        this.movePiece(7 + offset, 5 + offset);
                    } else {
                        this.updatePiece(0 + offset, 3 + offset);
                        this.movePiece(0 + offset, 3 + offset);
                    }
        }
                break;
            case 0x01:
            case 0x09:
                if (this.isEnPassantMove(from, to)) {
                    if (Board0x88Config.numberToColorMapping[this.cache['board'][from]] == 'black') {
                        this.deletePiece(to+16);
                        this.cache['board'][to + 16] = undefined;
                    } else {
                        this.deletePiece(to-16);
                        this.cache['board'][to - 16] = undefined;
                    }
                }

                if(this.getDistance(from,to) > 1 && (this.cache['board'][to-1] || this.cache['board'][to+1])){
                    enPassant = to > from ? from + 16 : from - 16;
                    enPassant = Board0x88Config.numberToSquareMapping[enPassant];
                }

                if(promoteTo){
                    if(this.cache['board'][from] > 0x08){
                        promoteTo += 8;
                    }
                    this.updatePieceType(from, promoteTo);
                }
                break;
            case 0x06:
                if(from === 0)this.disableCastleCode(Board0x88Config.castle['Q']);
                if(from === 7)this.disableCastleCode(Board0x88Config.castle['K']);
                break;
            case 0x0E:
                if(from === Board0x88Config.mapping['a8'])this.disableCastleCode(Board0x88Config.castle['q']);
                if(from === Board0x88Config.mapping['h8'])this.disableCastleCode(Board0x88Config.castle['k']);
                break;
        }

        this.setEnPassantSquare(enPassant);

        this.updatePiece(from, to);

        if(this.cache['board'][to]){
            this.deletePiece(to);
            this.historyCurrentMove.push({
                key : 'addToBoard', square : to, type : this.cache['board'][to]
            })
        }
        this.movePiece(from, to);
        if(promoteTo)this.cache['board'][to] = promoteTo;

        if(this.cache.fenParts['color'] === 'b')this.incrementFullMoves();
        this.setNewColor();
        this.madeMoves.push(this.historyCurrentMove);
    },

    movePiece:function(from, to){
        this.historyCurrentMove.push({
            key : 'addToBoard', square : from, type: this.cache['board'][from]
        });
        this.historyCurrentMove.push({
            key : 'removeFromBoard', square : to
        });
        this.cache['board'][to] = this.cache['board'][from];
        delete this.cache['board'][from];
    },

    unmakeMove:function(){
        var changes = this.madeMoves.pop();

        for(var i=changes.length-1;i>=0;i--){
            var item = changes[i];
            switch(item.key){
                case 'white':
                    this.cache['white'] = item.value;
                    break;
                case 'black':
                    this.cache['black'] = item.value;
                    break;
                case 'color':
                    this.cache.fenParts['color'] = item.value;
                    break;
                case 'castle':
                    this.cache.fenParts['castleCode'] = item.value;
                    break;
                case 'halfMoves':
                    this.cache.fenParts['halfMoves'] = item.value;
                    break;
                case 'fullMoves':
                    this.cache.fenParts['fullMoves'] = item.value;
                    break;
                case 'enPassant':
                    this.cache.fenParts['enPassant'] = item.value;
                    break;
                case 'addToBoard':
                    this.cache['board'][item.square] = item.type;
                    break;
                case 'removeFromBoard':
                    this.cache['board'][item.square] = undefined;
                    break;

            }
        }
    },

    updatePiece:function(from, to){
        var color = Board0x88Config.numberToColorMapping[this.cache['board'][from]];
        for(var i=0;i<this.cache[color].length;i++){
            if(this.cache[color][i].s === from){
                this.cache[color][i] = { s: to, t: this.cache[color][i].t };
                return;
            }
        }
    },

    updatePieceType:function(square, type){
        var color = Board0x88Config.numberToColorMapping[this.cache['board'][square]];
        for(var i=0;i<this.cache[color].length;i++){
            if(this.cache[color][i].s === square){
                this.cache[color][i] = { s: this.cache[color][i].s, t : type };
                return;
            }
        }
    },

    deletePiece:function(square){
        var color = Board0x88Config.numberToColorMapping[this.cache['board'][square]];
        for(var i=0;i<this.cache[color].length;i++){
            if(this.cache[color][i].s === square){
                this.cache[color].splice(i,1);
                return;
            }
        }
    },

    disableCastle:function(from){
        var codes = this.cache['board'][from] < 9 ? [4,8] : [1,2];
        this.disableCastleCode(codes[0]);
        this.disableCastleCode(codes[1]);
    },

    disableCastleCode:function(code){
        if((this.cache.fenParts['castleCode'] & code) > 0) this.cache.fenParts['castleCode'] -= code;
    },

	incrementFullMoves:function () {
		this.cache.fenParts['fullMoves']++;
	},
	incrementHalfMoves:function () {
		this.cache.fenParts['halfMoves']++;
	},
	resetHalfMoves:function () {
		this.cache.fenParts['halfMoves'] = 0;
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
			this.fen = this.getNewFen();
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
				if (this.isEnPassantMove(move.from, move.to) || this.cache['board'][move.to]) {
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

	/**
	 * Returns new fen based on current board position
	 * @method getNewFen
	 * @return {String}
	 */
	getNewFen:function () {
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

		return [fen, this.getColorCode(), this.getCastle(), this.cache.fenParts['enPassant'], this.getHalfMoves(), this.getFullMoves()].join(' ');
	},

    /**
     * Return relative mobility of white compared to white. 0.5 is equal mobility
     * @method getMobility
     * @return {Number}
     */
    getMobility:function(){
        var mw = this.getCountValidMoves('white');
        var mb = this.getCountValidMoves('black');
        return mw / (mw + mb);
    },

    getCountValidMoves:function(color){
        var c = 0;
        var moves = this.getValidMovesAndResult(color).moves;
        for(var key in moves){
            if(moves.hasOwnProperty(key)){
                c+= moves[key].length;
            }
        }
        return c;
    },

    evaluate:function(){
        var res = this.getValidMovesAndResult();
        var score = this.getMaterialScore();
        score += this.getMobility() * 2;
        return score;
    },

    /**
     * Return squares of hanging pieces
     * @method getHangingPieces
     * @param {String} color
     * @return {Array}
    */
    getHangingPieces:function(color){
        var ret = [];
        var m = this.getValidMovesAndResult(color);
        var c = this.getCaptureAndProtectiveMoves(color);
        var king = this.getKing(color);
        for(var key in m.moves){
            if(m.moves.hasOwnProperty(key)){
                if(key != king.s && c.indexOf(parseInt(key)) === -1)ret.push(key);
            }
        }
        return ret;
    },
    /**
     * Return squares of hanging pieces translated from numeric format to board notations, eg. 0 to a1, 1 to b1
     * @method getHangingSquaresTranslated
     * @param {String} color
     * @return {Array}
     */
    getHangingSquaresTranslated:function(color){
        var hanging = this.getHangingPieces(color);
        for(var i=0;i<hanging.length;i++){
            hanging[i] = Board0x88Config.numberToSquareMapping[hanging[i]];
        }
        return hanging;
    },

    getMaterialScore:function(){
        return this.getValueOfPieces('white') - this.getValueOfPieces('black');
    },

    getValueOfPieces:function(color){
        var ret = 0;
        var pieces = this.getPiecesOfAColor(color);
        for(var i=0;i<pieces.length;i++){
            ret += Board0x88Config.pieceValues[pieces[i].t];
        }
        return ret;
    }
});