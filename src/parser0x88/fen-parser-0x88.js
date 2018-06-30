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

    madeMoves: [],

    bc: Board0x88Config,
    lan: undefined,

    initialize: function (fen) {
        this.lan = chess.language.pieces;
        if (fen) {
            this.setFen(fen);
        }
    },

    /**
     * Set a new position
     * @method setFen
     * @param {String} fen
     */
    setFen: function (fen) {
        this.c = {
            fenParts: {},
            'board': [],
            'white': [],
            'black': [],
            'whiteSliding': [],
            'blackSliding': [],
            'k': { 'white': undefined, 'black': 'undefined' }
        };
        this.fen = fen;
        this.updateFenArray(fen);
        this.parseFen();
        this.madeMoves = [];
    },

    updateFenArray: function () {
        var fenParts = this.fen.split(' ');

        this.c.fenParts = {
            'pieces': fenParts[0],
            'color': fenParts[1],
            'castleCode': this.bc.castleToNumberMapping[fenParts[2]],
            'enPassant': fenParts[3],
            'halfMoves': fenParts[4],
            'fullMoves': fenParts[5]
        };
    },

    /**
     * Parses current fen and stores board information internally
     * @method parseFen
     */
    parseFen: function () {
        var pos = 0;

        var squares = this.bc.fenSquares;
        var index, type, piece;
        for (var i = 0, len = this.c.fenParts['pieces'].length; i < len; i++) {
            var token = this.c.fenParts['pieces'].substr(i, 1);

            if (this.bc.fenPieces[token]) {
                index = this.bc.mapping[squares[pos]];
                type = this.bc.pieces[token];
                piece = {
                    t: type,
                    s: index
                };
                // Board array
                this.c['board'][index] = type;

                // White and black array
                this.c[this.bc.colorMapping[token]].push(piece);

                // King array
                if (this.bc.typeMapping[type] == 'k') {
                    this.c['k' + ((piece.t & 0x8) > 0 ? 'black' : 'white')] = piece;
                }
                pos++;
            } else if (i < len - 1 && this.bc.numbers[token]) {
                var token2 = this.c.fenParts['pieces'].substr(i + 1, 1);
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
    getPieces: function () {
        return this.c['white'].append(this.c['black']);
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
    getKing: function (color) {
        return this.c['k' + color];
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
    getPiecesOfAColor: function (color) {
        return this.c[color]
    },

    /**
     @method getEnPassantSquare
     @return {String|null}
     @example
     var fen = '5k2/8/8/3pP3/8/8/8/7K w - d6 0 1';
     var parser = new chess.parser.FenParser0x88(fen);
     alert(parser.getEnPassantSquare()); // alerts 'd6'
     */
    getEnPassantSquare: function () {
        var enPassant = this.c.fenParts['enPassant'];
        if (enPassant != '-') {
            return enPassant;
        }
        return undefined;
    },
    setEnPassantSquare: function (square) {
        this.c.fenParts['enPassant'] = square;
    },

    getSlidingPieces: function (color) {
        return this.c[color + 'Sliding'];
    },

    getHalfMoves: function () {
        return this.c.fenParts['halfMoves'];
    },

    getFullMoves: function () {
        return this.c.fenParts['fullMoves'];
    },

    canCastleKingSide: function (color) {
        var code = color === 'white' ? this.bc.castle['K'] : this.bc.castle['k'];
        return this.c.fenParts.castleCode & code;
    },

    canCastleQueenSide: function (color) {
        var code = color === 'white' ? this.bc.castle['Q'] : this.bc.castle['q'];
        return this.c.fenParts.castleCode & code;
    },

    getColor: function () {
        return this.bc.colorAbbreviations[this.c.fenParts['color']];
    },

    getColorCode: function () {
        return this.c.fenParts['color'];
    },

    /**
     Return information about piece on square in human readable format
     @method getPieceOnSquare
     @param {Number} square
     @return {Object}
     @example
     var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
     var parser = new chess.parser.FenParser0x88(fen);
     console.log(parser.getPieceOnSquare(this.bc.mapping['e2']));
     will return an object like this:
     @example
     {
         "square": "e2",
         "type": 'p',
         "color": "white",
         "sliding": 0
     }
     */
    getPieceOnSquare: function (square) {
        var piece = this.c['board'][square];
        if (piece) {
            return {
                square: this.bc.numberToSquareMapping[square],
                type: this.bc.typeMapping[piece],
                color: (piece & 0x8) > 0 ? 'black' : 'white',
                sliding: (piece & 0x4) > 0
            }
        }
        return undefined;
    },

    getPieceTypeOnSquare: function (square) {
        return this.c['board'][square];
    },
    /**
     * Returns true if two squares are on the same rank. Squares are in the 0x88 format, i.e.
     * a1=0,a2=16. You can use this.bc.mapping to get a more readable code.
     @method isOnSameRank
     @param {Number} square1
     @param {Number} square2
     @return {Boolean}
     @example
     var parser = new chess.parser.FenParser0x88();
     console.log(parser.isOnSameSquare(0,16)); // a1 and a2 -> false
     console.log(parser.isOnSameSquare(0,1)); // a1 and b1 -> true
     */
    isOnSameRank: function (square1, square2) {
        return (square1 & 240) === (square2 & 240);
    },

    /**
     * Returns rank 0-7 where 0 is first rank and 7 is last rank
     * @function rank
     * @param {Number|String} square
     * @returns {number}
     */
    rank: function (square) {
        if (square.substr != undefined) {
            square = this.bc.mapping[square];
        }
        return (square & 240) / 16;
    },

    /**
     * Returns true if two squares are on the same file. Squares are in the 0x88 format, i.e.
     * a1=0,a2=16. You can use this.bc.mapping to get a more readable code.
     @method isOnSameFile
     @param {Number} square1
     @param {Number} square2
     @return {Boolean}
     @example
     var parser = new chess.parser.FenParser0x88();
     console.log(parser.isOnSameFile(0,16)); // a1 and a2 -> true
     console.log(parser.isOnSameFile(0,1)); // a1 and b1 -> false
     */
    isOnSameFile: function (square1, square2) {
        return (square1 & 15) === (square2 & 15);
    },

    secondParser: undefined,

    isCheckmate: function (fen, move) {
        if (this.secondParser == undefined) {
            this.secondParser = new chess.parser.FenParser0x88();
        }

        var p = this.secondParser;
        p.setFen(fen);
        p.move(move);
        var notation = p.notation;

        return notation.indexOf('#') > 0 ? notation : undefined;

    },

    getAllMovesReadable: function () {
        var obj = this.getValidMovesAndResult();
        var moves = obj.moves;
        var ret = [];
        var promoteTo = ['R', 'N', 'B', 'Q'];
        jQuery.each(moves, function (from, toSquares) {
            var fs = this.bc.numberToSquareMapping[from];
            jQuery.each(toSquares, function (i, toSquare) {
                var addPromotion = false;
                var rank = this.rank(toSquare);
                if (rank == 0 || rank == 7) {
                    var p = this.getPieceOnSquare(from);
                    if (p.type == 'p') addPromotion = true;
                }
                var ts = this.bc.numberToSquareMapping[toSquare];
                if (addPromotion) {
                    jQuery.each(promoteTo, function (i, promote) {
                        ret.push({
                            from: fs,
                            to: ts,
                            promoteTo: promote
                        })
                    });
                } else {
                    ret.push({
                        from: fs,
                        to: ts
                    })
                }

            }.bind(this))

        }.bind(this));

        return ret;
    },

    getAllCheckmateMoves: function () {
        var fen = this.getFen();
        var moves = this.getAllMovesReadable();
        var ret = [];
        jQuery.each(moves, function (i, m) {
            var notation = this.getNotationForAMove(m);

            if (this.isCheckmate(fen, m)) {
                ret.push(notation + '#');
            }
        }.bind(this));
        return ret;
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
    getValidMovesAndResult: function (color) {
        color = color || this.getColor();
        var ret = {}, directions;
        var enPassantSquare = this.getEnPassantSquare();
        if (enPassantSquare) {
            enPassantSquare = this.bc.mapping[enPassantSquare];
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
            pieces = this.c[color];
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
                    if (!pinned[piece.s] || (pinned[piece.s] && this.isOnSameFile(piece.s, pinned[piece.s].by))) {
                        if (!this.c['board'][piece.s + 16]) {
                            paths.push(piece.s + 16);
                            if (piece.s < 32) {
                                if (!this.c['board'][piece.s + 32]) {
                                    paths.push(piece.s + 32);
                                }
                            }
                        }
                    }
                    if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s + 15)) {
                        if (enPassantSquare == piece.s + 15 || (this.c['board'][piece.s + 15]) && (this.c['board'][piece.s + 15] & 0x8) > 0) {
                            paths.push(piece.s + 15);
                        }
                    }
                    if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s + 17)) {
                        if (enPassantSquare == piece.s + 17 || (this.c['board'][piece.s + 17]) && (this.c['board'][piece.s + 17] & 0x8) > 0) {
                            paths.push(piece.s + 17);
                        }
                    }
                    break;
                case 0x09:
                    if (!pinned[piece.s] || (pinned[piece.s] && this.isOnSameFile(piece.s, pinned[piece.s].by))) {
                        if (!this.c['board'][piece.s - 16]) {
                            paths.push(piece.s - 16);
                            if (piece.s > 87) {
                                if (!this.c['board'][piece.s - 32]) {
                                    paths.push(piece.s - 32);
                                }
                            }
                        }
                    }
                    if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s - 15)) {
                        if (enPassantSquare == piece.s - 15 || (this.c['board'][piece.s - 15]) && (this.c['board'][piece.s - 15] & 0x8) === 0) {
                            paths.push(piece.s - 15);
                        }
                    }
                    if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s - 17)) {
                        if (enPassantSquare == piece.s - 17 || (this.c['board'][piece.s - 17]) && (this.c['board'][piece.s - 17] & 0x8) === 0) {
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
                    directions = this.bc.movePatterns[piece.t];
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
                            if (this.c['board'][square]) {
                                if ((WHITE && (this.c['board'][square] & 0x8) > 0) || (!WHITE && (this.c['board'][square] & 0x8) === 0)) {
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
                    directions = this.bc.movePatterns[piece.t];

                    for (a = 0; a < directions.length; a++) {
                        square = piece.s + directions[a];
                        if ((square & 0x88) === 0) {
                            if (this.c['board'][square]) {
                                if ((WHITE && (this.c['board'][square] & 0x8) > 0) || (!WHITE && (this.c['board'][square] & 0x8) === 0)) {
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
                    directions = this.bc.movePatterns[piece.t];
                    for (a = 0; a < directions.length; a++) {
                        square = piece.s + directions[a];
                        if ((square & 0x88) === 0) {
                            if (protectiveMoves.indexOf(square) == -1) {
                                if (this.c['board'][square]) {
                                    if ((WHITE && (this.c['board'][square] & 0x8) > 0) || (!WHITE && (this.c['board'][square] & 0x8) === 0)) {
                                        paths.push(square);
                                    }
                                } else {
                                    paths.push(square);
                                }
                            }
                        }
                    }
                    if (kingSideCastle && !this.c['board'][piece.s + 1] && !this.c['board'][piece.s + 2] && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s + 2) == -1) {
                        paths.push(piece.s + 2);
                    }
                    if (queenSideCastle && !this.c['board'][piece.s - 1] && !this.c['board'][piece.s - 2] && !this.c['board'][piece.s - 3] && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s - 1) == -1 && protectiveMoves.indexOf(piece.s - 2) == -1) {
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
        return { moves: ret, result: result, check: checks };
    },

    fullMap: undefined,
    /**
     * Returns full map of squares for instructor board
     */
    getFullSquareMap: function () {
        if (!this.fullMap) {
            this.fullMap = {};
            var s = Board0x88Config.fenSquaresNumeric;
            for (var i = 0; i < s.length; i++) {
                this.fullMap[s[i]] = s;
            }
        }
        return this.fullMap;
    },


    getMovesAndResultLinear: function (color) {
        color = color || this.getColor();
        var directions;
        var enPassantSquare = this.getEnPassantSquare();
        if (enPassantSquare) {
            enPassantSquare = this.bc.mapping[enPassantSquare];
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
            pieces = this.c[color];
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
                    if (!pinned[piece.s] || (pinned[piece.s] && this.isOnSameFile(piece.s, pinned[piece.s].by))) {
                        if (!this.c['board'][piece.s + 16]) {
                            paths.push([piece.s, piece.s + 16]);
                            if (piece.s < 32) {
                                if (!this.c['board'][piece.s + 32]) {
                                    paths.push([piece.s, piece.s + 32]);
                                }
                            }
                        }
                    }
                    if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s + 15)) {
                        if (enPassantSquare == piece.s + 15 || (this.c['board'][piece.s + 15]) && (this.c['board'][piece.s + 15] & 0x8) > 0) {
                            paths.push([piece.s, piece.s + 15]);
                        }
                    }
                    if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s + 17)) {
                        if (enPassantSquare == piece.s + 17 || (this.c['board'][piece.s + 17]) && (this.c['board'][piece.s + 17] & 0x8) > 0) {
                            paths.push([piece.s, piece.s + 17]);
                        }
                    }
                    break;
                case 0x09:
                    if (!pinned[piece.s] || (pinned[piece.s] && this.isOnSameFile(piece.s, pinned[piece.s].by))) {
                        if (!this.c['board'][piece.s - 16]) {
                            paths.push([piece.s, piece.s - 16]);
                            if (piece.s > 87) {
                                if (!this.c['board'][piece.s - 32]) {
                                    paths.push([piece.s, piece.s - 32]);
                                }
                            }
                        }
                    }
                    if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s - 15)) {
                        if (enPassantSquare == piece.s - 15 || (this.c['board'][piece.s - 15]) && (this.c['board'][piece.s - 15] & 0x8) === 0) {
                            paths.push([piece.s, piece.s - 15]);
                        }
                    }
                    if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s - 17)) {
                        if (enPassantSquare == piece.s - 17 || (this.c['board'][piece.s - 17]) && (this.c['board'][piece.s - 17] & 0x8) === 0) {
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
                    directions = this.bc.movePatterns[piece.t];
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
                            if (this.c['board'][square]) {
                                if ((WHITE && (this.c['board'][square] & 0x8) > 0) || (!WHITE && (this.c['board'][square] & 0x8) === 0)) {
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
                    directions = this.bc.movePatterns[piece.t];

                    for (a = 0; a < directions.length; a++) {
                        square = piece.s + directions[a];
                        if ((square & 0x88) === 0) {
                            if (this.c['board'][square]) {
                                if ((WHITE && (this.c['board'][square] & 0x8) > 0) || (!WHITE && (this.c['board'][square] & 0x8) === 0)) {
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
                    directions = this.bc.movePatterns[piece.t];
                    for (a = 0; a < directions.length; a++) {
                        square = piece.s + directions[a];
                        if ((square & 0x88) === 0) {
                            if (protectiveMoves.indexOf(square) == -1) {
                                if (this.c['board'][square]) {
                                    if ((WHITE && (this.c['board'][square] & 0x8) > 0) || (!WHITE && (this.c['board'][square] & 0x8) === 0)) {
                                        if (!validSquares || validSquares.indexOf(square) >= 0) paths.push([piece.s, square]);
                                    }
                                } else {
                                    if (!validSquares || validSquares.indexOf(square) >= 0) paths.push([piece.s, square]);
                                }
                            }
                        }
                    }
                    if (kingSideCastle && !this.c['board'][piece.s + 1] && !this.c['board'][piece.s + 2] && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s + 2) == -1) {
                        if (!validSquares || validSquares.indexOf(square) >= 0) paths.push([piece.s, piece.s + 2]);
                    }
                    if (queenSideCastle && !this.c['board'][piece.s - 1] && !this.c['board'][piece.s - 2] && !this.c['board'][piece.s - 3] && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s - 1) == -1 && protectiveMoves.indexOf(piece.s - 2) == -1) {
                        if (!validSquares || validSquares.indexOf(square) >= 0) paths.push([piece.s, piece.s - 2]);
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
        return { moves: paths, result: result, check: checks };

    },

    excludeInvalidSquares: function (squares, validSquares) {
        var ret = [];
        for (var i = 0; i < squares.length; i++) {
            if (validSquares.indexOf(squares[i]) >= 0) {
                ret.push(squares[i]);
            }
        }
        return ret;
    },

    /* This method returns a comma separated string of moves since it's faster to work with than arrays*/
    getCaptureAndProtectiveMoves: function (color) {
        var ret = [], directions, square, a;

        var pieces = this.c[color];
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
                    directions = this.bc.movePatterns[piece.t];
                    for (a = 0; a < directions.length; a++) {
                        square = piece.s + directions[a];
                        while ((square & 0x88) === 0) {
                            if (this.c['board'][square] && square !== oppositeKingSquare) {
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
                    directions = this.bc.movePatterns[piece.t];
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
                    directions = this.bc.movePatterns[piece.t];
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
    getSlidingPiecesAttackingKing: function (color) {
        var ret = [];
        var king = this.c['k' + (color === 'white' ? 'black' : 'white')];
        var pieces = this.c[color];
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
                            ret.push({ s: piece.s, direction: boardDistance });
                        }
                        break;
                    // Rook
                    case 0x06:
                    case 0x0E:
                        if (numericDistance % 16 === 0) {
                            ret.push({ s: piece.s, direction: boardDistance });
                        }
                        // Rook on same rank as king
                        else if (this.isOnSameRank(piece.s, king.s)) {
                            ret.push({ s: piece.s, direction: numericDistance > 0 ? 1 : -1 })
                        }
                        break;
                    // Queen
                    case 0x07:
                    case 0x0F:
                        if (numericDistance % 15 === 0 || numericDistance % 17 === 0 || numericDistance % 16 === 0) {
                            ret.push({ s: piece.s, direction: boardDistance });
                        }
                        else if (this.isOnSameRank(piece.s, king.s)) {
                            ret.push({ s: piece.s, direction: numericDistance > 0 ? 1 : -1 })
                        }
                        break;
                }
            }
        }
        return ret;
    },

    /**
     Return array of the squares where pieces are pinned, i.e. cannot move.
     Squares are in the 0x88 format. You can use this.bc.numberToSquareMapping
     to translate to readable format, example: this.bc.numberToSquareMapping[16] will give you 'a2'
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
    getPinned: function (color) {
        var ret = {};
        var pieces = this.getSlidingPiecesAttackingKing((color === 'white' ? 'black' : 'white'));
        var WHITE = color === 'white';
        var king = this.c['k' + color];
        var i = 0;
        while (i < pieces.length) {
            var piece = pieces[i];
            var square = piece.s + piece.direction;
            var countPieces = 0;

            var pinning = '';
            while (square !== king.s && countPieces < 2) {
                if (this.c['board'][square]) {
                    countPieces++;
                    if ((!WHITE && (this.c['board'][square] & 0x8) > 0) || (WHITE && (this.c['board'][square] & 0x8) === 0)) {
                        pinning = square;
                    } else {
                        break;
                    }
                }
                square += piece.direction;
            }
            if (countPieces === 1 && pinning) {
                ret[pinning] = { 'by': piece.s, 'direction': piece.direction };
            }
            i++;
        }
        if (ret.length === 0) {
            return null;
        }
        return ret;
    },

    getPinnedReadable: function (color) {
        var pinned = this.getPinned(color);
        var ret = [];
        jQuery.each(pinned, function (square, by) {
            var obj = {
                king: this.bc.numberToSquareMapping[this.getKing(color).s],
                pinned: this.bc.numberToSquareMapping[square],
                by: this.bc.numberToSquareMapping[by.by]
            };
            ret.push(obj);
        }.bind(this));

        return ret;
    },

    getPinnedSquares: function (color) {
        var pinned = this.getPinnedReadable(color);
        var ret = [];
        jQuery.each(pinned, function (i, pinned) {
            ret.push(pinned.pinned);
        });
        return ret;

    },

    getValidSquaresOnCheck: function (color) {
        var ret = [], checks;
        var king = this.c['k' + color];
        var pieces = this.c[color === 'white' ? 'black' : 'white'];

        var enPassantSquare = this.getEnPassantSquare();
        if (enPassantSquare) {
            enPassantSquare = this.bc.mapping[enPassantSquare];
        }

        for (var i = 0; i < pieces.length; i++) {
            var piece = pieces[i];

            switch (piece.t) {
                case 0x01:
                    if (king.s === piece.s + 15 || king.s === piece.s + 17) {
                        var ret = [piece.s];
                        if (enPassantSquare == piece.s - 16) {
                            ret.push(enPassantSquare);
                        }
                        return ret;
                    }
                    break;
                case 0x09:
                    if (king.s === piece.s - 15 || king.s === piece.s - 17) {
                        var ret = [pieces.s];
                        if (enPassantSquare == piece.s + 16) {
                            ret.push(enPassantSquare);
                        }
                        return ret;
                    }
                    break;
                // knight
                case 0x02:
                case 0x0A:
                    if (this.getDistance(piece.s, king.s) === 2) {
                        var directions = this.bc.movePatterns[piece.t];
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

    getBishopCheckPath: function (piece, king) {
        if ((king.s - piece.s) % 15 === 0 || (king.s - piece.s) % 17 === 0) {
            var direction = (king.s - piece.s) / this.getDistance(piece.s, king.s);
            var square = piece.s + direction;
            var pieceFound = false;
            var squares = [piece.s];
            while (square !== king.s && !pieceFound) {
                squares.push(square);
                if (this.c['board'][square]) {
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

    getRookCheckPath: function (piece, king) {
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
                if (this.c['board'][square]) {
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


    getCountChecks: function (kingColor, moves) {
        var king = this.c['k' + kingColor];
        var index = moves.indexOf(king.s);
        if (index >= 0) {
            if (moves.indexOf(king.s, index + 1) >= 0) {
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
    getDistance: function (sq1, sq2) {
        return this.bc.distances[sq2 - sq1 + (sq2 | 7) - (sq1 | 7) + 240];
    },


    getPiecesInvolvedInMove: function (move) {
        var ret = [
            { from: move.from, to: move.to }
        ];
        var square;
        move = {
            from: this.bc.mapping[move.from],
            to: this.bc.mapping[move.to],
            promoteTo: move.promoteTo
        };

        var color = (this.c['board'][move.from] & 0x8) ? 'black' : 'white';

        if (this.isEnPassantMove(move.from, move.to)) {
            if (color == 'black') {
                square = move.to + 16;

            } else {
                square = move.to - 16;
            }
            ret.push({ capture: this.bc.numberToSquareMapping[square] })
        }

        if (this.isCastleMove(move)) {
            if ((move.from & 15) < (move.to & 15)) {
                ret.push({
                    from: 'h' + (color == 'white' ? 1 : 8),
                    to: 'f' + (color == 'white' ? 1 : 8)
                });
            } else {
                ret.push({
                    from: 'a' + (color == 'white' ? 1 : 8),
                    to: 'd' + (color == 'white' ? 1 : 8)
                });
            }
        }

        if (move.promoteTo) {
            ret.push({
                promoteTo: move.promoteTo, square: this.bc.numberToSquareMapping[move.to]
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
	 		from: this.bc.mapping['e5'],
	 		to: this.bc.mapping['e6']
	 	}
     console.log(parser.isEnPassantMove(move);

     Move is an object and requires properties "from" and "to" which is a numeric square(according to a 0x88 board).
     */
    isEnPassantMove: function (from, to) {


        if ((this.c['board'][from] === 0x01 || this.c['board'][from] == 0x09)) {
            if (
                !this.c['board'][to] &&
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
    isCastleMove: function (move) {
        if ((this.c['board'][move.from] === 0x03 || this.c['board'][move.from] == 0x0B)) {
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
    makeMoveByNotation: function (notation) {
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
    makeMoveByObject: function (move) {
        this.makeMove(
            this.bc.mapping[move.from],
            this.bc.mapping[move.to],
            move.promoteTo ? this.bc.typeToNumberMapping[move.promoteTo] : undefined
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
    hasThreeFoldRepetition: function (fens) {
        if (!fens || fens.length === 0) return false;
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

    getTruncatedFenWithColorAndCastle: function (fen) {
        return fen.split(/\s/g).slice(0, 3).join(' ');
    },

    getPromoteByNotation: function (notation) {
        if (notation.indexOf('=') > 0) {
            var piece = notation.replace(/^.*?=([QRBN]).*$/, '$1');
            return this.bc.pieceAbbr[piece];
        }
        if (notation.match(/[a-h][18][NBRQ]/)) {
            notation = notation.replace(/[^a-h18NBRQ]/g, '');
            return this.bc.pieceAbbr[notation.substr(notation.length - 1, 1)];
        }
        return '';
    },

    getFromAndToByNotation: function (notation) {
        var ret = { promoteTo: this.getPromoteByNotation(notation) };
        var color = this.getColor();
        var offset = 0;
        if (color === 'black') {
            offset = 112;
        }
        var validMoves = this.getValidMovesAndResult().moves;

        var foundPieces = [], offsets, sq, i;
        if (notation === 'OO') notation = 'O-O';
        if (notation === 'OOO') notation = 'O-O-O';
        if (notation.length === 2) {
            var square = this.bc.mapping[notation];
            ret.to = this.bc.mapping[notation];
            var direction = color === 'white' ? -16 : 16;
            if (this.c['board'][square + direction]) {
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
            var capture = notation.indexOf('x') > 0;
            ret.to = this.getToSquareByNotation(notation);

            switch (pieceType) {
                case 0x01:
                case 0x09:
                    if (color === 'black') {
                        offsets = capture ? [15, 17] : [16];
                        if (ret.to > 48) {
                            offsets.push(32);
                        }
                    } else {
                        offsets = capture ? [-15, -17] : [-16];
                        if (ret.to < 64) {
                            offsets.push(-32);
                        }
                    }
                    for (i = 0; i < offsets.length; i++) {
                        sq = ret.to + offsets[i];
                        if (this.c['board'][sq] && this.c['board'][sq] === pieceType && validMoves[sq].indexOf(ret.to) >= 0) {
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
                    var pattern = this.bc.movePatterns[pieceType];
                    for (i = 0; i < pattern.length; i++) {
                        sq = ret.to + pattern[i];
                        if ((sq & 0x88) === 0) {
                            if (this.c['board'][sq] && this.c['board'][sq] === pieceType && validMoves[sq].indexOf(ret.to) >= 0) {
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
                    var patterns = this.bc.movePatterns[pieceType];

                    for (i = 0; i < patterns.length; i++) {
                        sq = ret.to + patterns[i];
                        while ((sq & 0x88) === 0) {
                            if (this.c['board'][sq] && this.c['board'][sq] === pieceType && validMoves[sq].indexOf(ret.to) >= 0) {
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
        ret.from = this.bc.numberToSquareMapping[ret.from];
        ret.to = this.bc.numberToSquareMapping[ret.to];

        return ret;
    },
    /**
     Get from rank by notation, 0 is first rank, 16 is second rank, 32 is third rank etc.
     @method getFromRankByNotation
     @param {String} notation
     @return {Number}
     */
    getFromRankByNotation: function (notation) {
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
    getFromFileByNotation: function (notation) {
        notation = notation.replace(/^.*([a-h]).*[a-h].*$/g, '$1');
        if (notation.length > 1) {
            return null;
        }
        return this.bc.files[notation];
    },
    /**
     * Return numeric destination square by notation.
     * @method getToSquareByNotation
     * @param {String} notation
     * @return {Number} square
     */
    getToSquareByNotation: function (notation) {
        return this.bc.mapping[notation.replace(/.*([a-h][1-8]).*/g, '$1')];
    },

    getPieceTypeByNotation: function (notation, color) {
        notation = notation.replace(/=[NBRQ]/, '');
        if (notation === 'O-O-O' || notation === 'O-O') {
            notation = 'K';
        } else {
            notation = notation.replace(/.*?([NRBQK]).*/g, '$1');
            if (!notation || notation.length > 1) {
                notation = 'P';
            }
        }

        notation = this.bc.pieces[notation];
        if (color === 'black') {
            notation += 8;
        }

        return notation;
    },

    move: function (move) {
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
            this.bc.mapping[move.from],
            this.bc.mapping[move.to],
            move.promoteTo ? this.bc.typeToNumberMapping[move.promoteTo] : undefined
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

    setNewColor: function () {
        this.c.fenParts['color'] = (this.c.fenParts['color'] == 'w') ? 'b' : 'w';

    },

    getCastle: function () {
        return this.bc.castleMapping[this.c.fenParts['castleCode']];
    },

    historyCurrentMove: [],

    getCopyOfColoredPieces: function (color) {
        var ret = [];
        for (var i = 0; i < this.c[color].length; i++) {
            ret.push({ s: this.c[color][i].s, t: this.c[color][i].t });
        }
        return ret;
    },

    /**
     * Used on comp eval. Valid from and to is assumed
     * @param {Number} from
     * @param {Number} to
     * @param {String} promoteTo
     */
    makeMove: function (from, to, promoteTo) {
        this.historyCurrentMove = [
            { key: "white", value: this.getCopyOfColoredPieces('white') },
            { key: "black", value: this.getCopyOfColoredPieces('black') },
            { key: "castle", value: this.c.fenParts['castleCode'] },
            { key: "halfMoves", value: this.getHalfMoves() },
            { key: "fullMoves", value: this.getFullMoves() },
            { key: "color", value: this.c.fenParts['color'] },
            { key: "enPassant", value: this.c.fenParts['enPassant'] }
        ];

        if (!this.c['board'][to] && (this.c['board'][from] !== 0x01 && this.c['board'][from] !== 0x09)) {
            this.incrementHalfMoves();
        } else {
            this.resetHalfMoves();
        }

        var enPassant = '-';

        switch (this.c['board'][from]) {
            case 0x03:
            case 0x0B:
                var rook, offset;
                this.disableCastle(from);

                this.c['k' + this.bc.numberToColorMapping[this.c['board'][from]]].s = to;
                if (this.getDistance(from, to) > 1) {
                    if (this.c['board'][from] === 0x03) {
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
                    if (this.bc.numberToColorMapping[this.c['board'][from]] == 'black') {
                        this.deletePiece(to + 16);
                        this.c['board'][to + 16] = undefined;
                    } else {
                        this.deletePiece(to - 16);
                        this.c['board'][to - 16] = undefined;
                    }
                }

                if (this.getDistance(from, to) > 1 && (this.c['board'][to - 1] || this.c['board'][to + 1])) {
                    enPassant = to > from ? from + 16 : from - 16;
                    enPassant = this.bc.numberToSquareMapping[enPassant];
                }

                if (promoteTo) {
                    if (this.c['board'][from] > 0x08) {
                        promoteTo += 8;
                    }
                    this.updatePieceType(from, promoteTo);
                }
                break;
            case 0x06:
                if (from === 0) this.disableCastleCode(this.bc.castle['Q']);
                if (from === 7) this.disableCastleCode(this.bc.castle['K']);
                break;
            case 0x0E:
                if (from === this.bc.mapping['a8']) this.disableCastleCode(this.bc.castle['q']);
                if (from === this.bc.mapping['h8']) this.disableCastleCode(this.bc.castle['k']);
                break;
        }

        this.setEnPassantSquare(enPassant);

        this.updatePiece(from, to);

        if (this.c['board'][to]) {
            this.deletePiece(to);
            this.historyCurrentMove.push({
                key: 'addToBoard', square: to, type: this.c['board'][to]
            })
        }
        this.movePiece(from, to);
        if (promoteTo) this.c['board'][to] = promoteTo;

        if (this.c.fenParts['color'] === 'b') this.incrementFullMoves();
        this.setNewColor();
        this.madeMoves.push(this.historyCurrentMove);
    },

    movePiece: function (from, to) {
        this.historyCurrentMove.push({
            key: 'addToBoard', square: from, type: this.c['board'][from]
        });
        this.historyCurrentMove.push({
            key: 'removeFromBoard', square: to
        });
        this.c['board'][to] = this.c['board'][from];
        delete this.c['board'][from];
    },

    unmakeMove: function () {
        var changes = this.madeMoves.pop();

        for (var i = changes.length - 1; i >= 0; i--) {
            var item = changes[i];
            switch (item.key) {
                case 'white':
                    this.c['white'] = item.value;
                    break;
                case 'black':
                    this.c['black'] = item.value;
                    break;
                case 'color':
                    this.c.fenParts['color'] = item.value;
                    break;
                case 'castle':
                    this.c.fenParts['castleCode'] = item.value;
                    break;
                case 'halfMoves':
                    this.c.fenParts['halfMoves'] = item.value;
                    break;
                case 'fullMoves':
                    this.c.fenParts['fullMoves'] = item.value;
                    break;
                case 'enPassant':
                    this.c.fenParts['enPassant'] = item.value;
                    break;
                case 'addToBoard':
                    this.c['board'][item.square] = item.type;
                    break;
                case 'removeFromBoard':
                    this.c['board'][item.square] = undefined;
                    break;

            }
        }
    },

    isValid: function (move) {
        var moves = this.getValidMovesAndResult().moves;
        return moves[this.bc.mapping[move.from]] != undefined &&
            moves[this.bc.mapping[move.from]].indexOf(this.bc.mapping[move.to]) >= 0;
    },

    updatePiece: function (from, to) {
        var color = this.bc.numberToColorMapping[this.c['board'][from]];
        for (var i = 0; i < this.c[color].length; i++) {
            if (this.c[color][i].s === from) {
                this.c[color][i] = { s: to, t: this.c[color][i].t };
                return;
            }
        }
    },

    updatePieceType: function (square, type) {
        var color = this.bc.numberToColorMapping[this.c['board'][square]];
        for (var i = 0; i < this.c[color].length; i++) {
            if (this.c[color][i].s === square) {
                this.c[color][i] = { s: this.c[color][i].s, t: type };
                return;
            }
        }
    },

    deletePiece: function (square) {
        var color = this.bc.numberToColorMapping[this.c['board'][square]];
        for (var i = 0; i < this.c[color].length; i++) {
            if (this.c[color][i].s === square) {
                this.c[color].splice(i, 1);
                return;
            }
        }
    },

    disableCastle: function (from) {
        var codes = this.c['board'][from] < 9 ? [4, 8] : [1, 2];
        this.disableCastleCode(codes[0]);
        this.disableCastleCode(codes[1]);
    },

    disableCastleCode: function (code) {
        if ((this.c.fenParts['castleCode'] & code) > 0) this.c.fenParts['castleCode'] -= code;
    },

    incrementFullMoves: function () {
        this.c.fenParts['fullMoves']++;
    },
    incrementHalfMoves: function () {
        this.c.fenParts['halfMoves']++;
    },
    resetHalfMoves: function () {
        this.c.fenParts['halfMoves'] = 0;
    },

    getPiecesInvolvedInLastMove: function () {
        return this.piecesInvolved;
    },

    getNotation: function () {
        return this.notation;
    },
    getLongNotation: function () {
        return this.longNotation;
    },
    /**
     * Return current fen position
     * @method getFen
     * @return {String} fen
     */
    getFen: function () {
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
    getLongNotationForAMove: function (move, shortNotation) {
        if (!shortNotation) {
            return "";
        }
        if (shortNotation.indexOf('O-') >= 0) {
            return shortNotation;
        }
        var fromSquare = move.from;
        var toSquare = move.to;


        var type = this.c['board'][this.bc.mapping[move.from]];
        type = this.bc.typeMapping[type];
        var separator = shortNotation.indexOf('x') >= 0 ? 'x' : '-';

        var ret = this.lan[type] + fromSquare + separator + toSquare;

        if (move.promoteTo) {
            ret += '=' + this.lan[move.promoteTo];
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
    getNotationForAMove: function (move) {
        move = {
            from: this.bc.mapping[move.from],
            to: this.bc.mapping[move.to],
            promoteTo: move.promoteTo
        };

        var type = this.c['board'][move.from];

        var ret = this.lan[this.bc.typeMapping[this.c['board'][move.from]]];

        switch (type) {
            case 0x01:
            case 0x09:

                if (this.isEnPassantMove(move.from, move.to) || this.c['board'][move.to]) {
                    ret += this.bc.fileMapping[move.from & 15] + 'x';
                }
                ret += this.bc.fileMapping[move.to & 15] + '' + this.bc.rankMapping[move.to & 240];
                if (move.promoteTo) {
                    var pr = this.lan[move.promoteTo] != undefined ? this.lan[move.promoteTo] : move.promoteTo;
                    ret += '=' + pr;
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
                    if (square != move.from && this.c['board'][square] === type) {
                        if (config.moves[square].indexOf(move.to) >= 0) {
                            if ((square & 15) != (move.from & 15)) {
                                ret += this.bc.fileMapping[move.from & 15];
                            }
                            else if ((square & 240) != (move.from & 240)) {
                                ret += this.bc.rankMapping[move.from & 240];
                            }
                        }
                    }
                }
                if (this.c['board'][move.to]) {
                    ret += 'x';
                }
                ret += this.bc.fileMapping[move.to & 15] + '' + this.bc.rankMapping[move.to & 240];
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
                    if (this.c['board'][move.to]) {
                        ret += 'x';
                    }
                    ret += this.bc.fileMapping[move.to & 15] + '' + this.bc.rankMapping[move.to & 240];
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
    getNewFen: function () {
        var board = this.c['board'];
        var fen = '';
        var emptyCounter = 0;

        for (var rank = 7; rank >= 0; rank--) {
            for (var file = 0; file < 8; file++) {
                var index = (rank * 8) + file;
                if (board[this.bc.numericMapping[index]]) {
                    if (emptyCounter) {
                        fen += emptyCounter;
                    }
                    fen += this.bc.pieceMapping[board[this.bc.numericMapping[index]]];
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

        return [fen, this.getColorCode(), this.getCastle(), this.c.fenParts['enPassant'], this.getHalfMoves(), this.getFullMoves()].join(' ');
    },

    /**
     * Return relative mobility of white compared to white. 0.5 is equal mobility
     * @method getMobility
     * @return {Number}
     */
    getMobility: function () {
        var mw = this.getCountValidMoves('white');
        var mb = this.getCountValidMoves('black');
        return mw / (mw + mb);
    },

    getCountValidMoves: function (color) {
        var c = 0;
        var moves = this.getValidMovesAndResult(color).moves;
        for (var key in moves) {
            if (moves.hasOwnProperty(key)) {
                c += moves[key].length;
            }
        }
        return c;
    },

    evaluate: function () {
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
    getHangingPieces: function (color) {
        var ret = [];
        var m = this.getValidMovesAndResult(color);
        var c = this.getCaptureAndProtectiveMoves(color);
        var king = this.getKing(color);
        for (var key in m.moves) {
            if (m.moves.hasOwnProperty(key)) {
                if (key != king.s && c.indexOf(parseInt(key)) === -1) ret.push(key);
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
    getHangingSquaresTranslated: function (color) {
        var hanging = this.getHangingPieces(color);
        for (var i = 0; i < hanging.length; i++) {
            hanging[i] = this.bc.numberToSquareMapping[hanging[i]];
        }
        return hanging;
    },

    getMaterialScore: function () {
        return this.getValueOfPieces('white') - this.getValueOfPieces('black');
    },

    getValueOfPieces: function (color) {
        var ret = 0;
        var pieces = this.getPiecesOfAColor(color);
        for (var i = 0; i < pieces.length; i++) {
            ret += this.bc.pieceValues[pieces[i].t];
        }
        return ret;
    }
});