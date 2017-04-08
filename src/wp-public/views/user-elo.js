chess.UserElo = new Class({
    Extends: ludo.View,
    elo: undefined,
    cls: 'wpc-user-info-elo',

    suffix:undefined,

    val: function (elo) {
        elo = Math.floor(elo);
        if(!this.elo)this.elo = elo;
        var suff = '';
        if (this.elo && elo != this.elo) {
            var diff = elo - this.elo;
            suff = diff > 0 ? '+' + diff : diff;
            var cls = diff > 0 ? 'wpc-positve-elo' : 'wpc-negative-elo';
            suff = ' (<span class="' + cls + '">' + suff + '</span>)';
        }

        this.html(this.elo + suff);

        if(elo != this.elo){
            this.animateElo(this.elo, elo);
        }
        this.elo = elo;

        this.suffix = suff;
    },

    animateElo:function(from, to){
        this.html(Math.round(from) + this.suffix);
        if(from != to){
            from += to > from ? 1 : -1;
            this.animateElo.delay(17, this, [from, to]);
        }
    },

    clearIncs: function () {
        if(this.elo)this.val(this.elo);
    }
});