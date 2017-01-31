chess.AutoParse = new Class({

    Extends: Events,

    in: undefined,
    out: undefined,

    controller: undefined,
    garbochess: '../../garbochess/js/garbochess.js',

    currentPgn: undefined,
    currentMoves: undefined,
    currentFens: undefined,

    startTime: new Date().getTime(),
    timeout: 120000,
    minimiumTimeout: 5000,
    timeoutVariations: 1500,
    countGames: undefined,

    ds: undefined,

    index: 0,

    colorToMove: undefined,
    lastEngineMove: undefined,

    parser: undefined,
    secondParser: undefined,

    parsingMode: 0,

    bestScore: 0,

    checkmatesOnly: true,
    maxMoves: undefined,

    acceptedScore: 4,

    append: false,

    strict:true,

    timeMateFound:0,

    initialize: function (config) {
        this.in = config.in;
        this.out = config.out;
        this.garbochess = config.garbochess || this.garbochess;
        this.timeout = config.timeout || this.timeout;
        this.index = config.startIndex || this.index;

        if (config.checkmatesOnly != undefined)this.checkmatesOnly = config.checkmatesOnly;
        if (config.maxMoves != undefined)this.maxMoves = config.maxMoves;
        if (config.acceptedScore != undefined)this.acceptedScore = config.acceptedScore;
        if (config.append != undefined)this.append = config.append;

        this.parser = new chess.parser.FenParser0x88();
        this.secondParser = new chess.parser.FenParser0x88();

        if (config.listeners) {
            this.addEvents(config.listeners);
        }
        if (!this.append) {
            this.createPgn();
        }
        this.createController();
        this.createDataSource();

        this.checkTimeout();
    },

    createPgn: function () {
        $.ajax(
            {
                url: 'auto-parse-pgn-controller.php',
                method: 'post',
                data: {
                    pgn: this.out,
                    initialize: true
                }
            }
        )
    },

    createDataSource: function () {

        this.ds = new chess.dataSource.PgnGames({
            id: 'gameList',
            postData: {"arguments": this.in},
            "listeners": {
                "load": function (data) {
                    this.startTime = new Date().getTime();
                    this.countGames = data.length;

                    this.controller.loadGameFromFile(this.index);
                }.bind(this)
            }
        });
    },

    hasReachedAcceptedScore: function () {
        if (this.colorToMove == 'white')return this.bestScore > this.acceptedScore;
        return this.bestScore < -this.acceptedScore;
    },

    checkTimeout: function () {
        var elapsed = new Date().getTime() - this.startTime;


        var elapsedMinimum = new Date().getTime() - this.timeMateFound > this.minimiumTimeout;
        if(this.checkmatesOnly && this.parsingMode == 0 && this.foundMate  && elapsedMinimum ){
            this.foundMate = false;

            this.onNewMove();
            console.log('timeout new moves');
            return;
        }

        if (this.parsingMode == 0 && elapsed > this.timeout) {

            if (!this.checkmatesOnly && this.hasReachedAcceptedScore()) {
                console.log('stopping 4');
                this.controller.stopEngine();
                this.startTime = new Date().getTime();
                console.log('timeout');
                this.onNewMove();
            } else {
                console.log('stopping 4');
                this.controller.stopEngine();
                this.loadNext.delay(1000, this);
                this.startTime = new Date().getTime();
            }


        } else if ((this.parsingMode == 1 || this.parsingMode == 2) && elapsed > this.timeoutVariations) {
            //this.variationTimeout();
        }
        this.checkTimeout.delay(100, this);

    },

    loadNext: function () {

        location.href='index.php?index=' + (this.index + 1);
        return;

        if (this.index > 0 && this.index % 50 == 0) {
            return;
        }

        if (this.index < this.countGames - 1) {
            this.lastEngineMove = undefined;
            this.controller.loadGameFromFile(++this.index);
        }
    },

    createController: function () {
        var that = this;
        this.controller = new chess.controller.StockfishEngineController({
            stockfish: '../../stockfish-js/stockfish.js',
            pgn: this.in,
            autoStopEngineOnNewGame: false,
            stopped: true,
            debug: false,
            listeners: {
                engineupdate: that.updateMove.bind(that),
                loadGame: that.gameLoaded.bind(that)

            }
        });
    },


    gameLoaded: function (model, gameData) {

        this.foundMate = false;
        this.timeMateFound = 0;

        this.parsingMode = 0;
        this.currentMoves = [];
        this.currentFens = [];
        this.variationIndex = 0;
        this.variationMoveIndex = 0;
        this.bestScore = 0;


        this.currentPgn = gameData.metadata;

        this.parser.setFen(gameData.fen || gameData.metadata.fen);
        this.colorToMove = this.parser.getColor();

        this.fireEvent('message', 'Searching for checkmate');
        currentPgn = gameData.metadata;
        currentPgn.result = '*'; // to ensure engine is running
        startTime = new Date().getTime();

        if (this.controller.stopped && this.parsingMode == 0) {
            this.controller.startEngine.delay(100, this.controller);
        }
    },

    bestMoves: undefined,

    currentBest: undefined,

    updateMove: function (move) {


        this.bestMoves = move.bestMoves;

        if (this.parsingMode != 0) {
            return;
        }

        this.bestScore = move.score;


        this.fireEvent('score', move.mote ? move.mate * 100 : move.score);


        this.fireEvent('message', this.elapsed());


        var elapsed = new Date().getTime() - this.startTime > this.minimiumTimeout;

        if(move.mate && !this.timeMateFound){
            this.timeMateFound = new Date().getTime();
            this.foundMate = true;
        }

        if (move.mate && this.bestMoves != this.currentBest && elapsed) {
            this.timeMateFound = new Date().getTime();
            this.onNewMove();
        }

        this.currentBest = this.bestMoves;

    },

    elapsed: function () {
        return new Date().getTime() - this.startTime;
    },

    onNewMove: function () {

        this.foundMate = false;
        this.timeMateFound = 0;


        var elapsed = new Date().getTime() - startTime;

        this.startTime = new Date().getTime();

        var m = this.bestMoves.replace(/[\s]+/, ' ');

        var moves = m.split(/\s/g);

        if (this.lastEngineMove == undefined) {
            this.lastEngineMove = moves[moves.length - 1];
        }

        var model = this.controller.currentModel;

        console.log('stopping 1');
        this.controller.stopEngine();


        var pos = model.getCurrentPosition();
        this.parser.setFen(pos);

        var checkmateMoves = this.parser.getAllCheckmateMoves();


        this.currentFens.push(model.getCurrentPosition());

        var i;

        if (checkmateMoves.length > 1) {
            var lastMove = {
                move: checkmateMoves[0],
                variations: []
            };

            for (i = 1; i < checkmateMoves.length; i++) {
                lastMove.variations.push([checkmateMoves[i]]);
            }


            model.appendRemoteMove(checkmateMoves[0]);
            this.currentMoves.push(lastMove);


            this.onGameEnd();
        } else {

            var cmFound = false;
            var map = {q: 'queen', n: 'knight', 'b': 'bishop', 'rook': 'rook'};

            this.secondParser.setFen(this.parser.getFen());


            for (i = 0; i < moves.length; i++) {
                var move = moves[i];
                var promoteTo = undefined;
                if (move.length == 5) {
                    promoteTo = map[move.substr(4, 1)];
                }
                var obj = {
                    from: move.substr(0, 2),
                    to: move.substr(2, 2),
                    promoteTo: promoteTo
                };

                this.secondParser.move(obj);

                var notation = this.secondParser.getNotation();
                cmFound = notation.indexOf('#') > 0;
                model.appendRemoteMove(notation);
                this.currentMoves.push(notation);
                this.currentFens.push(model.getCurrentPosition());
            }

            if (!cmFound) {
                var checkmates = this.secondParser.getAllCheckmateMoves();
                var lm;

                jQuery.each(checkmates, function (i, checkmate) {
                    if (!lm) {
                        model.appendRemoteMove(checkmate);
                        lm = checkmates.length == 1 ? checkmate : {
                            move: checkmate,
                            variations: []
                        };
                    } else {
                        lm.variations.push(checkmate);
                    }
                }.bind(this));

                if (lm) {
                    this.currentMoves.push(lm);
                }
            }

            var cm = model.getLastMoveInGame().m.indexOf('#') >= 0;

            var timeout = this.lastEngineMove.indexOf('#') == -1 && elapsed > this.timeout && this.checkmatesOnly;
            if (!cm && !this.checkmatesOnly && this.currentMoves.length >= this.maxMoves)cm = true;
            if (cm > 0 || timeout) {
                startTime = new Date().getTime();
                if (timeout) {
                    this.loadNext.delay(500, this);
                } else {
                    this.onGameEnd();
                }
            } else {
                this.bestScore = 0;
                this.controller.startEngine.delay(10, this.controller);
                console.log('bestmoves', 'restarting engine');
            }
        }
    },

    bestLine: undefined,
    bestLineFens: undefined,
    variationIndex: 0,
    variationMoveIndex: 0,
    variationMoveLength: 0,
    availableMoves: undefined,
    currentVariationMove: undefined,

    arrayOfVariations: undefined,

    lineFinder: undefined,

    receivedNoVariationLine: function () {
        console.log('received no variation');
        this.parsingMode = (this.variationIndex % 2 == 0) ? 1 : 2;
        this.parseNextMove();
    },

    receivedVariationLine: function (variation) {

        var equal = variation[0] == this.bestLines[this.variationIndex];


        if (!equal && variation.length + this.variationIndex == this.bestLines.length) {
            if(this.strict){
                this.loadNext();
                return;
            }
            this.arrayOfVariations.push(variation);
            if (this.checkmatesOnly) {
                this.currentPgn.questionable = '1';
            }
        }
        this.parsingMode = (this.variationIndex % 2 == 0) ? 1 : 2;
        this.parseNextMove();

    },

    parseBranch: function () {

        this.arrayOfVariations = [];
        this.controller.setPosition(this.bestLineFens[this.variationIndex]);
        this.parser.setFen(this.bestLineFens[this.variationIndex]);
        this.availableMoves = this.parser.getAllMovesReadable();

        this.variationMoveIndex = 0;
        this.variationMoveLength = this.availableMoves.length;

        this.parseNextMove();
    },

    parseNextMove: function () {

        console.log('stopping 2');
        this.controller.stopEngine();

        this.startTime = new Date().getTime();
        if (this.variationMoveIndex >= this.availableMoves.length) {
            if (this.arrayOfVariations.length > 0) {
                this.currentMoves[this.variationIndex] = {
                    move: this.currentMoves[this.variationIndex],
                    variations: this.arrayOfVariations
                };
            }

            this.parsingMode = 3;
            console.log('stopping 3');
            this.controller.stopEngine();
            this.moveToNextInVariation();
            return;
        }


        this.parser.setFen(this.bestLineFens[this.variationIndex]);
        var move = this.currentVariationMove = this.availableMoves[this.variationMoveIndex];

        if (this.lineFinder == undefined) {
            this.lineFinder = new chess.FindLine({
                parentCmp: this,
                controller: this.controller,
                listeners: {
                    'finished': this.receivedVariationLine.bind(this),
                    'abort': this.receivedNoVariationLine.bind(this)
                }
            });
        }
        this.lineFinder.findLine(this.bestLineFens[this.variationIndex], move, this.bestLines.length * 100, this.colorToMove);


        this.parser.move(move);
        this.fireEvent('message', 'Trying ' + this.parser.getNotation());

        this.controller.setPosition(this.parser.getFen());
        // this.controller.startEngine();
        this.variationMoveIndex++;
    },

    moveToNextInVariation: function () {
        this.variationIndex += 2;

        if (this.variationIndex < this.bestLines.length - 1) {
            this.controller.setPosition(this.bestLineFens[this.variationIndex]);
            this.parser.setFen(this.bestLineFens[this.variationIndex]);

            this.variationMoveIndex = 0;
            this.parsingMode = this.variationIndex % 2 == 0 ? 1 : 2;
            this.parseBranch();
        } else {
            this.saveGame();
        }
    },

    parseVariations: function () {

        this.fireEvent('message', 'Searching for variations');

        this.bestLines = [];
        this.bestLineFens = [];
        this.variationIndex = 0;
        this.variationMoveIndex = 0;
        this.parsingMode = 1;

        jQuery.each(this.currentMoves, function (i, move) {
            this.bestLines.push(move);
            this.bestLineFens.push(this.currentFens[i]);
        }.bind(this));

        this.parser.setFen(this.bestLineFens[this.variationIndex]);
        this.parseBranch();

    },


    onGameEnd: function () {
        if (this.currentMoves.length > 1 && this.checkmatesOnly) {
            this.parsingMode = 1;
            this.parseVariations();
        } else {
            this.saveGame();
        }
    },

    saveGame: function () {


        var mi = this.colorToMove == 'black' ? 1 : 0;
        jQuery.each(this.currentMoves, function (i, move) {

            var moveIndex = mi + i;

            var moveNumber = Math.floor(moveIndex / 2) + 1;

            var prefix = i == 0 || moveIndex % 2 == 0 ? moveNumber + '.' : '';
            if (prefix.length && moveIndex % 2 == 1)prefix += '..';

            if (jQuery.type(move) == 'object') {
                var notation = prefix + ' ' + move.move;

                jQuery.each(move.variations, function (j, variation) {
                    notation += " (";

                    jQuery.each(variation, function (a, variationMove) {
                        var pr = a == 0 || ((moveIndex + a) % 2 == 0) ? moveIndex + a : '';
                        if (!isNaN(pr)) {
                            if (pr % 2 == 1) {
                                pr = Math.floor(pr / 2) + 1 + '...';
                            } else {
                                pr = Math.floor(pr / 2) + 1 + '.'
                            }
                        }
                        if (pr.length)pr += ' ';

                        if(jQuery.type(variationMove) == 'object'){
                            notation += pr + variationMove.move + ' ';

                            jQuery.each(variationMove.variations, function(a, subvar){
                                notation += '(' + subvar + ') ';
                            });
                        }else{
                            notation += pr + variationMove + ' ';

                        }

                    }.bind(this));

                    notation += ") ";

                }.bind(this));

                notation = notation.replace(/\s+/g, ' ');
                notation = notation.replace(/\s\)/g, ')');
                this.currentMoves[i] = notation;

            } else {
                this.currentMoves[i] = prefix + ' ' + move;
            }
        }.bind(this));


        this.currentPgn.black = this.currentPgn.white + ' ' + this.currentPgn.black;
        this.currentPgn.index = this.index;
        this.currentPgn.white = this.checkmatesOnly ? ((this.colorToMove == 'white' ? 'White' : 'Black') + ' mates in ' + (Math.ceil(this.currentMoves.length / 2))) : 'Find the best move';
        this.currentPgn.moves = this.currentMoves.join(' ');
        this.currentPgn.result = this.colorToMove == 'white' ? '1-0' : '0-1';
        this.currentPgn.plycount = this.currentMoves.length;
        this.currentPgn.ts = new Date().getTime();


        $.ajax({
            url: "auto-parse-pgn-controller.php",
            method: "post",
            data: {
                pgn: this.out,
                game: this.currentPgn,
                append: true
            },

            success: function () {
                this.startTime = new Date().getTime();
                new ludo.Notification({
                    duration: 1.5,
                    html: 'Game #' + (this.index + 1) + ' saved'
                });
                this.lastEngineMove = undefined;
                this.loadNext.delay(2000, this);
            }.bind(this)
        });

    }

});