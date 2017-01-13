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
    timeoutVariations: 1500,
    countGames: undefined,

    ds: undefined,

    index: 0,

    colorToMove: undefined,
    lastEngineMove: undefined,

    parser: undefined,

    parsingMode: 0,

    bestScore: 0,

    checkmatesOnly: true,
    maxMoves: undefined,

    acceptedScore: 4,

    append: false,


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


        if (this.parsingMode == 0 && elapsed > this.timeout) {

            if (!this.checkmatesOnly && this.hasReachedAcceptedScore()) {
                this.controller.stopEngine();
                this.startTime = new Date().getTime();
                this.onNewMove();
            } else {
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


        if(this.index > 0 && this.index % 20 == 0){
            return;
        }

        if (this.index < this.countGames - 1) {
            this.lastEngineMove = undefined;
            this.controller.loadGameFromFile(++this.index);
        }
    },

    createController: function () {
        var that = this;
        this.controller = new chess.controller.AnalysisEngineController({
            pgn: this.in,
            garboChess: this.garbochess,
            stopped: true,
            debug: false,
            listeners: {
                engineupdate: that.updateMove.bind(that),
                loadGame: that.gameLoaded.bind(that)

            }
        });
    },


    gameLoaded: function (model, gameData) {

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
            this.controller.startEngine();
        }
    },

    bestMoves: undefined,

    updateMove: function (move) {


        this.bestMoves = move.replace(/^.*?NPS:[0-9]+?[^0-9](.*)$/g, '$1').trim();

        var s = move.replace(/.*?Score:([\-0-9]+?)[^0-9].*/g, '$1');
        var c = this.controller.currentModel.getColorToMove();
        var score = (s / 1000);


        if (!isNaN(score) && c == 'black')score *= -1;

        if (this.parsingMode !=0) {
            return;
        }
        if (isNaN(score)) {
            this.controller.stopEngine();
            this.loadNext.delay(2, this);
            return;
        }


        this.bestScore = score;
        this.fireEvent('score', score);


        this.fireEvent('message', this.elapsed());

        if (Math.abs(score) >= 1000) {
            this.onNewMove();
        }
    },

    elapsed: function () {
        return new Date().getTime() - this.startTime;
    },

    onNewMove: function () {

        var elapsed = new Date().getTime() - startTime;

        this.startTime = new Date().getTime();

        var m = this.bestMoves.replace(/[\s]+/, ' ');

        var moves = m.split(/\s/g);
        if (this.lastEngineMove == undefined) {
            this.lastEngineMove = moves[moves.length - 1];
        }

        var model = this.controller.currentModel;

        this.controller.stopEngine();

        var pos = model.getCurrentPosition();
        this.parser.setFen(pos);

        var checkmateMoves = this.parser.getAllCheckmateMoves();


        this.currentFens.push(model.getCurrentPosition());

        if (checkmateMoves.length > 1) {
            var lastMove = {
                move: checkmateMoves[0],
                variations: []
            };

            for (var i = 1; i < checkmateMoves.length; i++) {
                lastMove.variations.push([checkmateMoves[i]]);
            }


            model.appendRemoteMove(checkmateMoves[0]);
            this.currentMoves.push(lastMove);

            this.onGameEnd();
        } else {

            this.currentMoves.push(moves[0]);

            model.appendRemoteMove(moves[0]);

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

        console.log('received', equal, variation[0], this.bestLines[this.variationIndex]);

        if (!equal && variation.length + this.variationIndex == this.bestLines.length) {

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
            this.controller.stopEngine();
            this.moveToNextInVariation();
            return;
        }


        this.parser.setFen(this.bestLineFens[this.variationIndex]);
        var move = this.currentVariationMove = this.availableMoves[this.variationMoveIndex];

        if (this.lineFinder == undefined) {
            this.lineFinder = new chess.FindLine({
                controller: this.controller,
                listeners: {
                    'finished': this.receivedVariationLine.bind(this),
                    'abort': this.receivedNoVariationLine.bind(this)
                }
            });
        }
        this.lineFinder.findLine(this.bestLineFens[this.variationIndex], move, undefined, this.colorToMove);


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

            this.currentBestMove = this.currentMoves[this.variationIndex];
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

        this.currentBestMove = this.currentMoves[this.variationIndex];
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
                        notation += pr + variationMove + ' ';

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
                this.loadNext.delay(30000, this);
            }.bind(this)
        });

    }

});