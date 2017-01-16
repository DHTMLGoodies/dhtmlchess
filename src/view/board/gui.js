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
    labelPos:'outside', // outside or inside - inside = in the corner of the left and bottom squares.
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

    __construct:function (config) {

        this.parent(config);
        this.setConfigParams(config, ['labels','boardCls','boardCss','boardLayout','lowerCaseLabels','chessSet','vAlign','labelPos']);
    },

    ludoDOM:function () {
        this.parent();

        this.els.labels = {};

        this.getBody().css({
            'padding':0,
            'margin':0,
            'border':0
        });


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
            this.els.boardContainer.addClass('ludo-chess-board-container-' + this.boardLayout);
        }
    },
    ludoEvents:function () {
        this.parent();
        $(document.documentElement).on('keypress', this.receiveKeyboardInput.bind(this));
    },

    receiveKeyboardInput:function (e) {
        if (e.control && e.key === 'f') {
            this.flip();
        }
    },

    __rendered:function () {
        this.parent();
        this.resizeSquares();
        this.resizeBoard.delay(50, this);
        this.updateLabels();
    },

    hasLabelsOutside:function(){
        return this.labels && this.labelPos == 'outside';
    },
    hasLabelsInside:function(){
        return this.labels && this.labelPos == 'inside';
    },
    hasLabels:function () {
        return this.labels;
    },

    createBoardContainer:function () {
        var el = this.els.boardContainer = $('<div>');
        el.addClass('ludo-chess-board-container');
        if (this.boardCss) {
            el.css(this.boardCss);
        }
        if (this.boardCls) {
            el.addClass(this.boardCls);
        }
        this.getBody().append(el);
    },

    createContainerForBoardAndFileLabels:function () {
        var el = this.els.boardContainerInner = $('<div>');
        el.css('float', 'left');
        this.els.boardContainer.append(el);
    },

    createBoard:function () {
        this.els.board = $('<div class="ludo-chess-board"></div>');
        this.els.board.css({
            position:'relative',
            width:this.internal.squareSize * 8,
            height:this.internal.squareSize * 8
        });
        this.els.boardContainerInner.append(this.els.board);
    },

    createSquares:function () {
        var files = 'abcdefgh';
        this.els.squares = [];

        for (var i = 0; i < 64; i++) {
            var square = files.substr((i % 8), 1) + Math.ceil(8 - (i / 8));
            var el = this.els.squares[i] = $('<div class="ludo-chess-square" style="position:relative"></div>');
            this.els.board.append(el);
            var backgroundPos = Math.round(Math.random() * 150);
            el.css('backgroundPosition',  backgroundPos + 'px ' + backgroundPos + 'px');
        }
        this.updateSquares();
    },

    getSquares:function(){
      return this.els.squares;
    },

    createPieceContainer:function () {
        this.els.pieceContainer = $('<div>');
        this.els.pieceContainer.css({
            position:'absolute',
            left:0,
            top:0,
            width:'100%',
            height:'100%'
        });
        this.els.board.append(this.els.pieceContainer);
    },

    updateSquares:function () {
        var types = ['white', 'black'];
        var index = 0;
        for (var i = 0; i < 64; i++) {
            index++;
            if (i % 8 == 0) {
                index++;
            }
            this.els.squares[i].css('float', 'left');
            this.els.squares[i].addClass('ludo-chess-square-' + types[index % 2]);
        }
    },

    flipSquares:function () {
        var squares = [];
        for (var i = this.els.squares.length - 1; i >= 0; i--) {
            this.els.board.append(this.els.squares[i]);
            squares.push(this.els.squares[i]);
        }
        this.els.squares = squares;
    },

    addLabelsForFiles:function () {
        var el = this.els.labels.files = $('<div class="ludo-chess-board-label-files-container"></div>');
        el.css({
            position:this.labelPos == 'outside' ? 'relative' : 'absolute','z-index' : 100
        });
        if(this.labelPos == 'inside'){
            el.css('bottom', 0);
            el.addClass('chess-board-label-inside');
        }
        this.els.files = [];
        for (var i = 0; i < 8; i++) {
            var file = this.els.files[i] = $('<div class="ludo-chess-board-label-file"></div>');
            file.addClass('chess-file-label-' + (i % 2 == 0 ? 'odd' : 'even'));
            file.css({
                'width':this.internal.squareSize + 'px',
                'float':'left',
                'overflow':'hidden'
            });
            el.append(file);
        }


        var parent = this.labelPos == 'outside' ? this.els.boardContainer : this.els.board;

        parent.append(el);
    },

    addLabelsForRanks:function () {
        var el = this.els.labels.ranks = $('<div class="ludo-chess-board-label-ranks-container"></div>');
        if(this.labelPos == 'inside'){
            el.addClass('chess-board-label-inside');
        }
        el.css({
            position:this.labelPos == 'outside' ? 'relative' : 'absolute',
            'float':'left',
            left:'0px', top:'0px',
            height:'100%','z-index' : 100
        });

        this.els.ranks = [];
        for (var i = 0; i < 8; i++) {
            var rank = this.els.ranks[i] = $('<div class="ludo-chess-board-label-rank"></div>');
            rank.addClass('chess-rank-label-' + (i % 2 == 0 ? 'odd' : 'even'));
            rank.css({
                'height':this.internal.squareSize + 'px',
                'overflow':'hidden'
            });
            if(this.labelPos == 'outside'){
                rank.css('line-height', this.internal.squareSize);
            }

            el.append(rank);
        }


        var parent = this.labelPos == 'outside' ? this.els.boardContainer : this.els.board;

        parent.append(el);
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
            this.els.ranks[i].html( '<span>' + ranks.substr(i, 1) + '</span>');
            this.els.files[i].html( '<span>' + files.substr(i, 1) + '</span>');

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

        var wOffset = this.els.board.outerWidth(true) - this.els.board.width();
        var hOffset = this.els.board.outerHeight(true) - this.els.board.height();
        var boardSize = Math.min(
            size.x - this.getLabelWidth() - wOffset,
            size.y - this.getLabelHeight() - hOffset);

        boardSize = Math.max(this.internal.squareSizes[0] * 8, Math.floor(boardSize / 8) * 8);



        if (isNaN(boardSize) || boardSize < 0) {
            return;
        }
        this.internal.squareSize = boardSize / 8;
        this.internal.pieceSize = this.getNewPieceSize();

        var boardContainerHeight = (boardSize + this.getLabelHeight() + ludo.dom.getMBPH(this.els.board));

        this.els.boardContainer.css({
            width:(boardSize + this.getLabelWidth() + ludo.dom.getMBPW(this.els.board)) + 'px',
            height:boardContainerHeight + 'px'
        });


        var marginTop;
        if (this.vAlign === 'center') {
            marginTop = Math.floor(this.getBody().height - this.els.boardContainer.outerHeight(true) / 2);
            marginTop = Math.max(0, marginTop);
        } else {
            marginTop = 0;
        }

        this.els.boardContainer.css('margin-top', marginTop);



        this.els.board.css({
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
            this.els.ranks[i].css('height', sizeRanks + 'px');
            if(this.labelPos == 'outside')this.els.ranks[i].css('line-height', sizeRanks + 'px');
            this.els.files[i].css('width', sizeFiles + 'px');
        }
    },

    resizeSquares:function () {
        for (var i = 0; i < 64; i++) {
            this.els.squares[i].css({
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
        var widthOffset = ludo.dom.getBW(b) + ludo.dom.getPW(b);
        var heightOffset = ludo.dom.getPH(b) + ludo.dom.getPH(b);
        var size = { x: c.width(), y: c.height() };
        size = {
            x:size.x - widthOffset,
            y:size.y - heightOffset
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
        if (!this.labels ||this.labelPos == 'inside') {
            return 0;
        }
        if (this.labelHeight === undefined) {
            this.labelHeight = this.els.labels.files.outerHeight(true);
        }
        return this.labelHeight;
    },

    labelWidth:undefined,
    getLabelWidth:function () {
        if (!this.labels ||this.labelPos == 'inside') {
            return 0;
        }
        if (this.labelWidth === undefined) {
            this.labelWidth = this.els.labels.ranks.outerWidth(true);
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
        return this.getBody().height();

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