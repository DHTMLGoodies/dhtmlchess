ludo.chess.parser.BitBoardConfig = {
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

    mapping:undefined,
    bitValues : []

}

ludo.chess.parser.FenParserBitBoard = new Class({

    fen:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    fenPieces:{
        'p':'blackPawns', 'b':'blackBishops', 'n':'blackKnights', 'r':'blackRooks', 'q':'blackQueens', 'k':'blackKing',
        'P':'whitePawns', 'B':'whiteBishops', 'N':'whiteKnights', 'R':'whiteRooks', 'Q':'whiteQueens', 'K':'whiteKing'
    },
    fenColors : {
        'p' : 'black', 'b' : 'black', 'n' : 'black', 'r' : 'black', 'q' : 'black', 'k' : 'black',
        'P' : 'white', 'B' : 'white', 'N' : 'white', 'R' : 'white', 'Q' : 'white', 'K' : 'white'
    },

    initialize:function (fen) {
        if (!ludo.chess.parser.BitBoardConfig.mapping) {
            this.createMappingProperties();
        }
        if (fen) {
            this.setFen(fen);
        }
    },

    setFen:function (fen) {
        if (!this.cache[fen]) {
            this.cache[fen] = {
                'board' : 0,
                'white' : 0,
                'black' : 0,
                'whitePawns':0,
                'whiteBishops':0,
                'whiteKnights':0,
                'whiteRooks':0,
                'whiteQueens':0,
                'whiteKing':0,
                'blackPawns':0,
                'blackBishops':0,
                'blackKnights':0,
                'blackRooks':0,
                'blackQueens':0,
                'blackKing':0
            }
        }
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
        this.parseFen();
    },

    cache:{

    },

    parseFen:function () {
        var pos = 0;
        for (var i = 0, len = this.fenParts['pieces'].length; i < len; i++) {
            var token = this.fenParts['pieces'].substr(i, 1);

            if (this.fenPieces[token]) {
                this.cache[this.fen][this.fenColors[token]] += ludo.chess.parser.BitBoardConfig.bitValues[pos];
                this.cache[this.fen][this.fenPieces[token]] += ludo.chess.parser.BitBoardConfig.bitValues[pos];
                this.cache[this.fen]['board']+= ludo.chess.parser.BitBoardConfig.bitValues[pos];
                pos ++;
            }else if (token.match(/[0-9]/)) {
                var token2 = this.fenParts['pieces'].substr(i + 1, 1);
                if (token2.match(/[0-9]/)) {
                    token = token + '' + token2;
                }
                pos += token / 1;
            }


        }
        //console.log(this.cache[this.fen]);
        this.displayBoard();
    },

    createMappingProperties:function () {
        ludo.chess.parser.BitBoardConfig.mapping = {};
        for (var i = 0; i < 64; i++) {
            var square = ludo.chess.parser.BitBoardConfig.squares[i];
            if (i == 0) {
                val = 1;
            } else {
                val = Math.pow(2, i);
            }
            ludo.chess.parser.BitBoardConfig.mapping[square] = val;
            ludo.chess.parser.BitBoardConfig.bitValues.push(val);
        }
    },

    displayBoard : function() {
        document.write('<table border=1>')


        for(var i=0;i<64;i++){
            if(i%8==0){
                document.write('<tr>');
            }
            var bitMap = ludo.chess.parser.BitBoardConfig.mapping[ludo.chess.parser.BitBoardConfig.squares[i]];

            document.write('<td width=25>');

            if(this.cache[this.fen]['white'] & bitMap){
                document.write('1');
            }else{
                document.write('0')
            }
            document.write('</TD>');

        }
        document.write('</table>');

    }


});