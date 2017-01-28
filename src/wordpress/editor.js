/**
 * Created by alfmagne1 on 26/01/2017.
 */
window.chess.isWordPress = true;

chess.WPEditor = new Class({

    Extends: Events,
    renderTo: undefined,

    initialize: function (config) {
        this.renderTo = jQuery(config.renderTo);


        if (config.docRoot) {
            ludo.config.setDocumentRoot(config.docRoot);
        }


        var r = this.renderTo;
        r.css('height', (jQuery(document.body).height()));

        console.log(r.parent().outerHeight(true))
        this.module = String.uniqueID();

        jQuery(document).ready(this.render.bind(this));
        jQuery(window).on('resize', this.onWinResize.bind(this));
    },

    onWinResize:function(){
        this.renderTo.css('height', (jQuery(document.body).height()));
    },

    render: function () {

        jQuery(document.body).addClass('ludo-twilight');
        this.renderTo.addClass('ludo-twilight');

        new chess.view.Chess({
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'linear', orientation: 'vertical',
                height: 'matchParent',
                width: 'matchParent'
            },

            children: [
                {
                    layout: {
                        type: 'linear',
                        orientation: 'horizontal',
                        weight: 1
                    },

                    children: [
                        {
                            module:this.module,
                            css:{
                                'overflow':'hidden'
                            },
                            submodule:'wordpress.dockinglayout',
                            layout: {
                                type: 'docking',
                                tabs: 'left',
                                width: 300,
                                resizable: true,
                                minWidth:50
                            },

                            children: [
                                {
                                    title: 'Drafts',
                                    id:'draftsDockingView',
                                    type: 'FramedView',
                                    elCss:{
                                        'border-left-width' : 0
                                    },
                                    layout: {
                                        type: 'fill'
                                    },
                                    children: [
                                        {
                                            type: 'chess.wordpress.DraftListView',
                                            module: this.module,
                                            css: {
                                                padding: 2
                                            },
                                            dataSource: {
                                                type: 'chess.wordpress.Drafts'
                                            }
                                        }

                                    ]
                                },
                                {
                                    type: 'FramedView',
                                    layout: {
                                        type: 'fill',
                                        visible:true
                                    },
                                    elCss:{
                                        'border-left-width' : 0
                                    },
                                    title: 'PGN Databases',
                                    children: [
                                        {
                                            type: 'chess.wordpress.PgnListView',
                                            module: this.module
                                        }
                                    ]

                                },
                                {
                                    type:'FramedView',
                                    module:this.module,
                                    submodule:'wordpress.gamelisttab',
                                    title: 'Games',
                                    elCss:{
                                        'border-left-width' : 0
                                    },
                                    layout: {
                                        type: 'linear', orientation:'vertical'
                                    },
                                    children:[
                                        {
                                            type:'form.Text',
                                            placeholder:'Search',
                                            id:'searchField',
                                            layout:{
                                                height:30
                                            },

                                            listeners:{
                                                key:function (value) {
                                                    ludo.$('gamelistgrid').getDataSource().search(value);
                                                }
                                            },
                                            elCss:{
                                                'border-bottom' : '1px solid ' + ludo.$C('border')
                                            }
                                        },
                                        {
                                            id:'gamelistgrid',
                                            type:'chess.wordpress.GameListGrid',
                                            module:this.module,
                                            layout:{
                                                weight:1
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            layout: {
                                weight: 1,
                                type: 'linear', orientation: 'vertical'
                            },
                            css: {
                                'border-left': '1px solid ' + ludo.$C('border')
                            },
                            children: [
                                {
                                    type:'chess.wordpress.EditorHeading',
                                    module: this.module,
                                    layout:{
                                        height:20
                                    }
                                },

                                {
                                    module:this.module,
                                    type: 'chess.wordpress.MetadataTitle',
                                    css:{
                                        'text-align' : 'center'
                                    },
                                    layout:{
                                        height:45
                                    }
                                },

                                {
                                    type: 'chess.view.board.Board',
                                    module: this.module,
                                    layout: {
                                        weight: 1
                                    },
                                    squareStyles_white: {
                                        'background-color': '#a3a3a3'
                                    },
                                    squareStyles_black: {
                                        'background-color': '#888888'
                                    },
                                    elCss: {
                                        'margin-top': 5

                                    },
                                    background: {
                                        borderRadius: ludo.isMobile ? '0.5%' : '1%',
                                        paint: {
                                            'fill': '#1a2026'
                                        }
                                    },
                                    pieceLayout: 'svg_darkgrey',
                                    labelOddStyles: ludo.isMobile ? {
                                        'color': '#fff'
                                    } : {
                                        'color': '#fff'
                                    },
                                    labelEvenStyles: {
                                        'color': '#fff'
                                    },
                                    padding: ludo.isMobile ? '1%' : '3%',
                                    labelPos: ludo.isMobile ? 'inside' : 'outside',
                                    plugins: [
                                        {
                                            type: 'chess.view.highlight.Arrow',
                                            styles: {
                                                'fill': '#f77cc5',
                                                'stroke': '#888'
                                            }
                                        },
                                        {
                                            type: 'chess.view.highlight.ArrowTactic',
                                            styles: {
                                                'fill': '#f77cc5',
                                                'stroke': '#888'
                                            }
                                        },
                                        {
                                            type: 'chess.view.highlight.SquareTacticHint'
                                        }
                                    ]
                                },
                                {
                                    type: 'chess.view.buttonbar.Bar',
                                    elCss: {
                                        'border-bottom': '1px solid ' + ludo.$C('border')
                                    },
                                    layout: {
                                        height: 40
                                    },
                                    module: this.module,
                                    borderRadius: '10%',
                                    styles: {
                                        button: {
                                            fill: '#666',
                                            stroke: '#bbb'
                                        },
                                        image: {
                                            fill: '#ccc'
                                        },
                                        buttonOver: {
                                            fill: '#777',
                                            stroke: '#a3a3a3'
                                        },
                                        imageOver: {
                                            fill: '#eee'
                                        },
                                        buttonDown: {
                                            fill: '#555',
                                            stroke: '#bbb'
                                        },
                                        imageDown: {
                                            fill: '#bbb'
                                        },
                                        buttonDisabled: {
                                            fill: '#888',
                                            'fill-opacity': 0.4,
                                            stroke: '#888'
                                        },
                                        imageDisabled: {
                                            fill: '#555',
                                            'fill-opacity': 0.4,
                                        }
                                    }
                                },
                                {

                                    elCss: {
                                        'border-top': '1px solid ' + ludo.$C('border')
                                    },
                                    layout: {
                                        type: 'tabs', tabs: 'top',
                                        height: 250,
                                        resizable: true,
                                        resizePos:'above'
                                    },
                                    children: [
                                        {
                                            title: 'Notations',
                                            type: 'chess.view.notation.Panel',
                                            module: this.module,
                                            figurines: 'svg_bw',
                                            showContextMenu: true

                                        },
                                        {
                                            type: 'chess.wordpress.CommentView',
                                            title: 'Comments',
                                            module: this.module
                                        },
                                        {
                                            'title': 'Computer Eval',
                                            module: this.module
                                        },
                                        {
                                            title: 'Metadata',
                                            module: this.module,
                                            type: 'chess.wordpress.GameMetadata'
                                        }

                                    ]

                                },
                                {
                                    elCss: {
                                        'border-top': '1px solid ' + ludo.$C('border')
                                    },
                                    module: this.module,
                                    type: 'chess.wordpress.WordPressMessage',
                                    layout:{
                                        height:20
                                    },
                                    css:{
                                        'line-height' : '20px'
                                    }
                                }
                            ]
                        }

                    ]
                },
                {
                    layout: {
                        height: 35,
                        type: 'linear',
                        orientation: 'horizontal'

                    },

                    css: {
                        padding: 4,
                        'background-color': ludo.$C('border')
                    },
                    children: [
                        {
                            module: this.module,
                            submodule: 'wordpress.newgame',
                            type: 'form.Button',
                            value: 'New',
                            layout: {width: 80}
                        },
                        {
                            module: this.module,
                            submodule: 'wordpress.newposition',
                            type: 'form.Button',
                            value: 'New Position',
                            layout: {width: 120}
                        },
                        {
                            layout: {
                                weight: 1, height: 25
                            }
                        },
                        {
                            type:'chess.wordpress.UpdateGameButton',
                            module: this.module,
                            layout: {
                                width: 80
                            }
                        },
                        {
                            module:this.module,
                            hidden:true,
                            type:'chess.wordpress.DiscardDraftButton',
                            layout:{
                                width:80
                            }
                        },
                        {
                            type:'chess.wordpress.PublishButton',
                            module: this.module,
                            layout: {
                                width: 80
                            }
                        },
                        {
                            type:'chess.wordpress.DraftButton',
                            module: this.module,
                            layout: {
                                width: 80
                            }
                        }
                    ]
                }

            ]


        });

        this.controller = new chess.wordpress.WordpressController({
            applyTo: [this.module],
            garboChess: ludo.config.getDocumentRoot() + '/garbochess/js/garbochess.js'    // Path to garbochess.js, relative to this file
        });
    }
});