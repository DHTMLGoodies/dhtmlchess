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
    Extends:ludo.View,
    type:'chess.view.board.GUI',
    module:'chess',
    submodule:'board',
    labels:true,
    flipped:false,
    boardLayout:undefined,
    vAlign:'center',
    boardCls:undefined,
    boardCss:undefined,
    lowerCaseLabels:false,

    internal:{
        squareSize:30,
        piezeSize:30,
        squareSizes:[30, 45, 60, 75, 90, 105],
        timestampLastResize:0
    },

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['labels','boardCls','boardCss','boardLayout','lowerCaseLabels','chessSet']);
    },

    ludoDOM:function () {
        this.parent();

        this.els.labels = {};

        this.createBoardContainer();

        if (this.hasLabels()) {
            this.addLabelsForRanks();
        }

        this.createContainerForBoardAndFileLabels();
        this.createBoard();
        this.createSquares();
        this.createPieceContainer();

        if (this.hasLabels()) {
            this.addLabelsForFiles();
        }

        this.getBody().setStyles({
            'padding':0,
            'margin':0,
            'border':0
        });

        if (this.boardLayout) {
            this.els.boardContainer.addClass('ludo-chess-board-container-' + this.boardLayout);
        }
    },
    ludoEvents:function () {
        this.parent();
        document.id(document.documentElement).addEvent('keypress', this.receiveKeyboardInput.bind(this));
    },

    receiveKeyboardInput:function (e) {
        if (e.control && e.key === 'f') {
            this.flip();
        }
    },

    ludoRendered:function () {
        this.parent();
        this.resizeSquares();
        this.resizeBoard.delay(50, this);
        this.updateLabels();
    },

    hasLabels:function () {
        return this.labels;
    },

    createBoardContainer:function () {
        var el = this.els.boardContainer = new Element('div');
        el.addClass('ludo-chess-board-container');
        if (this.boardCss) {
            el.setStyles(this.boardCss);
        }
        if (this.boardCls) {
            el.addClass(this.boardCls);
        }
        this.getBody().adopt(el);
    },

    createContainerForBoardAndFileLabels:function () {
        var el = this.els.boardContainerInner = new Element('div');
        el.setStyle('float', 'left');
        this.els.boardContainer.adopt(el);
    },

    createBoard:function () {
        this.els.board = new Element('div');
        this.els.board.addClass('ludo-chess-board');
        this.els.board.setStyles({
            position:'relative',
            width:this.internal.squareSize * 8,
            height:this.internal.squareSize * 8
        });
        this.els.boardContainerInner.adopt(this.els.board);
    },

    createSquares:function () {
        var files = 'abcdefgh';
        this.els.squares = [];

        for (var i = 0; i < 64; i++) {
            var square = files.substr((i % 8), 1) + Math.ceil(8 - (i / 8));
            var el = this.els.squares[i] = new Element('div');
            el.addClass('ludo-chess-square');
            el.style.position = 'relative';
            this.els.board.adopt(el);
            var backgroundPos = Math.round(Math.random() * 150);
            el.style.backgroundPosition = backgroundPos + 'px ' + backgroundPos + 'px';
        }
        this.updateSquares();
    },

    getSquares:function(){
      return this.els.squares;
    },

    createPieceContainer:function () {
        this.els.pieceContainer = new Element('div');
        this.els.pieceContainer.setStyles({
            position:'absolute',
            left:0,
            top:0,
            width:'100%',
            height:'100%'
        });
        this.els.board.adopt(this.els.pieceContainer);
    },

    updateSquares:function () {
        var types = ['white', 'black'];
        var index = 0;
        for (var i = 0; i < 64; i++) {
            index++;
            if (i % 8 == 0) {
                index++;
            }
            this.els.squares[i].setStyle('float', 'left');
            this.els.squares[i].addClass('ludo-chess-square-' + types[index % 2]);
        }
    },

    flipSquares:function () {
        var squares = [];
        for (var i = this.els.squares.length - 1; i >= 0; i--) {
            this.els.board.adopt(this.els.squares[i]);
            squares.push(this.els.squares[i]);
        }
        this.els.squares = squares;
    },

    addLabelsForFiles:function () {
        var el = this.els.labels.files = new Element('div');
        el.addClass('ludo-chess-board-label-files-container');
        el.setStyles({
            position:'relative'
        });
        this.els.files = [];
        for (var i = 0; i < 8; i++) {
            var file = this.els.files[i] = new Element('div');
            file.addClass('ludo-chess-board-label-file');
            file.setStyles({
                'width':this.internal.squareSize + 'px',
                'float':'left',
                'overflow':'hidden'
            });
            el.adopt(file);
        }


        this.els.boardContainerInner.adopt(el);
    },

    addLabelsForRanks:function () {
        var el = this.els.labels.ranks = new Element('div');
        el.addClass('ludo-chess-board-label-ranks-container');
        el.setStyles({
            position:'relative',
            'float':'left',
            left:'0px', top:'0px',
            height:'100%'
        });

        this.els.ranks = [];
        for (var i = 0; i < 8; i++) {
            var rank = this.els.ranks[i] = new Element('div');
            rank.setStyles({
                'height':this.internal.squareSize + 'px',
                'text-align':'center',
                'line-height':this.internal.squareSize + 'px',
                'overflow':'hidden'
            });
            el.adopt(rank);
        }
        this.els.boardContainer.adopt(el);
    },

    updateLabels:function () {
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
            this.els.ranks[i].set('html', ranks.substr(i, 1));
            this.els.files[i].set('html', files.substr(i, 1));

        }
    },

    resizeDOM:function () {
        this.parent();
        this.internal.timestampLastResize = this.getTimeStamp();
        this.resizeBoard();
    },

    autoResizeBoard:function () {
        this.resizeBoard();
    },
    lastBoardSize:{ x:0, y:0 },

    resizeBoard:function () {

        var size = this.getNewSizeOfBoardContainer();
        if (size.x < 50 || (size.x == this.lastBoardSize.x && size.y == this.lastBoardSize.y)) {
            return;
        }

        this.lastBoardSize = size;

        var boardSize = Math.min(size.x - this.getLabelWidth() - ludo.dom.getBW(this.els.board),
            size.y - this.getLabelHeight() - ludo.dom.getBH(this.els.board));


        boardSize = Math.max(this.internal.squareSizes[0] * 8, Math.floor(boardSize / 8) * 8);

        if (isNaN(boardSize) || boardSize < 0) {
            return;
        }
        this.internal.squareSize = boardSize / 8;
        this.internal.pieceSize = this.getNewPieceSize();

        var boardContainerHeight = (boardSize + this.getLabelHeight() + ludo.dom.getMBPH(this.els.board));

        var marginTop;
        if (this.vAlign === 'center') {
            marginTop = Math.floor((this.getHeightOfContainer() - boardContainerHeight) / 2);
            marginTop = Math.max(0, marginTop);
        } else {
            marginTop = 0;
        }

        this.els.boardContainer.setStyles({
            width:(boardSize + this.getLabelWidth() + ludo.dom.getMBPW(this.els.board)) + 'px',
            height:boardContainerHeight + 'px',
            top:marginTop
        });

        this.els.board.setStyles({
            width:boardSize,
            height:boardSize
        });
        this.resizeLabels();

        this.resizePieces();
    },

    resizeLabels:function () {
        if (!this.hasLabels()) {
            return;
        }
		var spacing = ludo.dom.getMBPH(this.els.ranks[0]);
        var spacingFiles = ludo.dom.getMBPW(this.els.files[0]);
        var sizeRanks = this.internal.squareSize - spacing;
        var sizeFiles = this.internal.squareSize - spacingFiles;
        if (isNaN(sizeRanks)) {
            return;
        }
        for (var i = 0; i < 8; i++) {
            this.els.ranks[i].setStyle('height', sizeRanks + 'px');
            this.els.ranks[i].setStyle('line-height', sizeRanks + 'px');
            this.els.files[i].setStyle('width', sizeFiles + 'px');
        }
    },

    resizeSquares:function () {
        for (var i = 0; i < 64; i++) {
            this.els.squares[i].setStyles({
                width:'12.5%',
                height:'12.5%'
            });
        }
    },

    getNewPieceSize:function () {
        return this.internal.squareSize - this.internal.squareSize % 15;
    },

    getNewSizeOfBoardContainer:function () {
        var b = this.els.boardContainer;
        var c = this.getBody();
        var e = this.getEl();


        var bSW = ludo.dom.getPW(b) + ludo.dom.getBW(b);
        var cSW = ludo.dom.getMBPW(c);
        var eSW = ludo.dom.getMBPW(e);

        var bSH = ludo.dom.getMBPH(b);
        var cSH = ludo.dom.getMBPH(c);
        var eSH = ludo.dom.getMBPH(e);

        var size = e.getSize();
        size = {
            x:size.x - (bSW + cSW + eSW),
            y:size.y - (bSH + cSH + eSH)
        };

        return size;
    },

    flip:function () {
        this.flipped = !this.flipped;
        this.updateLabels();
        this.flipSquares();
        this.fireEvent('flip', this);

    },
    isFlipped:function () {
        return this.flipped;
    },

    labelHeight:undefined,
    getLabelHeight:function () {
        if (!this.labels) {
            return 0;
        }
        if (this.labelHeight === undefined) {
            this.labelHeight = this.els.labels.files.getSize().y
        }
        return this.labelHeight;
    },

    labelWidth:undefined,
    getLabelWidth:function () {
        if (!this.labels) {
            return 0;
        }
        if (this.labelWidth === undefined) {
            this.labelWidth = this.els.labels.ranks.getSize().x;
        }
        return this.labelWidth;
    },

    getBoard:function () {
        return this.els.pieceContainer;
    },

    getPieceSize:function () {
        return this.internal.pieceSize;
    },

    getSquareSize:function () {
        return this.internal.squareSize;
    },

    getTimeStamp:function () {
        return new Date().getTime();
    },

    getHeightOfContainer:function () {
        var el = this.getBody();
        if (el.style.height) {
            return parseInt(el.style.height.replace('px', ''));
        }
        return el.getSize().y - ludo.dom.getBH(el) - ludo.dom.getPH(el);
    },

    getSquareByCoordinates:function (x, y) {
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
    }
});