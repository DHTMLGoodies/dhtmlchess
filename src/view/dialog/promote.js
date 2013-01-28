/**
 * Promotion dialog which will be displayed when controller fires the verifyPromotion event. Which piece to promote to
 * is chosen by clicking on images illustrating queen, rook, knight and bishop.
 * @submodule Dialog
 * @namespace chess.view.dialog
 * @class Promote
 * @extends dialog.Dialog
 */
chess.view.dialog.Promote = new Class({
    Extends:ludo.dialog.Dialog,
    module:'chess',
    submodule:'dialogPromote',
    layout:{
		type:'linear',
		orientation: 'vertical'
	},
    width:300,
    hidden: true,
    height:330,
    title : 'Promote to',
    pieces : [],
    move : undefined,
    autoDispose : false,

    setController:function (controller) {
        this.parent(controller);
        this.controller.addEvent('verifyPromotion', this.showDialog.bind(this))
    },

    ludoRendered:function () {
        this.parent();

        this.row1 = this.addChild({ weight:1, layout:'cols' });
        this.row2 = this.addChild({ weight:1, layout:'cols' });

        var pieces = ['queen', 'rook', 'bishop', 'knight'];
        var parent = this.row1;
        for (var i = 0; i < pieces.length; i++) {
            if (i > 1) {
                parent = this.row2;
            }
            var el =parent.addChild({
                type:'chess.view.dialog.PromotePiece',
                piece:pieces[i],
                weight:1,
                listeners:{
                    click:this.clickOnPiece.bind(this)
                }
            });
            this.pieces.push(el);
        }
    },

    setColor : function(color){
        for(var i=0;i<this.pieces.length;i++){
            this.pieces[i].setColor(color);
        }

    },

    clickOnPiece:function (piece) {
        this.move.promoteTo = piece;
		/**
		 * Event fired after promoted piece type has been selected. the promoteTo property of the move is updated
		 * @event promote
		 * @param {chess.model.Move} updatedMove
		 */
        this.fireEvent('promote', this.move);
        this.hide();
    },

    showDialog : function(model, move){
        this.move = move;
        this.setColor(model.getColorToMove());
        this.show();
    }
});

chess.view.dialog.PromotePiece = new Class({
    Extends:ludo.View,
    type:'chess.view.dialog.PromotePiece',
    piece:undefined,
    framed : true,
    ludoConfig:function (config) {
        this.parent(config);
        this.piece = config.piece
    },

    ludoRendered : function() {
        this.parent();
        this.getEl().addClass('chess-promote-piece');
        this.getEl().addEvent('click', this.clickOnPiece.bind(this));

    },

    setColor : function(color) {
        this.getEl().removeClass('chess-promote-white-' + this.piece);
        this.getEl().removeClass('chess-promote-black-' + this.piece);
        this.getEl().addClass('chess-promote-' + color + '-' + this.piece);
    },

    clickOnPiece : function(){
        this.fireEvent('click', this.piece);
    }
});