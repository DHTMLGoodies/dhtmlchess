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

    __construct:function(config){
        this.parent(config);

    },



    modelEventFired:function(event, model){
        this.parent(event, model);

        if (event === 'endOfGame' || event === 'endOfBranch' ) {
            if(this.dialog.puzzleComplete){
                this.dialog.puzzleComplete.show.delay(300, this.dialog.puzzleComplete);
            }else if(this.gameEndHandler){
                this.gameEndHandler.apply(this, [this]);
            }
        }
    }

});