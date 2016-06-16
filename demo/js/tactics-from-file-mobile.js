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
    getDialogPuzzleComplete:function () {
        return new ludo.dialog.Alert({
            autoDispose:false,
            height:150,
            width:250,
            css:{
                color:'#1565C0',
                'font-size': '1.1em',
                'padding' : 3
            },
            hidden:true,
            title:'Chess Tactics', // Title of dialog
            html:'Good Job - Puzzle solved. Click OK to load another puzzle',
            listeners:{
                'ok':function () {
                    if(this.gameEndHandler != undefined){
                        this.gameEndHandler.apply(this, [this]);
                    }else{
                        this.loadRandomGame();
                    }
                }.bind(this)
            }
        });
    }
});

chess.TacticsFromFile2016 = new Class({
    Extends: Events,

    renderTo:undefined,
    pgn : undefined,

    controller:undefined,

    initialize:function(config){
        this.renderTo = config.renderTo;
        this.pgn = config.pgn;

        window.addEvent('domready', this.render.bind(this));
    },

    render:function(){
        new ludo.View({
            renderTo:document.id(this.renderTo),
            containerCss:{

                'background-color' : 'transparent'
            },
            layout:{
                type:'fill',
                height:'matchParent',
                width:'matchParent'
            },
            children:[
                {
                    weight:1,
                    layout:'rows',
                    containerCss:{
                        'background-color' : 'transparent'
                    },

                    children:[


                        {
                            layout:{
                                type:'linear',
                                orientation:'horizontal'
                            },
                            css:{
                                'margin-top' : 2,
                                'backgrund-color' : 'transparent'
                            },
                            containerCss:{
                                'margin-top' : 2,
                                'background-color' : 'transparent'
                            },
                            height:50,
                            children:[
                                {
                                    type:'chess.view.message.TacticsMessage',
                                   weight:1,
                                    containerCss:{
                                        'background-color' : 'transparent'
                                    }
                                },
                                {
                                    layout:{ width: 80 },
                                    type:'chess.view.button.TacticHint',
                                    size:'l',
                                    value:chess.getPhrase('Hint'),
                                    containerCss:{
                                        'background-color' : 'transparent'
                                    }
                                },
                                {
                                    layout:{ width: 80 },
                                    type:'chess.view.button.TacticSolution',
                                    size:'l',
                                    value:chess.getPhrase('Solution'),
                                    containerCss:{
                                        'background-color' : 'transparent'
                                    }
                                },{
                                    layout:{ width: 80 },
                                    type:'form.Button',
                                    size:'l',
                                    value:chess.getPhrase('Next Game'),
                                    containerCss:{
                                        'background-color' : 'transparent'
                                    },
                                    listeners:{
                                        click : function(){
                                            this.controller.loadNextGameFromFile();
                                        }.bind(this)
                                    }
                                },{
                                    width:20,
                                    containerCss:{
                                        'background-color' : 'transparent'
                                    }
                                }
                            ]
                        },
                        {
                            type:'chess.view.board.Board',
                            overflow:'visible',
                            pieceLayout:'merida',
                            css:{
                                border:'1px solid',
                                'overflow' : 'visible'
                            },
                            vAlign:'top',
                            labels:true,
                            containerCss:{
                                'background-color' : 'transparent',
                                'overflow' : 'visible'
                            },
                            weight:1,
                            addOns:[
                                {
                                    type:'chess.view.highlight.Arrow',
                                    styles:{
                                        stroke:'#FF8F00',
                                        fill:'#FFC107'
                                    }
                                },
                                {
                                    type:'chess.view.highlight.ArrowTactic',
                                    styles:{
                                        stroke:'#FF8F00',
                                        fill:'#FFC107'
                                    }
                                },
                                {
                                    type:'chess.view.highlight.SquareTacticHint'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        var storageKey = 'key_' + this.pgn + '_tactic';

        this.controller = new chess.controller.DemoController({
            pgn:this.pgn,
            alwaysPlayStartingColor:true,
            autoMoveDelay:400,
            gameEndHandler:function(controller){
                controller.loadNextGameFromFile();
            },
            listeners:{
                'startOfGame' : function(){
                    ludo.getLocalStorage().save(storageKey, this.controller.getCurrentModel().getGameIndex() );
                }.bind(this)
            }
        });

        var index = ludo.getLocalStorage().get(storageKey);
        if(index != undefined){
            this.controller.getCurrentModel().setGameIndex(index);
        }else{
            index = 0;
        }

        this.controller.loadGameFromFile(index);

    }

});