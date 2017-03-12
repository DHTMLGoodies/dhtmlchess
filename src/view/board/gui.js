/**
 * Javascript Class for Chess Board and Pieces on the board
 * JSON config type: chess.view.board.Board
 * @module View
 * @submodule Board
 * @namespace chess.view.board
 * @class GUI
 * @extends View
 */
chess.view.board.GUI = new Class({
    Extends: ludo.View,
    type: 'chess.view.board.GUI',
    module: 'chess',
    submodule: 'board',
    labels: true,
    labelPos: 'outside', // outside or inside - inside = in the corner of the left and bottom squares.
    flipped: false,
    boardLayout: undefined,
    vAlign: 'middle',
    boardCls: undefined,
    boardCss: undefined,
    lowerCaseLabels: false,
    background: undefined,

    bg: undefined,

    padding: undefined,

    internal: {
        squareSize: 30,
        piezeSize: 30,
        squareSizes: [15, 30, 45, 60, 75, 90, 105],
        timestampLastResize: 0
    },

    labelOddStyles: undefined,
    labelEvenStyles: undefined,
    labelStyles: undefined,

    squareStyles_white:undefined,
    squareStyles_black:undefined,

    __construct: function (config) {

        this.parent(config);
        this.padding = '3.5%';

        this.__params(config, [
            'background',
            'labels', 'boardCls', 'boardCss', 'boardLayout', 'lowerCaseLabels', 'chessSet', 'vAlign',
            'labelPos', 'labelStyles', 'labelOddStyles', 'labelEvenStyles', 'padding',
            'bgWhite', 'bgBlack','squareStyles_white', 'squareStyles_black']);


        if (!jQuery.isPlainObject(this.padding)) {
            this.padding = {
                l: this.padding, t: this.padding, r: this.padding, b: this.padding
            }
        }
    },

    updateBackgroundPattern: function (horizontal, vertical) {
        if (this.bg) {
            this.bg.setPattern(horizontal, vertical)
        }
    },

    /**
     * Update css styling of labels
     * @function setLabelStyles
     * @param {object} stylesFiles
     * @param {object} stylesRanks
     * @memberof ludo.chess.view.board.Gui.prototype
     */
    setLabelStyles: function (stylesFiles, stylesRanks) {
        this.$b().find('.dhtml-chess-board-label-file').css(stylesFiles);
        this.$b().find('.dhtml-chess-board-label-rank').css(stylesRanks || stylesFiles);
    },

    hideLabels: function () {

    },

    setPaddings: function (l, t, r, b) {
        if (arguments.length == 1) {
            t = r = b = l;
        }
        this.padding = {
            l: l, t: t, r: r, b: b
        };
        this.resizeBoard();
    },

    ludoDOM: function () {
        this.parent();

        this.els.labels = {};

        this.$b().css({
            'padding': 0,
            'margin': 0,
            'border': 0
        });

        if (this.background) {
            this.bg = new chess.view.board.Background(
                Object.merge({
                    view: this
                }, this.background)
            )
        }

        this.createBoardContainer();
        if (this.hasLabelsOutside()) {
            this.addLabelsForRanks();
        }

        this.createContainerForBoardAndFileLabels();
        this.createBoard();
        this.createSquares();
        this.createPieceContainer();

        if (this.hasLabelsInside()) {
            this.addLabelsForRanks();
        }


        if (this.hasLabels()) {
            this.addLabelsForFiles();
        }


        if (this.boardLayout) {
            this.els.boardContainer.addClass('dhtml-chess-board-container-' + this.boardLayout);
        }
    },
    ludoEvents: function () {
        this.parent();
        jQuery(document.documentElement).on('keypress', this.receiveKeyboardInput.bind(this));
    },

    receiveKeyboardInput: function (e) {
        if (e.control && e.key === 'f') {
            this.flip();
        }
    },

    __rendered: function () {
        this.parent();

        if(this.bgWhite){
            this.setSquareBg('white', this.bgWhite);
        }
        if(this.bgBlack){
            this.setSquareBg('black', this.bgBlack);
        }
        this.resizeSquares();
        this.resizeBoard.delay(50, this);
        this.updateLabels();
    },

    hasLabelsOutside: function () {
        return this.labels && this.labelPos == 'outside';
    },
    hasLabelsInside: function () {
        return this.labels && this.labelPos == 'inside';
    },
    hasLabels: function () {
        return this.labels;
    },

    createBoardContainer: function () {
        var el = this.els.boardContainer = jQuery('<div>');
        el.addClass('dhtml-chess-board-container');
        if (this.boardCss) {
            el.css(this.boardCss);
        }
        if (this.boardCls) {
            el.addClass(this.boardCls);
        }
        this.$b().append(el);
    },

    createContainerForBoardAndFileLabels: function () {
        var el = this.els.boardContainerInner = jQuery('<div>');
        el.css('float', 'left');
        this.els.boardContainer.append(el);
    },

    createBoard: function () {
        this.els.board = jQuery('<div class="dhtml-chess-board"></div>');
        this.els.board.css({
            position: 'relative',
            margin: 0,
            padding: 0,
            width: this.internal.squareSize * 8,
            height: this.internal.squareSize * 8
        });
        this.els.boardContainerInner.append(this.els.board);


    },

    createSquares: function () {
        var files = 'abcdefgh';
        this.els.squares = [];

        for (var i = 0; i < 64; i++) {
            var square = files.substr((i % 8), 1) + Math.ceil(8 - (i / 8));
            var el = this.els.squares[i] = jQuery('<div class="dhtml-chess-square" style="position:relative"></div>');
            this.els.board.append(el);
            var backgroundPos = Math.round(Math.random() * 100) * -1;
            el.css('backgroundPosition', backgroundPos + 'px ' + backgroundPos + 'px');
        }
        this.updateSquares();

        this.els.hParent = jQuery('<div style="z-index:2;position:absolute;left:0;top:0;width:100%;height:100%"></div>');
        this.els.board.append(this.els.hParent);
    },

    getDivForInteraction:function(){
        return this.els.hParent;
    },

    getSquares: function () {
        return this.els.squares;
    },

    boardEl:function(){
        return this.els.board;
    },

    createPieceContainer: function () {
        this.els.pieceContainer = jQuery('<div>');
        this.els.pieceContainer.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%'
        });
        this.els.board.append(this.els.pieceContainer);
    },

    squareBg_white: undefined,
    squareBg_black: undefined,

    setSquareBg: function (color, background) {
        if (color != 'white' && color != 'black')return;
        this['squareBg_' + color] = background;
        this.updateSquares();
    },

    updateSquares: function () {
        var types = ['white', 'black'];
        var index = 0;
        for (var i = 0; i < 64; i++) {
            index++;
            if (i % 8 == 0) {
                index++;
            }

            var t = types[index % 2];
            this.els.squares[i].css('float', 'left');
            this.els.squares[i].addClass('dhtml-chess-square-' + t);


            if (this['squareStyles_' + t] != undefined) {
                this.els.squares[i].css(this['squareStyles_' + t]);

            }
            if (this['squareBg_' + t] != undefined) {
                this.els.squares[i].css('background-image', 'url(' + this['squareBg_' + t] + ')');

            }
        }
    },

    flipSquares: function () {
        var squares = [];
        for (var i = this.els.squares.length - 1; i >= 0; i--) {
            this.els.board.append(this.els.squares[i]);
            squares.push(this.els.squares[i]);
        }
        this.els.squares = squares;
    },

    addLabelsForFiles: function () {
        var el = this.els.labels.files = jQuery('<div class="dhtml-chess-board-label-files-container ludo-noselect"></div>');
        el.css({
            position: 'absolute', 'z-index': 100, 'bottom': 0
        });
        if (this.labelPos == 'inside') {
            el.css('bottom', 0);
            el.addClass('dhtml-chess-board-label-inside');
        }
        this.els.files = [];
        for (var i = 0; i < 8; i++) {
            var odd = i % 2 == 0;
            var file = this.els.files[i] = jQuery('<div class="dhtml-chess-board-label dhtml-chess-board-label-file"></div>');

            if (this.labelStyles) {
                file.css(this.labelStyles);
            }
            if (odd && this.labelOddStyles) {
                file.css(this.labelOddStyles)
            }
            if (!odd && this.labelEvenStyles) {
                file.css(this.labelEvenStyles)

            }

            file.addClass('dhtml-chess-board-label-' + (odd ? 'odd' : 'even'));
            file.css({
                'width': (100 / 8) + '%',
                'float': 'left',
                'overflow': 'hidden'
            });
            el.append(file);
        }


        var parent = this.labelPos == 'outside' ? this.els.boardContainer : this.els.board;

        parent.append(el);
    },

    addLabelsForRanks: function () {
        var el = this.els.labels.ranks = jQuery('<div class="dhtml-chess-board-label-ranks-container  ludo-noselect"></div>');
        if (this.labelPos == 'inside') {
            el.addClass('dhtml-chess-board-label-inside');
        }
        el.css({
            position: 'absolute',
            'float': 'left',
            left: '0px', top: '0px',
            height: '100%', 'z-index': 100
        });

        if (this.labelpos == 'outside') {
            el.css('text-align', 'center');
        }
        this.els.ranks = [];
        for (var i = 0; i < 8; i++) {
            var odd = (i + 1) % 2 == 0;
            var rank = this.els.ranks[i] = jQuery('<div class="dhtml-chess-board-label dhtml-chess-board-label-rank"></div>');
            if (this.labelStyles) {
                rank.css(this.labelStyles);
            }
            if (odd && this.labelOddStyles) {
                rank.css(this.labelOddStyles)
            }
            if (!odd && this.labelEvenStyles) {
                rank.css(this.labelEvenStyles)

            }
            rank.addClass('dhtml-chess-board-label-' + ((i + 1) % 2 == 0 ? 'odd' : 'even'));
            rank.css({
                'height': (100 / 8) + '%',
                'overflow': 'hidden'
            });
            if (this.labelPos == 'outside') {
                rank.css('line-height', this.internal.squareSize);

            }
            el.append(rank);
        }

        var parent = this.labelPos == 'outside' ? this.els.boardContainer : this.els.board;

        parent.append(el);
    },

    updateLabels: function () {
        if (!this.hasLabels()) {
            return;
        }
        var ranks, files;
        if (!this.isFlipped()) {
            files = 'ABCDEFGH';
            ranks = '87654321';
        } else {
            files = 'HGFEDCBA';
            ranks = '12345678';

        }
        if (this.lowerCaseLabels) {
            files = files.toLowerCase();
        }
        for (var i = 0; i < 8; i++) {
            this.els.ranks[i].html('<span>' + ranks.substr(i, 1) + '</span>');
            this.els.files[i].html('<span>' + files.substr(i, 1) + '</span>');

        }
    },

    resizeDOM: function () {
        this.parent();
        this.internal.timestampLastResize = this.getTimeStamp();
        this.resizeBoard();
    },

    autoResizeBoard: function () {
        this.resizeBoard();
    },
    lastBoardSize: {x: 0, y: 0},

    boardCoordinates: function () {
        var b = this.els.boardContainer;
        var bodyOff = this.$b().offset();
        var off = b.offset();

        var ret = {
            left: off.left - bodyOff.left,
            top: off.top - bodyOff.top
        };
        ret.width = b.outerWidth();
        ret.height = b.outerHeight();
        return ret;
    },

    resizeBoard: function () {

        ludo.dom.clearCache();

        var bc = this.els.boardContainer;
        var pl = this.getP('l');
        var pt = this.getP('t');
        var pr = this.getP('r');
        var pb = this.getP('b');



        bc.css({
            'padding-left': pl,
            'padding-top': pt,
            'padding-right': pr,
            'padding-bottom': pb
        });

        var boardSize = Math.min(
            this.$b().width() - (bc.outerWidth() - bc.width()),
            this.$b().height() - (bc.outerHeight() - bc.height())
        );

        if (boardSize < 10 || (boardSize == this.lastBoardSize.x && boardSize == this.lastBoardSize.y)) {
            return;
        }

        this.lastBoardSize = boardSize;

        boardSize = Math.max(this.internal.squareSizes[0] * 8, Math.floor(boardSize / 8) * 8);
        if (isNaN(boardSize) || boardSize < 0) {
            return;
        }

        var mt = 0;

        if (this.vAlign == 'middle') {
            mt = Math.max(0, (this.$b().height() - this.$b().width()) / 2);
        } else if (this.vAlign == 'bottom') {
            mt = Math.max(0, (this.$b().height() - this.$b().width()));
        }

        this.els.boardContainer.css({
            top: mt,
            width: boardSize + 'px',
            height: boardSize + 'px'
        });

        this.internal.pieceSize = this.getNewPieceSize();

        var w = bc.width() - (this.els.board.outerWidth() - this.els.board.width());

        if(Browser.name == 'safari'){ // Safari workaround - not accepting decimal values
            var o = w % 8;
            if(o > 4){
                o = o - 8;
            }
            w-=o;
            pl += (o/2);
            pt += (o/2);
        }

        this.internal.squareSize = w / 8;

        this.els.board.css({
            position: 'absolute',
            left: pl,
            top: pt,
            width: w,
            height: w
        });

        this.resizeLabels();
        this.resizePieces();

        this.fireEvent('boardResized', this.boardCoordinates());
    },

    resizeLabels: function () {
        if (!this.hasLabels()) {
            return;
        }

        this.els.labels.ranks.css('height', this.els.board.css('height'));
        this.els.labels.files.css('width', this.els.board.css('width'));

        var r = this.els.labels.ranks;
        var f = this.els.labels.files;

        if (this.labelPos == 'outside') {
            r.css('top', this.els.boardContainer.css('padding-top'));

            f.css('line-height', this.getP('b') + 'px');


            r.css('width', this.getP('l'));
            f.css('height', this.getP('b'));

            var fs = Math.ceil(f.height() * (this.labelPos == 'outside' ? 0.65 : 0.5 ));

            r.css('font-size', fs + 'px');
            f.css('font-size', fs + 'px');
        }else{
            var fs2 = Math.round(this.getSquareSize() * 0.2);
            r.css('font-size', fs2 + 'px');
            f.css('font-size', fs2 + 'px');
        }

        var h = this.els.ranks[0].height();
        for (var i = 0; i < 8; i++) {
            if (this.labelPos == 'outside') {
                this.els.ranks[i].css('line-height', h + 'px');
            } else {
                this.els.ranks[i].css({
                    position: 'absolute',
                    width: 'auto', height: 'auto',
                    top: this.internal.squareSize * i
                });
                this.els.files[i].css({
                    position: 'absolute',
                    width: 'auto',
                    left: (this.internal.squareSize * (i + 1)) - this.els.files[i].outerWidth(),
                    bottom: 0,
                    height: 'auto'
                })
            }
        }
    },

    getP: function (pos) {
        var p = this.padding[pos];
        if (isNaN(p)) {
            p = parseInt(p);
            return Math.min(this.$b().width(),  this.$b().height()) * p / 100;
        }
        return p;
    },

    resizeSquares: function () {
        for (var i = 0; i < 64; i++) {
            this.els.squares[i].css({
                width: '12.5%',
                height: '12.5%'
            });
        }
    },

    getNewPieceSize: function () {
        return this.internal.squareSize - this.internal.squareSize % 15;
    },

    getNewSizeOfBoardContainer: function () {
        var b = this.els.boardContainer;
        var c = this.$b();

        var widthOffset = b.outerWidth() - b.width();
        var heightOffset = b.outerHeight() - b.height();

        var size = {x: c.width(), y: c.height()};
        size = {
            x: size.x - widthOffset,
            y: size.y - heightOffset
        };
        return size;
    },

    flip: function () {
        this.flipped = !this.flipped;
        this.updateLabels();
        this.flipSquares();
        this.fireEvent('flip', this);

    },
    isFlipped: function () {
        return this.flipped;
    },

    labelHeight: undefined,
    getLabelHeight: function () {
        if (!this.labels || this.labelPos == 'inside') {
            return 0;
        }
        if (this.labelHeight === undefined) {
            this.labelHeight = this.els.labels.files.outerHeight();
        }
        return this.labelHeight;
    },

    labelWidth: undefined,
    getLabelWidth: function () {
        if (!this.labels || this.labelPos == 'inside') {
            return 0;
        }
        if (this.labelWidth === undefined) {
            this.labelWidth = this.els.labels.ranks.outerWidth();
        }
        return this.labelWidth;
    },

    getBoard: function () {
        return this.els.pieceContainer;
    },

    getPieceSize: function () {
        return this.internal.pieceSize;
    },

    getSquareSize: function () {
        return this.internal.squareSize;
    },

    getTimeStamp: function () {
        return new Date().getTime();
    },

    getHeightOfContainer: function () {
        return this.$b().height();

    },

    getSquareByCoordinates: function (x, y) {
        var offset = this.internal.squareSize / 2;
        x += offset;
        y += offset;

        x = Math.max(0, x);
        y = Math.max(0, y);

        var max = this.internal.squareSize * 8;
        x = Math.min(max, x);
        y = Math.min(max, y);

        x = Math.floor(x / this.internal.squareSize);
        y = Math.floor(8 - (y / this.internal.squareSize));
        if (this.isFlipped()) {
            x = 7 - x;
            y = 7 - y;
        }
        return x + y * 16;
    },

    wrappedHeight: function (size) {
        return Math.min(size.width, size.height);
    },

    wrappedWidth:function(size){
        return Math.max(size.width, size.height);
    }
});