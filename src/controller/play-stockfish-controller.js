chess.controller.PlayStockFishController = new Class({
    Extends: chess.controller.Controller,
    stockfish:undefined,

    history:undefined,
    engineStatus:{},
    
    __construct: function (config) {
        if(config.myColor != undefined)this.myColor = config.myColor;
        if(config.stockfish != undefined)this.stockfish = config.stockfish;
        if (config.thinkingTime != undefined) {
            this.thinkingTime = config.thinkingTime;
        }

        this.parent(config);
        
        this.history = [];
    },
    
    promotion:function(promoteTo){
          
    },

    createEngine:function(){
        try {
            var that = this;
            this.engine = new Worker(this.stockfish);


            this.uciCmd('uci');
            this.uciCmd('ucinewgame');

            this.engine.onmessage = function (event) {
                var line = event.data;
                if(line == 'uciok') {
                    that.engineStatus.engineLoaded = true;
                } else if(line == 'readyok') {
                    that.engineStatus.engineReady = true;
                }else{

                    var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
                    if(match) {
                        isEngineRunning = false;
                        game.move({from: match[1], to: match[2], promotion: match[3]});
                        prepareMove();
                    } else if(match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/)) {
                        engineStatus.search = 'Depth: ' + match[1] + ' Nps: ' + match[2];
                    }
                    if(match = line.match(/^info .*\bscore (\w+) (-?\d+)/)) {
                        var score = parseInt(match[2]) * (game.turn() == 'w' ? 1 : -1);
                        if(match[1] == 'cp') {
                            engineStatus.score = (score / 100.0).toFixed(2);
                        } else if(match[1] == 'mate') {
                            engineStatus.score = '#' + score;
                        }
                        if(match = line.match(/\b(upper|lower)bound\b/)) {
                            engineStatus.score = ((match[1] == 'upper') == (game.turn() == 'w') ? '<= ' : '>= ') + engineStatus.score
                        }
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
    },
    
    map:{
        'queen' : 'q', 'knight' : ''    
    },
    
    uciCmd:function(cmd){
        
    },
    
    modelEventFired: function (event, model) {
        this.chessModel = model;
        if (event === 'newMove' || event == 'newGame') {


            if (model.getResult() != 0) {
                this.fireEvent("gameover", model.getResult());
                return;
            }

            var colorToMove = model.getColorToMove();
            if (colorToMove === this.myColor) {
                this.views.board.enableDragAndDrop(model);
            } else {

                this.views.board.disableDragAndDrop();

                if (this.initializeBackgroundEngine()) {

                    var lastMove = model.getLastMoveInGame();

                    if (lastMove != undefined) {

                        var m = lastMove.from + lastMove.to;
                        if(lastMove.promoteTo){
                            m+= (lastMove.promoteTo == 'knight' ? 'n' : lastMove.substr(4));
                        }
                        

                    }else{
                        this.searchAndRedraw.delay(20, this);
                    }

                }
            }
        }

        if (event == 'newGame') {
            this.ensureAnalysisStopped();

            this.fireEvent('start', this.myColor)


            ResetGame();

            if (this.initializeBackgroundEngine()) {
                this.engine.postMessage("go");

            }
        }

    }


});