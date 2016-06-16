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
		type:'grid',
		columns:2,
        rows:2
	},
    width:300,
    hidden: true,
    height:330,
    title : 'Promote to',
    pieces : [],
    move : undefined,
    autoDispose : false,

    children:[
        {
            type:'chess.view.dialog.PromotePiece',
            piece:'queen'
        },
        {
            type:'chess.view.dialog.PromotePiece',
            piece:'rook'
        },
        {
            type:'chess.view.dialog.PromotePiece',
            piece:'bishop'
        },
        {
            type:'chess.view.dialog.PromotePiece',
            piece:'knight'
        }
    ],

    setController:function (controller) {
        this.parent(controller);
        this.controller.addEvent('verifyPromotion', this.showDialog.bind(this))
    },

    ludoRendered:function () {
        this.parent();
        for(var i=0;i<this.children.length;i++){
            this.children[i].addEvent('click', this.clickOnPiece.bind(this));
        }
    },

    setColor : function(color){
        for(var i=0;i<this.children.length;i++){
            this.children[i].setColor(color);
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
        this.show();
        this.move = move;
        this.setColor(model.getColorToMove());

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