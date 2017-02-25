chess.computer.Elo = new Class({

    K: 30,
    PROVISIONAL: 8,

    db: undefined,

    MIN_ELO: 800,
    clearAll: function () {
        this.db.empty();
    },


    initialize: function () {
        this.db = ludo.getLocalStorage();
    },

    hasPlayedBefore: function () {
        return this.db.get('played', '0') == '1';
    },

    getGameType: function (gameTime, inc) {
        var t = gameTime + (inc * 30);
        if (t < 60 * 3)return "bullet";
        if (t <= 60 * 8) return "blitz";
        return "classical";
    },

    getEloByTime: function (time, inc) {
        return this.getElo(this.getGameType(time, inc));
    },

    getElo: function (gameType) {
        return Math.max(this.MIN_ELO, this.db.getNumeric('elo' + gameType, 1200));
    },

    /**
     *
     * @param {int} result result as -1 for loss 0 for draw and 1 for win
     * @param againstElo
     * @param gameType
     * @param myColor
     */
    saveResult: function (result, againstElo, gameType, myColor) {

        this.db.save('played', '1');
        var c = this.incrementGames(gameType);
        var newElo;
        if (c <= this.PROVISIONAL) {
            var prov = this.db.get('provisional' + gameType, []);
            var e = result == -1 ? againstElo - 400 : result == 0 ? againstElo : againstElo + 400;
            e = Math.max(this.MIN_ELO, e);
            prov.push(e);

            this.db.save('provisional' + gameType, prov);
            var sum = 0;
            jQuery.each(prov, function (i, val) {
                sum += val;
            });
            newElo = Math.max(this.MIN_ELO, sum / prov.length);
        } else {
            var elo = this.getElo(gameType);
            if (myColor == 'black') {
                againstElo *= 1.05;
            } else {
                againstElo -= (againstElo * 0.05);
            }
            var adjustment = this.getRatingAdjustment(elo, againstElo, result);
            newElo = elo + adjustment;
        }

        return this.db.save('elo' + gameType, newElo);
    },

    getRatingAdjustment: function (eloW, eloB, result) {

        result += 1;
        result /= 2;

        var expected = this.getExpectedScore(eloW, eloB);

        return this.K * (result - expected);

    },

    getExpectedScore: function (ratingA, ratingB) {
        var qa = Math.pow(10, ratingA / 400);
        var qb = Math.pow(10, ratingB / 400);
        return qa / (qa + qb);
    },

    incrementGames: function (gameType) {
        var c = this.countGames(gameType) + 1;
        this.db.save('games' + gameType, c);
        return c;
    },

    countGames: function (gameType) {
        return this.db.getNumeric('games' + gameType, 0);
    }
});

