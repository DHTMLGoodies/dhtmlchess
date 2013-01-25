/**
 * You will never have to use this class. Pieces are created dynamically by chess.board.Board
 * @module View
 * @submodule Board
 * @namespace chess.view.board
 * @class Piece
 * @extends Core
 */
ludo_CHESS_PIECE_GLOBAL_Z_INDEX = 200;
chess.view.board.Piece = new Class({
    Extends:ludo.Core,
    type:'chess.view.board.Piece',
    color:'white',
    pieceLayout:'alpha',
    size:null,
    squareSize:null,
    validSizes:[30, 45, 60, 75, 90, 105],
    square:undefined,
    el:null,
    flipped:false,
    toSquare:null,
    Fx:null,
    board:undefined,
    ddEnabled:false,
    aniDuration:250,
    pieceType:'pawn',
    dd:{
        active:false,
        el:{ x:0, y:0},
        mouse:{x:0, y:0 }
    },
    internal:{
        files:{
            a:0, b:1, c:2, d:3, e:4, f:5, g:6, h:7
        }
    },

    validTargetSquares:[],

	ludoConfig:function (config) {
		this.parent(config);
        this.square = config.square;
        this.squareSize = config.squareSize;
        this.pieceLayout = config.pieceLayout;
        this.numSquare = config.numSquare;
        this.flipped = config.flipped;
        this.pieceType = config.pieceType;
        this.color = config.color;
        this.board = config.board;
        this.aniDuration = config.aniDuration || this.aniDuration;
        this.createDOM();
        this.resize(this.squareSize);
        this.position();

    },

    getEventEl:function () {
        if (Browser.ie) {
            return $(document.documentElement);
        }
        return $(window);
    },

    createDOM:function () {
        this.el = new Element('div');
        this.el.setStyles({
            'position':'absolute',
            padding:0,
            margin:0,
            borders:0,
            width:'12.5%',
            height:'12.5%',
            'z-index':100,
            overflow:'hidden'
        });

        this.el.addEvent('mouseenter', this.mouseEnterPiece.bind(this));
        this.el.addEvent('mouseleave', this.mouseLeavePiece.bind(this));

        if (this.shouldUseTouchEvents()) {
            this.el.addEvent('touchstart', this.initDragPiece.bind(this));
            this.getEventEl().addEvent('touchmove', this.dragPiece.bind(this));
            this.getEventEl().addEvent('touchend', this.stopDragPiece.bind(this));
        } else {
            this.el.addEvent('mousedown', this.initDragPiece.bind(this));
            this.getEventEl().addEvent('mousemove', this.dragPiece.bind(this));
            this.getEventEl().addEvent('mouseup', this.stopDragPiece.bind(this));
        }


        this.el.addClass('ludo-chess-piece');
        this.position();

        this.Fx = new Fx.Morph(this.el, {
            duration:this.aniDuration * 1000,
            unit:'%'
        });
        this.Fx.addEvent('complete', this.animationComplete.bind(this));
    },

    mouseEnterPiece:function () {
        this.fireEvent('mouseenter', this)
    },

    mouseLeavePiece:function () {
        this.fireEvent('mouseleave', this)
    },

    disableDragAndDrop:function () {
        this.ddEnabled = false;
        this.el.style.cursor = 'default';
    },

    enableDragAndDrop:function () {
        this.ddEnabled = true;
        this.el.style.cursor = 'pointer';
    },

    isVisible:function () {
        return this.el.style.display != 'none';
    },

    hide:function () {
        this.el.style.display = 'none';
    },

    show:function () {
        this.el.style.display = '';
    },

    initDragPiece:function (e) {
        if (this.ddEnabled) {
            this.increaseZIndex();
            this.validTargetSquares = this.board.getValidMovesForPiece(this);
            this.fireEvent('initdrag', this);
            this.el.style.left = this.el.offsetLeft + 'px';
            this.el.style.top = this.el.offsetTop + 'px';
            this.dd = {
                active:true,
                mouse:{ x:e.page.x, y:e.page.y},
                el:{ x:this.el.offsetLeft, y:this.el.offsetTop }
            };
            return false;
        }
        return undefined;
    },

    dragPiece:function (e) {
        if (this.dd.active === true) {
            this.el.style.left = (e.page.x + this.dd.el.x - this.dd.mouse.x) + 'px';
            this.el.style.top = (e.page.y + this.dd.el.y - this.dd.mouse.y) + 'px';
            return false;
        }
        return undefined;
    },

    stopDragPiece:function (e) {
        if (this.dd.active) {
            var coords;
            if (this.shouldUseTouchEvents()) {
                coords = {
                    x:e.target.offsetLeft,
                    y:e.target.offsetTop
                }
            } else {
                coords = {
                    x:e.page.x + this.dd.el.x - this.dd.mouse.x,
                    y:e.page.y + this.dd.el.y - this.dd.mouse.y
                }
            }

            var square = this.getSquareFromCoordinates(
                coords.x,
                coords.y
            );

            if (this.validTargetSquares.indexOf(square) >= 0) {
                this.position(square);
                this.fireEvent('move', {
                    from:Board0x88Config.numberToSquareMapping[this.square],
                    to:Board0x88Config.numberToSquareMapping[square]
                });

            } else {
                this.position();
            }
            this.dd.active = false;
        }
    },

    getSquareFromCoordinates:function (x, y) {
        x += this.squareSize / 2;
        y += this.squareSize / 2;

        x = Math.max(0, x);
        y = Math.max(0, y);

        x = Math.min(this.squareSize * 8, x);
        y = Math.min(this.squareSize * 8, y);

        x = Math.floor(x / this.squareSize);
        y = Math.floor(8 - (y / this.squareSize));
        if (this.isFlipped()) {
            x = 7 - x;
            y = 7 - y;
        }
        return x + y * 16;
    },
    getSquare:function () {
        return this.square;
    },

    promote:function (toType) {
        this.pieceType = toType;
        this.updateBackgroundImage();
    },

    updateBackgroundImage:function () {
        this.el.setStyle('background-image', 'url(' + chess.IMAGE_FOLDER + this.pieceLayout + this.size + this.getColorCode() + this.getTypeCode() + '.png)');
    },

    resize:function (squareSize) {
        this.squareSize = squareSize;
        if (squareSize < this.validSizes[0]) {
            squareSize = this.validSizes[0];
        }
        if (squareSize > this.validSizes[this.validSizes.length - 1]) {
            squareSize = this.validSizes[this.validSizes.length - 1];
        }

        var tmpSquareSize = squareSize * 1.1;
        var pieceSize = tmpSquareSize - tmpSquareSize % 15;

        if (pieceSize != this.size) {
            this.size = pieceSize;
            this.updateBackgroundImage();
        }
    },

    position:function (square) {
        var pos = this.getPos(square);
        this.el.style.left = pos.x;
        this.el.style.top = pos.y;
    },

    playMove:function (toSquare) {

        toSquare = Board0x88Config.mapping[toSquare];

        if (this.isAlreadyOnSquare(toSquare)) {
            this.toSquare = toSquare;
            this.animationComplete();
        } else {
            var posTo = this.getPosOfSquare(toSquare);
            var posFrom = this.getPosOfSquare(this.square);

            this.increaseZIndex();

            this.Fx.start({
                'left':[posFrom.x, posTo.x],
                'top':[posFrom.y, posTo.y]
            });
            this.toSquare = toSquare;
        }

    },
    isAlreadyOnSquare:function (square) {
        var pos = this.getPos(square);
        return pos.x == this.el.style.left && pos.y === this.el.style.top;
    },
    increaseZIndex:function () {
        ludo_CHESS_PIECE_GLOBAL_Z_INDEX++;
        this.el.style.zIndex = ludo_CHESS_PIECE_GLOBAL_Z_INDEX;
    },

    animationComplete:function () {
        this.fireEvent('animationComplete', {
            from:this.square,
            to:this.toSquare
        });
        this.square = this.toSquare;
    },

    getPos:function (square) {
        var pos = this.getPosOfSquare(square !== undefined ? square : this.square);
        return {
            'x':pos.x + '%',
            'y':pos.y + '%'
        };
    },
    getPosOfSquare:function (square) {
        var file = (square & 15);
        var rank = 7 - ((square & 240) / 16);

        if (this.flipped) {
            file = 7 - file;
            rank = 7 - rank;
        }
        return {
            x:(file * 12.5),
            y:(rank * 12.5)
        }
    },

    getEl:function () {
        return this.el;
    },

    getColorCode:function () {
        return this.color == 'white' ? 'w' : 'b';
    },

    getTypeCode:function () {
        switch (this.pieceType) {
            case 'pawn':
            case 'rook':
            case 'bishop':
            case 'queen':
            case 'king':
                return this.pieceType.substr(0, 1).toLowerCase();
            case 'knight':
                return 'n';
            default:
                return undefined;
        }
    },

    flip:function () {
        this.flipped = !this.flipped;
        this.position();
    },

    isFlipped:function () {
        return this.flipped;
    }
});