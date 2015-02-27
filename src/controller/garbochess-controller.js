chess.controller.GarboChessController = new Class({
    Extends:chess.controller.Controller,
    disabledEvents:{
        overwriteOrVariation:1
    },
    dialog : {

    },

    engine:undefined,

    analyzing:false,

    pathToGarboChess: undefined,

    backgroundEngineValid:true,

    allMoves:[],

    chessModel : undefined,

    ludoConfig:function(config){
        this.parent(config);
        this.pathToGarboChess = config.garboChess;
    },

    modelEventFired:function (event, model) {
        this.chessModel = model;
        if (event === 'newMove' || event == 'newGame') {
            var result = model.getResult();
            var colorToMove = model.getColorToMove();
            if (colorToMove === 'white') {
                this.views.board.enableDragAndDrop(model);
            }else{
                if(this.initializeBackgroundEngine()){

                    var lastMove = model.getLastMoveInGame();
                    var from = this.getXY(lastMove.from);
                    var to = this.getXY(lastMove.to);

                    var moves = GenerateValidMoves();

                    var move = null;
                    for (var i = 0; i < moves.length; i++) {
                        if ((moves[i] & 0xFF) == MakeSquare(from.y, from.x) &&
                            ((moves[i] >> 8) & 0xFF) == MakeSquare(to.y, to.x)) {
                            move = moves[i];
                        }
                    }

                    if(move != null) {
                        this.engine.postMessage(FormatMove(move));

                        MakeMove(move);

                        this.searchAndRedraw.delay(20, this);
                    }

                }
            }
        }

        if(event == 'newGame'){
            this.ensureAnalysisStopped();

            ResetGame();

            if (this.initializeBackgroundEngine()) {
                this.engine.postMessage("go");

            }
        }

    },

    files:['a','b','c','d','e','f','g','h'],

    getXY:function(square){
        var move = square
        move = move.replace(/[^a-z0-9]/g,'');
        var file = this.files.indexOf(move.substr(move.length - 2, 1));
        var rank = move.substr(move.length - 1, 1) - 1;
        return {
            x : file,
            y : 7 - rank
        }
    },

    shouldAutoPlayNextMove : function(colorToMove){
        return colorToMove == 'black'
    },

    ensureAnalysisStopped: function(){
        if (this.analyzing && this.engine != undefined) {
            this.engine.terminate();
            this.engine = undefined;
        }
    },

    initializeBackgroundEngine:function(){

        if (!this.backgroundEngineValid) {
            return false;
        }

        if (this.engine == null) {

            this.backgroundEngineValid = true;
            try {
                var that = this;
                this.engine = new Worker('../garbochess/js/garbochess.js');
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
                    alert("Error from background worker:" + e.message);
                };
                this.engine.postMessage("position " + this.getFen());
            } catch (error) {
                this.backgroundEngineValid = false;
                console.log(error);
            }
        }

        return this.backgroundEngineValid;
    },

    getFen:function(){
        return this.model ? this.model.getFen() : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    },

    updatePVDisplay:function(move){
        console.log(move);
    },

    playMove:function(move, pv){

        var fromX = this.files[(move & 0xF) - 4];
        var fromY = 8 - (((move >> 4) & 0xF) - 2);
        var toX = this.files[((move >> 8) & 0xF) - 4];
        var toY = 8 - (((move >> 12) & 0xF) - 2);

        this.currentModel.appendMove({
            from : fromX + fromY, to: toX + toY
        });

        MakeMove(move);

        this.updatePVDisplay(move);

        this.updateFromMove(move);
    },

    updateFromMove:function(move){
        console.log("Update: " + move);
    },

    finishMove:function(bestmove, value, timeTaken, ply){

        console.log("Received move " + bestMove);
        if(bestMove != null){
            console.log("Play move " + bestmove);
            this.playMove(move, BuildPVMessage(bestMove, value, timeTaken, ply));
        }
    },

    searchAndRedraw:function(){
        if(this.analyzing){
            this.ensureAnalysisStopped();
            this.initializeBackgroundEngine();

            this.engine.postMessage("position " + this.model.getFen());
            this.engine.postMessage("analyze");
            return;
        }

        if(this.initializeBackgroundEngine()){
            this.engine.postMessage("search " + 40);
        }else{
           Search(this.finishMove, 99, null);
        }
    }


});