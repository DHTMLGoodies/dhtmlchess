chess.computer.Elo = new Class({

    K: 30,
    PROVISIONAL: 8,

    db: undefined,

    initialize: function () {
        this.db = ludo.getLocalStorage();
    },

    getGameType: function (gameTime, inc) {
        var t = gameTime + (inc * 30);
        if (t < 60 * 3)return "bullet";
        if (t <= 60 * 8) return "blitz";
        return "classical";
    },
    
    getElo: function (gameType) {
        return this.db.getNumeric('elo' + gameType, 1200);
    },

    /**
     *
     * @param {int} result result as -1 for loss 0 for draw and 1 for win
     * @param againstElo
     * @param gameType
     * @param myColor
     */
    saveResult: function (result, againstElo, gameType, myColor) {
        var c = this.incrementGames(gameType);
        var newElo;
        if (c <= this.PROVISIONAL) {
            var prov = this.db.get('provisional' + gameType, []);
            var e = result == -1 ? againstElo - 400 : result == 0 ? againstElo : againstElo + 400;
            prov.push(e);

            this.db.save('provisional' + gameType, prov);
            var sum = 0;
            jQuery.each(prov, function (i, val) {
                sum += val;
            });
            newElo = sum / prov.length;
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

    started:false,

    initialize:function(){
        this.tick();
    },

    tick:function(){

        if(this.started){
            this.validateTime();

            this.onChange();
        }

        this.tick.delay(100, this);

    },

    validateTime:function(){
        var t = this.getTime(this.turn);
        if(t == 0){
            this.fireEvent('end', [this.timeAsObject('white'), this.timeAsObject('black')]);
            this.started = false;
        }
    },

    setTime: function (time, increment) {
        increment = increment || 0;

        this.time = {};

        this.time.white = time * 1000;
        this.time.black = time * 1000;
        this.increment = increment * 1000;
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
        if (this.turn == color) {
            t -= new Date().getTime() - this.savedTime;
        }
        return Math.max(0, t);
    },

    onChange:function(){
        this.fireEvent('change', [this.timeAsObject('white'), this.timeAsObject('black')]);
    },

    timeAsObject: function(color){
        var t = this.getTime(color);

        var decimals = t < 10000 ? parseInt((t/100)%10) : undefined
            , seconds = parseInt((t/1000)%60)
            , minutes = parseInt((t/(1000*60))%60)
            , hours = parseInt((t/(1000*60*60))%24);
        return {
            h :  hours,
            m : this.pad(minutes, 2),
            s : this.pad(seconds, 2),
            d : decimals,
            totalSeconds: t / 1000
        }
    },

    pad: function (num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

});
