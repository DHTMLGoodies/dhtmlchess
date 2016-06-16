/**
 * Chess board for the position setup dialog
 * @namespace chess.view.position
 * @class Board
 * @extends chess.view.board.Board
 */
chess.view.position.Board = new Class({
    Extends:chess.view.board.Board,
    type : 'chess.view.position.Board',
    vAlign:'top',
    pieceLayout:'alphapale',
    boardLayout:'wood',
    module:'positionsetup',
    submodule:'chesspositionboard',
    boardCss:{
        'background-color':'transparent',
        border:0
    },
    lowerCaseLabels:true,
    selectedPiece:undefined,

    ludoEvents:function () {
        this.parent();
        this.els.board.addEvent('click', this.insertPiece.bind(this));
        this.addEvent('resetboard', this.sendFen.bind(this));
        this.addEvent('modifyboard', this.sendFen.bind(this));
        this.addEvent('clearboard', this.sendFen.bind(this));
        this.addEvent('render', this.sendFen.bind(this));
    },

    setController:function(){

    },

    sendFen:function () {
        this.fireEvent('setPosition', this.getFen());
    },

    deleteSelectedPiece:function () {
        this.selectedPiece = undefined;
        this.els.board.style.cursor = 'default';
    },

    setSelectedPiece:function (piece) {
        this.selectedPiece = piece;
        this.els.board.style.cursor = 'pointer';
    },

    insertPiece:function (e) {
        if (!this.selectedPiece) {
            return;
        }
        var square = this.getSquareByEvent(e);
        if (square === undefined) {
            return;
        }
        if (!this.isValidSquareForSelectedPiece(square)) {
            return;
        }
        var p;
        if (this.selectedPiece.pieceType == 'king') {
            p = this.getKingPiece(this.selectedPiece.color);
            var visiblePieceOnSquare = this.getVisiblePieceOnNumericSquare(square);
            if (visiblePieceOnSquare) {
                this.hidePiece(visiblePieceOnSquare);
                if (this.isEqualPiece(visiblePieceOnSquare, p)) {
                    this.fireEvent('modifyboard');
                    return;
                }
            }
            this.hidePiece(p);
        }
        if (!p) {
            p = this.getVisiblePieceOnNumericSquare(square);
            if (p && p.pieceType == 'king') {
                this.hidePiece(p);
            }
            else if (p) {
                if (this.isEqualPiece(p, this.selectedPiece) && p.isVisible()) {
                    this.hidePiece(p);
                    this.fireEvent('modifyboard');
                    return;
                }
            } else {
                p = this.pieces[this.getIndexForNewPiece(this.selectedPiece.color)];
            }
        }

        this.configurePieceAndPlaceOnSquare(p, square);
        this.fireEvent('modifyboard');

    },

    isValidSquareForSelectedPiece:function (square) {
        var p = this.selectedPiece;

        if (p.pieceType == 'pawn') {
            var rank = ((square & 240) / 16) + 1;
            if (rank < 2 || rank > 7) {
                return false;
            }
        }

        return true;
    },

    configurePieceAndPlaceOnSquare:function (piece, placeOnSquare) {
        piece.square = placeOnSquare;
        piece.pieceType = this.selectedPiece.pieceType;
        piece.color = this.selectedPiece.color;
        piece.position();
        piece.updateBackgroundImage();
        piece.show();
        this.pieceMap[piece.square] = piece;
    },

    isEqualPiece:function (piece1, piece2) {
        return piece1.color == piece2.color && piece1.pieceType == piece2.pieceType;
    },

    getIndexForNewPiece:function (color) {
        var firstIndex;
        for (var i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].color == color) {
                if (!firstIndex)firstIndex = i;
                if (!this.pieces[i].isVisible()) {
                    return i;
                }
            }
        }
        return firstIndex;
    },

    getIndexesOfPiecesOfAColor:function (color) {
        var ret = [];
        for (var i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].color == color) {
                ret.push(i);
            }
        }
        return ret;
    },

    getKingPiece:function (color) {
        for (var i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].pieceType == 'king' && this.pieces[i].color == color) {
                return this.pieces[i];
            }
        }
        return null;
    },

    getVisiblePieceOnNumericSquare:function (square) {
        var piece = this.pieceMap[square];
        if (piece && piece.isVisible()) {
            return piece;
        }
        return null;
    },

    getSquareByEvent:function (e) {
        var boardPos = this.els.board.getPosition();
        var squareSize = this.getSquareSize();

        var x = Math.floor((e.page.x - boardPos.x) / squareSize);
        var y = Math.floor((e.page.y - boardPos.y) / squareSize);
        if (!this.isFlipped()) {
            y = 7 - y;
        } else {
            x = 7 - x;
        }
        var square = y * 16 + x;
        if ((square & 0x88) === 0) {
            return square;
        }
        return undefined;
    },

    getFen:function () {
        var fen = '';
        var emptyCounter = 0;
        for (var i = 0; i < Board0x88Config.fenSquaresNumeric.length; i++) {
            var square = Board0x88Config.fenSquaresNumeric[i];
            if (i && i % 8 == 0) {
                if (emptyCounter > 0) {
                    fen = fen + emptyCounter;
                }
                fen = fen + '/';
                emptyCounter = 0;
            }
            var piece = this.pieceMap[square];
            if (piece) {
                if (emptyCounter > 0) {
                    fen = fen + emptyCounter;
                    emptyCounter = 0;
                }
                fen = fen + Board0x88Config.fenNotations[piece.color][piece.pieceType];
            } else {
                emptyCounter++;
            }
        }
        if (emptyCounter > 0) {
            fen = fen + emptyCounter;
        }
        return fen;
    }
});