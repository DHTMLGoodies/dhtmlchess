chess.view.board.ArrowNode = new Class({
    Extends: ludo.svg.Node,

    _fromSquare: undefined,
    _toSquare: undefined,
    _bs: undefined,
    _flip: undefined,

    initialize: function (properties) {
        this.parent('path', properties);
    },

    showArrow: function (fromSquare, toSquare, boardSize, flip) {
        this._fromSquare = fromSquare;
        this._toSquare = toSquare;
        this._bs = boardSize;
        this._flip = flip;
        this._update();
    },

    setTo: function (square) {
        this._toSquare = square;
        this._update();
    },

    _update: function () {
        this.set('d', chess.util.CoordinateUtil.arrowPath(this._fromSquare, this._toSquare, {}, this._bs, this._flip));
    }


});