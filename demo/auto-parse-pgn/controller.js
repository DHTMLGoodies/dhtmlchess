chess.controller.ParseController = new Class({
    Extends: chess.controller.StockfishEngineController,

    searchAndRedraw:function(){
        this.uciCmd("ucinewgame");
    },
    
    analyze:function(fen){
        this.uciCmd("position fen " + this.getFen()+ "");
        this.uciCmd("go infinite");
    }
})