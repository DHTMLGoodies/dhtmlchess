/**
 * Promotion dialog which will be displayed when controller fires the verifyPromotion event. Which piece to promote to
 * is chosen by clicking on images illustrating queen, rook, knight and bishop.
 * @submodule Dialog
 * @namespace chess.view.dialog
 * @class Promote
 * @extends dialog.Dialog
 */
chess.view.dialog.Promote = new Class({
    Extends: chess.view.dialog.Dialog,
    module: 'chess',
    submodule: 'dialogPromote',
    layout: {
        type: 'grid',
        columns: 2,
        rows: 2,
        width: 300,
        height: 330
    },
    hidden: true,
    title: 'Promote to',
    pieces: [],
    move: undefined,
    autoRemove: false,

    __children: function () {
        var t = 'chess.view.dialog.PromotePiece';
        return [
            {
                type: t,
                piece: 'q',
                layout: {x: 0, y: 0}
            },
            {
                type: t,
                piece: 'r',
                layout: {x: 1, y: 0}
            },
            {
                type: t,
                piece: 'b',
                layout: {x: 0, y: 1}
            },
            {
                type: t,
                piece: 'n',
                layout: {x: 1, y: 1}
            }
        ]

    },

    __construct: function (config) {

        this.parent(config);
    },

    setController: function (controller) {
        this.parent(controller);

        this.controller.on('verifyPromotion', this.showDialog.bind(this));


    },

    __rendered: function () {
        this.parent();
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].addEvent('click', this.clickOnPiece.bind(this));
        }
    },

    setColor: function (color) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].setColor(color);
        }

    },

    clickOnPiece: function (piece) {
        this.move.promoteTo = piece;
        this.fireEvent('promote', this.move);
        this.hide();
    },

    showDialog: function (model, move) {
        this.parent();
        this.move = move;
        this.setColor(model.getColorToMove());

    }
});

chess.view.dialog.PromotePiece = new Class({
    Extends: ludo.View,
    type: 'chess.view.dialog.PromotePiece',
    piece: undefined,
    framed: true,
    __construct: function (config) {
        this.parent(config);
        this.piece = config.piece
    },

    __rendered: function () {
        this.parent();
        this.$e.addClass('dhtml-chess-promote-piece');
        this.$e.on('click', this.clickOnPiece.bind(this));

    },

    setColor: function (color) {
        var e = this.$e;
        var p = this.piece;
        e.removeClass('dhtml-chess-promote-white-' + p);
        e.removeClass('dhtml-chess-promote-black-' + p);
        e.addClass('dhtml-chess-promote-' + color + '-' + p);
    },

    clickOnPiece: function () {
        this.fireEvent('click', this.piece);
    }
});