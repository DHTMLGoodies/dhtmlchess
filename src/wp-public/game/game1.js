window.chess.isWordPress = true;
chess.WPGame1 = new Class({
    Extends: chess.WPGameTemplate,
    boardSize: undefined,
    buttonSize: 45,

    initialize: function (config) {
        this.parent(config);
        var w = this.renderTo.width();

        if(ludo.isMobile){
            this.renderTo.css({
                'height': Math.ceil(w + this.wpm_h + 40),
                position: 'relative'
            });
            this.boardSize = w - 200;
        }else{
            this.renderTo.css({
                'height': Math.ceil(w - 200 + 45 + 35 + this.wpm_h),
                position: 'relative'
            });
            this.boardSize = w - 200;
        }

        this.buttons = ['start', 'previous', 'play', 'next', 'end', 'flip'];
        this.adjustButtonArray(this.buttons);

        this.bs = this.boardSize > 400 ? this.boardSize : w;
        if (this.canRender()) {
            this.render();
        }
    },

    render: function () {

        this.board = Object.merge({
            boardLayout: undefined,
            id: this.boardId,
            type: 'chess.view.board.Board',
            module: this.module,
            overflow: 'hidden',
            pieceLayout: 'svg3',
            boardCss: {
                border: 0
            },
            labelPos: this.lp, // show labels inside board, default is 'outside'
            layout: {
                weight: 1,
                height: 'wrap'
            },
            plugins: [
                Object.merge({
                    type: 'chess.view.highlight.Arrow'
                }, this.arrow)
            ]
        }, this.board);

        new chess.view.Chess({
            renderTo: this.renderTo,
            cls: this.th,
            layout: {
                type: 'linear', orientation: 'vertical',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: ludo.isMobile ? this.mobileChildren() : this.desktopChildren()
        });

        this.createController();

    },

    desktopChildren: function () {
        return [
            {
                layout: {
                    height: 35,
                    width: ludo.isMobile ? 'matchParent' : this.boardSize
                },
                module: this.module,
                type: 'chess.view.metadata.Game',
                tpl: this.heading_tpl || '{white} - {black}',
                cls: 'metadata',
                css: {
                    'text-align': 'center',
                    'overflow-y': 'auto',
                    'font-weight': 'bold'
                }
            },

            {
                layout: {
                    type: 'linear', orientation: 'horizontal',
                    height: this.boardSize
                },

                children: [
                    this.board,
                    {
                        id: this.module + '-panel',
                        name: "notation-panel",
                        type: 'chess.view.notation.Table',
                        layout: {
                            width: 200
                        },
                        elCss: {
                            'margin-left': '2px'
                        },
                        module: this.module
                    }
                ]
            },
            {
                css: {
                    'margin-top': 5
                },
                type: 'chess.view.buttonbar.Bar',
                buttons:this.buttons,
                layout: {
                    height: 45,
                    width: this.bs
                },
                module: this.module
            },
            {
                type: 'chess.WPComMessage',
                hidden : this._p
            }
        ];
    },

    mobileChildren: function () {
        return [
            this.board,
            {
                layout: {
                    type: 'linear', orientation: 'horizontal',
                    height: this.buttonSize
                },
                elCss: {
                    'margin-top': 10
                },
                children: [
                    {weight: 1},
                    {
                        anchor: [0.5, 0.5],
                        type: 'chess.view.buttonbar.Bar',
                        buttons: ['start', 'previous'],
                        module: this.module,
                        layout: {
                            width: (this.buttonSize) * 3
                        },
                        buttonSize: function (ofSize) {
                            return ofSize * 0.9;
                        }
                    },
                    {
                        type: 'chess.view.notation.LastMove',
                        module: this.module,
                        layout: {

                            width: this.buttonSize * 2

                        },
                        css: {
                            border: 'none'
                        }
                    },
                    {
                        anchor: [0.5, 0.5],
                        type: 'chess.view.buttonbar.Bar',
                        buttons: ['next', 'end'],
                        module: this.module,
                        layout: {
                            width: (this.buttonSize) * 2
                        },
                        buttonSize: function (ofSize) {
                            return ofSize * 0.9;
                        }
                    },
                    {weight: 1}

                ]
            },
            {
                type: 'chess.WPComMessage',
                hidden:this._p
            }
        ];
    }

});