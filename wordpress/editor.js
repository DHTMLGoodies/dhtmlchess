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

        var r = jQuery(this.renderTo);
        var w = r.width();
        r.css('height', Math.round(w + 400));
        this.module = String.uniqueID();

        jQuery(document).ready(this.render.bind(this));
    },

    render: function () {

        $(document.body).addClass('ludo-twilight');
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
                            layout: {
                                type: 'docking',
                                tabs: 'left',
                                width: 200,
                                resizable: true
                            },

                            children: [
                                {
                                    title: 'Drafts',
                                    type: 'chess.wordpress.DraftListView',
                                    module:this.module,
                                    css:{
                                        padding:2
                                    },
                                    dataSource: {
                                        type: 'chess.wordpress.Drafts'
                                    }
                                },
                                {
                                    title: 'PGNS',
                                    type: 'ListView',
                                    swipable: false,
                                    module:this.module,
                                    itemRenderer: function (record) {
                                        return '<div><strong>' + record.pgn_name + '</strong><br>' + record.count + '</div> '
                                    },
                                    dataSource: {
                                        type: 'chess.wordpress.PgnList'
                                    }
                                },
                                {
                                    title: 'Games'
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
                                        resizable: true
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
                                            type:'chess.wordpress.CommentView',
                                            title: 'Comments',
                                            module: this.module
                                        },
                                        {
                                            'title': 'Computer Eval',
                                            module:this.module
                                        },
                                        {
                                            title:'Metadata',
                                            module:this.module,
                                            type:'chess.wordpress.GameMetadata'
                                        }

                                    ]

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
                    elCss: {
                        'border-top': '1px solid ' + ludo.$C('border')
                    },
                    css:{
                        padding:4,
                        'background-color' : ludo.$C('border')
                    },
                    children: [
                        {
                            module: this.module,
                            submodule:'wordpress.newgame',
                            type: 'form.Button',
                            value: 'New',
                            layout: {width: 80}
                        },
                        {
                            module: this.module,
                            submodule:'wordpress.newposition',
                            type: 'form.Button',
                            value: 'New Position',
                            layout: {width: 120}
                        },
                        {
                            module: this.module,
                            type:'chess.wordpress.WordpressError',
                            layout:{
                                weight:1, height:25
                            }
                        },
                        {
                            module: this.module,
                            submodule:'wordpress.savedraft',
                            type: 'form.Button',
                            value: 'Save Draft',
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
            garboChess:ludo.config.getDocumentRoot() + '/garbochess/js/garbochess.js',    // Path to garbochess.js, relative to this file
        });
    }
});