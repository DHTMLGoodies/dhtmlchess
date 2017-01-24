chess.GameViewer = new Class({

    renderTo: undefined,
    pgn: undefined,
    gameIndex: undefined,
    module: undefined,

    initialize: function (config) {

        this.renderTo = $(config.renderTo);

        this.pgn = this.renderTo.attr("data-dhtmlchess-pgn");
        // Using 1 based numbering on the view(1 = first game). decrement by 1 since DHTML Chess is 0-based(0 = first game)
        this.gameIndex = this.renderTo.attr("data-dhtmlchess-game") - 1;


        // Creating unique module id for each instance of the game viewer
        // each view and the controller is assigned to this.
        this.module = 'dhtml-chess' + String.uniqueID();

        // Call the render functino below
        this.render();

    },

    render: function () {

        this.view = new chess.view.Chess({
            renderTo: this.renderTo,
            layout: {
                width: 'matchParent', height: 'matchParent',
                type: 'linear',
                orientation: ludo.isMobile ? 'vertical' : 'horizontal'
            },
            css: {
                padding: 5
            },
            children: [
                {
                    layout: {
                        weight: ludo.isMobile ? 2 : 1,
                        type: 'linear', orientation: 'vertical'
                    },
                    children: [
                        {
                            type:'chess.view.metadata.Game',
                            tpl: '{white} vs {black} - {result}',
                            css:{
                                'text-align': 'center',
                                color: ludo.$C('border'),
                                'font-weight' : 'bold'
                            },
                            module: this.module, // To make the controller aware of this view
                            layout:{
                                height:30
                            }
                        },

                        {
                            type: 'chess.view.board.Board',
                            pieceLayout: 'svg_alpha_bw',
                            labelStyles:{
                                color:'#fff'
                            },
                            labels: !ludo.isMobile,
                            layout: {
                                height:'wrap'
                            },
                            module: this.module, // To make the controller aware of this view
                            background: {
                                borderRadius: 5,
                                horizontal: '../images/board-bg/wood-strip-horizontal.png',
                                vertical: '../images/board-bg/wood-strip-vertical.png'
                            },
                            plugins:[
                                {
                                    type: 'chess.view.highlight.Arrow',
                                    styles:{
                                        fill:'#0288D1',
                                        stroke:'#01579B'
                                    }
                                }
                            ]
                        },
                        {
                            type: 'chess.view.buttonbar.Bar',
                            module: this.module, // To make the controller aware of this view
                            layout: {
                                height: 40

                            },
                            borderRadius:'50%',
                            background:{
                                borderRadius:'20%',
                                paint:{
                                    'stroke-width': '1',
                                    'stroke' : '#daac78'
                                }
                            },

                            styles:{
                                button: {
                                    'stroke': '#444',
                                    'fill': '#444',
                                    'stroke-width': 1
                                },
                                buttonOver: {
                                    'stroke': '#333',
                                    'fill': '#444',
                                    'stroke-width': 1
                                },
                                buttonDown: {
                                    'stroke': '#333',
                                    'fill': '#aeb0b0',
                                    'stroke-width': 1
                                },
                                buttonDisabled: {
                                    'stroke': '#444',
                                    'fill': '#666',
                                    'stroke-width': 1,
                                    'stroke-opacity': 0.7
                                },
                                buttonPlay: {
                                    'stroke': '#C8E6C9',
                                    'fill': '#388E3C',
                                    'stroke-width': 1
                                },
                                image: {fill: '#aeb0b0'},
                                imageOver: {fill: '#aeb0b0'},
                                imageDown: {fill: '#444'},
                                imageDisabled: {
                                    fill: '#aeb0b0',
                                    'fill-opacity': 0.5,
                                    'stroke-opacity': 0.5
                                },
                                imagePlay:{fill: '#C8E6C9'}
                            },

                            buttonSize: function (availSize) {
                                return availSize - (availSize / 4);
                            }
                        }
                    ]
                }
                ,
                {
                    type: 'chess.view.notation.Panel',
                    module: this.module, // To make the controller aware of this view
                    layout: {
                        weight: 1
                    },
                    css:{
                        'padding-top': 30
                    },
                    figurines: 'svg_egg',
                    figurineHeight: 18,
                    showResult: true
                }
            ]
        });

        this.controller = new chess.controller.Controller({
            applyTo: [this.module],// The module the controller should look for.
            pgn: this.pgn // The pgn file
        });

        // Load the selected game from server.
        this.controller.loadGameFromFile(this.gameIndex);

    }


});

$(document).ready(function () {

    var els = $(document.body).find('.dhtmlchess');

    jQuery.each(els, function (i, el) {


        new chess.GameViewer({
            renderTo: el

        });

    });
    console.log(els.length);


});

