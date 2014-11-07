chess.GamesFromFile = new Class({
    Extends: Events,
    renderTo : undefined,
    pgn : undefined,

    initialize:function(config){
        this.renderTo = config.renderTo;
        this.pgn = config.pgn;

        window.addEvent('domready', this.render.bind(this));
    },

    render:function(){
        new ludo.View({
            id:'gamesApp',
            css:{
                border:0,
                'margin':5,
                padding:3
            },
            renderTo:document.id(this.renderTo),
            containerCss:{
                height:'100%'
            },
            layout:{
                type:'slideIn'
            },
            overflow:'hidden',

            children:[
                {
                    layout:{
                        width:'39.1%',
                        type:'linear',
                        orientation:'vertical'
                    },
                    css:{
                        'border-left' : '1px solid #d7d7d7',
                        'border-bottom' : '1px solid #d7d7d7',
                        'border-top' : '1px solid #d7d7d7'
                    },
                    children:[
                        {
                            type:'form.Text',
                            label:'Busqueda',
                            id:"searchField",
                            labelWidth:90,
                            containerCss:{
                                'border-bottom':'1px solid #C6c8c6'
                            },
                            listeners:{
                                key:function (value) {
                                    ludo.get('gameList').search(value);
                                }
                            }
                        },
                        {
                            visible:true,
                            layout:{
                                weight:1
                            },
                            type:'chess.view.gamelist.Grid',
                            css:{
                                'background-color':'#FFF',
                                'overflow-y':'auto'
                            },
                            dataSource:{
                                id:'gameList',
                                "type":'chess.dataSource.PgnGames',
                                // "Morphy" is the name of a pgn file inside the "pgn" folder.
                                //  You can put games inside that folder and change the argument below.
                                // You can also call
                                // ludo.get('gameList').loadFile('Lasker');
                                // to change pgn file after page load. Example
                                // <a href="#" onclick="ludo.get('gameList').loadFile('Lasker');return false">Load games of E. Lasker</a>
                                "arguments":"Morphy",
                                "listeners":{
                                    "beforeload":function () {
                                        ludo.get("searchField").reset();
                                    },
                                    "select": function(){
                                        ludo.get('gamesApp').getLayout().hide();
                                    },
                                    "load": function(data){
                                        if(data.length){
                                            ludo.get('gameList').selectRecord(data[0]);
                                        }
                                    }
                                },
                                shim:{
                                    txt : chess.getPhrase('Loading games')
                                },
                                paging:{
                                    size:18,
                                    pageQuery:false,
                                    cache:false,
                                    cacheTimeout:1000
                                }
                            },
                            cols:['white', 'black', 'result']
                        },
                        {
                            height:30,
                            layout:{
                                type:'linear',
                                orientation:'horizontal'
                            },
                            containerCss:{
                                'border-top':'1px solid #c6c6c6'
                            },
                            css:{
                                'padding-top':2
                            },
                            children:[
                                {
                                    type:'paging.First',
                                    dataSource:'gameList'
                                },
                                {
                                    type:'paging.Previous',
                                    dataSource:'gameList'
                                },
                                {
                                    type:'paging.CurrentPage',
                                    dataSource:'gameList'
                                },
                                {
                                    type:'paging.TotalPages',
                                    dataSource:'gameList'
                                },
                                {
                                    type:'paging.Next',
                                    dataSource:'gameList'
                                },
                                {
                                    type:'paging.Last',
                                    dataSource:'gameList'
                                }

                            ]
                        }
                    ]
                },
                {
                    layout:{
                        type:'cols'
                    },
                    minHeight:100,
                    children:[
                        {
                            weight:1,
                            layout:{ type:'linear', orientation:'vertical' },
                            frame:true,
                            css:{
                                'margin' : 5
                            },
                            children:[
                                {
                                    layout:{
                                        type:'linear',
                                        orientation:'horizontal',
                                        height:50
                                    },
                                    children:[
                                        {
                                            type:'ludo.form.Button',
                                            size : 'l',
                                            value : 'Juegos',
                                            layout:{
                                                width:130
                                            },
                                            icon:'images/menu-icon-large.png',
                                            listeners:{
                                                'click' : function(){
                                                    ludo.get('gamesApp').getLayout().toggle();
                                                }
                                            }
                                        },
                                        {
                                            type:'chess.view.metadata.Game',
                                            height:50,
                                            layout:{
                                                weight:1
                                            },
                                            containerCss:{
                                                'color':'#000'
                                            },
                                            tpl:'<h2 class="game_heading">{white} vs {black}, {result}</h2>'
                                        }
                                    ]
                                },

                                {
                                    type:'chess.view.board.Board',
                                    labels:true,
                                    weight:1,
                                    containerCss:{
                                        'margin-bottom':5
                                    },
                                    addOns:[
                                        {
                                            type:'chess.view.highlight.Arrow',
                                            styles:{
                                                'stroke':'#444',
                                                'stroke-opacity':.8,
                                                'stroke-width':1
                                            }
                                        }
                                    ]
                                },
                                {
                                    type:'chess.view.buttonbar.Game',
                                    width:200,
                                    containerCss:{
                                        margin:2
                                    },
                                    height:30
                                }
                            ]
                        },
                        {
                            width:300,
                            collapsed:false,
                            layout:{ type:'rows' },
                            type:'FramedView',
                            title:'Detalles',
                            resizable:true,
                            collapsible:true,
                            minimizable:false,
                            containerCss:{

                            },

                            children:[
                                {
                                    type:'chess.view.metadata.FenField',
                                    height:27,

                                    tpl:'FEN: <input type="text" value="{fen}" style="font-size:10px">'
                                },
                                {
                                    weight:1,

                                    css:{
                                        'margin-top':3
                                    },
                                    containerCss:{
                                        'border-top':'1px solid #C0C0C0'

                                    },
                                    title:'Notations',
                                    id:'notation-view',
                                    type:'chess.view.notation.Panel',
                                    notations:'long',
                                    showContextMenu:true
                                }
                            ]
                        }
                    ],
                    statusBar:{
                        visible:true
                    }
                }

            ]


        });

        var fen = '6bk/7p/8/8/8/8/5B2/6K1 w - - 0 1';
        var controller = new chess.controller.Controller();
        controller.addEvent('newGame', function () {
            ludo.get('notation-view').show();
        });
        controller.addEvent('selectPgn', function () {
            ludo.get('list-of-games').show();
        });
    }


});