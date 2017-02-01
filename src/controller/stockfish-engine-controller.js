chess.controller.StockfishEngineController = new Class({
    Extends: chess.controller.AnalysisController,

    dialog: {},

    engine: undefined,

    analyzing: true,

    backgroundEngineValid: true,

    allMoves: [],

    chessModel: undefined,

    thinkingTime: 40,

    stockfish:'../stockfish-js/stockfish.js',

    fen:undefined,

    stopped:true,

    debug:false,

    startFen:undefined,

    examine:true,

    engineStatus:{},

    colorToMove:undefined,

    autoStopEngineOnNewGame:true,

    __construct: function (config) {
        if(config.stockfish != undefined)this.stockfish = config.stockfish;
        if(config.autoStopEngineOnNewGame != undefined)this.autoStopEngineOnNewGame = config.autoStopEngineOnNewGame;
        this.engineStatus = {};
        this.setConfigParams(config, ['stopped','examine']);
        if (config.thinkingTime != undefined) {
            this.thinkingTime = config.thinkingTime;
        }

        this.parent(config);
    },

    modelEventFired: function (event, model, param) {

        this.parent(event,model, param);

        this.chessModel = model;

        if (event == 'newGame' && this.autoStopEngineOnNewGame) {
            console.log('stopping because of event');
            this.stopEngine();
            this.startFen = this.currentModel.model.startFen;
        }

        if (event === 'setPosition' || event === 'nextmove' || event == 'newMove') {
            if(this.examine)this.views.board.enableDragAndDrop(model);
        }

        if (event === 'fen') {
            this.fen = param;

            if (model.getResult() != 0) {
                this.fireEvent("gameover", model.getResult());
                return;
            }

            if(!this.stopped)this.updateEngine();
        }



    },

    updateEngine:function(){
        this.searchAndRedraw();
    },

    stopEngine:function(){
        this.stopped = true;
        this.awaitingStop = true;

        this.uciCmd("stop");
        //console.log('stop engine');

    },

    startEngine:function(){

        this.stopped = false;

        if(!this.engine){
            this.initializeBackgroundEngine();
        }

        this.searchAndRedraw();
        // console.log('start engine');
    },

    searchAndRedraw: function () {
        if (this.analyzing) {
            this.colorToMove = this.getCurrentModel().getColorToMove();
            this.currentPly = this.getCurrentModel().getCurrentPly();
            
            this.uciCmd("ucinewgame");
            this.uciCmd("position fen " + this.getFen()+ "");
            this.uciCmd("go infinite");
        }
    },

    uciCmd: function(cmd){
        if(this.engine){
            if(cmd == 'stop')console.log('UCICmd', cmd);
            this.engine.postMessage(cmd);
        }
    },

    initializeBackgroundEngine: function () {

        console.log("UCICmd", "Initialize engine");

        if (!this.backgroundEngineValid) {
            console.log('UCICmd', 'not valid');
            return false;
        }

        if (!this.engine) {

            this.backgroundEngineValid = true;
            try {
                var that = this;
                this.engine = new Worker(this.stockfish);

                this.uciCmd('uci');
                this.uciCmd('ucinewgame');

                this.engine.onmessage = function (event) {
                    var line = event.data;
                    // console.log(line);
                    if(line == 'uciok') {
                        that.engineStatus.engineLoaded = true;
                    } else if(line == 'readyok') {
                        that.engineStatus.engineReady = true;
                    }else{
                        var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
                        if(match){

                        // UCICmd Out info depth 120 seldepth 8 score mate 4 nodes 7372428 nps 1571611 time 4691 multipv 1 pv d5f7 f8f7 e2e8 f7f8 e8f8 g8f8

                        }else if(match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/)) {
                            that.engineStatus.search = 'Depth: ' + match[1] + ' Nps: ' + match[2];
                        }
                        if(!that.stopped && (match = line.match(/^info .*\bscore (\w+) (-?\d+)/))) {
                            // info depth 120 seldepth 6 score mate 3 nodes 293724 nps 428169 time 686 multipv 1 pv d5c7 e8f8 d1d8 e7d8 e1e8
                            // info depth 20 seldepth 24 score cp 19 nodes 7739291 nps 442548 time 17488 multipv 1 pv e2e4 e7e5 g1f3 b8c6 f1b5 g8f6 e1g1 f8d6 d2d3 a7a6 b5c6 d7c6 c1g5 h7h6 g5f6 d8f6 b1d2 e8g8 a2a3 c8d7 b2b4
                            var bestMoves = line.replace(/.*pv(.+?)$/g, '$1').trim();

                            if(!that.isValidEngineMoveForCurrentPosition(bestMoves)){
                                return false;
                            }
                            var nps = line.replace(/.*nps.*?([0-9]+?)[^0-9].+/g, '$1');
                            var depth = line.replace(/.*?depth ([0-9]+?)[^0-9].*/g, '$1').trim();
                            var ret = {
                                depth:depth,
                                bestMoves:bestMoves,
                                nps: nps,
                                mate:false,
                                currentPly: that.currentPly
                            };


                            if(match[1] == 'cp') {
                                var score = parseInt(match[2]) * (that.colorToMove == 'white' ? 1 : -1);
                                score = (score / 100.0).toFixed(2);
                            } else if(match[1] == 'mate') {
                                ret.mate = match[2] * (that.colorToMove == 'white' ? 1 : -1);
                                score = '#' + match[2];
                            }
                            ret.score = score;
                            that.fireEvent('engineupdate', ret);
                        }
                    }
                };
                this.engine.error = function (e) {
                    console.log("Error from background worker:" + e.message);
                };
                this.searchAndRedraw();
            } catch (error) {
                this.backgroundEngineValid = false;
                console.log('UCICmd', error);
            }

            jQuery.ajax({
                url:ludo.config.getUrl() + '/stockfish-js/book.bin',
                complete:function(response){
                    this.engine.postMessage({book: response.responseText });
                }.bind(this)
            });
        }

        return this.backgroundEngineValid;
    },

    isValidEngineMoveForCurrentPosition:function(line){
        if(this.parser == undefined){
            this.parser = new chess.parser.FenParser0x88();
        }

        this.parser.setFen(this.fen);
        var m = {
            from: Board0x88Config.mapping[line.substr(0,2)],
            to: Board0x88Config.mapping[line.substr(2,2)]
        };

        var valid = this.parser.getValidMovesAndResult().moves;

        if(valid[m.from] && valid[m.from].indexOf(m.to) >=0){
            return true;

        }
        console.log('invalid' , line, this.fen);
        return false;

    },

    getFen: function () {

        return this.fen ? this.fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    },

    color:function(){
        return this.models[0].getColorToMove();
    },


    newGame: function () {
        this.currentModel.newGame();
    },

    setThinkingTime:function(thinkingTime){
        this.thinkingTime = thinkingTime;
    }
});