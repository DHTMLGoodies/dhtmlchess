chess.wordpress.FenBoard = new Class({
    Extends: chess.view.position.Board,
    boardMode:'insertPiece',

    addBoardEvents:function(){

        this.els.board.on('click', this.onBoardClick.bind(this));
        this.addEvent('resetboard', this.sendFen.bind(this));
        this.addEvent('modifyboard', this.sendFen.bind(this));
        this.addEvent('clearboard', this.sendFen.bind(this));
        this.addEvent('render', this.sendFen.bind(this));
    },



    onBoardClick:function(e){
        var square = this.getSquareByEvent(e);
        if(square === undefined)return;

        if(this.boardMode === 'insertPiece'){
            this.insertPiece(e);
        }

    },

    setMode:function(mode){
        this.mode = mode;
    },

    clearMode:function(){
        this.mode = 'insertPiece';
    }
});