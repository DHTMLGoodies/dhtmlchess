FenParserConfig = {
    files:['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    pieceTypes:{
        'p':'pawn',
        'P':'pawn',
        'n':'knight',
        'N':'knight',
        'b':'bishop',
        'B':'bishop',
        'r':'rook',
        'R':'rook',
        'q':'queen',
        'Q':'queen',
        'k':'king',
        'K':'king'
    },
    numericFiles:{
        'a1':1, 'b1':2, 'c1':3, 'd1':4, 'e1':5, 'f1':6, 'g1':7, 'h1':8,
        'a2':1, 'b2':2, 'c2':3, 'd2':4, 'e2':5, 'f2':6, 'g2':7, 'h2':8,
        'a3':1, 'b3':2, 'c3':3, 'd3':4, 'e3':5, 'f3':6, 'g3':7, 'h3':8,
        'a4':1, 'b4':2, 'c4':3, 'd4':4, 'e4':5, 'f4':6, 'g4':7, 'h4':8,
        'a5':1, 'b5':2, 'c5':3, 'd5':4, 'e5':5, 'f5':6, 'g5':7, 'h5':8,
        'a6':1, 'b6':2, 'c6':3, 'd6':4, 'e6':5, 'f6':6, 'g6':7, 'h6':8,
        'a7':1, 'b7':2, 'c7':3, 'd7':4, 'e7':5, 'f7':6, 'g7':7, 'h7':8,
        'a8':1, 'b8':2, 'c8':3, 'd8':4, 'e8':5, 'f8':6, 'g8':7, 'h8':8
    },
    numericRanks:{
        'a1':1, 'b1':1, 'c1':1, 'd1':1, 'e1':1, 'f1':1, 'g1':1, 'h1':1,
        'a2':2, 'b2':2, 'c2':2, 'd2':2, 'e2':2, 'f2':2, 'g2':2, 'h2':2,
        'a3':3, 'b3':3, 'c3':3, 'd3':3, 'e3':3, 'f3':3, 'g3':3, 'h3':3,
        'a4':4, 'b4':4, 'c4':4, 'd4':4, 'e4':4, 'f4':4, 'g4':4, 'h4':4,
        'a5':5, 'b5':5, 'c5':5, 'd5':5, 'e5':5, 'f5':5, 'g5':5, 'h5':5,
        'a6':6, 'b6':6, 'c6':6, 'd6':6, 'e6':6, 'f6':6, 'g6':6, 'h6':6,
        'a7':7, 'b7':7, 'c7':7, 'd7':7, 'e7':7, 'f7':7, 'g7':7, 'h7':7,
        'a8':8, 'b8':8, 'c8':8, 'd8':8, 'e8':8, 'f8':8, 'g8':8, 'h8':8
    },
    squares:[
        'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
        'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
        'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
        'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
        'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
        'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
        'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
        'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
    ],
    oppositeColors:{
        'white':'black',
        'black':'white'
    },
    castleBits : {
        'whiteKing' : 1,
        'whiteQueen' : 2,
        'blackKing' : 4,
        'blackQueen' : 8
    },
    colorAbbreviations:{
        'w':'white',
        'b':'black'
    },
    pieceColors:{
        'p':'black',
        'n':'black',
        'b':'black',
        'r':'black',
        'q':'black',
        'k':'black',
        'P':'white',
        'N':'white',
        'B':'white',
        'R':'white',
        'Q':'white',
        'K':'white'
    },
    pieceTypesInitials : {
        'pawn':'',
        'rook':'R',
        'bishop':'B',
        'knight':'N',
        'queen':'Q',
        'king':'K'
    },
    numericRankCache:{},
    numericFileCache:{}

};

