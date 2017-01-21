/**
 * CSS and Appearance rules for the brown theme
 *
 */
chess.THEME = {
    name: 'blue',
    css: {

        '.dhtml-chess-board-label-inside .dhtml-chess-board-label-file': {
            'text-align': 'right',
            'padding-right': '4px'
        },

        '.dhtml-chess-board-label-inside .dhtml-chess-board-label-rank': {
            'padding-left': '2px',
            'padding-top': '2px'
        },


        '.ludo-layout-resize-col ': {
            'border-left': '1px solid #aaa',
            'border-right': 'px solid #aaa'
        },

        '.chess-board-label-inside span ': {
            'padding-left': '2px',
            'padding-right': '2px'
        },

        /** custom square background */

        '.dhtml-chess-square-white ': {
            'background-image': 'none !important',
            'background-color': '#FFF8E1'

        },

        '.dhtml-chess-square-black ': {
            'background-image': 'none !important',
            'background-color': '#7fa6cf'

        },

        '.dhtml-chess-board-label-ranks-container,.dhtml-chess-board-label-files-container ': {
            'color': '#fffffb'
        },

        'div.dhtml-chess-notation-panel, span.notation-branch, .notation-chess-move ': {
            'color': '#486a8c'
        },

        /** Highlighted notation styles */
        'span.notation-chess-move-highlighted ': {
            'background-color': '#486a8c',
            'color': '#FFF',
            'border-radius': '3px'
        },

        '.dhtml-chess-square-highlight ': {
            'background-color': '#598db5',
            'border-width': '0'
        },

        '.ludo-view ': {
            'background-color': 'transparent'
        },

        '.dhtml-chess-view-metadata-game div.ludo-body ': {
            'color': '#333'
        },

        'body': {
            'background-color': 'transparent'
        },
        '.ludo-form-button .ludo-body ': {
            'border': '1px solid #3b5773',
            'background-color': '#486a8c',
            'color': '#fff'
        },

        '.ludo-form-button div.ludo-form-button-over ': {
            'border': '1px solid #694b34'
        },

        /* Button click style */
        '.ludo-form-button div.ludo-form-button-down ': {
            'background-color': '#3b5773',
            'color': '#FFF',
            'border': '1px solid #3b5773'
        },

        'div.ludo-window ': {
            'background-color': '#486a8c'
        },

        '.ludo-window > .ludo-body ': {
            'border': '1px solid #3b5773',
            'color': '#FFF',
            'padding': '3px'
        },
        'div.ludo-body': {
            'color' : '#444'
        }

    },

    'chess.view.board.Board': {
        background: {
            borderRadius: ludo.isMobile ? '0.5%' : '1%',
            paint: {
                'fill': '#5c89b6'
            }
        },
        labelPos: 'outside',
        pieceLayout:'svg_alpha_bw',
        plugins: [
            {
                type: 'chess.view.highlight.Arrow',
                styles:{
                    'fill': '#7ecf7f',
                    'stroke':'#486a8c'
                }
            },
            {
                type: 'chess.view.highlight.ArrowTactic',
                styles:{
                    'fill': '#7ecf7f',
                    'stroke':'#486a8c'
                }
            },
            {
                type: 'chess.view.highlight.SquareTacticHint'
            }
        ]
    },
    'chess.view.dialog.PuzzleSolved ': {
        title: 'Nice one.',
        html: 'You solved this chess puzzle. Click OK to load next.'
    },
    'chess.view.notation.TacticPanel': {
        css: {
            'text-align': 'center',
            color: '#444'
        }
    }


};
