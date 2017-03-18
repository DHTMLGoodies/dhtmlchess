/**
 * Usage:
 *
 * new chess.FileTactics({
            renderTo:'chessContainer',
            pgn:'sample'
    })
 *
 * where "chessContainer" is id of an html element and "sample" is the name
 * of a pgn file inside the pgn folder(sample.pgn)
 * @type {Class}
 */

window.chess.isWordPress = true;

chess.WPViewer3 = new Class({
    Extends: chess.WPViewerTemplate,

    renderTo: undefined,
    pgn: undefined,

    controller: undefined,

    showLabels: undefined,

    module: undefined,

    boardSize: undefined,



    initialize: function (config) {
        this.parent(config);
        this.renderTo = config.renderTo;
        var r = jQuery(this.renderTo);
        var w = r.width();

        if (ludo.isMobile) {
            this.boardSize = w;
            r.css('height', Math.round(this.boardSize + 340 + this.wpm_h));
        } else {
            this.boardSize = w / 2;
            r.css('height', Math.round(this.boardSize + 375 + this.wpm_h));
        }


        this.buttons = ludo.isMobile ? ['start', 'previous', 'next', 'end'] : ['flip', 'start', 'previous', 'next', 'end'];

        this.pgn = config.pgn;
        this.board = config.board || {};
        this.arrow = config.arrow || {};
        this.arrowSolution = config.arrowSolution || {};
        this.hint = config.hint || {};

        this.showLabels = !ludo.isMobile;
        if (this.canRender()) {
            this.render();
        }
    },

    render: function () {

        new chess.view.Chess({
            cls:this.th,
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'fill',
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
                    type: 'linear', orientation: 'vertical'
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
                            'text-align': 'center',
                            'font-size': '1em',
                            'font-weight': 'bold'
                        }
                    },

                    {
                        layout: {
                            type: 'linear', orientation: 'horizontal',
                            height: this.boardSize
                        },

                        children: [
                            Object.merge({
                                boardLayout: undefined,
                                id: this.boardId,
                                type: 'chess.view.board.Board',
                                module: this.module,
                                overflow: 'hidden',
                                pieceLayout: 'svg3',
                                boardCss: {
                                    border: 0
                                },
                                labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
                                labelPos: 'outside', // show labels inside board, default is 'outside'
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
                                id: this.module + '-panel',
                                name: "notation-panel",
                                type: 'chess.view.notation.Panel',
                                layout: {
                                    weight:1
                                },
                                elCss: {
                                    'margin-left': '2px'
                                },
                                module: this.module
                            }
                        ]
                    },
                    {
                        anchor: [1, 0.5],
                        type: 'chess.view.buttonbar.Bar',
                        buttons: this.buttons,
                        module: this.module,
                        layout: {
                            height:40
                        },
                        buttonSize: function (ofSize) {
                            return ofSize * 0.9;
                        }
                    },
                    {
                        title: this.pgn.name,
                        module: this.module,
                        layout: {
                            height: 300
                        },
                        type: 'chess.WPGameGrid',
                        css: {
                            'overflow-y': 'auto'
                        },
                        cols: ['white', 'black', 'result'],
                        dataSource: {
                            id: 'gameList',
                            "type": 'chess.wordpress.GameList',
                            module: this.module,
                            autoload: true,
                            postData: {
                                pgn: this.pgn.id
                            },
                            "listeners": {
                                "select": function () {
                                    ludo.$(this.module + '-panel').show();
                                }.bind(this),
                                "load": function (data) {
                                    if (data.length) {
                                        ludo.get('gameList').selectRecord(data[0]);
                                    }
                                }
                            },
                            shim: {
                                txt: ''
                            }
                        }
                    },
                    {
                        type:'chess.WPComMessage'
                    }

                ]
            }
        ]
    },

    mobileChildren: function () {
        return [
            {
                layout: {
                    type: 'linear', orientation: 'vertical'
                },

                children: [
                    Object.merge({
                        boardLayout: undefined,
                        id: 'tactics_board',
                        type: 'chess.view.board.Board',
                        module: this.module,
                        overflow: 'hidden',
                        pieceLayout: 'svg3',
                        boardCss: {
                            border: 0
                        },
                        labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
                        labelPos: 'outside', // show labels inside board, default is 'outside'
                        layout: {
                            height: this.boardSize
                        },
                        plugins: [
                            Object.merge({
                                type: 'chess.view.highlight.Arrow'
                            }, this.arrow)
                        ]
                    }, this.board),
                    {
                        layout:{
                            height:40,type:'linear',orientation:'horizontal'
                        },
                        children:[
                            { weight:1 },
                            {
                                type: 'chess.view.buttonbar.Bar',
                                layout: {
                                    height: 40,
                                    width: 90
                                },
                                module: this.module,
                                buttons:['start','previous'],
                                buttonSize: function (ofSize) {
                                    return ofSize * 0.9;
                                }
                            },
                            {
                                type:'chess.view.notation.LastMove',
                                module: this.module,
                                layout:{
                                    width:70
                                },
                                css:{
                                    'padding-top' : 4, 'padding-bottom' : 4, border:'none'
                                }
                            },
                            {
                                type: 'chess.view.buttonbar.Bar',
                                layout: {
                                    height: 40,
                                    width: 90
                                },
                                module: this.module,
                                buttons:['next','end'],
                                buttonSize: function (ofSize) {
                                    return ofSize * 0.9;
                                }
                            },
                            {
                                weight:1
                            }

                        ]
                    },
                    {
                        title: this.pgn.name,
                        module: this.module,
                        layout: {
                            height: 300
                        },
                        type: 'chess.WPGameGrid',
                        css: {
                            'overflow-y': 'auto'
                        },
                        cols: ['white', 'black', 'result'],
                        dataSource: {
                            id: 'gameList',
                            "type": 'chess.wordpress.GameList',
                            module: this.module,
                            autoload: true,
                            postData: {
                                pgn: this.pgn.id
                            },
                            "listeners": {
                                "load": function (data) {
                                    if (data.length) {
                                        ludo.get('gameList').selectRecord(data[0]);
                                    }
                                }
                            },
                            shim: {
                                txt: ''
                            }
                        }
                    }

                ]
            }
        ]

    }
});