ludo.chess.parser.FenParser = new Class({
    Extends:ludo.chess.parser.FenObjectCache,
    fen:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',

    initialize:function (fen) {
        if (fen) {
            this.setFen(fen);
        }
    },

    setFen:function (fen) {
        this.fen = fen;
        var fenParts = this.fen.split(' ');
        this.fenParts = {
            'pieces':fenParts[0],
            'color':fenParts[1],
            'castle':fenParts[2],
            'enPassant':fenParts[3],
            'halfMoves':fenParts[4],
            'fullMoves':fenParts[5]
        };
        this.fenParts['castleBits'] = 0
            + (fenParts[2].indexOf('K')>=0 ? FenParserConfig.castleBits.whiteKing : 0)
            + (fenParts[2].indexOf('Q')>=0 ? FenParserConfig.castleBits.whiteQueen : 0)
            + (fenParts[2].indexOf('k')>=0 ? FenParserConfig.castleBits.blackKing : 0)
            + (fenParts[2].indexOf('q')>=0 ? FenParserConfig.castleBits.blackQueen : 0);


        this.parseFen();
    },

    parseFen:function () {

        if (!this.fenCacheExists(this.fen)) {
            var ret = [];
            var piecePart = this.fenParts['pieces'];
            piecePart += ' ';
            countSquares = 0;

            for (var i = 0, len = piecePart.length; i < len; i++) {
                var token = piecePart.substr(i, 1);

                if (token.match(/[pnbrqk]/i)) {
                    var piece = {
                        square:FenParserConfig.squares[countSquares],
                        type:FenParserConfig.pieceTypes[token],
                        color:FenParserConfig.pieceColors[token],
                        fenIndex:i
                    };
                    ret.push(piece);

                    this.appendToCache(piece.color, piece);
                    this.setCache('squares_' + piece.square, piece);
                    this.appendToCache('pieceTypes' + '_' + piece.color + '_' + piece.type, piece);

                    if (piece.type === 'king') {
                        this.setCache('king_' + piece.color, piece);

                    }
                    countSquares++;
                } else if (token.match(/[0-9]/)) {
                    var token2 = piecePart.substr(i + 1, 1);
                    if (token2.match(/[0-9]/)) {
                        token = token + '' + token2;
                    }
                    countSquares += token / 1;
                }
            }

            this.setCache('pieces', ret)
        }
    },

    getPieces:function () {
        return ludo.ChessCache[this.fen]['pieces'];
    },

    getPieceOnSquare:function (square) {
        return ludo.ChessCache[this.fen]['squares_' + square];
    },

    isPieceOnSquarePawnOnLastRank : function(square){
        var piece = this.getPieceOnSquare(square);
        if(piece && piece.type ==='pawn'){
            if(FenParserConfig.numericRanks[square] ==  7 && piece.color === 'white'){
                return true;
            }
            if(FenParserConfig.numericRanks[square] ==  2 && piece.color === 'black'){
                return true;
            }
        }
        return false;
    },

    getKing:function (color) {
        return ludo.ChessCache[this.fen]['king_' + color];
    },

    getColoredPieceOnSquare:function (color, square) {
        var piece = this.getPieceOnSquare(square);
        if (piece && piece.color === color) {
            return piece;
        }
        return null;
    },

    getPiecesOfAColor:function (color) {
        return ludo.ChessCache[this.fen][color];
    },

    getPiecesOfAType:function (type) {
        return this.getColoredPiecesOfAType('white', type).concat(this.getColoredPiecesOfAType('black', type));
    },

    getColoredPiecesOfAType:function (color, type) {
        return ludo.ChessCache[this.fen]['pieceTypes_' + color + '_' + type] || [];
    },

    getOppositeColor:function (color) {
        return FenParserConfig.oppositeColors[color];
    },

    getWhoToMove:function () {
        return FenParserConfig.colorAbbreviations[this.fenParts['color']];
    },

    getPassiveColor:function () {
        var color = this.getWhoToMove();
        return color === 'white' ? 'black' : 'white';
    },

    getCastleForFen:function () {
        return this.fenParts['castle'];
    },

    canCastleKingSide:function (color) {
        return this.fenParts['castleBits'] & FenParserConfig.castleBits[color + 'King'];
    },
    canCastleQueenSide:function (color) {
        return this.fenParts['castleBits'] & FenParserConfig.castleBits[color + 'Queen'];
    },

    getEnPassantSquare:function () {
        var enPassant = this.fenParts['enPassant'];
        if (enPassant != '-') {
            return enPassant;
        }
        return null;
    },

    getHalfMoves:function () {
        return this.fenParts['halfMoves'];
    },

    getFullMoves:function () {
        return this.fenParts['fullMoves'];
    },

    getSquareFromNumber:function (counter) {
        var rank = 8 - Math.floor(counter / 8);
        var file = counter % 8;
        var files = 'abcdefgh';

        return files.substr(file, 1) + rank;
    },
    getType:function (piece) {
        return FenParserConfig.pieceTypes[piece];
    },

    getInitialsOfPieceOnSquare:function (square) {
        return this.getInitials(this.getPieceOnSquare(square));
    },
    getInitials:function (piece) {
        return FenParserConfig.pieceTypesInitials[piece.type];
    },
    getColor:function (piece) {
        return FenParserConfig.pieceColors[piece];
    },
    getNumericFile:function (square) {
        if (!FenParserConfig.numericFileCache[square]) {
            FenParserConfig.numericFileCache[square] = FenParserConfig.files.indexOf(square.substr(0, 1));
        }
        return FenParserConfig.numericFileCache[square];
    },
    getNumericRank:function (square) {
        if (!FenParserConfig.numericRankCache[square]) {
            FenParserConfig.numericRankCache[square] = square.substr(1, 1) / 1;
        }
        return FenParserConfig.numericRankCache[square];
    },

    getAlphaNumericFile:function (numericFile) {
        return FenParserConfig.files[numericFile];
    },

    getFirstRank:function (piece) {
        return piece.color === 'white' ? 1 : 8;
    },

    isOnFirstRank:function (piece) {
        var rank = FenParserConfig.numericRanks[piece.square];
        if((piece.color === 'white' && rank === 1) || (piece.color === 'black' && rank === 8)){
            return true;
        }
        return false;
    },

    getRooksOnFirstRank:function (color) {
        var rooks = this.getColoredPiecesOfAType(color, 'rook');

        var ret = [];
        for (var i = 0; i < rooks.length; i++) {
            if (this.isOnFirstRank(rooks[i])) {
                ret.push(rooks[i]);
            }
        }
        return ret;
    },

    getRank:function (piece) {
        return piece.square.substr(1, 1);
    },

    getFile:function (piece) {
        return piece.square.substr(0, 1);
    },

    getFenAfterRemovingPiece:function (piece) {

        var index = piece['fenIndex'];
        var startIndex = index;
        var endIndex = index + 1;
        var increment = 1;

        var found = false;
        for (var i = index - 1, min = Math.max(index - 2, 0); i >= min; i--) {
            if (!found) {
                var previous = this.fen.substr(i, 1);
                if (this.isNumber(previous)) {
                    increment += previous / 1;
                    startIndex--;

                } else {
                    found = true;
                }
            }
        }
        var found = false;
        for (var i = index + 1; i <= index + 2; i++) {
            if (!found) {
                var next = this.fen.substr(i, 1);
                if (this.isNumber(next)) {
                    increment += next / 1;
                    endIndex++;
                } else {
                    found = true;
                }
            }
        }

        var ret = this.fen.substr(0, startIndex) + increment + this.fen.substr(endIndex);
        return ret;

    },

    isNumber:function (token) {
        token = token + '';
        return token.match(/[0-9]/);
    }
});