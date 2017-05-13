/**
 * Position setup dialog
 * @namespace chess.view.position
 * @class Dialog
 * @extends ludo.dialog.Dialog
 */
chess.wordpress.PositionDialog = new Class({
    Extends: ludo.dialog.Dialog,
    module: 'chess',
    submodule: 'positionSetup',
    autoRemove: false,
    autoHideOnBtnClick: false,
    width: 670,
    height: 550,
    title: chess.__('Fen Setup'),
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

    colors: ['#ff0000', '#00ff00', "#B71C1C", '#66BB6A', '#29B6F6', '#FB8C00', '#7B1FA2','#303F9F','#1976D2','#0097A7'],

    boardId: 'boardContainer',

    __construct: function (config) {
        config = config || {};

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
                    css: {'font-weight': 'normal'},
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
                    value: 'Clear Arrows',
                    listeners: {
                        click: function () {
                            this.boardView().clearArrows();
                        }.bind(this)
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

    __children: function () {
        return [
            {
                type: 'chess.wordpress.FenBoard',
                id: this.boardId,
                autoResize: false,
                pieceLayout: 'svg_darkgrey',
                background: {
                    borderRadius: ludo.isMobile ? '0.5%' : '1%',
                    paint: {
                        'fill': '#1a2026'
                    }
                },
                layout: {
                    alignParentLeft: true,
                    alignParentTop: true,
                    width: 380,
                    height: 380
                },
                padding: '3%',
                elCss: {
                    margin: 3
                },
                listeners: {
                    setPosition: this.receivePosition.bind(this),
                    clickSquare: this.onClickSquare.bind(this)
                },
                plugins: [
                    {
                        type: 'chess.view.highlight.Arrow',
                        styles: {
                            'fill': '#f77cc5',
                            'stroke': '#888'
                        }
                    },
                    {
                        type: 'chess.view.highlight.ArrowTactic',
                        styles: {
                            'fill': '#f77cc5',
                            'stroke': '#888'
                        }
                    },
                    {
                        type: 'chess.view.highlight.SquareTacticHint'
                    }
                ]
            },
            {
                type: 'chess.view.position.Pieces',
                id: 'whitePieces',
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
            },
            {
                type: 'chess.view.position.Pieces',
                id: 'blackPieces',
                width: 55,
                pieceColor: 'black',
                listeners: {
                    selectpiece: this.selectPiece.bind(this)
                },
                elCss: {
                    'padding-right': 4
                },
                layout: {
                    height: 400,
                    rightOf: 'whitePieces',
                    type: 'linear',
                    orientation: 'vertical'
                }
            },
            {
                id: 'castling',
                type: 'chess.view.position.Castling',
                listeners: {
                    change: this.receiveCastling.bind(this)
                },
                layout: {
                    rightOf: 'blackPieces',
                    width: 150,
                    alignParentTop: true,
                    height: 145
                }
            }, {
                id: 'sideToMove',
                type: 'chess.view.position.SideToMove',
                listeners: {
                    change: this.receiveColor.bind(this)
                },
                layout: {
                    sameWidthAs: 'castling',
                    height: 100,
                    below: 'castling',
                    alignLeft: 'castling'
                }
            },
            {
                id: 'moveNumberContainer',
                children: [
                    {
                        id: 'moveNumber',
                        type: 'form.Label', labelFor: 'moveNumber',
                        label: chess.__('Ply'),
                        value: 1
                    },
                    {
                        id: 'moveNumber',
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
                    below: 'sideToMove',
                    sameWidthAs: 'sideToMove',
                    alignLeft: 'sideToMove',
                    height: 25
                }
            },
            {
                children: [
                    {
                        type: 'form.Label', labelFor: 'enPassant',
                        label: chess.__('En passant')
                    },
                    {
                        id: 'positionEnPassant',
                        type: 'form.Text',
                        name: 'enPassant',
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
                    below: 'moveNumberContainer',
                    sameWidthAs: 'moveNumberContainer',
                    alignLeft: 'moveNumberContainer',
                    height: 25
                }
            },
            {
                layout: {
                    below: 'boardContainer',
                    type: 'linear',
                    orientation: 'horizontal',
                    fillDown: true,
                    width: 'matchParent'
                },
                css: {},
                children: [
                    {
                        id: 'highlightColorView',
                        layout: {weight: 1, height: 'matchParent'},
                        type: 'chess.wordpress.ColorView',
                        storageKey:'wpc-highlight-colors',
                        title: 'Highlight Squares',
                        dialog:this,
                        colors: this.colors,
                        listeners: {
                            'select': function (color) {
                                this.boardView().startHighlight(color);
                                ludo.$('arrowColorView').clear();
                            }.bind(this),
                            'deselect': function () {
                                this.boardView().clearMode();

                            }.bind(this)
                        }
                    },
                    {
                        width: 5
                    },
                    {
                        id: 'arrowColorView',
                        layout: {weight: 1, height: 'matchParent'},
                        type: 'chess.wordpress.ColorView',
                        title: 'Arrows',
                        colors: this.colors,
                        dialog:this,
                        storageKey:'wpc-arrow-colors',
                        listeners: {
                            'select': function (color) {
                                this.boardView().startArrowMode(color);
                                ludo.$('highlightColorView').clear();

                            }.bind(this),
                            'deselect': function () {
                                this.boardView().clearMode();
                            }.bind(this)
                        }
                    }
                ]

            }

        ]
    },

    highlightColor: undefined,
    boardView: function () {
        return ludo.$(this.boardId);
    },

    onClickSquare: function (square) {

        console.log(square);
    },


    __rendered: function () {
        this.parent();
        this.$b().addClass('dc-grey');
        this.$b().addClass('dc-admin-pos-dialog');

        this.board = ludo.$('boardContainer');
        this.pieces = {};
        this.pieces.white = ludo.$('whitePieces');
        this.pieces.black = ludo.$('blackPieces');
        this.castling = ludo.$('castling');
        this.sideToMove = ludo.$('sideToMove');
        this.moveNumber = ludo.$('moveNumber');
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
            if (button) button.enable();
        } else {
            if (button) button.disable();
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
        ludo.$('moveNumber').val('1');
        ludo.$('positionEnPassant').val('');
    },
    sendPosition: function () {
        /**
         * @event setPosition
         * @param String FEN position
         */
        var payload = {
            fen: this.getPosition(),
            arrows: this.getArrows(),
            highlightedSquares: this.highlightedSquares()
        };
        this.fireEvent('setPosition', payload);
        this.hide();
    },

    highlightedSquares: function () {
        return "";
    },

    getArrows: function () {
        return "";
    },

    flipBoard: function () {
        this.board.flip();
    },

    selectPiece: function (obj) {


        ludo.$('highlightColorView').clear();
        ludo.$('arrowColorView').clear();
        this.boardView().clearMode();

        this.pieces.white.clearSelections();
        this.pieces.black.clearSelections();
        if (this.selectedPiece && this.selectedPiece.pieceType === obj.pieceType && this.selectedPiece.color === obj.color) {
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
            layout: {
                width: 400,
                height: 140,
                centerIn: this.$e
            },
            css: {
                padding: 4
            },
            resizable: false,
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
            ludo.$('moveNumber').val(this.positionValidator.getFullMoves());
            ludo.$('positionEnPassant').val(this.positionValidator.getEnPassantSquare());
            this.board.showFen(fen);
        }
    },

    isValidFen: function (fen) {

        try {
            parser = new chess.parser.FenParser0x88(fen);
            parser.getValidMovesAndResult();
        } catch (e) {
            new ludo.Notification({
                html: chess.__('Invalid Fen')
            });
            return false;
        }
        return true;
    },

    showPositionDialog: function (parentDialog, fen) {
        this.fen = fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        var off = parentDialog.offset();
        this.showAt(off.left - 20, off.top + 20);


        if (this.fen) {
            this.loadFen(this.fen);
        }
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
