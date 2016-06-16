chess.view.highlight.SquareBase = new Class({
    Extends:chess.view.highlight.Base,
    els:{},
    visibleSquares:[],

	ludoConfig:function (config) {
        this.parent(config);
        this.createDOM();
    },

    createDOM:function () {
        var files = 'abcdefgh';
        var squares = this.getParent().getSquares();
        this.els.square = {};
        for (var i = 0; i < squares.length; i++) {
            var square = files.substr((i % 8), 1) + Math.ceil(8 - (i / 8));
            this.createHighlightElement(square, squares[i]);
        }
        this.getParent().addEvent('resize', this.resizeSquares.bind(this));
    },

    createHighlightElement:function (square, renderTo) {
        var el = renderTo.getElement('.ludo-chess-square-highlight');
        if (!el) {
            el = new Element('div');
            el.id = 'ludo-square-highlight-' + String.uniqueID();
            el.addClass('ludo-chess-square-highlight');
        }
        el.style.display = 'none';
        this.els.square[square] = el.id;
        renderTo.adopt(el);
    },

    highlight:function (move) {
        this.clear();
        var squares = [move.from, move.to];
        for (var i = 0; i < squares.length; i++) {
            this.highlightSquare(squares[i]);
        }
    },

    highlightSquare:function (square) {
        var el = document.id(this.els.square[square]);
        this.visibleSquares.push(el);
        el.style.display = '';
        this.resizeSquare(el);
    },

    resizeSquares:function () {
        for (var i = 0; i < this.visibleSquares.length; i++) {
            this.resizeSquare(this.visibleSquares[i]);
        }
    },

    resizeSquare:function (el) {
        var size = el.getParent().getSize().x;
        var width = size - ludo.dom.getMBPW(el);
        var height = size - ludo.dom.getMBPH(el);
        el.style.width = width + 'px';
        el.style.height = height + 'px';
    },

    clear:function () {
        for (var i = 0; i < this.visibleSquares.length; i++) {
            this.visibleSquares[i].style.display = 'none';
        }
        this.visibleSquares = [];
    }
});