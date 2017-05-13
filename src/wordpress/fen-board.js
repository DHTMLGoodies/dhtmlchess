chess.wordpress.FenBoard = new Class({
    Extends: chess.view.position.Board,
    mode: 'insertPiece',

    curColor: undefined,
    curArrow: undefined,

    addBoardEvents: function () {

        this.els.board.on('mousedown', this.onMouseDown.bind(this));
        this.els.board.on('mouseup', this.onMouseUp.bind(this));
        this.els.board.on('click', this.onBoardClick.bind(this));
        this.els.board.on('mousemove', this.onBoardMove.bind(this));

        jQuery(document.body).on('mouseup', this.onMouseUp.bind(this));
        this.els.board.on('mouseup', this.onBoardMove.bind(this));
        this.addEvent('resetboard', this.sendFen.bind(this));
        this.addEvent('modifyboard', this.sendFen.bind(this));
        this.addEvent('clearboard', this.sendFen.bind(this));
        this.addEvent('render', this.sendFen.bind(this));
    },

    lastArrowSquare: undefined,

    onMouseUp: function (e) {
        if (this.mode === 'arrowMove') {
            var square = this.getSquareByEvent(e);
            var squareString = Board0x88Config.numberToSquareMapping[square];

            if (squareString === this.curArrow.from) {
                this.arrowPool().removeArrow(this.curArrow);
            } else {
                this.arrowPool().update(this.curArrow, squareString);
            }

            console.log(this.arrowPool().toString());
            this.mode = 'arrowStart';
        }
        this.lastArrowSquare = undefined;
    },

    onBoardMove: function (e) {
        if (this.mode === 'arrowMove') {
            var square = this.getSquareByEvent(e);
            if (square !== this.lastArrowSquare) {
                var squareString = Board0x88Config.numberToSquareMapping[square];
                this.lastArrowSquare = square;
                this.arrowPool().update(this.curArrow, squareString);
            }
        }
    },

    clearBoard: function () {
        this.parent();
        this.clearArrows();
        this.highlightPool().hideAll();
    },

    clearArrows: function () {
        this.arrowPool().hideAll();
    },

    addArrow: function(from, to, color){
        this.arrowPool().show(from, to, { fill: color, stroke: color });
    },

    highlightSquare:function(square, color){
        this.highlightPool().show(square, color);
    },

    onMouseDown: function (e) {
        if (this.mode !== 'arrowStart')return;
        var square = this.getSquareByEvent(e);
        if (square === undefined)return;
        var squareString = Board0x88Config.numberToSquareMapping[square];

        this.curArrow = this.arrowPool().show(squareString, squareString, {
            fill: this.curColor,
            stroke: this.curColor
        });
        this.mode = 'arrowMove'
    },

    arrowString:function(){
        return this.arrowPool().toString();
    },

    highlightString:function(){
        return this.highlightPool().toString();
    },

    onBoardClick: function (e) {
        var square = this.getSquareByEvent(e);
        if (square === undefined)return;

        var squareString = Board0x88Config.numberToSquareMapping[square];


        switch (this.mode) {
            case 'insertPiece':
                this.insertPiece(e);
                break;
            case 'arrowStart':
            case 'arrowMove':

                break;
            case 'highlight':
                this.highlightPool().show(squareString, this.curColor);
                break;
        }
    },

    startHighlight: function (color) {
        this.mode = 'highlight';
        this.curColor = color;
    },

    startArrowMode: function (color) {
        this.mode = 'arrowStart';
        this.curColor = color;
    },

    setMode: function (mode) {
        this.mode = mode;
    },

    clearMode: function () {
        this.mode = 'insertPiece';
    },

    highlightPool: function () {
        if (this._highlightPool === undefined) {
            this._highlightPool = new chess.view.highlight.SquarePool({
                board: this,
                autoToggle: true
            });
        }

        return this._highlightPool;

    },

    _arrowPool: undefined,
    arrowPool: function () {
        if (this._arrowPool === undefined) {
            this._arrowPool = new chess.view.highlight.ArrowPool({
                board: this
            });
        }
        return this._arrowPool;

    }
});