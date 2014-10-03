/**
 * Javascript Class for Chess Board and Pieces on the board
 * JSON config type: chess.view.board.Board
 * @submodule Board
 * @namespace chess.view.board
 * @class Board
 * @extends chess.view.board.GUI
 *
 */
chess.view.board.Board = new Class({
    Extends:chess.view.board.GUI,
    type:'chess.view.board.Board',
    pieces:[],
    pieceMap:{},
    fen:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    /**
     * Duration of piece animations in seconds.
     * @config float animationDuration
     * @default 0.35
     */
    animationDuration:.35,
    /**
     * Layout of pieces, examples: "alphapale", "alpha", "merida", "kingdom"
     * @config string pieceLayout
     * @default alphapale
     */
    pieceLayout:'alphapale',
    /**
     * Layout of board. The name correspondes to the suffix of the CSS class
     * ludo-chess-board-container-wood. (In this example wood). If you want to create your own
     * board layout. You can specify a custom value for boardLayout, create your own graphic and
     * implement your own CSS rules. Take a look at css/board/board.css for more info
     * @config string boardLayout
     * @default wood
     */
    boardLayout:'wood',
    positionParser:undefined,
    currentValidMoves:undefined,
    ddEnabled:false,
    addOns:[],

    currentAnimation:{
        index:0,
        moves:[],
        duration:.5,
        isBusy:false
    },
    ludoConfig:function (config) {
        this.parent(config);
        this.pieces = [];
        this.setConfigParams(config, ['pieceLayout','animationDuration','addOns']);

        if(this.addOns && Browser.ie && Browser.version < 9){
            for(var i=0;i<this.addOns.length;i++){
                if(this.addOns[i].type === 'chess.view.highlight.Arrow'){
                    this.addOns[i].type = 'chess.view.highlight.Square';
                }
            }
        }
        this.positionParser = new chess.parser.FenParser0x88();
    },

    getTimeForAnimation:function () {
        return this.animationDuration;
    },

    ludoRendered:function () {
        this.createPieces();
        this.showFen(this.fen);
        this.parent();
    },

    createPieces:function () {
        var flipped = this.isFlipped();

        for (var i = 0; i < 32; i++) {
            var config = {
                square:0,
                color:'white',
                pieceType:'pawn',
                pieceLayout:this.pieceLayout,
                squareSize:30,
                flipped:flipped,
                aniDuration:this.animationDuration,
                board:this
            };
            var piece = new chess.view.board.Piece(config);
            piece.addEvent('animationComplete', this.pieceMoveFinished.bind(this));
            piece.addEvent('move', this.makeMove.bind(this));
            piece.addEvent('initdrag', this.startPieceDrag.bind(this));
            this.pieces.push(piece);
            this.getBoard().adopt(piece.getEl());
        }
        this.resizePieces();
        this.addPieceDragEvents();
    },

    addPieceDragEvents:function(){
        // var on = this.getEventEl().addEvent;
        this.getEventEl().addEvent(ludo.util.getDragMoveEvent(), this.dragPiece.bind(this));
        this.getEventEl().addEvent(ludo.util.getDragEndEvent(), this.stopDragPiece.bind(this));
    },

    draggedPiece : undefined,
    startPieceDrag:function(piece){
        this.draggedPiece = piece;
    },

    dragPiece:function(e){
        if(this.draggedPiece){
            this.draggedPiece.dragPiece(e);
        }
    },

    stopDragPiece:function(e){
        if(this.draggedPiece){
            this.draggedPiece.stopDragPiece(e);
            this.draggedPiece = undefined;
        }
    },

    /**
     * All DHTML Chess 3 views are using the setController method. It is used to
     * control behaviour of the view. So if you want to create your own Chess View component, you
     * should take a look at setController. Example method:<br><br>
     *     setController : function(controller){<br>
     *         this.parent(controller); // always call supperclass
     *         controller.addEvent('newGame', this.doSomethingOnNewGame.bind(this));
     *     }
     * Here, the method doSomethingOnNewGame will be executed every time the controller loads a new game
	 * @method setController
     * @param {Object} controller
     */
    setController:function (controller) {
        this.parent(controller);
        controller.addEvent('newGame', this.showStartBoard.bind(this));
        controller.addEvent('newMove', this.clearHighlightedSquares.bind(this));
        controller.addEvent('newMove', this.playChainOfMoves.bind(this));
        controller.addEvent('setPosition', this.showMove.bind(this));
        controller.addEvent('nextmove', this.playChainOfMoves.bind(this));
        controller.addEvent('startOfGame', this.clearHighlightedSquares.bind(this));
        controller.addEvent('newGame', this.clearHighlightedSquares.bind(this));
        controller.addEvent('flip', this.flip.bind(this));
		this.controller.addEvent('beforeLoad', this.beforeLoad.bind(this));
		this.controller.addEvent('afterLoad', this.afterLoad.bind(this));
    },


	beforeLoad:function(){
		this.shim().show(chess.getPhrase('Loading game'));
	},

	afterLoad:function(){
		this.shim().hide();
	},

    clearHighlightedSquares:function(){
        this.fireEvent('clearHighlight', this);
    },
    /**
     * Enable drag and drop feature of the board. It expects a game model as first argument.
     * When connected to a controller event, the controller always sends current game model as
     * first argument when it fire events.
     * @method enableDragAndDrop
     * @param model
     * @return void
     */
    enableDragAndDrop:function (model) {
        if (this.currentAnimation.isBusy) {
            this.enableDragAndDrop.delay(200, this, model);
            return;
        }
        this.ddEnabled = true;
        var pos = model.getCurrentPosition();

        this.positionParser.setFen(pos);
        // 6k1/5ppp/8/8/8/8/5PPP/3R2K1 w KQkq - 0 0
        this.currentValidMoves = this.positionParser.getValidMovesAndResult().moves;
        this.resetPieceDragAndDrop();
        for (var square in this.currentValidMoves) {
            if(this.currentValidMoves.hasOwnProperty(square)){
                this.pieceMap[square].enableDragAndDrop();
            }
        }
    },
    /**
     * Disable drag and drop feature of the board
     * @method disableDragAndDrop
     * @return void
     */
    disableDragAndDrop:function () {
        this.ddEnabled = false;
        this.resetPieceDragAndDrop();
    },
    resetPieceDragAndDrop:function () {
        for (var i = 0; i < this.pieces.length; i++) {
            this.pieces[i].disableDragAndDrop();
        }
    },
    /**
     Animate/Play the "movements" involved in a move, example: O-O involves two moves,
     moving the king and moving the rook. By default, this method will be executed when the
     controller fires newMove or nextmove event.
     @method playChainOfMoves
     @param {game.model.Game} model
     @param {Object} move
     @example
        { m: 'O-O', moves : [{ from: 'e1', to: 'g1' },{ from:'h1', to: 'f1'}] }
     */
    playChainOfMoves:function (model, move) {
        if (this.currentAnimation.isBusy) {
            this.playChainOfMoves.delay(200, this, [model, move]);
            return;
        }
        var moves = move.moves;

        this.currentAnimation.duration = this.getDurationPerMovedPiece(move);
        this.currentAnimation.index = 0;
        this.currentAnimation.moves = moves;
        this.currentAnimation.isBusy = true;
        this.animateAMove();
    },

    animateAMove:function () {
        var move = this.currentAnimation.moves[this.currentAnimation.index];

        if (move.capture) {
            var sq = Board0x88Config.mapping[move.capture];
            if (sq != move.to) {
                this.pieceMap[sq].hide();
                this.pieceMap[sq] = null;
            }
            this.pieceMoveFinished(move);
        }
        else if (move.promoteTo) {
            this.getPieceOnSquare(move.square).promote(move.promoteTo);
            this.currentAnimation.isBusy = false;
        } else if (move.from) {
            var piece = this.getPieceOnSquare(move.from);
            piece.playMove(move.to, this.currentAnimation.duration);
        }
    },

    pieceMoveFinished:function (move) {
        this.currentAnimation.index++;
        if (this.pieceMap[move.to]) {
            this.pieceMap[move.to].hide();
        }
        this.pieceMap[move.to] = this.pieceMap[move.from];
        this.pieceMap[move.from] = null;

        if (this.currentAnimation.index < this.currentAnimation.moves.length) {
            this.animateAMove();
        } else {
            this.fireEvent('highlight', this.currentAnimation.moves[0]);
            this.fireEvent('animationComplete');
            this.currentAnimation.isBusy = false;
        }
    },

    getDurationPerMovedPiece:function (move) {
        var count = 0;
        for (var i = 0; i < move.moves.length; i++) {
            if (move.moves[i].from) {
                count++;
            }
        }
        return (this.animationDuration / count) * 1000;
    },

    showMove:function (model, move, pos) {
        if (this.currentAnimation.isBusy) {
            pos = model.getCurrentPosition();
            this.showMove.delay(200, this, [model, move, pos]);
            return;
        }
        pos = pos || model.getCurrentPosition();
        this.showFen(pos);

        if (move = model.getCurrentMove()) {
            this.highlightMove(move);
        }
    },
    highlightMove:function (move) {
        if (!move) {
            return;
        }
        if (move.from && move.to) {
            this.fireEvent('highlight', move);
        }
    },
    /**
     * Show start position of game
     * @method showStartBoard
     * @param {game.model.Game} model
     * @return void
     */
    showStartBoard:function (model) {
        this.showFen(model.getCurrentPosition());
    },
    /**
     * Show a specific FEN position on the board
     * @method showFen
     * @param {String} fen
     * @return undefined
     */
    showFen:function (fen) {
        this.positionParser.setFen(fen);
        var pieces = this.positionParser.getPieces();
        this.pieceMap = {};
        for (var i = 0, count = pieces.length; i < count; i++) {
            var color = (pieces[i].t & 0x8) ? 'black' : 'white';
            var type = Board0x88Config.typeMapping[pieces[i].t];

            var p = this.pieces[i];
            p.square = pieces[i].s;
            p.color = color;
            p.pieceType = type;
            p.position();
            p.updateBackgroundImage();
            p.show();

            this.pieceMap[ pieces[i].s] = p;
        }

        for (var j = i; j < this.pieces.length; j++) {
            this.pieces[j].hide();
        }
    },
    /**
     * Return number of visible pieces on the board
     * @method getCountPiecesOnBoard
     * @return int
     */
    getCountPiecesOnBoard:function () {
        var ret = 32;
        for (var i = this.pieces.length - 1; i >= 0; i--) {
            if (!this.pieces[i].isVisible()) {
                ret--;
            }
        }
        return ret;
    },

    hidePiece:function (piece) {
        if (piece) {
            delete this.pieceMap[piece.square];
            piece.hide();
        }
    },

    /**
     * This method resets the board to the standard position at start of games
     * @method resetBoard
     * @return void
     */
    resetBoard:function () {
        this.showFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        /**
         * Event fired when board is reset to standard start position,
         * i.e. fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
         * @event resetboard
         * @param Component this
         */
        this.fireEvent('resetboard', this);
    },
    /**
     * Remove all pieces from the board
     * @method clearBoard
     * @return void
     */
    clearBoard:function () {
        for (var i = 0; i < this.pieces.length; i++) {
            this.pieces[i].hide();
            this.pieceMap = {};
        }
        /**
         * Event fired when all pieces are being removed from the board via the clearBoard() method
         * @event clearboard
         * @param Component this
         */
        this.fireEvent('clearboard', this);
    },

    makeMove:function (move) {
        /**
         * Event fired when a piece is moved from one square to another
         * @event move
         * @param Object move, example: { from: "e2", to: "e4" }
         */
        this.fireEvent('move', move);
    },
    getValidMovesForPiece:function (piece) {
        return this.currentValidMoves[piece.square] || [];
    },

    /**
     Returns JSON object for a piece on a specific square or null if no piece is on the square
     @method getPieceOnSquare
     @param {String} square
     @example
        alert(board.getPieceOnSquare('e4');
     */
    getPieceOnSquare:function (square) {
        return this.pieceMap[Board0x88Config.mapping[square]];
    },

    currentPieceSize:undefined,

    resizePieces:function () {
        var squareSize = this.getSquareSize();
        for (var i = 0; i < this.pieces.length; i++) {
            this.pieces[i].resize(squareSize)
        }
    },
    /**
     * Flip board
     * @method flip
     * @return void
     */
    flip:function () {
        this.parent();
        for (var i = 0, count = this.pieces.length; i < count; i++) {
            this.pieces[i].flip();
        }
    },
    /**
     * Show whites pieces at the bottom. If white is allready on the bottom, this method will do nothing.
     * @method flipToWhite
     */
    flipToWhite:function () {
        if (this.flipped) {
            this.flip();
        }
    },
    /**
     * Show blacks pieces at the bottom. If black is allready on the bottom, this method will do nothing.
     * @method flipToBlack
     */
    flipToBlack:function () {
        if (!this.flipped) {
            this.flip();
        }
    },

    showSolution:function(move){
        this.fireEvent('showSolution', move);
    },

    showHint:function(move){
        this.fireEvent('showHint', move);
    }
});