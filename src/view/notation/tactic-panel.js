chess.view.notation.TacticPanel = new Class({
    Extends: chess.view.notation.Panel,
    tactics : true,
    setController:function(controller){
        controller.on('nextmove', this.showMoves.bind(this));
        controller.on('newGame', this.clearCurrentMove.bind(this));
        this.parent(controller);
    },
    clearCurrentMove:function(){
        this.currentModelMoveId = undefined;
    },
    clickOnMove:function(e){

    }
});