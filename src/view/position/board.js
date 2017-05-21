/**
 * Chess board for the position setup dialog
 * @namespace chess.view.position
 * @class Board
 * @extends chess.view.board.Board
 */
chess.view.position.Board = new Class({
    Extends: chess.view.board.Board,
    type: 'chess.view.position.Board',
    vAlign: 'top',
    pieceLayout: 'svg_bw',
    boardLayout: 'wood',
    module: 'positionsetup',
    submodule: 'chesspositionboard',
    boardCss: {
        'background-color': 'transparent',
        border: 0
    },
    lowerCaseLabels: true,
    selectedPiece: undefined,

    ludoEvents: function () {
        this.parent();
        this.addBoardEvents();
    },

    addBoardEvents: function () {
        this.els.board.on('click', this.insertPiece.bind(this));
        this.addEvent('resetboard', this.sendFen.bind(this));
        this.addEvent('modifyboard', this.sendFen.bind(this));
        this.addEvent('clearboard', this.sendFen.bind(this));
        this.addEvent('render', this.sendFen.bind(this));
    },

    setController: function () {

    },

    sendFen: function () {
        this.fireEvent('setPosition', this.getFen());
    },

    deleteSelectedPiece: function () {
        this.selectedPiece = undefined;
        this.els.board.css('cursor', 'default');
    },

    setSelectedPiece: function (piece) {
        this.selectedPiece = piece;
        this.els.board.css('cursor', 'pointer');
    },


    insertPiece: function (e) {

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

        if (this.selectedPiece.pieceType === 'k') {
            p = this.getAvailablePiece(square);

            var visiblePieceOnSquare = this.getVisiblePieceOnNumericSquare(square);
            if (visiblePieceOnSquare) {

                if (this.isEqualPiece(visiblePieceOnSquare, p)) {
                    this.hidePiece(visiblePieceOnSquare);
                    this.fireEvent('modifyboard');
                    return;
                }
            }
        }
        if (!p) {
            p = this.getAvailablePiece(square);

            if (p && p.pieceType === 'k') {
                this.hidePiece(p);
            }
            else if (p) {
                var ex = this.getVisiblePieceOnNumericSquare(square);
                if (ex) {
                    this.hidePiece(ex);
                    if (this.isEqualPiece(ex, this.selectedPiece)){
                        this.fireEvent('modifyboard');
                        return;
                    }
                }
            } else {
                p = this.pieces[this.getIndexForNewPiece(this.selectedPiece.color)];
            }
        }

        this.configurePieceAndPlaceOnSquare(p, square);
        this.fireEvent('modifyboard');

    },

    hidePiece: function (p) {

        this.pieceMap[p.square] = undefined;
        this.parent(p);
    },


    getAvailablePiece: function (square) {
        var selType = this.selectedPiece.pieceType;
        if (selType === 'k') {
            return this.getKingPiece(this.selectedPiece.color);
        }

        var color = this.selectedPiece.color;
        var ps;


        for (var i = 0; i < this.pieces.length; i++) {
            ps = this.pieces[i];
            if (ps.color === color && ps.pieceType === selType && !ps.isVisible()) {
                return ps;
            }
        }

        for (i = 0; i < this.pieces.length; i++) {
            ps = this.pieces[i];
            if (ps.color === color && !ps.isVisible() && ps.pieceType !== 'k') {
                return ps;
            }
        }

        for (i = 0; i < this.pieces.length; i++) {
            ps = this.pieces[i];
            if (ps.color === color && ps.pieceType === 'p') {
                return ps;
            }
        }

        for (i = 0; i < this.pieces.length; i++) {
            ps = this.pieces[i];
            if (ps.color === color && ps.square !== square && ps.pieceType === 'p') {
                return ps;
            }
        }

        for (i = 0; i < this.pieces.length; i++) {
            ps = this.pieces[i];
            if (ps.color === color) {
                return ps;
            }
        }
    },

    isValidSquareForSelectedPiece: function (square) {
        var p = this.selectedPiece;

        if (p.pieceType === 'p') {
            var rank = ((square & 240) / 16) + 1;
            if (rank < 2 || rank > 7) {
                return false;
            }
        }

        return true;
    },

    configurePieceAndPlaceOnSquare: function (piece, placeOnSquare) {

        piece.square = placeOnSquare;
        piece.color = this.selectedPiece.color;
        piece.pieceType = this.selectedPiece.pieceType;
        piece.position();
        piece.setPieceLayout(this.pieceLayout);
        piece.el.show();

        this.pieceMap[piece.square] = piece;
    },

    isEqualPiece: function (piece1, piece2) {
        return piece1.color === piece2.color && piece1.pieceType === piece2.pieceType;
    },

    getIndexForNewPiece: function (color) {
        var firstIndex;
        for (var i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].color === color) {
                if (!firstIndex) firstIndex = i;
                if (!this.pieces[i].isVisible()) {
                    return i;
                }
            }
        }
        return firstIndex;
    },

    getIndexesOfPiecesOfAColor: function (color) {
        var ret = [];
        for (var i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].color === color) {
                ret.push(i);
            }
        }
        return ret;
    },

    getKingPiece: function (color) {
        for (var i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].pieceType === 'k' && this.pieces[i].color === color) {
                return this.pieces[i];
            }
        }
        return null;
    },

    getVisiblePieceOnNumericSquare: function (square) {
        var piece = this.pieceMap[square];
        if (piece && piece.isVisible()) {
            return piece;
        }
        return null;
    },

    getSquareByEvent: function (e) {
        var boardPos = this.els.board.offset();
        var squareSize = this.getSquareSize();

        var x = Math.floor((e.pageX - boardPos.left) / squareSize);
        var y = Math.floor((e.pageY - boardPos.top) / squareSize);
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

    getFen: function () {
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