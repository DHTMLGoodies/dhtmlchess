/**
 * Piece panel for the position setup dialog
 * @namespace chess.view.position
 * @class Pieces
 * @extends View
 */
chess.view.position.Pieces = new Class({
    Extends:ludo.View,
    pieceColor:'white',
    pieceLayout:'alphapale',
    pieceTypes:['k', 'q', 'r', 'b', 'n', 'p'],
    pieces : {},

    __construct:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['pieceColor','pieceLayout']);
    },

    __rendered:function () {
        this.parent();
        for (var i = 0; i < this.pieceTypes.length; i++) {
            this.pieces[this.pieceTypes[i]] = this.addChild({
                type:'chess.view.position.Piece',
                pieceType:this.pieceTypes[i],
                pieceLayout:this.pieceLayout,
                pieceColor:this.pieceColor,
                listeners:{
                    selectpiece:this.selectPiece.bind(this)
                }
            });
        }
    },

    clearSelections : function() {
        for(var pieceType in this.pieces){
            if(this.pieces.hasOwnProperty(pieceType)){
                this.pieces[pieceType].clearSelectionCls();
            }
        }
    },

    addSelection : function(pieceType){
        this.pieces[pieceType].addSelectionCls();
    },

    selectPiece:function (obj) {
        this.fireEvent('selectpiece', obj);
    }
});

chess.view.position.Piece = new Class({
    Extends:ludo.View,
    pieceColor:'white',
    pieceType:'p',
    pieceLayout:'p',
    size:45,
    height:55,

    __construct:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['pieceColor','pieceType','pieceLayout']);
        this.parent(config);
    },

    __rendered:function () {
        this.parent();
        var piece = this.els.piece = jQuery('<div>');
        piece.css({
            'background-image':'url(' + ludo.config.getDocumentRoot() + '/images/' + this.pieceLayout + this.size + this.getColorCode() + this.getTypeCode() + '.png)',
            'background-position':'center center',
            'background-repeat':'no-repeat',
            'cursor':'pointer'
        });

        piece.attr('pieceType', this.pieceType);
        piece.on('click', this.selectPiece.bind(this));
        this.getBody().append(piece);
        piece.addClass('position-setup-piece');
        piece.on('mouseenter', this.mouseEnterPiece.bind(this));
        piece.on('mouseleave', this.mouseLeavePiece.bind(this));
        this.resizePiece.delay(50, this);
    },

    mouseEnterPiece : function() {
        this.els.piece.addClass('position-setup-piece-over');
        this.resizePiece();
    },

    mouseLeavePiece : function() {
        this.els.piece.removeClass('position-setup-piece-over');
        this.resizePiece();
    },

    resizePiece : function() {
        var b = this.getBody();
        var size = { x : b.width(), y: b.height() };

        size.x -= this.getPadding('x');
        size.y -= this.getPadding('y');

        this.els.piece.css({
            width : size.x,
            height : size.y
        });
    },
    piecePadding:{
        width:undefined,height:undefined
    },
    getPadding:function(type){

        if(this.piecePadding[type] === undefined){
            var c = this.getBody();
            switch(type){
                case "x":
                    this.piecePadding[type] = (ludo.dom.getBW(c) + ludo.dom.getPW(c) + ludo.dom.getMBPW(this.els.piece));
                    break;
                default:
                    this.piecePadding[type] = (ludo.dom.getBH(c) + ludo.dom.getPH(c) + ludo.dom.getMBPH(this.els.piece));

            }

        }
        return this.piecePadding[type];
    },

    getColorCode:function () {
        return this.pieceColor === 'white' ? 'w' : 'b';
    },

    getTypeCode:function () {
        return this.pieceType === 'n' ? 'n' : this.pieceType ? this.pieceType.substr(0,1).toLowerCase() : undefined;
    },
    selectPiece:function (e) {
        var obj = {
            color:this.pieceColor,
            pieceType:jQuery(e.target).attr('pieceType')
        };
        this.fireEvent('selectpiece', obj);
    },

    clearSelectionCls : function() {
        this.els.piece.removeClass('position-setup-selected-piece');
        this.resizePiece();
    },
    addSelectionCls : function() {
        this.els.piece.addClass('position-setup-selected-piece');
        this.resizePiece();
    }
});