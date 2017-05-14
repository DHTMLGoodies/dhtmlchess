/**
 * Position setup dialog
 * @namespace chess.view.position
 * @class Dialog
 * @extends ludo.dialog.Dialog
 */
chess.view.position.Dialog = new Class({
    Extends: ludo.dialog.Dialog,
    module: 'chess',
    submodule: 'positionSetup',
    autoRemove: false,
    autoHideOnBtnClick: false,
    width: 640,
    height: 450,
    title: chess.__('Position setup'),
    layout: {
        type: 'relative'
    },
    selectedPiece: undefined,
    closable: true,
    minimizable: false,
    resizable: false,
    positionValidator: undefined,

    position: {
        board: '',
        color: 'w',
        castling: 'KQkq',
        enPassant: '-',
        halfMoves: '0',
        fullMoves: '0'
    },

    __construct: function (config) {
        this.positionValidator = new chess.parser.PositionValidator();

        config.buttonBar = {
            align: 'left',
            children: [
                {
                    value: 'OK',
                    listeners: {
                        click: this.sendPosition.bind(this)
                    }
                },
                {
                    weight: 1
                },
                {
                    value: 'Reset',
                    listeners: {
                        click: this.resetBoard.bind(this)
                    }
                },
                {
                    value: 'Clear board',
                    listeners: {
                        click: this.clearBoard.bind(this)
                    }
                },
                {
                    value: 'Load fen',
                    listeners: {
                        click: this.showLoadFenDialog.bind(this)
                    }
                },
                {
                    value: 'Flip',
                    listeners: {
                        click: this.flipBoard.bind(this)
                    }
                },
                {
                    value: 'Cancel',
                    listeners: {
                        click: this.hide.bind(this)
                    }
                }
            ]
        };
        this.parent(config);

    },

    __rendered: function () {
        this.parent();

        this.board = this.addChild({
            type: 'chess.view.position.Board',
            id: 'boardContainer',
            autoResize: false,
            layout: {
                alignParentLeft: true,
                alignParentTop: true,
                width: 380,
                height: 380
            },
            elCss: {
                margin: 3
            },
            listeners: {
                setPosition: this.receivePosition.bind(this)
            }
        });

        this.pieces = {};
        this.pieces.white = this.addChild({
            type: 'chess.view.position.Pieces',

            layout: {
                height: 470,
                width: 55,
                type: 'linear',
                orientation: 'vertical',
                alignParentTop: true,
                fillDown: true,
                rightOf: 'boardContainer'
            },
            pieceColor: 'white',
            listeners: {
                selectpiece: this.selectPiece.bind(this)
            }
        });
        this.pieces.black = this.addChild({
            type: 'chess.view.position.Pieces',
            id: 'blackPieces',
            width: 55,
            pieceColor: 'black',
            listeners: {
                selectpiece: this.selectPiece.bind(this)
            },
            elCss:{
                'padding-right' : 4
            },
            layout: {
                height: 400,
                rightOf: this.pieces.white,
                type: 'linear',
                orientation: 'vertical'
            }
        });


        this.castling = this.addChild({
            type: 'chess.view.position.Castling',
            listeners: {
                change: this.receiveCastling.bind(this)
            },
            layout: {
                rightOf: 'blackPieces',
                width: 130,
                alignParentTop: true,
                height: 145
            }
        });

        this.sideToMove = this.addChild({
            type: 'chess.view.position.SideToMove',
            listeners: {
                change: this.receiveColor.bind(this)
            },
            layout: {
                sameWidthAs: this.castling,
                height: 100,
                below: this.castling,
                alignLeft: this.castling
            }
        });

        this.moveNumber = this.addChild({
            children: [
                {

                    type: 'form.Label', labelFor: 'moveNumber',
                    label: chess.__('Ply')
                },
                {
                    id:'positionMoveNumber',
                    name: 'moveNumber',
                    type: 'form.Number',
                    minValue: 1,
                    maxValue: 500,
                    required: true,
                    value: '1',
                    listeners: {
                        change: this.receiveFullMoves.bind(this)
                    }
                }
            ],
            layout: {
                type: 'table',
                columns: [{weight: 1}, {width: 40}],
                below: this.sideToMove,
                sameWidthAs: this.sideToMove,
                alignLeft: this.sideToMove,
                height: 25
            }
        });
        this.enPassant = this.addChild({
            children:[
                {
                    type: 'form.Label', labelFor: 'enPassant',
                    label: chess.__('En passant'),
                },
                {
                    id:'positionEnPassant',
                    type: 'form.Text',
                    name:'enPassant',
                    maxLength: 1,
                    required: false,
                    stretchField: false,
                    validateKeyStrokes: true,
                    regex: /[a-h]/g,
                    listeners: {
                        change: this.receiveEnPassant.bind(this)
                    }
                }
            ],

            layout: {
                type: 'table',
                columns: [{weight: 1}, {width: 40}],
                below: this.moveNumber,
                sameWidthAs: this.moveNumber,
                alignLeft: this.moveNumber,
                height: 25
            }
        });

    },
    receiveCastling: function (castling) {
        this.updatePosition('castling', castling);
    },
    receiveColor: function (color) {
        
        this.updatePosition('color', color);
    },
    receiveEnPassant: function (enPassant) {
        enPassant = enPassant || '-';
        this.updatePosition('enPassant', enPassant);
    },

    receiveFullMoves: function (fullMoves) {
        fullMoves = fullMoves || '0';
        this.updatePosition('fullMoves', fullMoves);
    },

    receivePosition: function (fen) {
        this.updatePosition('board', fen);
        this.position.board = fen;
    },

    updatePosition: function (key, value) {
        this.position[key] = value;
        var button = this.getButton('ok');
        if (this.positionValidator.isValid(this.getPosition())) {
            button.enable();
        } else {
            button.disable();
        }
    },

    getPosition: function () {
        var obj = this.position;
        return obj.board + ' ' + obj.color + ' ' + obj.castling + ' ' + obj.enPassant + ' ' + obj.halfMoves + ' ' + obj.fullMoves;
    },

    clearBoard: function () {
        this.board.clearBoard();
    },
    resetBoard: function () {
        this.board.resetBoard();
        this.castling.resetOptions();
        this.sideToMove.resetOptions();
        ludo.$('positionMoveNumber').val('0');
        ludo.$('positionEnPassant').val('');
    },
    sendPosition: function () {
        /**
         * @event setPosition
         * @param String FEN position
         */
        this.fireEvent('setPosition', this.getPosition());
        this.hide();
    },
    flipBoard: function () {
        this.board.flip();
    },
    selectPiece: function (obj) {
        this.pieces.white.clearSelections();
        this.pieces.black.clearSelections();
        if (this.selectedPiece && this.selectedPiece.pieceType == obj.pieceType && this.selectedPiece.color == obj.color) {
            this.selectedPiece = undefined;
            this.board.deleteSelectedPiece();
        } else {
            this.selectedPiece = obj;
            this.pieces[obj.color].addSelection(obj.pieceType);
            this.board.setSelectedPiece(obj);
        }

    },
    showLoadFenDialog: function () {
        new ludo.dialog.Prompt({
            layout:{
                width: 400,
                height: 140,
                centerIn:this.$e
            },
            css:{
                padding:4
            },
            resizable:false,
            html: chess.__('Paste fen into the text box below'),
            inputConfig: {
                stretchField: true
            },
            modal: true,
            label: chess.__('FEN'),
            title: chess.__('Load fen'),
            listeners: {
                'ok': this.loadFen.bind(this)
            }
        });
    },

    loadFen: function (fen) {
        if (this.isValidFen(fen)) {

            this.positionValidator.setFen(fen);

            this.sideToMove.setColor(this.positionValidator.getColor());
            this.castling.val(this.positionValidator.getCastle());
            ludo.$('positionMoveNumber').val(this.positionValidator.getFullMoves());
            ludo.$('positionEnPassant').val(this.positionValidator.getEnPassantSquare());
            this.board.showFen(fen);
        }
    },

    isValidFen: function (fen) {

        try{
            parser = new chess.parser.FenParser0x88(fen);
            parser.getValidMovesAndResult();
        }catch(e){
            new ludo.Notification({
                html : chess.__('Invalid Fen')
            });
            return false;
        }
        return true;
    },

    show: function () {
        this.parent();

        if (this.controller) {
            var model = this.controller.getCurrentModel();
            if (model) {
                this.loadFen(model.getCurrentPosition());
            }
        }

    }
});

chess.view.position.Dialog.getDialog = function (config) {
    if (!chess.view.position.Dialog.dialogObject) {
        chess.view.position.Dialog.dialogObject = new chess.view.position.Dialog(config);
    }
    return chess.view.position.Dialog.dialogObject;
};