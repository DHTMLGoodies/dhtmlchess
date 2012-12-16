ludo.chess.parser.ChessPosition = new Class({
    Extends:ludo.chess.parser.FenParser,

    movesOnEmptyBoard:null,

    initialize:function (fen) {
        this.parent(fen);
    },

    getPositionData:function (color) {
        if (!color) {
            color = this.getWhoToMove();
        }
        var cacheKeys = 'allMoves';
        if (!this.isInCache(cacheKeys)) {
            var moveConfig = this.getMoveConfig(color);
            var opposite = this.getMoveConfig(this.getOppositeColor(color));

            var obj = {
                paths:moveConfig.paths,
                moves:moveConfig.moves,
                pawnAttacks:moveConfig.pawnAttacks,
                oppositePlayerMoves:opposite.moves,
                oppositePawnAttacks:opposite.pawnAttacks,
                checkedBy:this.pathsToSquares(opposite.pathsCheckingKing),
                pinned:opposite.pinning,
                doubleCheck:opposite.pathsCheckingKing.length > 1,
                matingMaterial:this.matingMaterialExists(color),
                matingMaterialOnBoard:this.isMatingMaterialOnBoard()
            };

            var allMoves = [];
            for (var square in obj.paths) {

                var pieceOnSquare = ludo.ChessCache[this.fen]['squares_' + square];

                if (obj.checkedBy.length === 0 && pieceOnSquare.type === 'king') {
                    var castlePaths = this.getCastlePaths(pieceOnSquare);
                    if (castlePaths.moves.length > 0) {
                        obj.paths[square] = obj.paths[square].concat(castlePaths.paths);
                        obj.moves[square] = obj.moves[square].concat(castlePaths.moves);
                    }
                }
                if (obj.doubleCheck) {
                    var validMoves = this.getValidMovesOnDoubleCheck(pieceOnSquare, obj);
                    obj.moves[square] = validMoves.moves;
                    obj.paths[square] = validMoves.paths;
                } else if (obj.checkedBy.length) {
                    var validMoves = this.getValidMovesOnCheck(pieceOnSquare, obj);
                    obj.moves[square] = validMoves.moves;
                    obj.paths[square] = validMoves.paths;
                } else if (pieceOnSquare.type === 'king') {
                    var validMoves = this.getValidKingMoves(pieceOnSquare, obj);
                    obj.moves[square] = validMoves.moves;
                    obj.paths[square] = validMoves.paths;
                }
                if (obj.pinned[square]) {
                    var validMoves = this.getValidMovesWhenPinned(obj.paths[square], obj.pinned[square]);
                    obj.paths[square] = validMoves.paths;
                    obj.moves[square] = validMoves.moves;
                }
                allMoves = allMoves.concat(obj.moves[square]);
            }

            obj.checkMate = allMoves.length === 0 && obj.checkedBy.length > 0;
            obj.staleMate = allMoves.length === 0 && obj.checkedBy.length === 0;
            obj.draw = obj.staleMate || !obj.matingMaterial;
            this.setCache(cacheKeys, obj);
        }
        return this.getFromCache(cacheKeys);
    },

    getValidMovesWhenPinned:function (piecePaths, pinnedBy) {
        if (pinnedBy.length > 1) {
            return {
                'paths':[],
                'moves':[]
            };
        }
        var square = pinnedBy[0]['square'];
        for (var i = 0; i < piecePaths.length; i++) {
            var path = piecePaths[i];
            if (path.indexOf(square) >= 0) {
                return {
                    'paths':[path],
                    'moves':path
                };
            }
        }
        return {
            'paths':[],
            'moves':[]
        };
    },

    isMatingMaterialOnBoard:function () {
        return this.matingMaterialExists('white') || this.matingMaterialExists('black');
    },

    matingMaterialExists:function (color) {
        var cacheKey = 'matingMaterials_' + color;
        if (!this.isInCache(cacheKey)) {
            var types = ['rook', 'queen', 'pawn'];
            for (var i = 0; i < types.length; i++) {
                var pieces = this.getColoredPiecesOfAType(color, types[i]);
                if (pieces.length > 0) {
                    this.setCache(cacheKey, true);
                    return true;
                }
            }
            var bishops = this.getPiecesOfAType('bishop');
            var knights = this.getPiecesOfAType('knight');
            if (knights.length >= 2 || bishops.length >= 3 || (knights.length >= 1 && bishops.length >= 1 )) {
                this.setCache(cacheKey, true);
                return true;
            }
            this.setCache(cacheKey, false);
            return false;
        }
        return ludo.ChessCache[this.fen][cacheKey];
        //return this.getFromCache(cacheKey);

    },

    getValidMovesOnDoubleCheck:function (piece, moveConfigObj) {
        var ret = {};
        var square = piece.square;

        if (piece.type === 'king') {
            var moves = moveConfigObj.moves[square];

            var newMoves = [];
            for (var i = 0; i < moves.length; i++) {
                if (moveConfigObj.checkedBy.indexOf(moves[i]) == -1) {
                    newMoves.push(moves[i]);
                }
            }
            ret.moves = newMoves;
            ret.paths = [newMoves];
        } else {
            ret.paths = [];
            ret.moves = [];
        }

        return ret;
    },

    getValidKingMoves:function (king, moveConfigObj) {
        var ret = {
            paths:[],
            moves:[]
        };

        var moves = [];
        for (var square in moveConfigObj.oppositePlayerMoves) {
            moves.push(moveConfigObj.oppositePlayerMoves[square]);
        }
        moves = moves.flatten();

        for (var i = 0; i < moveConfigObj.moves[king.square].length; i++) {
            var move = moveConfigObj.moves[king.square][i];
            if (moves.indexOf(move) === -1 && moveConfigObj.oppositePawnAttacks.indexOf(move) == -1) {
                ret.moves.push(move);
                ret.paths.push(move);
            }
            //else{
            /*
             var piece = this.getPieceOnSquare(move);
             if(piece && piece.color!==king.color && !this.isPieceOnSquareProtected(move)){
             ret.moves.push(move);
             ret.paths.push([move]);
             }*/
            // }
        }

        return ret;
    },

    getValidMovesOnCheck:function (piece, moveConfigObj) {
        var ret = {};

        var square = piece.square;
        var moves = moveConfigObj.moves[square];
        ret.paths = [];
        ret.moves = [];

        for (var i = 0; i < moves.length; i++) {

            var index = moveConfigObj.checkedBy.indexOf(moves[i]);

            if (piece.type === 'king' && index === -1) {
                ret.moves.push(moves[i]);
                ret.paths.push([moves[i]]);
            } else if (piece.type !== 'king' && index >= 0) {
                ret.moves.push(moveConfigObj.checkedBy[index]);
                ret.paths.push([moveConfigObj.checkedBy[index]]);
            }
        }
        if (piece.type === 'king') {
            ret = this.stripInvalidKingMovesOnCheck(piece, ret);
            ret = this.addKingWhenWhereKingCanTakeAttackingPiece(piece, ret, moveConfigObj);
        }

        return ret;
    },

    stripInvalidKingMovesOnCheck:function (king, pathsAndMoves) {
        var ret = { paths:[], moves:[] };

        var moves = pathsAndMoves['moves'];
        var fen = this.getFenAfterRemovingPiece(king);
        var fenParser = new ludo.chess.parser.ChessPosition(fen);
        var oppositeConfig = fenParser.getPositionData(this.getPassiveColor());
        var oppositeMoves = oppositeConfig['moves'];

        var allOppositeMoves = [];

        for (var square in oppositeMoves) {
            if (moves.indexOf(square) === -1) {
                allOppositeMoves = allOppositeMoves.concat(oppositeMoves[square]);
            }
        }

        for (var i = 0; i < moves.length; i++) {
            if (allOppositeMoves.indexOf(moves[i]) === -1) {
                ret.moves.push(moves[i]);
                ret.paths.push([moves[i]]);
            }
        }

        return ret;
    },

    addKingWhenWhereKingCanTakeAttackingPiece:function (king, paths, moveConfigObj) {
        var square = king.square;
        var checkedBy = moveConfigObj.checkedBy;

        for (var i = 0; i < checkedBy.length; i++) {
            if (this.isSquareInReachOfKing(checkedBy[i], king) && !this.isPieceOnSquareProtected(checkedBy[i])) {
                paths.moves.push(checkedBy[i]);
                paths.paths.push([checkedBy[i]]);
            }
        }
        return paths;
    },

    isSquareInReachOfKing:function (square, king) {

        var kingFile = FenParserConfig.numericFiles[king.square];
        var kingRank = FenParserConfig.numericRanks[king.square];

        var file = FenParserConfig.numericFiles[square];
        var rank = FenParserConfig.numericRanks[square];

        if (Math.abs(kingFile - file) <= 1 && Math.abs(kingRank - rank) <= 1) {
            return true;
        }
        return false;
    },

    isPieceOnSquareProtected:function (square) {
        var piece = ludo.ChessCache[this.fen]['squares_' + square];
        if (!piece) {
            return true;
        }

        var fen = this.getFenAfterRemovingPiece(piece);
        var fenParser = new ludo.chess.parser.ChessPosition(fen);

        var oppositeConfig = fenParser.getPositionData(this.getPassiveColor());
        var oppositeMoves = oppositeConfig['moves'];

        for (var sq in oppositeMoves) {
            if (oppositeMoves[sq].indexOf(square) >= 0) {
                return true;
            }
        }
        return false;

    },

    getMoveConfig:function (color) {
        var cacheKey = 'moveConfig_' + color;
        if (!this.isInCache(cacheKey)) {
            var ret = {
                paths:{},
                moves:{},
                pinning:{},
                pinnedBy:{},
                pathsCheckingKing:[],
                pawnAttacks:[]
            };
            var pieces = this.getPiecesOfAColor(color);

            if (!pieces) {
                return ret;
            }

            for (var i = 0; i < pieces.length; i++) {
                var piece = pieces[i];

                var paths = this.getFullPaths(piece);

                var squares = this.getPinnedAndCheck(piece, paths);

                ret.pinning = Object.merge(ret.pinning, squares.pinned);
                if(squares.check){
                    ret.pathsCheckingKing = ret.pathsCheckingKing.concat(squares.check);
                }
                if (piece.type === 'pawn') {
                    paths = this.shortenPawnPaths(piece, paths);
                    var pawnAttacks = ludo.MovesOnEmptyBoard.getPawnAttackMoves(piece);
                    ret.pawnAttacks = ret.pawnAttacks.concat(pawnAttacks);
                }
                paths = this.shortenPathsWhereItHitOpponentPiece(piece, paths);

                ret.paths[piece.square] = paths;
                ret.moves[piece.square] = this.pathsToSquares(paths);
            }
            this.setCache(cacheKey, ret);
        }
        return this.getFromCache(cacheKey);
    },

    shortenPawnPaths:function (pawn, paths) {
        var file = FenParserConfig.numericFiles[pawn.square];
        var rank = FenParserConfig.numericRanks[pawn.square];

        var ret = [];

        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];

            if (path.length > 0) {

                var fileForPath = FenParserConfig.numericFiles[path[0]];
                var rankForPath = FenParserConfig.numericRanks[path[0]];

                if (fileForPath === file) {
                    var square;
                    if (rankForPath - rank === -2 || rankForPath - rank === 2) {
                        square = pawn.square[0] + (rankForPath + rank) / 2;
                    } else {
                        square = path[0];
                    }
                    // var piece = this.getPieceOnSquare(square);
                    var piece = ludo.ChessCache[this.fen]['squares_' + square];
                    if (!piece) {
                        ret.push(path);
                    }
                } else {
                    ret.push(path);
                }
            }
        }

        return ret;
    },

    getFullPaths:function (piece) {
        var paths = ludo.MovesOnEmptyBoard.getAllPaths(piece);
        if (piece.type === 'pawn') {
            paths = this.removeInvalidPawnCapturePaths(piece, paths);
        }
        for (var i = 0; i < paths.length; i++) {
            paths[i] = this.shortenPathWhereItHitsOwnPiece(piece, paths[i]);
        }
        paths = this.removeEmptyPaths(paths);

        return paths;
    },

    shortenPathWhereItHitsOwnPiece:function (piece, path) {
        for (var j = 0; j < path.length; j++) {
            var square = path[j];
            //var pieceOnSquare = this.getColoredPieceOnSquare(piece.color, square);
            var pieceOnSquare = ludo.ChessCache[this.fen]['squares_' + square];
            if (pieceOnSquare && pieceOnSquare.color == piece.color) {
                return path.slice(0, j);
            }
        }

        return path;
    },

    shortenPathsWhereItHitOpponentPiece:function (piece, paths) {
        for (var i = 0; i < paths.length; i++) {
            paths[i] = this.shortenPathWhereItHitsOpponentPiece(piece, paths[i]);
        }
        return paths;
    },

    shortenPathWhereItHitsOpponentPiece:function (piece, path) {

        var opositeColor = piece.color === 'white' ? 'black' : 'white';
        for (var j = 0; j < path.length; j++) {
            var square = path[j];
            //var pieceOnSquare = this.getColoredPieceOnSquare(opositeColor, square);
            var pieceOnSquare = ludo.ChessCache[this.fen]['squares_' + square];
            if (pieceOnSquare && pieceOnSquare.color == opositeColor) {
                return path.slice(0, j + 1);
            }
        }
        return path;
    },

    removeEmptyPaths:function (paths) {
        var ret = [];
        for (var i = 0; i < paths.length; i++) {
            if (paths[i].length > 0) {
                ret.push(paths[i]);
            }
        }
        return ret;
    },

    removeInvalidPawnCapturePaths:function (piece, paths) {
        var file = FenParserConfig.numericFiles[piece.square];
        var rank = FenParserConfig.numericRanks[piece.square];

        var enPassantSquare = this.getEnPassantSquare();
        var oppositeColor = this.getOppositeColor(piece.color);
        var ret = [];
        for (var i = 0; i < paths.length; i++) {
            if (paths[i].length === 1) {
                var square = paths[i][0];
                var squareFile = FenParserConfig.numericFiles[square];
                if (squareFile === file || square === enPassantSquare || this.getColoredPieceOnSquare(oppositeColor, square)) {
                    ret.push(paths[i]);
                }
            } else {
                var path = [];
                for (var j = 0; j < paths[i].length; j++) {
                    var square = paths[i][j];
                    var pieceOnSquare = ludo.ChessCache[this.fen]['squares_' + square];
                    if (!pieceOnSquare) {
                        path.push(square);
                    } else {
                        break;
                    }
                }
                ret.push(path);
            }
        }

        return ret;
    },

    getCastlePaths:function (piece) {
        var ret = {
            paths:[],
            moves:[]
        };

        if (this.isOnFirstRank(piece)) {
            var rooks = null;
            if (this.canCastleQueenSide(piece.color)) {
                var rooks = this.getRooksOnFirstRank(piece.color);
                if (rooks.length > 0 && rooks[0].square < piece.square) {
                    var path = this.getQueenSideCastlePath(piece);
                    if (path.length > 0) {
                        ret.paths.push(path);
                        ret.moves.push(path[0]);
                    }
                }
            }

            if (this.canCastleKingSide(piece.color)) {
                if (!rooks) {
                    var rooks = this.getRooksOnFirstRank(piece.color);
                }
                if (rooks.length > 0 && rooks[rooks.length - 1].square > piece.square) {
                    var path = this.getKingSideCastlePath(piece);
                    if (path.length > 0) {
                        ret.paths.push(path);
                        ret.moves.push(path[0]);
                    }
                }
            }
        }
        return ret;
    },

    isPathClearedForCastling:function (piece, path) {
        if (this.isPathAttacked(piece, path)) {
            return false;
        }
        var piecesInPath = this.getPiecesInPath(path);

        if (piecesInPath.length === 0 || ( piecesInPath.length === 1 && piecesInPath[0].type === 'rook' && piecesInPath[0].color === piece.color  )) {
            return true;
        }
        return false;
    },

    isPathAttacked:function (piece, path) {
        var oppositeColor = this.getOppositeColor(piece.color);
        var moveConfig = this.getMoveConfig(oppositeColor);
        var opponentMoves = this.getAllAvailableMoves(oppositeColor);
        for (var i = 0; i < path.length; i++) {
            if (opponentMoves.indexOf(path[i]) >= 0) {
                return true;
            }
        }
        return false;
    },

    getPiecesInPath:function (path) {
        var ret = [];

        for (var i = 0; i < path.length; i++) {
            var piece = ludo.ChessCache[this.fen]['squares_' + path[i]];
            if (piece) {
                ret.push(piece);
            }
        }

        return ret;
    },

    getAllAvailableMoves:function (color) {
        var cacheKey = 'availableMoves_' + color;
        if (!this.isInCache(cacheKey)) {
            var moveConfig = this.getMoveConfig(color);
            this.setCache(cacheKey, Object.values(moveConfig.moves).flatten());
        }
        return ludo.ChessCache[this.fen][cacheKey];
    },

    getKingSideCastlePath:function (piece) {
        var toSquare = 'g' + this.getNumericRank(piece.square);
        var path = this.getCastlePath(piece, toSquare);
        if (this.isPathClearedForCastling(piece, path)) {
            if (path.length === 1) {
                return [path[path.length - 1].square];
            } else {
                return [ path[path.length - 1] ];
            }
        }
        return [];
    },

    getQueenSideCastlePath:function (piece) {
        var toSquare = 'c' + this.getNumericRank(piece.square);
        var path = this.getCastlePath(piece, toSquare);
        if (this.isPathClearedForCastling(piece, path)) {
            if (path.length === 1) {
                return [path[0].square];
            } else {
                return[ path[path.length - 1] ];
            }
        }
        return [];
    },

    getCastlePath:function (piece, toSquare) {
        toFile = this.getNumericFile(toSquare);
        var file = this.getNumericFile(piece.square);
        var rank = this.getNumericRank(piece.square);
        var ret = [];
        if (toFile > file) {
            for (var i = file + 1; i <= toFile; i++) {
                ret.push(FenParserConfig.files[i] + rank);
            }
        } else {
            for (var i = file - 1; i >= toFile; i--) {
                ret.push(FenParserConfig.files[i] + rank);
            }
        }
        return ret;
    },

    pathsToSquares:function (paths) {
        var allMoves = this.flattenArray(paths), ret = [], obj = {};

        for (var i = 0; i < allMoves.length; i++) {
            if (!obj[allMoves[i]]) {
                obj[allMoves[i]] = true;
                ret.push(allMoves[i]);
            }
        }
        return ret;
    },

    flattenArray:function (ret) {
        var array = [];
        for (var i = 0, l = ret.length; i < l; i++) {
            for(var j=0;j<ret[i].length;j++){
                array.push(ret[i][j]);
            }
        }
        return array;
    },

    getPinnedAndCheck:function (piece, paths) {
        var king = this.getKing(FenParserConfig.oppositeColors[piece.color]);
        if (!king) {
            return paths;
        }
        var ret = {
            pinned:undefined,
            check:[]
        };
        kingSquare = king.square;
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var index = path.indexOf(kingSquare);

            if (index >= 0) {
                var occupiedSquares = [];
                for (var j = 0; j < index; j++) {
                    if (ludo.ChessCache[this.fen]['squares_' + path[j]]) {
                        occupiedSquares.push(path[j]);
                    }
                }
                if (occupiedSquares.length === 1) {
                    if (ret.pinned === undefined) {
                        ret.pinned = [];
                    }
                    if (ret.pinned[occupiedSquares[0]] === undefined) {
                        ret.pinned[occupiedSquares[0]] = [];
                    }
                    ret.pinned[occupiedSquares[0]].push(piece);
                }
                if (occupiedSquares.length === 0) {
                    var pathToKing = [piece.square].concat(path.slice(0, index));
                    ret.check.push(pathToKing);
                }
            }
        }

        return ret;
    },

    isMoveValid:function (fromSquare, toSquare) {
        var config = this.getPositionData(this.getWhoToMove());
        return config.moves[fromSquare] && config.moves[fromSquare].indexOf(toSquare) >= 0;
    }
});
