chess.view.notation.Table = new Class({
    Extends: chess.view.notation.Panel,
    type: 'chess.view.notation.Table',

    showContextMenu: false,


    ludoDOM: function () {
        this.parent();
        this.$e.addClass('dhtml-chess-notation-table');
    },

    showEval: false,

    getMovesInBranch: function (branch, startPly, depth, branchIndex, countBranches) {
        this.comments = false;
        var ret = [];
        ret.push('<ol>');

        var c = 0;
        jQuery.each(branch, function (i, move) {
            if (move['m']) {
                var ply = c + startPly;
                if (c == 0 && ply % 2 == 1) {
                    ret.push('<li><dt>' + ( Math.ceil(ply / 2)) + '</dt><dd>&nbsp;</dd>');
                }
                if ((ply % 2) == 0) {
                    if (c > 0) {
                        ret.push('</li>');
                    }
                    ret.push('<li><dt>' + (1 + Math.ceil(ply / 2)) + '</dt>');
                }
                move.eval = ((Math.random() * 4) - (Math.random() * 4));
                ret.push('<dd>' + this.getDomTextForAMove(move) + "</dd>");
                c++;
            }


        }.bind(this));
        ret.push('</li></ol>');
        return ret;
    },

    appendMove: function () {
        this.showMoves(this.controller.currentModel);
        this.setCurrentMove(this.controller.currentModel);
    },

    scrollMoveIntoView: function (move) {
        if (!move)return;

        if (move.position == undefined) move = jQuery(move);
        if (!move.length)return;
        var moveTop = move.offset().top - this.$b().offset().top + this.$b().scrollTop();
        var oh = move.outerHeight();
        this._scrollIntoView(moveTop, oh);
    },

    addVariations: function () {
        // silent is golden
    },

    getResultDOM: function (model) {
        return '<p class="game-result">' + this.parent(model) + '</p>';
    }
});