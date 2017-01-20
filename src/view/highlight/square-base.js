chess.view.highlight.SquareBase = new Class({
    Extends: chess.view.highlight.Base,
    els: {},
    visibleSquares: [],

    __construct: function (config) {
        this.parent(config);
        this.createDOM();
    },

    createDOM: function () {
        var files = 'abcdefgh';
        var squares = this.getParent().getSquares();
        this.els.square = {};
        for (var i = 0; i < squares.length; i++) {
            var square = files.substr((i % 8), 1) + Math.ceil(8 - (i / 8));
            this.createHighlightElement(square, squares[i]);
        }
        this.getParent().addEvent('resize', this.resizeSquares.bind(this));
    },

    createHighlightElement: function (square, renderTo) {
        var el = renderTo.find('.dhtml-chess-square-highlight').first();
        if (!el.length) {
            el = $('<div>');
            el.attr('id', 'ludo-square-highlight-' + String.uniqueID());
            el.addClass('dhtml-chess-square-highlight');
        }
        el.css('display', 'none');
        this.els.square[square] = el.attr('id');
        renderTo.append(el);
    },

    highlight: function (move) {
        this.clear();
        var squares = [move.from, move.to];
        for (var i = 0; i < squares.length; i++) {
            this.highlightSquare(squares[i]);
        }
    },

    highlightSquare: function (square) {
        var el = $("#" + this.els.square[square]);
        this.visibleSquares.push(el);
        el.css('display', '');
        this.resizeSquare(el);
    },

    resizeSquares: function () {
        for (var i = 0; i < this.visibleSquares.length; i++) {
            this.resizeSquare(this.visibleSquares[i]);
        }
    },

    resizeSquare: function (el) {
        var size = el.parent().outerWidth();
        var width = size - ludo.dom.getMBPW(el);
        var height = size - ludo.dom.getMBPH(el);
        el.css({
            width: width, height: height
        });
    },

    clear: function () {
        for (var i = 0; i < this.visibleSquares.length; i++) {
            this.visibleSquares[i].css('display', 'none');
        }
        this.visibleSquares = [];
    }
});