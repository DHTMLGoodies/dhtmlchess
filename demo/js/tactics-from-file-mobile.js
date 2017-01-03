/**
 * Usage:
 *
 * new chess.TacticsFromFile2016({
            renderTo:'chessContainer',
            pgn:'sample'
    })
 *
 * where "chessContainer" is id of an html element and "sample" is the name
 * of a pgn file inside the pgn folder(sample.pgn)
 * @type {Class}
 */


/** Creating custom controller for handling end of games */
chess.controller.DemoController = new Class({
    Extends: chess.controller.TacticControllerGui,

    /** Show a dialog when the puzzle has been solved - Click on OK will load next game **/
    getDialogPuzzleComplete: function () {
        return ludo.get('puzzleCompleteView');

    }
});

chess.TacticsFromFile2016 = new Class({
    Extends: Events,

    renderTo: undefined,
    pgn: undefined,

    controller: undefined,

    initialize: function (config) {
        this.renderTo = config.renderTo;
        if(this.renderTo.substr(0,1) != "#")this.renderTo = "#" + this.renderTo;
        this.pgn = config.pgn;

        $(document).ready(this.render.bind(this));
    },

    render: function () {
        // Render the views
        new ludo.View({
            renderTo: $(this.renderTo),
            elCss: {
                'background-color': 'transparent' // default background color is white, set transparent for this demo.
            },
            layout: {
                type: 'relative',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [

                {
                    layout: {
                        type: 'fill', width: 'matchParent', height: 'matchParent'
                    },
                    elCss: {

                        'background-color': 'transparent'
                    },
                    children: [
                        {
                            weight: 1,
                            layout: 'rows',
                            elCss: {
                                'background-color': 'transparent'
                            },

                            children: [


                                {
                                    layout: {
                                        type: 'linear',
                                        orientation: 'horizontal'
                                    },
                                    css: {
                                        'margin-top': 2,
                                        'backgrund-color': 'transparent'
                                    },
                                    elCss: {
                                        'margin-top': 2,
                                        'background-color': 'transparent'
                                    },
                                    height: 50,
                                    children: [
                                        {
                                            /* Tactic message module - showing good move, wrong move, color to move automatically */
                                            type: 'chess.view.message.TacticsMessage',
                                            autoHideAfterMs: false,
                                            weight: 1,
                                            elCss: {
                                                'background-color': 'transparent'
                                            }
                                        },
                                        {
                                            /* Tactic button hint - will highlight square to move from automatically */
                                            layout: {width: 80},
                                            type: 'chess.view.button.TacticHint',
                                            size: 'l',
                                            value: chess.getPhrase('Hint'),
                                            elCss: {
                                                'background-color': 'transparent'
                                            }
                                        },
                                        {
                                            /** Tactic button solution - will show corrrect move using arrows or from-to square automatically */
                                            layout: {width: 80},
                                            type: 'chess.view.button.TacticSolution',
                                            size: 'l',
                                            value: chess.getPhrase('Solution'), // You can type a string here instead(example: 'Solution') if you only supports 1 language
                                            elCss: {
                                                'background-color': 'transparent'
                                            }
                                        }, {
                                            /** Button loading another puzzle */
                                            layout: {width: 80},
                                            type: 'form.Button',
                                            size: 'l',
                                            value: chess.getPhrase('Next Game'),
                                            elCss: {
                                                'background-color': 'transparent'
                                            },
                                            listeners: {
                                                click: function () {
                                                    this.controller.loadNextGameFromFile();
                                                }.bind(this)
                                            }
                                        }, {
                                            width: 20,
                                            elCss: {
                                                'background-color': 'transparent'
                                            }
                                        }
                                    ]
                                },
                                {
                                    type: 'chess.view.board.Board',
                                    overflow: 'visible',
                                    pieceLayout: 'merida', // Chess pieces to use, example: 'merida','alpha', 'alphapale','cases','kingdom','leipzig', 'meridapale','motif','smart','traveler' (names can be found inside the images folder. It's the prefix which is followed by size and type
                                    css: {
                                        border: '1px solid',
                                        'overflow': 'visible'
                                    },
                                    vAlign: 'top', // can be center
                                    labels: true, // show labels for ranks, A-H, 1-8
                                    labelPos:'inside', // show labels inside board, default is 'outside'
                                    elCss: {
                                        'background-color': 'transparent',
                                        'overflow': 'visible'
                                    },
                                    weight: 1,
                                    /** List of addons to implement */
                                    plugins: [
                                        {
                                            /** Arrow for highlighting active moves, chess.view.highlight.Square is an alternative which will highlight from and to square instead of showing arrows.*/
                                            type: 'chess.view.highlight.Arrow',
                                            styles: {
                                                stroke: '#FF8F00',
                                                fill: '#FFC107'
                                            }
                                        },
                                        {
                                            /** Add On for arrows for tactic solutions */
                                            type: 'chess.view.highlight.ArrowTactic',
                                            styles: {
                                                stroke: '#FF8F00',
                                                fill: '#FFC107'
                                            }
                                        },
                                        {
                                            /** Add on for highlighting hints, ie highlighting square to move from */
                                            type: 'chess.view.highlight.SquareTacticHint'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    /** View to show when a puzzle is solved. This view is initially hidden, but will be shown automatically when a puzzle is solved. It is referred to by chess.controller.DemoController at the top of this page.*/
                    id: 'puzzleCompleteView',
                    layout: {
                        centerInParent: true,
                        type: 'relative',
                        width: '50%',
                        height: '30%'
                    },
                    css:{
                        padding:10
                    },
                    elCss: {
                        'borderRadius': '5px',
                        'background-color': '#1976D2',
                        'border': '1px solid #1976D2'
                    },
                    children: [
                        {
                            html: 'Good Job. Puzzle Solved',
                            css:{
                                'font-size' : '1.5em',
                                'text-align' : 'center'
                            },
                            layout:{
                                centerInParent:true, width:'100%'
                            },
                            elCss: {

                                'background-color': 'transparent'
                            }
                        },{
                            /** Next puzzle button. Click event will load a new puzzle */
                            type:'form.Button',
                            value:'Next Puzzle',
                            layout:{
                                alignParentBottom:true,
                                alignParentRight:true
                            },
                            listeners:{
                                'click' : function(){
                                    ludo.get('puzzleCompleteView').hide();
                                    if (this.controller.gameEndHandler != undefined) {
                                        this.controller.gameEndHandler.apply(this.controller, [this.controller]);
                                    } else {
                                        this.controller.loadRandomGame();
                                    }
                                }.bind(this)
                            },
                            size:'xl' // Extra large button
                        }
                    ]

                }


            ]
        });

        var storageKey = 'key_' + this.pgn + '_tactic';

        this.controller = new chess.controller.DemoController({
            pgn: this.pgn,
            alwaysPlayStartingColor: true,
            autoMoveDelay: 400,
            gameEndHandler: function (controller) {
                controller.loadNextGameFromFile();
            },
            listeners: {
                'startOfGame': function () {
                    ludo.getLocalStorage().save(storageKey, this.controller.getCurrentModel().getGameIndex());
                }.bind(this)
            }
        });

        var index = ludo.getLocalStorage().get(storageKey);
        if (index != undefined) {
            this.controller.getCurrentModel().setGameIndex(index);
        } else {
            index = 0;
        }

        this.controller.loadGameFromFile(index);

        ludo.get('puzzleCompleteView').hide();

    }

});