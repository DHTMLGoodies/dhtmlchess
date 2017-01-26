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

chess.WPViewer = new Class({
    Extends: Events,

    renderTo: undefined,
    pgn: undefined,

    controller: undefined,

    showLabels:undefined,

    module:undefined,

    boardSize:undefined,

    initialize: function (config) {
   
        this.renderTo = config.renderTo;

        var r = jQuery(this.renderTo);
        var w = r.width();
        r.css('height', Math.round(w + 480));
        this.boardSize = w;

        this.pgn = config.pgn;
        this.board = config.board || {};
        this.arrow = config.arrow || {};
        this.arrowSolution = config.arrowSolution || {};
        this.hint = config.hint || {};

        if(config.docRoot){
            ludo.config.setDocumentRoot(config.docRoot);
        }


        this.module = String.uniqueID();

        this.showLabels = !ludo.isMobile;
        if (this.renderTo.substr && this.renderTo.substr(0, 1) != "#")this.renderTo = "#" + this.renderTo;
        jQuery(document).ready(this.render.bind(this));
    },

    render: function () {

        new chess.view.Chess({
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


                    children: [
                        {
                            height: 35,
                            module:this.module,
                            type: 'chess.view.metadata.Game',
                            tpl: '{white} vs {black}',
                            cls:'metadata',
                            css: {
                                'text-align': 'center',
                                'overflow-y': 'auto',
                                'font-size': '1.2em',
                                'font-weight': 'bold'
                            }
                        },
                        
                        Object.merge({
                            boardLayout:undefined,
                            id:'tactics_board',
                            type: 'chess.view.board.Board',
                            module:this.module,
                            overflow: 'hidden',
                            pieceLayout: 'svg3',
                            boardCss: {
                                border: 0
                            },
                            labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
                            labelPos:'outside', // show labels inside board, default is 'outside'
                            layout:{
                                height:'wrap'
                            },
                            plugins: [
                                Object.merge({
                                    type: 'chess.view.highlight.Arrow'
                                }, this.arrow),
                                Object.merge({
                                    type: 'chess.view.highlight.ArrowTactic'
                                }, this.arrowSolution),
                                Object.merge({
                                    type: 'chess.view.highlight.SquareTacticHint'
                                },this.hint)
                            ]
                        }, this.board),
                        {
                            type:'chess.view.buttonbar.Bar',
                            layout:{
                                height:40
                            },
                            module:this.module
                        },
                        {
                            type: 'chess.view.notation.Panel',
                            height: 200,
                            module:this.module,
                            elCss:{
                                border: '1px solid ' + chess.THEME.borderColor,
                                'border-bottom-width': 0
                            }
                        },
                        {
                            module:this.module,
                            layout:{
                                weight:1
                            },
                            type:'chess.wordpress.GameListGrid',
                            elCss:{
                                border: '1px solid ' + chess.THEME.borderColor
                            },
                            css:{
                                'overflow-y':'auto'
                            },
                            dataSource:{
                                id:'gameList',
                                "type":'chess.wordpress.GameList',
                                module:this.module,
                                autoload:true,
                                postData:{
                                    pgn:this.pgn
                                },
                                // "Morphy" is the name of a pgn file inside the "pgn" folder.
                                //  You can put games inside that folder and change the argument below.
                                // You can also call
                                // ludo.get('gameList').loadFile('Lasker');
                                // to change pgn file after page load. Example
                                // <a href="#" onclick="ludo.get('gameList').loadFile('Lasker');return false">Load games of E. Lasker</a>
                                "listeners":{
                                    "load": function(data){
                                        if(data.length){
                                            ludo.get('gameList').selectRecord(data[0]);
                                        }
                                    }
                                },
                                shim:{
                                    txt : ''
                                }
                            },
                            cols:['white', 'black', 'result', 'event', 'site']
                        }
                    ]
                }
            ]
        });

        this.controller = new chess.controller.Controller({
            applyTo:[this.module],
            pgn: this.pgn,
            listeners: {

            }
        });


      //  this.controller.loadWordPressGameByIndex(this.pgn, 0);

    }

});