chess.controller.DummyController = new Class({
    Extends: chess.controller.StockfishEngineController,
    positionParser: undefined,
    fen: undefined,
    isValid: false,
    _colorToMove: "white",

    _moves: undefined,
    _movePointer: undefined,
    _buttonBar: undefined,
    _inited: false,
    _persistant: true,
    __construct: function (config) {
        this.parent(config);

        if (config.persistent !== undefined) this._persistant = config.persistent !== "0";
        this.circleColors = ["#E53935", "#43A047"]
        this.positionParser = new chess.parser.FenParser0x88();

        var b = this.views.board;

        this.squarePool = new chess.view.highlight.SquarePool({
            board: b
        });

        this.circlePool = new chess.view.highlight.SquarePool({
            board: b,
            circular: true
        });

        this.arrowPool = new chess.view.highlight.ArrowPool({
            board: b
        });

        this.loadFromLocalStore();
        this._onNav();

        setTimeout(function () {
            this._onNav();
            if(this._flipped && this.views.board){
                this.views.board.flipToBlack();
            }
        }.bind(this), 300);
        this._inited = true;
    },

    resetMoves: function () {
        this._moves = [{
            fen: Board0x88Config.fen
        }];
        this._movePointer = 0;

        this.updateLocalStore();
    },

    updateLocalStore: function () {
        if (!this._inited || !this._persistant) return;
        var s = ludo.getLocalStorage();
        s.save("inst", {
            moves: this._moves,
            movePointer: this._movePointer,
            color: this._colorToMove,
            flipped: this.views.board.isFlipped()
        });
    },

    loadFromLocalStore: function () {
        if (!this._persistant) return;
        var data = ludo.getLocalStorage().get("inst");
        if (data) {
            this._moves = data.moves;
            this._movePointer = data.movePointer;
            this._colorToMove = data.color;
            this._flipped = data.flipped;
        }
    },

    createView: function (type) {
        var c = this.theme[type] || {};
        c.type = type;
        if (this._module != undefined) c.module = this._module;
        return ludo.factory.create(c);
    },

    createDefaultViews: function () {
        if (this.views.board) {
            new chess.action.Handler({
                board: this.views.board,
                controller: this,
                arrowStyles: this.arrowStylesSec
            })
        }
    },

    modelEventFired: function (event, model, param) {

    },

    updateFen: function (move, color) {
        var fen = this.views.board.buildFen();
        var c = color === "white" ? "b" : "w";
        this.fen = [fen, c, "KQkq", "-", "0", c === "w" ? 2 : 1].join(" ");
        this.validate();
        if (this.isValid) this.onFenUpdated();

        if (this.lastMove) {
            this.squarePool
                .hideAll()
                .show(this.lastMove.from, this.circleColors[0])
                .show(this.lastMove.to, this.circleColors[0]);
        }
        // console.log(this.positionParser.isValid(this.fen));
    },

    onFenUpdated: function () {
        var fens = this.fen.split(' ');
        this._colorToMove = fens[1] === "w" ? "white" : "black";

        this.fireEvent('instructorFen', [undefined, this.fen]);

        this.views.board.updateSTM();

        if (this.arrowPool) {
            this.squarePool.hideAll();
            this.circlePool.hideAll();
            this.arrowPool.hideAll();
        }

        this.restartEngine();
    },

    validateFen: function (fen) {
        try {
            this.positionParser.setFen(fen);
            var whiteKing = this.positionParser.getKing("white");
            var blackKing = this.positionParser.getKing("black");
            var oppositeColor = this.positionParser.getColor() === "white" ? "black" : "white";
            var res = this.positionParser.getValidMovesAndResult(oppositeColor);
            return whiteKing && blackKing && !res.check && res.result === 0;
        } catch (e) {

        }

        return false;
    },

    validate: function () {
        this.isValid = this.validateFen(this.fen);
        try {
            this.positionParser.setFen(this.fen);
            var whiteKing = this.positionParser.getKing("white");
            var blackKing = this.positionParser.getKing("black");
            var oppositeColor = this.positionParser.getColor() === "white" ? "black" : "white";
            var res = this.positionParser.getValidMovesAndResult(oppositeColor);
            this.isValid = whiteKing && blackKing && !res.check && res.result === 0;
        } catch (e) {

        }

        if (this.isValid) {
            if (this.compMode) {
                this.searchAndRedraw();
            }
        } else {
            this.stopEngine();
            if (console) console.log("invalid fen");
            this.fireEvent("comp");

        }
    },
    compMode: false,

    color: function () {
        return this._colorToMove;
    },

    colorToMove: function () {
        return this._colorToMove;
    },

    searchAndRedraw: function () {
        if (this.compMode) {
            this.currentPly = this._colorToMove === "white" ? 0 : 1;

            this.uciCmd("ucinewgame");
            this.uciCmd("position fen " + this.fen);
            this.uciCmd("go infinite");
        }
    },

    toggleCompMode: function () {
        this.compMode = !this.compMode;

        if (this.compMode) {
            this.startEngine();
        } else {
            this.stopEngine();
        }

    },

    clickSquare: function (square, event) {
        var color = event.shiftKey ? this.circleColors[1] : this.circleColors[0];
        this.circlePool.toggle(square, color);
        event.preventDefault();
    },

    _arrow: undefined,


    arrowStart: function (square, event) {

        var i = event.altKey ? 0 : 1;
        this._arrow = this.arrowPool.show(
            square,
            square,
            {
                fill: this.circleColors[i],
                stroke: this.circleColors[i]
            }
        )
    },

    arrowMove: function (square, event) {
        if (this._arrow) {
            this._arrow.el.setTo(square);
        }
    },

    arrowEnd: function (square, event) {
        if (this._arrow) {
            this._arrow.el.setTo(square);
        }
        this._arrow = undefined;
    },

    _onMove: function () {

    },

    keyNext: function () {
        if (this._movePointer < this._moves.length - 1) {
            this._movePointer++;
            this._onNav(true);

        }
    },

    keyBack: function () {
        if (this._movePointer > 0) {
            this._movePointer--;
            this._onNav(true);
        }
    },

    toStart: function () {
        if (this._movePointer > 0) {
            this._movePointer = 0;
            this._onNav(true);
        }
    },

    toEnd: function () {
        if (this._movePointer < this._moves.length - 1) {
            this._movePointer = this._moves.length - 1;
            this._onNav(true);

        }
    },

    _onNav: function (updateLocalStorage) {
        this.fireEvent(this._movePointer === 0 ? "startOfGame" : "notStartOfGame");
        this.fireEvent(this._movePointer === this._moves.length - 1 ? "endOfBranch" : "notEndOfBranch");

        var m = this._moves[this._movePointer];
        this.lastMove = m.move;
        this.fen = m.fen;
        this.views.board.showFen(this.fen);

        this.onFenUpdated();
        this.updateFen(m.move, m.color);
        this.fireEvent("move", m);

        if (updateLocalStorage) {
            this.updateLocalStore();
        }
    },

    restartEngine: function () {
        if (this._restartTimer) clearTimeout(this._restartTimer);
        if (!this.compMode) return;
        this.stopEngine();

        var fn = function () {
            if (this.compMode) {
                this.startEngine();
            }
            this._restartTimer = undefined;
        }.bind(this);
        this._restartTimer = setTimeout(fn, 1500);
    },

    addView: function (view) {
        this.views[view.submodule] = view;

        switch (view.submodule) {
            case 'wordpress.computereval':
                view.on("error", this.restartEngine.bind(this));
                break;
            case 'board':
                view.enableInstructorMode();
                view.on('move', function (move, piece) {
                    this.lastMove = move;

                    this.updateFen(move, piece.color);

                    this._moves = this._moves.slice(0, this._movePointer + 1);
                    this._moves.push({
                        fen: this.fen,
                        move: move,
                        color: piece.color
                    });
                    this._movePointer = this._moves.length - 1;

                    this.fireEvent("notStartOfGame");

                    this.fireEvent("move", move);

                    this.updateLocalStore();

                    this.restartEngine();

                }.bind(this));
                view.on('fen', function (fen) {
                    if (fen !== this.fen) {
                        this.fen = fen;
                        this.resetMoves();
                        this.onFenUpdated();
                        this.lastMove = undefined;
                        this.fireEvent("startOfGame");
                        this.fireEvent("endOfBranch");

                    }
                }.bind(this));
                view.on("clickSquare", this.clickSquare.bind(this));
                view.on("arrowStart", this.arrowStart.bind(this));
                view.on("arrowEnd", this.arrowEnd.bind(this));
                view.on("arrowMove", this.arrowMove.bind(this));

                break;
            case 'metadata.FenField':
                this._fenField = view;
                view.on("change", function (fen, el) {
                    if (this.validateFen(fen)) {
                    } else {
                        el.val(this.defFen);
                    }
                }.bind(this));
                break;
            case window.chess.Views.buttonbar.bar:

                if (!view.name) {
                    this._buttonBar = view;
                    view.on("comp", function () {
                        this.toggleCompMode();
                    }.bind(this));
                    view.on('flip', function () {
                        this.views.board.showFen(this.fen);
                        this.views.board.flip();
                    }.bind(this));
                    view.on("previous", this.keyBack.bind(this));
                    view.on("next", this.keyNext.bind(this));
                    view.on("start", this.toStart.bind(this));
                    view.on("end", this.toEnd.bind(this));
                    view.on("board", function(){
                        this.views.board.showFen(this.defFen);
                    }.bind(this));
                    view.enableButton('board');

                } else {
                    view.enableButton('enter');
                    view.on("enter", function () {
                        var fen = this._fenField.val();
                        if (this.validateFen(fen)) {
                            this.views.board.showFen(fen);
                        }
                    }.bind(this));
                }
                break;
        }
        return true;
    },
    _fenField: undefined,
    defFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
});