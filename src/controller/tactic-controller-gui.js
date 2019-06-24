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
    gameEndHandler: undefined,
    showDialog: undefined,
    gameEnded: false,

    __construct: function (config) {
        this.parent(config);
        this.showDialog = config.showDialog !== undefined ? config.showDialog : true;
    },

    modelEventFired: function (event, model) {
        this.parent(event, model);

        if (!this.gameEnded && (event === 'endOfGame' || event === 'endOfBranch')) {
            if (this.showDialog && this.dialog.puzzleComplete) {
                this.dialog.puzzleComplete.show.delay(300, this.dialog.puzzleComplete);
            } else if (this.gameEndHandler) {
                this.gameEnded = true;
                var fn = function () {
                    this.gameEnded = false;
                    this.gameEndHandler();
                };
                fn.delay(1000, this);
            }
        }
    }

});