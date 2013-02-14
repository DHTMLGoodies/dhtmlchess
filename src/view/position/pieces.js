/**
 * Piece panel for the position setup dialog
 * @namespace chess.view.position
 * @class Pieces
 * @extends View
 */
chess.view.position.Pieces = new Class({
    Extends:ludo.View,
    layout:'rows',
    pieceColor:'white',
    pieceLayout:'alphapale',
    pieceTypes:['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'],
    pieces : {},

    ludoConfig:function (config) {
        this.pieceColor = config.pieceColor || this.pieceColor;
        this.pieceLayout = config.pieceLayout || this.pieceLayout;
        this.parent(config);
    },

    ludoRendered:function () {
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
    pieceType:'pawn',
    pieceLayout:'pawn',
    size:45,
    height:55,

    ludoConfig:function (config) {
        this.pieceColor = config.pieceColor || this.pieceColor;
        this.pieceType = config.pieceType || this.pieceType;
        this.pieceLayout = config.pieceLayout || this.pieceLayout;
        this.parent(config);
    },

    ludoRendered:function () {
        this.parent();
        var piece = this.els.piece = new Element('div');
        piece.setStyles({
            'background-image':'url(' + ludo.config.getDocumentRoot() + '/images/' + this.pieceLayout + this.size + this.getColorCode() + this.getTypeCode() + '.png)',
            'background-position':'center center',
            'background-repeat':'no-repeat',
            'cursor':'pointer'
        });

        piece.setProperty('pieceType', this.pieceType);
        piece.addEvent('click', this.selectPiece.bind(this));
        this.getBody().adopt(piece);
        piece.addClass('position-setup-piece');
        piece.addEvent('mouseenter', this.mouseEnterPiece.bind(this));
        piece.addEvent('mouseleave', this.mouseLeavePiece.bind(this));
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
        var c = this.getBody();
        var size = c.getSize();
        size.x -= (ludo.dom.getBW(c) + ludo.dom.getPW(c) + ludo.dom.getBW(this.els.piece) + ludo.dom.getMW(this.els.piece) + ludo.dom.getPW(this.els.piece));
        size.y -= (ludo.dom.getBH(c) + ludo.dom.getPH(c) + ludo.dom.getBH(this.els.piece) + ludo.dom.getMH(this.els.piece) + ludo.dom.getPH(this.els.piece));

        this.els.piece.setStyles({
            width : size.x,
            height : size.y
        });
    },

    getColorCode:function () {
        if (this.pieceColor == 'white') return 'w';
        return 'b';
    },
    getTypeCode:function () {
        switch (this.pieceType) {
            case 'pawn':
            case 'rook':
            case 'bishop':
            case 'queen':
            case 'king':
                return this.pieceType.substr(0, 1).toLowerCase();
            case 'knight':
                return 'n';
            default:
                return undefined;
        }
    },
    selectPiece:function (e) {
        var obj = {
            color:this.pieceColor,
            type:e.target.getProperty('pieceType')
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