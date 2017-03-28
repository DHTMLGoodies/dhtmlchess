chess.view.board.ArrowNode = new Class({
    Extends: ludo.svg.Node,

    squareSize:60,
    /*
     * Width of arrow head
     */
    arrowWidth:24,
    /*
     * Height of arrow head
     */
    arrowHeight:35,
    /*
     * Width of arrow line
     */
    lineWidth:10,
    /*
     * Offset at arrow end(+ value = smaller arrow, measured from center of square)
     */
    offsetEnd:15,
    /*
     * Offset at start of arrow (positive value = smaller arrow - measured from center of square)
     */
    offsetStart:0,
    /*
     * Size of rounded edge
     */
    roundEdgeSize:8,
    /*
     * 0 = 90 degrees from line to left and right tip of arrow, positive value = less than 90 degrees
     */
    arrowOffset:0,
    
    arrowPaint:undefined,


    initialize: function (properties) {
        this.parent('path', properties);
    },

    showArrow:function(fromSquare, toSquare, boardSize, flip){
        this.set('d', chess.util.CoordinateUtil.arrowPath(fromSquare, toSquare, {}, boardSize, flip));
    }
    
    
});