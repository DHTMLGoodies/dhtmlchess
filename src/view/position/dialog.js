/**
 * Position setup dialog
 * @namespace chess.view.position
 * @class Dialog
 * @extends ludo.dialog.Dialog
 */
chess.view.position.Dialog = new Class({
    Extends:ludo.dialog.Dialog,
    module:'chess',
    submodule : 'positionSetup',
    autoDispose:false,
    autoHideOnBtnClick:false,
    width:660,
    height:500,
    title:chess.getPhrase('Position setup'),
    layout:'rows',
    selectedPiece:undefined,

	closable:true,
	minimizable : true,
	resizable : false,
    positionValidator:undefined,

    position:{
        board:'',
        color:'w',
        castling:'KQkq',
        enPassant:'-',
        halfMoves:'0',
        fullMoves:'0'
    },

    ludoConfig:function (config) {
        this.positionValidator = new chess.parser.PositionValidator();

        config.buttonBar = {
            align:'left',
            children:[
                {
                    value:'OK',
                    listeners:{
                        click:this.sendPosition.bind(this)
                    }
                },
                {
                    weight:1
                },
                {
                    value:'Reset',
                    listeners:{
                        click:this.resetBoard.bind(this)
                    }
                },
                {
                    value:'Clear board',
                    listeners:{
                        click:this.clearBoard.bind(this)
                    }
                },
                {
                    value:'Load fen',
                    listeners:{
                        click:this.showLoadFenDialog.bind(this)
                    }
                },
                {
                    value:'Flip',
                    listeners:{
                        click:this.flipBoard.bind(this)
                    }
                },
                {
                    value:'Cancel',
                    listeners:{
                        click:this.hide.bind(this)
                    }
                }
            ]
        };
        this.parent(config);

    },


    ludoRendered:function () {
        this.parent();

        this.firstRow = this.addChild({ weight:1, layout:'cols' });
        this.board = this.firstRow.addChild({
            type:'chess.view.position.Board',
            width:400,
            autoResize : false,
            containerCss:{
                margin:3
            },
            listeners:{
                setPosition:this.receivePosition.bind(this)
            }
        });

        this.pieces = {};
        this.pieces.white = this.firstRow.addChild({
            type:'chess.view.position.Pieces',
            width:55,
            pieceColor:'white',
            listeners:{
                selectpiece:this.selectPiece.bind(this)
            }
        });
        this.pieces.black = this.firstRow.addChild({
            type:'chess.view.position.Pieces',
            width:55,
            pieceColor:'black',
            listeners:{
                selectpiece:this.selectPiece.bind(this)
            }
        });

        this.optionPanel = this.firstRow.addChild({
            layout:'rows',
            weight:1
        });

        this.castling = this.optionPanel.addChild({
            type:'chess.view.position.Castling',
            listeners:{
                change:this.receiveCastling.bind(this)
            }
        });

        this.sideToMove = this.optionPanel.addChild({
            type:'chess.view.position.SideToMove',
            listeners:{
                change:this.receiveColor.bind(this)
            }
        });

        this.secondRow = this.addChild({
            height:40,
            layout:'cols'
        });
        this.moveNumber = this.secondRow.addChild({
            label:chess.getPhrase('Move number'),
            width:150,
            type:'form.Number',
            maxValue:300,
            required:true,
            value:'1',
            fieldWidth:35,
            listeners:{
                change:this.receiveFullMoves.bind(this)
            }
        });
        this.enPassant = this.secondRow.addChild({
            label:chess.getPhrase('En passant'),
            type:'form.Text',
            width:100,
            fieldWidth:25,
            maxLength:1,
            required:false,
            stretchField:false,
            validateKeyStrokes:true,
            regex:'[a-h]',
            listeners:{
                change:this.receiveEnPassant.bind(this)
            }
        });
    },
    receiveCastling:function (castling) {
        this.updatePosition('castling', castling);
    },
    receiveColor:function (color) {
        this.updatePosition('color', color);
    },
    receiveEnPassant:function (enPassant) {
        enPassant = enPassant || '-';
        this.updatePosition('enPassant', enPassant);
    },

    receiveFullMoves:function (fullMoves) {
        fullMoves = fullMoves || '0';
        this.updatePosition('fullMoves', fullMoves);
    },

    receivePosition:function (fen) {
        this.updatePosition('board', fen);
        this.position.board = fen;
    },

    updatePosition : function(key, value){
        this.position[key] = value;
        var button = this.getButton('ok');
        if(this.positionValidator.isValid(this.getPosition())){
            button.enable();
        }else{
            button.disable();
        }
    },

    getPosition:function () {
        var obj = this.position;
        return obj.board + ' ' + obj.color + ' ' + obj.castling + ' ' + obj.enPassant + ' ' + obj.halfMoves + ' ' + obj.fullMoves;
    },

    clearBoard:function () {
        this.board.clearBoard();
    },
    resetBoard:function () {
        this.board.resetBoard();
        this.castling.resetOptions();
        this.sideToMove.resetOptions();
        this.moveNumber.setValue('0');
        this.enPassant.setValue('');
    },
    sendPosition:function () {
        /**
         * @event setPosition
         * @param String FEN position
         */
        this.fireEvent('setPosition', this.getPosition());
        this.hide();
    },
    flipBoard:function () {
        this.board.flip();
    },
    selectPiece:function (obj) {
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
    showLoadFenDialog:function () {
        new ludo.dialog.Prompt({
            width:400,
            height:130,
            html:chess.getPhrase('Paste fen into the text box below'),
            inputConfig:{
                stretchField:true
            },
            modal:true,
            label:chess.getPhrase('FEN'),
            title:chess.getPhrase('Load fen'),
            listeners:{
                'ok':this.loadFen.bind(this)
            }
        });
    },

    loadFen:function (fen) {
        if (this.isValidFen(fen)) {
            this.positionValidator.setFen(fen);

            this.sideToMove.setColor(this.positionValidator.getColor());
            this.castling.setValue(this.positionValidator.getCastle());
            this.moveNumber.setValue(this.positionValidator.getFullMoves());
            this.enPassant.setValue(this.positionValidator.getEnPassantSquare());
            this.board.showFen(fen);
        }
    },

    isValidFen:function () {
        return true;
    },

    show:function(){
        this.parent();
        if(this.controller){
            var model = this.controller.getCurrentModel();
            if(model){
                this.loadFen(model.getCurrentPosition());
            }
        }

    }
});

chess.view.position.Dialog.getDialog = function(config) {
    if(!chess.view.position.Dialog.dialogObject){
        chess.view.position.Dialog.dialogObject = new chess.view.position.Dialog(config);
    }
    return chess.view.position.Dialog.dialogObject;
};