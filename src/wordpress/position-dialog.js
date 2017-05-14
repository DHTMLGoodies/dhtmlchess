/**
 * Position setup dialog
 * @namespace chess.view.position
 * @class Dialog
 * @extends ludo.dialog.Dialog
 */
chess.wordpress.PositionDialog = new Class({
    Extends: ludo.dialog.Dialog,
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

    colors: ['#ff0000', '#00ff00', "#B71C1C", '#66BB6A', '#29B6F6', '#FB8C00', '#7B1FA2', '#303F9F', '#1976D2', '#0097A7'],

    boardId: 'boardContainer',

    controller: undefined,

    module: 'wpc-pos-dialog',

    _curTheme: 'grey',

    __construct: function (config) {
        config = config || {};

        if (config.theme) this._curTheme = config.theme;

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
                id:'boardChessView',
                type: 'chess.view.Chess',
                layout: {
                    alignParentLeft: true,
                    alignParentTop: true,
                    width: 380,
                    height: 380,
                    type: 'fill'
                },
                children: [
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
                        layout: {},
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
                    }
                ]
            },


            {
                layout: {
                    type: 'tabs',
                    tabs: 'top',
                    rightOf: 'boardChessView',
                    alignParentTop: true,
                    fillRight: true,
                    height: 380
                },
                elCss: {
                    'border-top': '1px solid #ccc'
                },
                css: {
                    border: '1px solid #ccc',
                    'border-top': 'none',
                    'padding-top': 2
                },
                children: [
                    {
                        title: 'Setup',
                        layout: {
                            type: 'relative'
                        },
                        children: [
                            {
                                type: 'chess.view.position.Pieces',
                                id: 'whitePieces',
                                layout: {
                                    height: 'matchParent',
                                    width: 55,
                                    type: 'linear',
                                    orientation: 'vertical',
                                    top: 4,
                                    fillDown: true
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
                                    top: 4,
                                    height: 'matchParent',
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
                                    top: 4,
                                    rightOf: 'blackPieces',
                                    width: 150,
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
                            }
                        ]
                    },
                    {
                        title: 'Analysis',
                        type: 'chess.wordpress.ComputerEval',
                        id: 'compEval',
                        layout: {
                            height: 470, width: 'matchParent',
                            type: 'linear', orientation: 'vertical'
                        },
                        listeners: {
                            'start': function () {
                                if (this.isCurFenValid()) {
                                    var fen = this.getPosition();
                                    ludo.$('compEval').fen = fen;
                                    this.controller.currentModel.setPosition(fen);
                                    this.controller.startEngine();
                                } else {
                                    ludo.$('compEval').stopEngine();
                                }

                            }.bind(this),
                            'stop': function () {
                                this.controller.stopEngine();

                            }.bind(this)
                        }
                    }
                ]
            },
            {
                layout: {
                    below: 'boardChessView',
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
                        storageKey: 'wpc-highlight-colors',
                        title: 'Highlight Squares',
                        dialog: this,
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
                        dialog: this,
                        storageKey: 'wpc-arrow-colors',
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

    },


    __rendered: function () {
        this.parent();
        this.$b().addClass('dc-' + this._curTheme);
        this.$b().addClass('dc-admin-pos-dialog');

        this.board = ludo.$('boardContainer');
        this.moveNumber = ludo.$('moveNumber');

        this.controller = new chess.controller.StockfishEngineController({
            examine: false,
            applyTo: this.module,
            stockfish: ludo.config.getDocumentRoot() + '/stockfish-js/stockfish.js',
            listeners: {
                'engineupdate': this.onEngineUpdate.bind(this)
            }
        });
    },

    onEngineUpdate: function (score) {
        ludo.$('compEval').receiveEngineUpdate(score);
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
        this.toggleOkButton();
    },

    isCurFenValid: function () {
        return this.positionValidator.isValid(this.getPosition());
    },

    toggleOkButton: function () {
        var button = this.getButton('ok');
        if (this.isCurFenValid()) {
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
        ludo.$('castling').resetOptions();
        ludo.$('sideToMove').resetOptions();
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
            arrows: this.boardView().arrowString(),
            highlight: this.boardView().highlightString()
        };
        this.fireEvent('setPosition', payload);
        this.hide();
    },

    flipBoard: function () {
        this.board.flip();
    },

    selectPiece: function (obj) {


        ludo.$('highlightColorView').clear();
        ludo.$('arrowColorView').clear();
        this.boardView().clearMode();

        ludo.$('whitePieces').clearSelections();
        ludo.$('blackPieces').clearSelections();
        if (this.selectedPiece && this.selectedPiece.pieceType === obj.pieceType && this.selectedPiece.color === obj.color) {
            this.selectedPiece = undefined;
            this.board.deleteSelectedPiece();
        } else {
            this.selectedPiece = obj;
            ludo.$(obj.color + 'Pieces').addSelection(obj.pieceType);
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

            ludo.$('sideToMove').setColor(this.positionValidator.getColor());
            ludo.$('castling').val(this.positionValidator.getCastle());
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

    showPositionDialog: function (parentDialog, fen, arrowString, squareString, theme) {
        fen = fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

        this.boardView().clearBoard();

        var tokens = fen.split(/\s/g);
        this.position = {
            'board': tokens[0],
            'color': tokens[1],
            'castling': tokens.length > 1 ? tokens[2] : '',
            'enPassant': tokens.length > 2 ? tokens[3] : '',
            'halfMoves': tokens.length > 3 ? tokens[4] : '',
            'fullMoves': tokens.length > 4 ? tokens[5] : ''
        };

        this.toggleOkButton();

        var off = parentDialog.offset();
        this.showAt(off.left - 20, off.top + 20);

        if (fen) {
            this.loadFen(fen);
        }

        if (arrowString) {
            var arrows = arrowString.split(/,/g);
            arrows.forEach(function (arrow) {
                var tokens = arrow.split(/;/);
                if (/^[a-h][1-8][a-h][1-8]$/.test(tokens[0])) {
                    var color = tokens.length === 2 && this.isColor(tokens[1]) ? tokens[1] : '#ff0000';
                    this.boardView().addArrow(
                        tokens[0].substr(0, 2),
                        tokens[0].substr(2, 2),
                        color
                    );
                }
            }.bind(this));
        }

        if (squareString) {
            var squares = squareString.split(/,/g);
            squares.forEach(function (square) {
                var tokens = square.split(/;/);
                if (/^[a-h][1-8]$/.test(tokens[0])) {
                    var color = tokens.length === 2 && this.isColor(tokens[1]) ? tokens[1] : '#ff0000';
                    this.boardView().highlightSquare(tokens[0], color);
                }

            }.bind(this));
        }

        this.$b().removeClass('dc-' + this._curTheme);
        this._curTheme = theme;
        this.$b().addClass('dc-' + theme);
    },

    isColor: function (color) {
        var pattern = /^#[a-f0-9]{3}$/;
        var pattern2 = /^#[a-f0-9]{6}$/;
        return pattern.test(color) || pattern2.test(color);
    }
});
