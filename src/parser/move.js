ludo.chess.parser.Move = new Class({
    Extends:ludo.chess.parser.FenParser,
    newFen:'',
    originalFen:'',
    removedSquares:[],

    move:{
        fromSquare:undefined,
        toSquare:undefined,
        promoteTo:undefined
    },

    initialize:function (fen) {
        this.parent(fen);
        this.chessPosition = new ludo.chess.parser.ChessPosition();
    },

    moveConfig:{
        added:{},
        removed:{}
    },

    isValid:function (move, fen) {
        if (move.fen) {
            return true;
        }
        this.chessPosition.setFen(fen);
        return this.chessPosition.isMoveValid(move.from, move.to);
    },

    isPromotionMove:function (move, fen) {
        this.chessPosition.setFen(fen);
        return this.chessPosition.isPieceOnSquarePawnOnLastRank(move.from);
    },

    getMoveConfig:function (move, fen) {
        this.move = {
            fromSquare:move.from,
            toSquare:move.to,
            promoteTo:move.promoteTo ? move.promoteTo : null,
            notation:''
        }


        this.setFen(fen);
        this.parseMove();

        var newFen = this.getNewFen();

        return {
            fen:newFen,
            notation:move.m ? move.m : this.getNotation() + this.getCheckOrCheckmateForNotation(newFen),
            moves:this.moveConfig.moves,
            from:move.from,
            to:move.to,
            variations:move.variations || []
        };
    },
    getCheckOrCheckmateForNotation:function (fen) {
        var posObj = new ludo.chess.parser.ChessPosition(fen);
        var data = posObj.getPositionData(this.getPassiveColor());
        if (data.checkMate) {
            return '#';
        }
        if (data.checkedBy.length > 0) {
            return '+';
        }
        return '';
    },

    parseMove:function () {
        this.moveConfig = {
            added:{},
            removed:{},
            moves:[
                { from:this.move.fromSquare, to:this.move.toSquare}
            ]
        }
        this.setRemovedPieces();
        this.setAddedPieces();
        this.setEnPassantSquare();
    },

    getNotation:function () {
        var piece = this.getPieceOnSquare(this.move.fromSquare);

        if(piece.type === 'king' && this.isCastleMove()){
            return this.getCastleNotation();
        }
        var notation = this.getInitials(piece);
        notation += this.getRankAndFileForNotation();

        var capturedPiece = this.getCapturedPieceByMove();
        if (capturedPiece) {
            if (piece.type === 'pawn') {
                notation += piece.square.substr(0, 1);
            }
            notation += 'x';
        }
        notation += this.move.toSquare;
        if (this.move.promoteTo) {
            notation += '=';
            if (!this.move.promoteTo.match(/[QRBN]/g)) {
                var pieceTypesInitials = {
                    'knight':'N',
                    'bishop':'B',
                    'rook':'R',
                    'queen':'Q'
                };
                notation += pieceTypesInitials[this.move.promoteTo];
            } else {
                notation += this.move.promoteTo;
            }
        }
        return notation;
    },

    isCastleMove : function(){
        var fileFrom = FenParserConfig.numericFiles[this.move.fromSquare];
        var fileTo = FenParserConfig.numericFiles[this.move.toSquare];

        if(Math.abs(fileFrom - fileTo) < 2){
            return false;
        }
        return true;
    },

    getCastleNotation : function(){
        var fileFrom = FenParserConfig.numericFiles[this.move.fromSquare];
        var fileTo = FenParserConfig.numericFiles[this.move.toSquare];
        if(fileTo > fileFrom){
            return 'O-O';
        }
        return 'O-O-O';
    },

    getRankAndFileForNotation:function () {
        var movedPiece = this.getPieceOnSquare(this.move.fromSquare);
        var pieces = this.getColoredPiecesOfAType(movedPiece.color, movedPiece.type);
        var fromFile = this.getFile(movedPiece);
        var fromRank = this.getRank(movedPiece);

        var chessPosition;
        var ret = {
            file:'',
            rank:''
        }

        for (var i = 0; i < pieces.length; i++) {
            var piece = pieces[i];
            if (piece.square !== movedPiece.square) {
                if (!chessPosition) {
                    chessPosition = new ludo.chess.parser.ChessPosition(this.fen);
                }
                if (chessPosition.isMoveValid(piece.square, this.move.toSquare)) {
                    if (this.getFile(piece) !== fromFile) {
                        ret.file = fromFile;
                    }
                    else if (this.getRank(piece) !== fromFile) {
                        ret.rank = fromRank;
                    }
                }
            }
        }
        return ret.file + ret.rank;
    },


    setRemovedPieces:function () {
        var piece = this.getPieceOnSquare(this.move.fromSquare);
        this.moveConfig.removed[piece.square] = piece;

        var capturedPiece = this.getCapturedPieceByMove();
        if (capturedPiece) {
            if (capturedPiece.type === 'rook') {
                this.removeCastleAbilityByRook(capturedPiece);
            }
            this.moveConfig.removed[capturedPiece.square] = capturedPiece;
            this.moveConfig.moves.push({ capture:capturedPiece.square });
        }
    },

    setAddedPieces:function () {

        var piece = this.getPieceOnSquare(this.move.fromSquare);
        this.moveConfig.added[this.move.toSquare] = piece;
        switch (piece.type) {
            case 'pawn':
                if (this.move.promoteTo) {
                    var piece = Object.clone(piece);
                    piece.type = this.move.promoteTo;
                    this.moveConfig.moves.push({ promoteTo:this.move.promoteTo });

                }

                break;
            case 'rook' :
                this.removeCastleAbilityByRook(piece);
                this.moveConfig.added[square] = piece;

                break;
            case 'king':
                this.removeAllCastleCapability(piece.color);
                var fileFrom = this.getNumericFile(this.move.fromSquare);
                var fileTo = this.getNumericFile(this.move.toSquare);
                var rank = this.getNumericRank(this.move.fromSquare);

                if (Math.abs(fileFrom - fileTo) > 1) {
                    var rook = this.getCastleRook();

                    if (fileTo > fileFrom) {
                        var square = FenParserConfig.files[fileTo - 1] + rank;
                    } else {
                        var square = FenParserConfig.files[fileTo + 1] + rank;
                    }
                    this.moveConfig.added[square] = rook;
                    this.moveConfig.removed[rook.square] = rook;

                    this.moveConfig.moves.push({ from:rook.square, to:square });
                }
                break;
            default:

        }

    },

    removeCastleAbilityByRook:function (rook) {
        var king = this.getKing(rook.color);
        if (king.square > rook.square) {
            this.removeQueenSideCastleAbility(rook.color);
        } else {
            this.removeKingSideCastleAbility(rook.color);
        }
    },

    removeQueenSideCastleAbility:function (color) {
        this.removeCastleCapability('q', color);
    },

    removeKingSideCastleAbility:function (color) {
        this.removeCastleCapability('k', color);
    },

    removeAllCastleCapability:function (color) {
        this.removeCastleCapability('kq', color);

    },

    removeCastleCapability:function (pattern, color) {
        var pattern = '[' + pattern + ']';
        if (color == 'white') {
            pattern = pattern.toUpperCase();
        }
        var reg = new RegExp(pattern, 'g');
        this.fenParts.castle = this.fenParts.castle.replace(reg, '');
        if (this.fenParts['castle'].length == 0) {
            this.fenParts['castle'] = '-';
        }
    },

    setEnPassantSquare:function () {
        this.fenParts['enPassant'] = '-';
        var piece = this.getPieceOnSquare(this.move.fromSquare);
        if (piece.type === 'pawn') {
            var rankFrom = this.getNumericRank(this.move.fromSquare);
            var rankTo = this.getNumericRank(this.move.toSquare);
            var file = this.move.fromSquare.substr(0, 1);
            if (Math.abs(rankFrom - rankTo) === 2) {
                this.fenParts['enPassant'] = file + ((rankFrom + rankTo) / 2);
            }
        }
    },


    getCastleRook:function () {
        var piece = this.getPieceOnSquare(this.move.fromSquare);
        var rooks = this.getColoredPiecesOfAType(piece.color, 'rook');

        var rankFrom = this.getNumericRank(this.move.fromSquare);
        var fileFrom = this.getNumericFile(this.move.fromSquare);
        var fileTo = this.getNumericFile(this.move.toSquare);


        for (var i = 0; i < rooks.length; i++) {
            var rankRook = this.getNumericRank(rooks[i].square);
            if (rankRook === rankFrom) {
                if (this.move.fromSquare > this.move.toSquare && rooks[i].square < this.move.fromSquare) {
                    return rooks[i];
                }
                if (this.move.fromSquare < this.move.toSquare && rooks[i].square > this.move.fromSquare) {
                    return rooks[i];
                }
            }
        }
    },

    getNewFen:function () {
        var pieceTypes = {
            'pawn':'P',
            'rook':'R',
            'bishop':'B',
            'knight':'N',
            'queen':'Q',
            'king':'K'
        };
        var fen = '';
        emptySquaresCounter = 0;
        for (var i = 0; i < 64; i++) {
            if (i > 0 && i % 8 == 0) {
                if (emptySquaresCounter) {
                    fen = fen + '' + emptySquaresCounter;
                }
                fen += '/';
                emptySquaresCounter = 0;
            }
            var square = this.getSquareFromNumber(i);
            var piece = this.getPieceOnSquareAfterMove(square);
            if (!piece) {
                emptySquaresCounter++;
            } else {
                if (emptySquaresCounter) {
                    fen = fen + '' + emptySquaresCounter;
                }
                var type = pieceTypes[piece.type];
                if (piece.color === 'black') {
                    type = type.toLowerCase();
                }
                fen += type;
                emptySquaresCounter = 0;
            }
        }
        if (emptySquaresCounter) {
            fen += '' + emptySquaresCounter
        }
        fen += ' ' + this.getNewColor() + ' ' + this.getCastleForFen() + ' ' + this.fenParts['enPassant'] + ' ' + this.getHalfMoves() + ' ' + this.getFullMoves();

        this.newFen = fen;
        return this.newFen;
    },

    getNewColor:function () {
        return (this.getWhoToMove() === 'white' ? 'b' : 'w');
    },


    getPieceOnSquareAfterMove:function (square) {

        if (this.moveConfig.added[square]) {
            return this.moveConfig.added[square];
        }
        if (this.moveConfig.removed[square]) {
            return null;
        }
        return this.getPieceOnSquare(square);
    },

    resetHalfMoves:function () {
        this.fenParts['halfMoves'] = 0;
    },

    incrementHalfMoves:function () {
        this.fenParts['halfMoves']++;
    },

    getCapturedPieceByMove:function () {
        var piece = this.getPieceOnSquare(this.move.toSquare);

        if (piece) {
            return piece;
        }

        var fromPiece = this.getPieceOnSquare(this.move.fromSquare);

        if (fromPiece.type === 'pawn' && this.move.toSquare === this.getEnPassantSquare()) {
            var file = this.move.toSquare.substr(0, 1);
            var rank = this.move.toSquare.substr(1, 1) / 1;

            if (fromPiece.color === 'white') {
                return this.getPieceOnSquare(file + (rank - 1));
            } else {
                return this.getPieceOnSquare(file + (rank + 1));
            }
        }
        return null;

    }
});