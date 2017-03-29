chess.view.board.ArrowNode = new Class({
    Extends: ludo.svg.Node,

    initialize: function (properties) {
        this.parent('path', properties);
    },

    showArrow:function(fromSquare, toSquare, boardSize, flip){
        this.set('d', chess.util.CoordinateUtil.arrowPath(fromSquare, toSquare, {}, boardSize, flip));
    }
    
    
});