chess.computer.Clock = new Class({

    Extends: Events,

    time: undefined,

    increment: undefined,

    turn: 'white',

    savedTime: undefined,

    started: false,

    initialize: function () {
        this.tick();
    },

    tick: function () {
        if (this.started) {
            this.validateTime();
            this.onChange();
        }
        this.tick.delay(100, this);

    },

    stop: function () {
        this.time[this.turn] = this.getTime(this.turn);
        this.started = false;
        this.savedTime = new Date().getTime();
        this.onChange();
    },

    validateTime: function () {
        var t = this.getTime(this.turn);
        if (t == 0) {
            this.time[this.turn] = this.getTime(this.turn);
            this.onChange();
            this.fireEvent('end', this.turn);
            this.started = false;
        }
    },

    wTime: function () {
        return this.getTime('white');
    },

    bTime: function () {
        return this.getTime('black');
    },

    inc: function () {
        return this.increment;
    },

    setTime: function (time, increment) {
        increment = increment || 0;

        this.time = {};

        this.time.white = time * 1000;
        this.time.black = time * 1000;
        this.increment = increment * 1000;

        this.onChange();
    },

    start: function (time, increment) {
        if (arguments.length == 2) {
            this.setTime(time, increment);
        }
        this.turn = 'white';
        this.savedTime = new Date().getTime();
        this.started = true;

        this.onChange();
    },

    tap: function () {
        this.time[this.turn] = this.getTime(this.turn) + this.increment;
        this.turn = this.turn == 'white' ? 'black' : 'white';
        this.savedTime = new Date().getTime();
        this.onChange();
    },

    getTime: function (color) {
        var t = this.time[color];
        if (this.turn == color && this.started) {
            t -= new Date().getTime() - this.savedTime;
        }
        return Math.max(0, t);
    },

    onChange: function () {
        this.fireEvent('change', [this.turn, this.timeAsObject('white'), this.timeAsObject('black')]);
    },

    timeAsObject: function (color) {
        var t = this.getTime(color);

        var decimals = t < 10000 ? parseInt((t / 100) % 10) : undefined
            , seconds = parseInt((t / 1000) % 60)
            , minutes = parseInt((t / (1000 * 60)) % 60)
            , hours = parseInt((t / (1000 * 60 * 60)) % 24);
        var ret = {
            h: hours,
            m: this.pad(minutes, 2),
            s: this.pad(seconds, 2),
            d: decimals,
            totalSeconds: t / 1000
        };

        ret.string = (ret.h > 0 ? ret.h + ':' : '') + ret.m + ':' + ret.s + (ret.totalSeconds < 10 ? ':' + ret.d : '');

        return ret;

    },

    pad: function (num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

});


chess.computer.ClockView = new Class({
    Extends: ludo.View,
    color: undefined,
    module: 'chess',
    submodule: 'computer.clockview',
    elo: undefined,
    pos: undefined,

    lastColor: undefined,

    __construct: function (config) {
        this.parent(config);
        this.color = config.color;
        this.pos = config.pos;
    },

    setColor: function (color) {
        this.color = color;
        this.$b().removeClass('clock-turn');
        this.lastColor = undefined;
    },

    __rendered: function () {
        this.parent();
        this.$e.addClass('dhtml-chess-clock');
        this.showTime();
    },


    setController: function (controller) {
        this.parent(controller);
        controller.clock.on('change', this.update.bind(this));
        this.elo = controller.elo;
    },

    update: function (color, timeWhite, timeBlack) {
        var val = this.color == 'white' ? timeWhite : timeBlack;
        if (color != this.lastColor) {
            this.$b().removeClass('clock-turn');
            if (color == this.color) {
                this.$b().addClass('clock-turn');
            }
        }

        this.$b().html(val.string);
        this.lastColor = color;
    },

    resize: function (size) {
        this.parent(size);

        this.getBody().css({
            'line-height': size.height + 'px',
            'font-size': (size.height * 0.6) + 'px'
        })
    },

    showTime: function (time) {
        if (time == undefined) {
            this.getBody().html('00:00');
        } else {

        }

    }
});

chess.computer.GameDialog = new Class({
    Extends: ludo.dialog.Dialog,
    module: 'chess',
    submodule: 'chess.computer.gamedialog',
    autoRemove: false,
    layout: {
        width: 300,
        height: 300,
        type: 'table', simple: true,
        columns: [{
            weight: 1
        }, {width: 50}, {
            weight: 1
        }, {width: 50}]
    },
    css: {
        padding: 10
    },
    buttonConfig: 'Ok',

    title: chess.getPhrase('New Game'),
    elo: undefined,
    color: undefined,

    __construct: function (config) {
        this.parent(config);
        this.elo = new chess.computer.Elo();
    },
    __rendered: function () {
        this.parent();
        this.$b().addClass('dhtml-chess-comp-dialog');
        this.on('ok', this.onNewGame.bind(this));
        this.selectColor('white');

        this.child['color-white'].$b().on('click', function () {
            this.selectColor('white');
        }.bind(this));
        this.child['color-black'].$b().on('click', function () {
            this.selectColor('black');
        }.bind(this));
    },

    selectColor: function (color) {
        this.color = color;
        var cls = 'dhtml-chess-comp-dialog-selected-color';
        this.child['color-black'].$b().removeClass(cls);
        this.child['color-white'].$b().removeClass(cls);
        this.child['color-' + color].$b().addClass(cls);
    },

    __children: function () {
        return [
            {
                type: 'form.Label',
                label: chess.getPhrase('Your color:'),
                layout: {
                    colspan: 4
                }
            },
            {
                name: 'color-white',
                layout: {
                    colspan: 2,
                    height: 50
                },
                elCss: {
                    'margin': 2
                },
                css: {
                    'border-radius': '5px',
                    'background-color': '#CCC',
                    'color': '#444',
                    'cursor': 'pointer',
                    'line-height': '45px',
                    'border': '2px solid transparent',
                    'text-align': 'center'
                },
                html: chess.getPhrase('White')
            }, {
                name: 'color-black',
                layout: {
                    colspan: 2,
                    height: 50
                },
                elCss: {
                    'margin': '2px'
                },
                css: {
                    'border-radius': '5px',
                    'cursor': 'pointer',
                    'background-color': '#777',
                    'color': '#fff',
                    'line-height': '45px',
                    'border': '3px solid transparent',
                    'text-align': 'center'
                },
                html: chess.getPhrase('Black')
            },
            {
                type: 'form.Label', label: chess.getPhrase('Opponent rating:'), labelFor: 'name',
                layout: {
                    colspan: 2
                }
            },
            {
                type: 'form.Number', name: 'stockfishElo', placeholder: chess.getPhrase('ex: 1400')
            },
            {
                layout: {colspan: 1}
            },
            {
                layout: {colspan: 4, height: 20}
            },
            {
                type: 'form.Label', label: chess.getPhrase('Time'), css: {'font-size': '1.3em'},
                layout: {
                    colspan: 2
                }

            },
            {
                type: 'form.Label', label: chess.getPhrase('Increment'),
                layout: {
                    colspan: 2
                }
            },
            {
                type: 'form.Select', name: 'game-time',
                value: 5,
                dataSource: {
                    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 30, 45, 60, 90, 120]
                },
                listeners: {
                    'change': this.onTimeChange.bind(this)
                }
            },
            {
                html: chess.getPhrase('min'),
                css: {
                    padding: 5
                }
            },
            {
                type: 'form.Select', name: 'game-inc',
                value: 3,
                dataSource: {
                    data: [0, 1, 2, 3, 5, 10, 12, 15, 30]
                },
                listeners: {
                    'change': this.onTimeChange.bind(this)
                }
            },
            {
                html: chess.getPhrase('sec'),
                css: {
                    padding: 5
                }
            },
            {
                elCss: {
                    'margin-top': 10
                },
                css: {
                    'text-align': 'center'
                },
                name: 'your-elo',
                layout: {colspan: 4},
                html: 'Your ratings'

            }

        ]
    },

    onTimeChange: function () {
        var min = this.child['game-time'].val() / 1;
        var inc = this.child['game-inc'].val() / 1;

        var gameType = this.elo.getGameType(min * 60, inc);
        var elo = Math.round(this.elo.getElo(gameType));
        this.child['your-elo'].html('Your rating: ' + elo + ' (' + gameType + ')');


        this.child['stockfishElo'].val(elo);
    },

    setController: function (controller) {
        this.parent(controller);
        this.controller.on('newgamedialog', this.show.bind(this));
    },

    show: function () {
        this.parent();
        this.onTimeChange();
    },

    onNewGame: function () {
        this.fireEvent('newGame', {
            time: this.child['game-time'].val() / 1,
            inc: this.child['game-inc'].val() / 1,
            elo: this.child['stockfishElo'].val() / 1,
            color: this.color
        });
    }

});

