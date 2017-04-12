chess.view.highlight.SquareTacticHint = new Class({

    delay : 1,
    squarePool:undefined,
    board:undefined,

	initialize:function (config) {
        console.log(config);
        if(config.delay !== undefined)this.delay = config.delay;
        this.board = config.parentComponent;
        this.board.on('showHint', this.showHint.bind(this));
    },

    showHint:function(move){

        var p = this.pool();
        p.hideAll();
        p.show(move.from);

        p.hide.delay(this.delay* 1000, p, move.from);

        //this.highlightSquare(move.from);
        //this.clear.delay(this.delay * 1000, this);
    },

    pool:function(){
        if(this.squarePool == undefined){
            this.squarePool = new chess.view.highlight.SquarePool({
                board:this.board
            });
        }
        return this.squarePool;
    }
});