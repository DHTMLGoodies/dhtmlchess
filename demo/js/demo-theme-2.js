chess.GameViewer = new Class({

    renderTo: undefined,
    pgn: undefined,
    gameIndex: undefined,
    module: undefined,

    initialize: function (config) {

        this.renderTo = jQuery(config.renderTo);

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
                            labels: !ludo.isMobile,
                            layout: {
                                height:'wrap'
                            },
                            module: this.module, // To make the controller aware of this view
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
                            elCss: {
                                margin: 2
                            },
                            layout: {
                                height: 40

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

jQuery(document).ready(function () {

    var els = jQuery(document.body).find('.dhtmlchess');

    jQuery.each(els, function (i, el) {


        new chess.GameViewer({
            renderTo: el

        });

    });
    console.log(els.length);


});

