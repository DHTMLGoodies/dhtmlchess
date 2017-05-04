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

chess.WPViewer2 = new Class({
    Extends: chess.WPViewerTemplate,
    showLabels: undefined,
    boardSize: undefined,
    sofia:false,
    width:undefined,
    __construct: function (config) {
        this.parent(config);
        var r = this.renderTo;
        var w = this.width = r.width();
        this.boardSize = ludo.isMobile ? w : w/2;

        r.css('height', Math.round(this.boardSize + 335 + this.navH + this.wpm_h));

        if(config.sofia)this.sofia = true;
        this.showLabels = !ludo.isMobile;

        this.buttons = ludo.isMobile ? ['start', 'previous', 'next', 'end'] : ['start', 'previous', 'next', 'end', 'flip'];
        this.adjustButtonArray(this.buttons);


        this.gameListDsId = 'gamelist' + String.uniqueID();
        this.standingsId = 'standingsId' + String.uniqueID();
        this.beforeRender();
    },

    render: function () {

        new chess.view.Chess({
            cls:this.th,
            theme : this.themeObject,
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'fill',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [
                {
                    layout: {
                        type: 'linear', orientation: 'vertical'
                    },
                    children: ludo.isMobile ? this.mobileChildren() : this.desktopChildren()
                }
            ]
        });

        this.createController();
    },

    desktopChildren:function(){
        return [
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
                        id: this.module + '-panel',
                        name: "notation-panel",
                        type: 'chess.view.notation.Panel',
                        layout: {
                            weight: 1
                        },
                        elCss: {
                            'margin-left': '2px'
                        },
                        module: this.module
                    }
                ]
            },
            {
                layout:{
                    height: 40,
                    type:'linear', orientation:'horizontal',
                    width:'matchParent'
                },
                children:[
                    {
                        anchor:[1,0.5],
                        type: 'chess.view.buttonbar.Bar',
                        buttons: this.buttons,
                        module: this.module,
                        layout: {
                            height: 'matchParent',
                            width:this.width - 40
                        },
                        buttonSize: function (ofSize) {
                            return ofSize * 0.9;
                        }
                    }
                ]
            },
            {
                height: 300,
                layout: {
                    type: 'tabs'
                },
                cls: 'ludo-light-gray',
                css: {
                    border: '1px solid #aeb0b0'
                },
                children: [

                    {
                        layout: {
                            type: 'linear', orientation: 'vertical'
                        },
                        title: chess.__('Games'),
                        children: [

                            {
                                module: this.module,
                                layout: {
                                    weight: 1
                                },
                                type: 'chess.WPGameGrid',
                                css: {
                                    'overflow-y': 'auto'
                                },
                                cols: ['round', 'white', 'black', 'result'],
                                dataSource: {
                                    id: this.gameListDsId,
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
                                                ludo.$(this.gameListDsId).selectRecord(data[0]);
                                            }
                                        }.bind(this)
                                    },
                                    shim: {
                                        txt: ''
                                    }
                                }
                            },
                            {
                                type: 'form.Text',
                                placeholder: chess.__('Search'),
                                css:{
                                    'border-top' : '1px solid #aeb0b0'
                                },
                                layout: {
                                    height: 30
                                },
                                listeners: {
                                    key: function (value) {
                                        this.search(value);
                                    }.bind(this)
                                }
                            }
                        ]
                    },

                    {

                        id: this.standingsId,
                        type: 'chess.wordpress.PgnStandings',
                        module: this.module,
                        pgnId: this.pgn.id,
                        layout: {
                            weight: 1
                        },
                        title: chess.__('Standings')
                    }


                ]

            },
            {
                type:'chess.WPComMessage',
                hidden:this._p
            }


        ];
    },

    mobileChildren:function(){
        return [
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
                            height: this.navH,
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
                height: 300,
                layout: {
                    type: 'tabs'
                },
                cls: 'ludo-light-gray',
                css: {
                    border: '1px solid #aeb0b0'
                },
                children: [

                    {
                        layout: {
                            type: 'linear', orientation: 'vertical'
                        },
                        title: chess.__('Games'),
                        children: [

                            {
                                module: this.module,
                                layout: {
                                    weight: 1
                                },
                                type: 'chess.WPGameGrid',
                                css: {
                                    'overflow-y': 'auto'
                                },
                                keys:['white','black', 'result'],
                                dataSource: {
                                    id: this.gameListDsId,
                                    "type": 'chess.wordpress.GameList',
                                    module: this.module,
                                    autoload: true,
                                    postData: {
                                        pgn: this.pgn.id
                                    },
                                    "listeners": {
                                        "load": function (data) {
                                            if (data.length) {
                                                ludo.$(this.gameListDsId).selectRecord(data[0]);
                                            }
                                        }.bind(this)
                                    },
                                    shim: {
                                        txt: ''
                                    }
                                }
                            },
                            {
                                type: 'form.Text',
                                placeholder: chess.__('Search'),
                                css:{
                                    'border-top' : '1px solid #aeb0b0'
                                },
                                layout: {
                                    height: 30
                                },
                                listeners: {
                                    key: function (value) {
                                        this.search(value);
                                    }.bind(this)
                                }
                            }
                        ]
                    },

                    {

                        id: this.standingsId,
                        type: 'chess.wordpress.PgnStandings',
                        module: this.module,
                        sofiaRules:this.sofia,
                        pgnId: this.pgn.id,
                        keys:['player', 'score'],
                        layout: {
                            weight: 1
                        },
                        title: chess.__('Standings')
                    }
                ]

            },
            {
                type:'chess.WPComMessage',
                hidden: this._p
            }


        ];
    },

    search: function (val) {

        ludo.$(this.gameListDsId).search(val);
    }
});