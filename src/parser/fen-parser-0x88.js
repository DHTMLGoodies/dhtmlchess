ludo.chess.parser.Board0x88Config = {
    Extends:ludo.chess.parser.FenObjectCache,
    squares:[
        'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
        'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
        'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
        'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
        'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
        'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
        'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
        'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'
    ],

    fenSquares:[
        'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
        'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
        'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
        'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
        'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
        'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
        'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
        'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
    ],

    numericMapping:undefined,
    bitValues:[]

}

ludo.chess.parser.FenParser0x88 = new Class({
    Extends:ludo.chess.parser.FenObjectCache,
    fen:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',

    fenPieces:{
        'p':'blackPawns', 'b':'blackBishops', 'n':'blackKnights', 'r':'blackRooks', 'q':'blackQueens', 'k':'blackKing',
        'P':'whitePawns', 'B':'whiteBishops', 'N':'whiteKnights', 'R':'whiteRooks', 'Q':'whiteQueens', 'K':'whiteKing'
    },

    colorAbbreviations : { 'w' : 'white', 'b' : 'black' },
    oppositeColors :{ 'white' : 'black', 'black': 'white'},
    mapping:{
        'a1':0, 'b1':1, 'c1':2, 'd1':3, 'e1':4, 'f1':5, 'g1':6, 'h1':7,
        'a2':16, 'b2':17, 'c2':18, 'd2':19, 'e2':20, 'f2':21, 'g2':22, 'h2':23,
        'a3':32, 'b3':33, 'c3':34, 'd3':35, 'e3':36, 'f3':37, 'g3':38, 'h3':39,
        'a4':48, 'b4':49, 'c4':50, 'd4':51, 'e4':52, 'f4':53, 'g4':54, 'h4':55,
        'a5':64, 'b5':65, 'c5':66, 'd5':67, 'e5':68, 'f5':69, 'g5':70, 'h5':71,
        'a6':80, 'b6':81, 'c6':82, 'd6':83, 'e6':84, 'f6':85, 'g6':86, 'h6':87,
        'a7':96, 'b7':97, 'c7':98, 'd7':99, 'e7':100, 'f7':101, 'g7':102, 'h7':103,
        'a8':112, 'b8':113, 'c8':114, 'd8':115, 'e8':116, 'f8':117, 'g8':118, 'h8':119
    },

    numericMapping : {
        '0': 0,'1': 1,'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7': 7,
        '8': 16,'9': 17,'10': 18,'11': 19,'12': 20,'13': 21,'14': 22,'15': 23,
        '16': 32,'17': 33,'18': 34,'19': 35,'20': 36,'21': 37,'22': 38,'23': 39,
        '24': 48,'25': 49,'26': 50,'27': 51,'28': 52,'29': 53,'30': 54,'31': 55,
        '32': 64,'33': 65,'34': 66,'35': 67,'36': 68,'37': 69,'38': 70,'39': 71,
        '40': 80,'41': 81,'42': 82,'43': 83,'44': 84,'45': 85,'46': 86,'47': 87,
        '48': 96,'49': 97,'50': 98,'51': 99,'52': 100,'53': 101,'54': 102,'55': 103,
        '56': 112,'57': 113,'58': 114,'59': 115,'60': 116,'61': 117,'62': 118,'63': 119
    },
    
    pieces:{
        'P':0x01,
        'N':0x02,
        'K':0x03,
        'B':0x05,
        'R':0x06,
        'Q':0x07,
        'p':0x09,
        'n':0x0A,
        'k':0x0B,
        'b':0x0D,
        'r':0x0E,
        'q':0x0F
    },
    pieceMapping:{
        0x01:'P',
        0x02:'N',
        0x03:'K',
        0x05:'B',
        0x06:'R',
        0x07:'Q',
        0x09:'p',
        0x0A:'n',
        0x0B:'k',
        0x0D:'b',
        0x0E:'r',
        0x0F:'q'
    },
    typeMapping:{
        0x01:'pawn',
        0x02:'knight',
        0x03:'king',
        0x05:'bishop',
        0x06:'rook',
        0x07:'queen',
        0x09:'pawn',
        0x0A:'knight',
        0x0B:'king',
        0x0D:'bishop',
        0x0E:'rook',
        0x0F:'queen'
    },

    colorMapping : {
        'p' : 'black', 'n' : 'black', 'b' : 'black', 'r' : 'black', 'q' : 'black', 'k' : 'black',
        'P' : 'white', 'N' : 'white', 'B' : 'white', 'R' : 'white', 'Q' : 'white', 'K' : 'white'
    },

    castle : {
        '-' : 0,
        'K' : 8,
        'Q' : 4,
        'k' : 2,
        'q' : 1
    },
    initialize:function (fen) {

        if (fen) {
            ludo.ChessCache[fen] = {};
            this.setFen(fen);
        }
    },

    setFen:function (fen) {
        if (!this.cache[fen]) {
            this.cache[fen] = {
                'board':[],
                'white' : [],
                'black' : [],
                'king' : { 'white' : undefined, 'black' : 'undefined'}
            }
        }
        this.fen = fen;
        var fenParts = this.fen.split(' ');

        var castleCode = 0;
        for(var i=0;i<fenParts[2].length;i++){
            castleCode += this.castle[fenParts[2][i]];
        };
        this.fenParts = {
            'pieces':fenParts[0],
            'color':fenParts[1],
            'castle':fenParts[2],
            'castleCode' : castleCode,
            'enPassant':fenParts[3],
            'halfMoves':fenParts[4],
            'fullMoves':fenParts[5]
        };
        this.parseFen();
    },

    cache:{

    },

    numbers : {
        '0' : 1, '1' : 1, '2' :1, '3' : 1, '4': 1, '5':1, '6':1,'7':1,'8':1,'9':0
    },
    parseFen:function () {
        var pos = 0;

        var squares = ludo.chess.parser.Board0x88Config.fenSquares;
        for (var i = 0, len = this.fenParts['pieces'].length; i < len; i++) {
            var token = this.fenParts['pieces'][i];

            if (this.fenPieces[token]) {
                var index = this.mapping[squares[pos]];
                this.cache[this.fen]['board'][index] = this.pieces[token];
                this.cache[this.fen][this.colorMapping[token]].push(token);
                if(this.typeMapping[this.pieces[token]] == 'king'){
                    this.cache[this.fen]['king'][this.pieces[token] & 0x8 ? 'black' : 'white'] = this.pieces[token];
                }
                pos++;
            } else if (this.numbers[token]) {
                var token2 = this.fenParts['pieces'].substr(i + 1, 1);
                if (token2.match(/[0-9]/)) {
                    token = token + '' + token2;
                }
                pos += token / 1;
            }
        }
    },

    getPieceOnSquare:function (square) {
        var piece = this.cache[this.fen]['board'][this.mapping[square]];
        if (piece) {
            return {
                square:square,
                type:this.typeMapping[piece],
                color:piece & 0x8 ? 'black' : 'white',
                sliding:piece & 0x4
            }
        }
        return null;
    },

    getKing : function(color){
        return this.cache[this.fen]['king'][color];
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

    canCastleKingSide : function(color){
        var code = color === 'white' ? this.castle['K'] : this.castle['k'];
        return this.fenParts.castleCode & code;
    },

    getWhoToMove:function () {
        return this.colorAbbreviations[this.fenParts['color']];
    },

    canCastleQueenSide : function(color){
        var code = color === 'white' ? this.castle['Q'] : this.castle['q'];
        return this.fenParts.castleCode & code;
    },

    getColoredPiecesOfAType : function(color, type) {
        var ret =[];
        var pieces = this.getPiecesOfAColor(color);
        for(var i=0;i<pieces.length;i++){
            if(this.typeMapping[pieces[i]] == type){
                ret.push(pieces[i]);
            }
        }
        return ret;
    },

    getPiecesOfAColor : function(color){
        return this.cache[this.fen][color]
    },
    getOppositeColor:function (color) {
        return this.oppositeColors[color];
    },

    getFenAfterRemovingPiece:function (piece) {
        var fenParts = ' ' + this.fen.split(' ').slice(1).join(' ');
        var square = piece.square ? piece.square : piece;
        var board = this.cache[this.fen]['board'].slice(0);

        board[this.mapping[square]] = undefined;

        var squares = ludo.chess.parser.Board0x88Config.fenSquares;

        var fen = '';
        var emptyCounter = 0;

        for (var rank = 7; rank >= 0; rank--) {

            for (var file = 0; file < 8; file++) {
                var index = (rank * 8) + file;

                if (board[this.numericMapping[index]]) {
                    if (emptyCounter) {
                        fen += emptyCounter;
                    }
                    fen += this.pieceMapping[board[this.numericMapping[index]]];
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

        return fen + fenParts;
    }
});