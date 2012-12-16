MovesOnEmptyBoardCounter = 0;


ludo.chess.parser.MovesOnEmptyBoard = new Class({
    Extends : ludo.chess.parser.FenParser,

    initialize : function(){
        MovesOnEmptyBoardCounter++;
    },

    getAllPaths : function(piece){

        var ret = [];
        switch(piece.type){
            case 'rook':
                ret = this.getAllRookSquares(piece);
                break;
            case 'bishop':
                ret = this.getAllBishopSquares(piece);
                break;
            case 'queen':
                ret = this.getAllRookSquares(piece).concat(this.getAllBishopSquares(piece));
                break;
            case 'pawn':
                ret = this.getAllPawnSquares(piece);
                break;
            case 'knight':
                ret = this.getAllKnightSquares(piece);
                break;
            case 'king':
                ret = this.getAllKingSquares(piece);
                break;
        }
        return ret;
    },

    getAllRookSquares : function(piece){
        var file = FenParserConfig.numericFiles[piece.square];
        var rank = FenParserConfig.numericRanks[piece.square];

        var ret = [];

        var path = [];
        for(var i=file-1;i>=1;i--){
            path.push(FenParserConfig.files[i] + rank);
        }
        ret.push(path);

        path = [];
        for(var i=file+1;i<=8;i++){
            path.push(FenParserConfig.files[i] + rank);
        }
        ret.push(path);

        path = [];
        for(var i=rank-1;i>=1;i--){
            path.push(FenParserConfig.files[file] + i);
        }
        ret.push(path);

        path = [];
        for(var i=rank+1;i<=8;i++){
            path.push(FenParserConfig.files[file] + i);
        }
        ret.push(path);

        return ret;
    },

    getAllBishopSquares : function(piece){
        var ret = [];
        var file = FenParserConfig.numericFiles[piece.square];
        var rank = FenParserConfig.numericRanks[piece.square];

        var path = [];
        for(var i=file-1, j = rank-1; i>=1 && j>=1; i--, j--){
            path.push(FenParserConfig.files[i] + j);
        }
        ret.push(path);

        var path = [];
        for(var i=file+1, j = rank+1; i<=8 && j<=8; i++, j++){
            path.push(FenParserConfig.files[i] + j);
        }
        ret.push(path);

        var path = [];
        for(var i=file+1, j = rank-1; i<=8 && j>=1; i++, j--){
            path.push(FenParserConfig.files[i] + j);
        }
        ret.push(path);

        var path = [];
        for(var i=file-1, j = rank+1; i>=1 && j<=8; i--, j++){
            path.push(FenParserConfig.files[i] + j);
        }
        ret.push(path);

        return ret;
    },

    getAllPawnSquares : function(piece){
        var ret = [];
        var file = FenParserConfig.numericFiles[piece.square];
        var rank = FenParserConfig.numericRanks[piece.square];

        var direction = piece.color === 'white' ? 1 : -1;
        var firstRank = piece.color === 'white' ? 2 : 7;

        var path = [];
        path.push(FenParserConfig.files[file] + (rank + direction));
        if(rank == firstRank){
            path.push(FenParserConfig.files[file] + (rank + (2 * direction)));
        }
        ret.push(path);


        if(file > 1){
            ret.push([FenParserConfig.files[file-1] + (rank + direction)]);
        }
        if(file < 8){
            ret.push([FenParserConfig.files[file+1] + (rank + direction)]);
        }
        return ret;
    },

    getPawnAttackMoves : function(piece){
        var ret = [];
        var file = FenParserConfig.numericFiles[piece.square];
        var rank = FenParserConfig.numericRanks[piece.square];

        var direction = piece.color === 'white' ? 1 : -1;
        var firstRank = piece.color === 'white' ? 2 : 7;

        if(file > 1){
            ret.push(FenParserConfig.files[file-1] + (rank + direction));
        }
        if(file < 8){
            ret.push(FenParserConfig.files[file+1] + (rank + direction));
        }
        return ret;

    },

    getAllKingSquares : function(piece){
        var square = piece.square;

        var ret = [];
        var file = FenParserConfig.numericFiles[piece.square];
        var rank = FenParserConfig.numericRanks[piece.square];

        var squares = [];
        for(var i=-1;i<=1;i++){
            for(var j=-1;j<=1;j++){
               if(i == 0 && j == 0){

               } else{
                   squares.push({
                       file : file + i,
                       rank : rank + j
                   })
               }
            }
        }
        for(var i=0;i<squares.length;i++){
            if(squares[i].file >=1 && squares[i].file <=8 && squares[i].rank >=1 && squares[i].rank <=8){
                ret.push([FenParserConfig.files[squares[i].file] + squares[i].rank]);
            }
        }

        return ret;
    },

    getAllKnightSquares : function(piece){
        var square = piece.square;

        var ret = [];
        var file = FenParserConfig.numericFiles[piece.square];
        var rank = FenParserConfig.numericRanks[piece.square];

        var squares = [
            { f : file-1, 'r' : rank-2 },
            { f : file-1, 'r' : rank+2 },
            { f : file+1, 'r' : rank-2 },
            { f : file+1, 'r' : rank+2 },
            { f : file-2, 'r' : rank-1 },
            { f : file-2, 'r' : rank+1 },
            { f : file+2, 'r' : rank-1 },
            { f : file+2, 'r' : rank+1 }
        ];

        for(var i=0;i<squares.length;i++){
            var square = squares[i];
            if(square.f >=1 && square.f<=8 && square.r>=1 && square.r<=8){
                ret.push([FenParserConfig.files[square.f] + square.r])
            }
        };
        return ret;

    }
});

ludo.MovesOnEmptyBoard = new ludo.chess.parser.MovesOnEmptyBoard();