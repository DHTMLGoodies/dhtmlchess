chess.controller.PlayStockFishController = new Class({
    Extends: chess.controller.Controller,
    stockfish: undefined,


    history: undefined,
    engineStatus: {},

    whiteTime: 1000 * 60,
    blackTime: 1000 * 60,
    whiteIncrement: 1,
    blackIncrement: 1,

    debug: true,

    playerColor: 'white',

    elo: undefined,
    clock: undefined,

    playingStrength: undefined,

    __construct: function (config) {
        if (config.playerColor != undefined)this.playerColor = config.playerColor;
        if (config.stockfish != undefined)this.stockfish = config.stockfish;
        if (config.thinkingTime != undefined) {
            this.thinkingTime = config.thinkingTime;
        }
        this.elo = new chess.computer.Elo();
        this.clock = new chess.computer.Clock();

        this.parent(config);
        this.history = [];
    },

    addView: function (view) {
        this.parent(view);
        
        switch (view.submodule) {
            case 'chess.computer.gamedialog':
                view.on('newGame', this.prepareNewGame.bind(this));
                break;
            case 'computer.clockview':

                if(view.pos == 'top'){
                    this.views.clockTop = view;
                }else{
                    this.views.clockBottom = view;
                }
        }

    },

    getSkillLevel:function(){
        if(this.playingStrength < 1400)return 0;

        /*
         20 0 0 2894 [2859, 2929]
         19 -1 -66 2828 [2786, 2868]
         18 -2 -133 2761 [2714, 2807]
         17 -3 -199 2695 [2642, 2745]
         16 -4 -265 2629 [2570, 2684]
         15 -5 -331 2563 [2498, 2623]
         14 -6 -398 2496 [2426, 2562]
         13 -7 -464 2430 [2354, 2500]
         12 -8 -530 2364 [2282, 2439]
         11 -9 -596 2298 [2209, 2378]
         10 -10 -663 2231 [2137, 2317]
         9 -11 -729 2165 [2065, 2255]
         8 -12 -795 2099 [1993, 2194]
         7 -13 -861 2033 [1921, 2133]
         6 -14 -928 1966 [1849, 2071]

         */
        if(this.playingStrength > 2800)return 20;
        if(this.playingStrength > 2700)return 19;
        if(this.playingStrength > 2600)return 17;
        if(this.playingStrength > 2500)return 15;
        if(this.playingStrength > 2400)return 13;
        if(this.playingStrength > 2300)return 11;
        if(this.playingStrength > 2200)return 10;
        if(this.playingStrength > 2100)return 9;
        if(this.playingStrength > 2000)return 8;
        if(this.playingStrength > 1900)return 6;
        if(this.playingStrength > 1800)return 5;
        if(this.playingStrength > 1700)return 4;
        if(this.playingStrength > 1600)return 3;
        if(this.playingStrength > 1500)return 2;
        return 1;

    },

    prepareNewGame: function (timeControl) {
        console.log(timeControl);

        this.clock.setTime(timeControl.time * 60, timeControl.inc);
        this.clock.start();
        
        this.playingStrength = this.elo.getEloByTime(timeControl.time * 60, timeControl.inc);


        
        this.uciCmd('setoption name Mobility (Middle Game) value 150');
        this.uciCmd('setoption name Mobility (Endgame) value 150');
        this.uciCmd('setoption name Contempt Factor value 0');
        this.uciCmd('setoption name UCI_LimitStrength value 1200');
        this.uciCmd('setoption name Cowardice value 80');
        this.uciCmd('setoption name Skill Level value ' + this.getSkillLevel());

        if(timeControl.color == 'white'){
            this.views.board.flipToWhite();

            this.views.clockTop.setColor('black');
            this.views.clockBottom.setColor('white');

        }else{
            this.views.board.flipToBlack();

            this.views.clockTop.setColor('white');
            this.views.clockBottom.setColor('black');
        }
    },


    promotion: function (promoteTo) {

    },

    createEngine: function () {
        try {
            var that = this;

            this.fireEvent('message', chess.getPhrase('Loading StockfishJS'));

            this.engine = new Worker(this.stockfish);


            this.uciCmd('uci');
            this.uciCmd('ucinewgame');

            this.engine.onmessage = function (event) {
                var line = event.data;
                if (line == 'uciok') {
                    that.fireEvent('message', chess.getPhrase('StockfishJS loaded'));
                    that.engineStatus.engineLoaded = true;
                } else if (line == 'readyok') {
                    that.engineStatus.engineReady = true;
                    that.fireEvent('message', chess.getPhrase('StockfishJS ready'));
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
                this.fireEvent('message', "Error from background worker:" + e.message);
            }.bind(this);


            jQuery.ajax({
                url: ludo.config.getUrl() + '/stockfish-js/book.bin',
                complete: function (response) {
                    this.engine.postMessage({book: response.responseText});
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
            if(this.playingStrength <= 1200){
                this.uciCmd('go depth ' + 3);
            }else{
                this.uciCmd('go wtime ' + this.clock.wTime() + ' winc ' + this.clock.inc() + ' btime ' + this.clock.bTime() + ' binc ' + this.clock.inc());

            }


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
                this.clock.tap();

                if (this.history == undefined)this.history = [];
                this.history.push(move.from + move.to + (move.promoteTo ? move.promoteTo : ''));

                this.start();

                if (colorToMove != this.playerColor) {
                    this.prepareMove();
                }
            }

            if (model.getResult() != 0) {
                this.fireEvent("gameover", model.getResult());

                

                this.clock.stop();
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