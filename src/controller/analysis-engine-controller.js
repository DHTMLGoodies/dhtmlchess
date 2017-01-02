chess.controller.AnalysisEngineController = new Class({
    Extends: chess.controller.AnalysisController,
    disabledEvents: {
        overwriteOrVariation: 1
    },
    dialog: {},

    engine: undefined,

    analyzing: true,

    backgroundEngineValid: true,

    allMoves: [],

    chessModel: undefined,

    thinkingTime: 40,

    garboChess:'../garbochess-engine/garbochess.js',

    fen:undefined,

    stopped:true,

    __construct: function (config) {
        if(config.garboChess != undefined)this.garboChess = config.garboChess;
        this.setConfigParams(config, ['stopped']);
        this.garboChess = config.garboChess;
        if (config.thinkingTime != undefined) {
            this.thinkingTime = config.thinkingTime;
        }

        this.parent(config);
    },

    modelEventFired: function (event, model, param) {
        this.chessModel = model;

        if (event === 'setPosition' || event === 'nextmove' || event == 'newMove') {
            // this.views.board.enableDragAndDrop(model);
        }

        if (event === 'fen') {

            this.fen = param;


            if (model.getResult() != 0) {
                this.fireEvent("gameover", model.getResult());
                return;
            }


            if(!this.stopped)this.updateEngine();
        }


        if (event == 'newGame') {
            this.ensureAnalysisStopped();

            ResetGame();

            if (this.initializeBackgroundEngine()) {
                this.engine.postMessage("go");

            }
        }
    },

    updateEngine:function(){
        if (this.initializeBackgroundEngine()) {


            this.engine.postMessage("position " + this.getFen());

            this.searchAndRedraw.delay(20, this);

        }
    },

    stopEngine:function(){
        this.stopped = true;
        this.ensureAnalysisStopped();
    },

    startEngine:function(){
        this.stopped = false;
        this.updateEngine();


    },

    files: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],

    getXY: function (square) {
        var move = square
        move = move.replace(/[^a-z0-9]/g, '');
        var file = this.files.indexOf(move.substr(move.length - 2, 1));
        var rank = move.substr(move.length - 1, 1) - 1;
        return {
            x: file,
            y: 7 - rank
        }
    },

    shouldAutoPlayNextMove: function (colorToMove) {
        return colorToMove == 'black'
    },

    ensureAnalysisStopped: function () {
        if (this.analyzing && this.engine != undefined) {
            this.engine.terminate();
            this.engine = undefined;
        }
    },

    initializeBackgroundEngine: function () {

        if (!this.backgroundEngineValid) {
            return false;
        }

        if (this.engine == null) {

            this.backgroundEngineValid = true;
            try {
                var that = this;
                this.engine = new Worker(this.garboChess);
                this.engine.onmessage = function (e) {
                    if (e.data.match("^pv") == "pv") {
                        that.updatePVDisplay(e.data.substr(3, e.data.length - 3));
                    } else if (e.data.match("^message") == "message") {
                        that.ensureAnalysisStopped();
                        that.updatePVDisplay(e.data.substr(8, e.data.length - 8));
                    } else {
                        that.playMove(GetMoveFromString(e.data), null);
                    }
                };
                this.engine.error = function (e) {
                    console.log("Error from background worker:" + e.message);
                };

                this.engine.postMessage("position " + this.getFen());
            } catch (error) {
                this.backgroundEngineValid = false;
                console.log(error);
            }
        }

        return this.backgroundEngineValid;
    },

    getFen: function () {

        return this.fen ? this.fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    },

    color:function(){
        return this.models[0].getColorToMove();  
    },
    updatePVDisplay: function (move) {

        this.fireEvent("engineupdate", [move, this.color()] );
    },

    playMove: function (move, pv) {

        var fromX = this.files[(move & 0xF) - 4];
        var fromY = 8 - (((move >> 4) & 0xF) - 2);
        var toX = this.files[((move >> 8) & 0xF) - 4];
        var toY = 8 - (((move >> 12) & 0xF) - 2);

        this.currentModel.appendMove({
            from: fromX + fromY, to: toX + toY
        });

        MakeMove(move);

        this.updateFromMove(move);
    },

    updateFromMove: function (move) {

    },

    finishMove: function (bestmove, value, timeTaken, ply) {
        if (bestMove != null) {
            this.playMove(move, BuildPVMessage(bestMove, value, timeTaken, ply));
        }
    },

    searchAndRedraw: function () {
        if (this.analyzing) {
            this.ensureAnalysisStopped();
            this.initializeBackgroundEngine();

            this.engine.postMessage("position " + this.getFen());
            this.engine.postMessage("analyze");
            return;
        }

        if (this.initializeBackgroundEngine()) {
            this.engine.postMessage("search " + this.thinkingTime);
        } else {
            Search(this.finishMove, 99, null);
        }
    },

    newGame: function () {
        this.currentModel.newGame();
    },

    setThinkingTime:function(thinkingTime){
        this.thinkingTime = thinkingTime;
    }
});