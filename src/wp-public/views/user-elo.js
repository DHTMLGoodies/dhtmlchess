chess.UserElo = new Class({
    Extends: ludo.View,
    elo: undefined,
    cls: 'wpc-user-info-elo',

    val: function (elo) {
        elo = Math.floor(elo);
        var suff = '';
        if (this.elo && elo != this.elo) {
            var diff = elo - this.elo;
            suff = diff > 0 ? '+' + diff : diff;
            var cls = diff > 0 ? 'wpc-positve-elo' : 'wpc-negative-elo';
            suff = ' (<span class="' + cls + '">' + suff + '</span>)';
        }

        this.html(elo + suff);
        this.elo = elo;
    },

    clearIncs: function () {
        if(this.elo)this.val(this.elo);
    }


});
