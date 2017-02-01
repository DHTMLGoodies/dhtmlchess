chess.wordpress.ComputerEval = new Class({

    Extends: ludo.View,
    submodule: 'wordpress.computereval',
    started: false,
    fen: undefined,

    layout: {
        type: 'linear', orientation: 'vertical'
    },

    parser: undefined,

    bestLine: undefined,
    bestLineString: undefined,

    __children: function () {
        return [
            {
                name: 'scoreBar',
                css: {
                    'margin': 5
                },
                type: 'chess.view.score.Bar',
                layout: {
                    height: 60
                },
                borderRadius: 5,
                blackColor: '#444444',
                whiteColor: '#EEEEEE',
                markerColor: '#B71C1C',
                markerTextColor: '#FFF',
                stroke: '#222222',
                range: 3
            },
            {
                name: 'eval',
                layout: {
                    weight: 1
                },
                css: {
                    padding: 4
                }
            },
            {
                name: 'buttons',
                layout: {
                    height: 30, type: 'linear', orientation: 'horizontal'
                },
                children: [
                    {
                        name: 'startStopEngine',
                        value: 'Start',
                        type: 'form.Button'
                    },
                    {
                        name: 'appendLine',
                        value: 'Append Line',
                        type: 'form.Button'
                    }
                ]
            },

            {
                layout: {
                    height: 20
                },
                css: {
                    'text-align': 'right',
                    'font-style': 'italic',
                    'font-size': '0.9em',
                    'padding-right': '4px'
                },
                html: '<a href="https://github.com/nmrugg/stockfish.js" onclick="var w = window.open(this.href); return false">' + chess.getPhrase('StockFish.JS Engine') + '</a>'
            }
        ]
    },

    __construct: function (config) {
        this.parent(config);
        this.parser = new chess.parser.FenParser0x88();
        this.bestLine = [];
    },

    setController: function (controller) {
        this.parent(controller);
        controller.on('engineupdate', this.receiveEngineUpdate.bind(this));
        controller.on('fen', this.onPositionUpdate.bind(this));
        controller.on('newGame', this.clearView.bind(this));
        // controller.on('nextmove', this.onNextMove.bind(this));
    },

    receiveEngineUpdate: function (update) {

        if (update.mate) {
            var s = update.mate < 0 ? -100 : 100;
            this.child['scoreBar'].setScore(s);
            update.score = 'Mate in ' + update.mate;
        } else {
            this.child['scoreBar'].setScore(update.score);
        }

        this.bestLineString = update.bestMoves;

        // Ply:9 Score:3142 Nodes:341415 NPS:418914  Nxe5 Bf1 d5 d4 Nc6 e5 Bb4+ c3 Bg4 Be2
        var ply = update.depth;
        var nps = update.nps;
        var pr = update.score > 0 ? '+' : '';
        this.child['eval'].html('Depth: ' + ply + '<br>Nodes/s: ' + nps + '<br><div class="dhtml-chess-comp-eval"><span class="dhtml-chess-comp-eval-score">' + pr + update.score + '</span> ' + this.getMoveLine(update) + '</div>');

    },

    clearView: function () {
        if (this.child['eval']) {
            this.child['eval'].html('');
            this.child['scoreBar'].setScore(0);
        }
        this.bestLineString = '';
        this.bestLine = [];

        if(this.child['buttons']){
            this.child['buttons'].child['appendLine'].hide();
        }
    },

    getMoveLine: function (update) {


        this.parser.setFen(this.fen);
        var ml = update.bestMoves.split(/\s/g);

        this.bestLine = [];

        var ply = update.currentPly;
        ply += 2;

        var spanMN = '<span class="dhtml-chess-comp-eval-mn">';
        var spanNotation = '<span class="dhtml-chess-comp-eval-notation">';
        var urlPrefix = ludo.config.getDocumentRoot() + '/images/svg_bw45';

        var prefix = ply % 2 == 1 ? (spanMN + '.. ' + Math.floor(ply / 2) + '</span>') : '';
        this.bestLine.push(prefix);

        var a = ply;
        for (var i = 0; i < ml.length; i++) {


            if (a % 2 == 0) {
                if (i > 0)this.bestLine.push('</span>');
                this.bestLine.push('<span class="dhtml-chess-comp-eval-group">');
                this.bestLine.push(spanMN + (a / 2) + '. </span>');
            }

            var m = ml[i];
            var f = m.substr(0, 2);
            var t = m.substr(2, 2);

            var obj = {
                from: f, to: t
            };
            if (m.length == 5) {
                obj.promoteTo = m.substr(4, 1);
            }
            this.parser.move(obj);

            var notation = this.parser.getNotation();

            if (/[QRBN]/.test(notation.substr(0, 1))) {
                var c = a % 2 == 0 ? 'w' : 'b';
                this.bestLine.push('<img style="vertical-align:text-bottom;height:18px" src="' + urlPrefix + c + notation.substr(0, 1).toLocaleLowerCase() + '.svg">');

                notation = spanNotation + notation.substr(1) + '</span>';
            } else {
                notation = spanNotation + notation + '</span>';
            }

            this.bestLine.push(notation);

            a++;
        }
        this.bestLine.push('</span>');

        return this.bestLine.join(' ');
    },


    __rendered: function () {
        this.parent();
        this.on('hide', this.stopEngine.bind(this));

        var p = this.child['buttons'];
        p.child['startStopEngine'].on('click', this.toggleEngine.bind(this));
        p.child['appendLine'].on('click', this.appendLine.bind(this));
        p.child['appendLine'].hide();
    },

    appendLine: function () {
        if (this.bestLineString) {
            if(this.started)this.stopEngine();
            this.fireEvent('appendLine', this.bestLineString);
        }
    },


    onNextMove: function (model, m) {
        console.log(arguments);

        if (this.started && m.from) {

        }
    },

    onPositionUpdate: function (model, fen) {
        this.fen = fen;
        this.parser.setFen(fen);
        this.bestLine = [];

        if (this.started) {
            var c = this.controller;
            c.ensureAnalysisStopped();
            c.initializeBackgroundEngine();

            c.engine.postMessage("position " + fen);
            c.engine.postMessage("analyze");


        }
    },

    toggleEngine: function () {
        if (this.started) {
            this.stopEngine();
        } else {
            this.startEngine();
        }
    },

    stopEngine: function () {
        if (!this.started)return;

        this.controller.stopEngine();
        this.started = false;
        this.child['buttons'].child['startStopEngine'].val('Start');
        this.controller.sendMessage(chess.getPhrase('Engine stopped'))
    },

    startEngine: function () {
        this.controller.startEngine();
        this.started = true;
        this.child['buttons'].child['startStopEngine'].val('Stop');
        this.child['buttons'].child['appendLine'].show();

    }

});