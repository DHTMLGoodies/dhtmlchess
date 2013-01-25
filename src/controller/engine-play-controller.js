chess.controller.EnginePlayController = new Class({
    Extends:chess.controller.Controller,
    disabledEvents:{
        overwriteOrVariation:1
    },
    dialog : {

    },
    modelEventFired:function (event, model) {
        if (event === 'newMove' || event == 'newGame') {
            var result = model.getResult();
            var colorToMove = model.getColorToMove();
            if(this.shouldAutoPlayNextMove(colorToMove, result)){
                model.getEngineMove();
            }
            if (colorToMove === 'white') {
                this.views.board.enableDragAndDrop(model);
            }
        }
    },

    shouldAutoPlayNextMove : function(colorToMove){
        return colorToMove == 'black'
    }
});