chess.view.notation.TacticPanel = new Class({
    Extends: chess.view.notation.Panel,
    tactics : true,
    setController:function(controller){
        controller.addEvent('nextmove', this.showMoves.bind(this));
        controller.addEvent('newGame', this.clearCurrentMove.bind(this));
        this.parent(controller);
    },
    clearCurrentMove:function(){
        this.currentModelMoveId = undefined;
    },
    clickOnMove:function(e){

    }
});