chess.controller.TacticControllerGui = new Class({
    Extends: chess.controller.TacticController,

    /**
     * Function for manual handling of how next game should be loaded.
     * @config gameEndHandler
     * @type {Function}
     * @example
     *      new chess.controller.TacticControllerGui({
     *      pgn:this.pgn,
     *      alwaysPlayStartingColor:true,
     *      autoMoveDelay:400,
     *      gameEndHandler:function(controller){
     *          controller.loadNextGameFromFile();
     *      }
     *  });
     */
    gameEndHandler:undefined,

    ludoConfig:function(config){
        this.parent(config);
        if(config.gameEndHandler != undefined)this.gameEndHandler = config.gameEndHandler;
    },

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
                    if(this.gameEndHandler != undefined){
                        this.gameEndHandler.apply(this, [this]);
                    }else{
                        this.loadRandomGame();
                    }
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