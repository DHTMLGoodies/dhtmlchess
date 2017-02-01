chess.controller.PlayStockFishController = new Class({
    Extends: chess.controller.Controller,
    stockfish: undefined,

    history: undefined,
    engineStatus: {},

    whiteTime: 1000 * 60,
    blackTime: 1000 * 60,
    whiteIncrement: 1,
    blackIncrement: 1,

    debug:false,

    playerColor: 'white',

    __construct: function (config) {
        if (config.myColor != undefined)this.myColor = config.myColor;
        if (config.stockfish != undefined)this.stockfish = config.stockfish;
        if (config.thinkingTime != undefined) {
            this.thinkingTime = config.thinkingTime;
        }
        this.parent(config);
        this.history = [];


    },

    promotion: function (promoteTo) {

    },

    createEngine: function () {
        try {
            var that = this;
            this.engine = new Worker(this.stockfish);


            this.uciCmd('uci');
            this.uciCmd('ucinewgame');

            this.engine.onmessage = function (event) {
                var line = event.data;
                if (line == 'uciok') {
                    that.engineStatus.engineLoaded = true;
                } else if (line == 'readyok') {
                    that.engineStatus.engineReady = true;
                } else {

                    var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
                    if (match) {
                        var m = match[1] + match[2] + (match[3] != undefined ? match[3] : '');
                        if (that.history.length == 0 || that.history[that.history.length - 1] != m) {
                            that.currentModel.move({from: match[1], to: match[2], promoteTo: match[3]});
                        }
                    }

                    if (match = line.match(/^info .*\bscore (\w+) (-?\d+)/)) {
                        var bestMoves = line.replace(/.*pv(.+?)$/g, '$1').trim();

                        var nps = line.replace(/.*nps.*?([0-9]+?)[^0-9].+/g, '$1');
                        var depth = line.replace(/.*?depth ([0-9]+?)[^0-9].*/g, '$1').trim();
                        var ret = {
                            depth: depth,
                            bestMoves: bestMoves,
                            nps: nps,
                            mate: false,
                            currentPly: that.currentPly
                        };


                        if (match[1] == 'cp') {
                            var score = parseInt(match[2]) * (that.colorToMove == 'white' ? 1 : -1);
                            score = (score / 100.0).toFixed(2);
                        } else if (match[1] == 'mate') {
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

            jQuery.ajax({
                url:ludo.config.getUrl() + '/stockfish-js/book.bin',
                complete:function(response){
                    this.engine.postMessage({book: response.responseText });
                }.bind(this)
            });


        } catch (error) {
            this.backgroundEngineValid = false;
            console.log('UCICmd', error);
        }
    },

    newGame: function () {
        this.history = [];
        this.currentModel.newGame();
        this.start();
        this.prepareMove();
    },

    start: function () {
        this.uciCmd('ucinewgame');
        this.uciCmd('isready');
        this.engineStatus.engineReady = false;
        this.engineStatus.search = null;

        this.prepareMove();
    },

    prepareMove: function () {

        var c = this.currentModel.turn();

        if (c != this.playerColor) {
            if (this.history == undefined)this.history = [];
            this.uciCmd('position startpos moves ' + this.history.join(' '));
            this.uciCmd('go wtime ' + this.whiteTime + ' winc ' + this.whiteIncrement + ' btime ' + this.blackTime + ' binc ' + this.blackIncrement);


        }

    },

    uciCmd: function (cmd) {
        this.engine.postMessage(cmd);
    },

    modelEventFired: function (event, model, move) {
        this.chessModel = model;
        if (event === 'newMove' || event == 'newGame') {

            if (event == 'newGame') {
                if (this.playerColor == 'white') {
                    this.views.board.flipToWhite();
                } else {
                    this.views.board.flipToBlack();
                }
                if (this.engine == undefined) {
                    this.createEngine();
                }
            }


            var colorToMove = model.turn();
            if (event == 'newMove') {
                if (this.history == undefined)this.history = [];
                this.history.push(move.from + move.to + (move.promoteTo ? move.promoteTo : ''));

                this.start();

                if (colorToMove != this.playerColor) {
                    this.prepareMove();
                }
            }

            if (model.getResult() != 0) {
                this.fireEvent("gameover", model.getResult());
                return;
            }

            if (colorToMove === this.playerColor) {
                this.views.board.enableDragAndDrop(model);
            } else {

                this.views.board.disableDragAndDrop();
                if (event == 'newGame') {
                    this.prepareMove();
                }

            }
        }


    }


});