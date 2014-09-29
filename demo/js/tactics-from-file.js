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

chess.TacticsFromFile = new Class({
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
                            type:'chess.view.message.TacticsMessage',
                            height:25,
                            containerCss:{
                                'background-color' : 'transparent'
                            }
                        },
                        {
                            type:'chess.view.board.Board',
                            overflow:'hidden',
                            chessSet:'alphapale',
                            boardCss:{
                                border:0
                            },
                            labels:true,
                            containerCss:{
                                'background-color' : 'transparent'
                            },
                            weight:1,
                            addOns:[
                                {
                                    type:'chess.view.highlight.Arrow'
                                },
                                {
                                    type:'chess.view.highlight.ArrowTactic'
                                },
                                {
                                    type:'chess.view.highlight.SquareTacticHint'
                                }
                            ]
                        },
                        {
                            height:25,
                            type:'chess.view.metadata.Game',
                            tpl:'{white} vs {black}, {date}',
                            css:{
                                'text-align' : 'center',
                                'overflow-y':'auto',
                                'background-color':'#FFF'
                            }
                        },
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
                                'background-color' : 'transparent'
                            },
                            height:30,
                            children:[
                                { weight:1,
                                    containerCss:{
                                        'background-color' : 'transparent'
                                    } },
                                {
                                    layout:{ width: 80 },
                                    type:'chess.view.button.TacticHint',
                                    value:chess.getPhrase('Hint'),
                                    containerCss:{
                                        'background-color' : 'transparent'
                                    }
                                },
                                {
                                    layout:{ width: 80 },
                                    type:'chess.view.button.TacticSolution',
                                    value:chess.getPhrase('Solution'),
                                    containerCss:{
                                        'background-color' : 'transparent'
                                    }
                                },{
                                    layout:{ width: 80 },
                                    type:'form.Button',
                                    value:chess.getPhrase('Next Game'),
                                    containerCss:{
                                        'background-color' : 'transparent'
                                    },
                                    listeners:{
                                        click : function(){
                                            this.controller.loadNextGameFromFile();
                                        }.bind(this)
                                    }
                                },
                                {
                                    weight:1,
                                    containerCss:{
                                        'background-color' : 'transparent'
                                    }
                                }
                            ]
                        },
                        {
                            height:50,
                            comments:false,
                            type:'chess.view.notation.TacticPanel'
                        }
                    ]
                }
            ]
        });

        var storageKey = 'key_' + this.pgn + '_tactic';

        this.controller = new chess.controller.TacticControllerGui({
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