chess.WPGame2 = new Class({
    Extends: chess.WPGameTemplate,
    boardSize: undefined,

    __construct: function (config) {
        this.parent(config);
        var w = this.renderWidth();
        this.renderTo.css('height', w + 235 + this.navH + this.wpm_h);
        this.boardSize = w;
        this.buttons = this.buttons || ['start', 'previous', 'play', 'next', 'end', 'flip'];
        this.adjustButtonArray(this.buttons);

        this.beforeRender();
    },

    render: function () {
        new chess.view.Chess({
            theme : this.themeObject,
            renderTo: this.renderTo,
            cls: this.th,
            layout: {
                type: 'linear', orientation: 'vertical',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [
                {
                    layout: {
                        height: 35,
                        width: this.boardSize
                    },
                    module: this.module,
                    type: 'chess.view.metadata.Game',
                    tpl: this.heading_tpl || '{white} - {black}',
                    cls: 'metadata',
                    css: {
                        'text-align': 'center'
                    }
                },

                Object.merge({
                    boardLayout: undefined,
                    id: this.boardId,
                    animationDuration: this.animationDuration,
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
                }, this.board),
                {
                    type: 'chess.view.buttonbar.Bar',
                    buttons: this.buttons,
                    elCss: {
                        'padding-top': 2
                    },
                    layout: {
                        height: this.navH,
                        width: this.boardSize
                    },
                    module: this.module
                },
                {
                    id: this.module + '-panel',
                    name: "notation-panel",
                    type: 'chess.view.notation.Panel',
                    layout: {
                        height: 200
                    },
                    elCss: {
                        'margin-left': '2px'
                    },
                    module: this.module

                },
                {
                    type: 'chess.WPComMessage',
                    hidden: this._p
                }
            ]
        });

        this.createController();
    }

});