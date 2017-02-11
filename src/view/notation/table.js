chess.view.notation.Table = new Class({
    Extends: chess.view.notation.Panel,
    type: 'chess.view.notation.Table',

    showContextMenu:false,

    
    ludoDOM:function(){
        this.parent();
        this.getEl().addClass('dhtml-chess-notation-table');
    },
    
    showEval:false,
    
    getMovesInBranch: function (branch, startPly, depth, branchIndex, countBranches) {
        this.comments = false;
        var ret = [];
        ret.push('<ol>');

        jQuery.each(branch, function(i, move){
            var ply = i + startPly;
            if(i == 0 && ply % 2 == 1){
                ret.push('<li><dt>' + ( Math.ceil(ply / 2)) + '</dt><dd>&nbsp;</dd>');
            }
            if((ply % 2) == 0){
                if(i> 0){
                    ret.push('</li>');
                }
                ret.push('<li>');

                ret.push('<dt>' + (1 + Math.ceil(ply / 2)) + '</dt>');
            }

            move.eval = ((Math.random() * 4) - (Math.random() * 4));
            ret.push('<dd>' + this.getDomTextForAMove(move) + "</dd>");

        }.bind(this));
        ret.push('</li>');
        ret.push('</ol>');
        return ret;
    },

    appendMove:function(){
        this.showMoves(this.controller.currentModel);
        this.setCurrentMove(this.controller.currentModel);
    },

    addVariations:function(){
        // silent
    },

    getResultDOM:function(model){
        return '<p class="game-result">' + this.parent(model) + '</p>';
    }
});