chess.computer.DialogTimeButton = new Class({
    Extends: ludo.View,

    __construct: function (config) {
        this.parent(config);
        this.time = config.time;
    }
});

chess.computer.ComputerStatusDialog = new Class({
    Extends: ludo.dialog.Dialog,
    module: 'chess',
    modal: true,
    submodule: 'chess.computer.computerstatusdialog',
    title: 'Loading Stockfish JS',
    updateFn: undefined,
    layout: {
        type: 'relative',
        width: 300, height: 100
    },
    __children: function () {
        return [
            {
                name: 'status',
                layout: {
                    width: 'matchParent',
                    centerVertical: true
                },
                css: {
                    'text-align': 'center'
                }
            }
        ]
    },

    setController: function (controller) {
        this.parent(controller);
        this.updateFn = function (status, done) {
            this.child['status'].html(status);
            if (done) {
                this.hide.delay(100, this);
            }
        }.bind(this);
        controller.on('enginestatus', this.updateFn);
    },

    remove: function () {
        if (this.updateFn) {
            this.controller.off('enginestatus', this.updateFn);
            this.updateFn = undefined;
        }
        this.parent();
    }
});


chess.computer.GameOverDialog = new Class({
    Extends: ludo.dialog.Dialog,
    module: 'chess',
    submodule: 'chess.computer.gameoverdialog',
    autoRemove: false,
    hidden: true,
    layout: {
        width: 300, height: 200,
        type: 'linear', orientation: 'vertical'
    },

    buttonBar: {
        children: [
            {
                name: 'rematch',
                value: chess.getPhrase('Rematch')
            },
            {
                value: chess.getPhrase('Exit')
            }
        ]
    },

    __children: function () {
        return [
            {
                name: 'title',
                css: {
                    'margin-top': 15,
                    'text-align': 'center',
                    'font-weight': 'bold',
                    'font-size': '1.5em',
                    'line-height': '25px'
                },
                layout: {
                    height: 50
                }
            },
            {
                css: {
                    'text-align': 'center'
                },
                name: 'rating'
            }
        ]
    },

    __rendered: function () {
        this.parent();
        this.getButton('rematch').on('click', this.onNewGameClick.bind(this));
    },

    onNewGameClick: function () {
        this.fireEvent('newgame');

    },

    setController: function (controller) {
        this.parent(controller);
        controller.on('gameover', this.onGameOver.bind(this));
    },

    onGameOver: function (myResult, oldElo, newElo) {
        this.show();

        var title = myResult == 1 ? chess.getPhrase('You Won')
            : myResult == 0 ? chess.getPhrase('Game Drawn')
            : chess.getPhrase('You lost');

        this.setTitle(title);

        this.child['title'].$b().removeClass('title-win');
        this.child['title'].$b().removeClass('title-draw');
        this.child['title'].$b().removeClass('title-loss');


        this.child['title'].html(title);
        var ratingChange = newElo - oldElo;
        if (myResult == 0) {
            this.child['title'].$b().addClass('title-draw');
        }
        else if (myResult == 1) {
            this.child['title'].$b().addClass('title-win');
        } else {
            this.child['title'].$b().addClass('title-loss');

        }
        if (ratingChange > 1) {
            ratingChange = '<span class="rating-change-win">+' + ratingChange + '</span>';
        } else if (ratingChange == 0) {
            ratingChange = '<span class="rating-change-draw">' + ratingChange + '</span>';
        }
        else {
            ratingChange = '<span class="rating-change-loss">' + ratingChange + '</span>';
        }
        this.child['rating'].html(chess.getPhrase('New rating') + ': <span class="new-rating">' + newElo + '</span> (' + ratingChange + ')');


    }

});