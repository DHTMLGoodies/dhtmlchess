chess.controller.TacticControllerGui = new Class({
    Extends: chess.controller.TacticController,

    getDialogPuzzleComplete:function () {
        return new ludo.dialog.Alert({
            autoDispose:false,
            height:150,
            width:250,
            hidden:true,
            title:chess.getPhrase('tacticPuzzleSolvedTitle'),
            html:chess.getPhrase('tacticPuzzleSolvedMessage'),
            listeners:{
                'ok':function () {
                    this.loadRandomGame();
                }.bind(this)
            }
        });
    },

    modelEventFired:function(event, model){
        this.parent(event, model);

        if (event === 'endOfGame' || event === 'endOfBranch') {
            this.dialog.puzzleComplete.show.delay(300, this.dialog.puzzleComplete);
        }
    }

});