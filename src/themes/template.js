/**
 * CSS and Appearance rules for the brown theme
 *
 */
chess.THEME = {
    name: 'Enter name',
    css: {
        '.dhtml-chess-board ': {
            'border': '1px solid #e7caa3'
        },

        '.dhtml-chess-board-label-inside ': {
            'font-size': '10px !important'

        },
        '.dhtml-chess-board-label-inside .dhtml-chess-board-label-file': {
            'text-align': 'right',
            'padding-right': '4px'
        },

        '.dhtml-chess-board-label-inside .dhtml-chess-board-label-rank': {
            'padding-left': '2px',
            'padding-top': '2px'
        },

        '.dhtml-chess-board-container': {
            'background-color': 'transparent',
            'border': '1px solid #b58159',
            'border-radius': '5px'

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
            'background-color': '#e7caa3'

        },

        '.dhtml-chess-square-black ': {
            'background-image': 'none !important',
            'background-color': '#b48059'

        },

        '.dhtml-chess-board-label-ranks-container,.dhtml-chess-board-label-files-container ': {
            'color': '#fffffb'
        },

        'div.dhtml-chess-notation-panel ': {
            'text-align': 'center'
        },

        'div.dhtml-chess-notation-panel, span.notation-branch, .ludo-twilight .notation-chess-move ': {
            'color': '#b58159'
        },

        /** Highlighted notation styles */
        '.ludo-twilight span.notation-chess-move-highlighted ': {
            'background-color': '#b58159',
            'color': '#FFF',
            'border-radius': '3px'
        },

        '.dhtml-chess-board-label-even': {
            'color': '#b58159'
        },
        '.dhtml-chess-board-label-odd': {
            'color': '#e7caa3'
        },
        '.dhtml-chess-square-highlight ': {
            'background-color': '#598db5',
            'border-width': '0'
        },

        '.ludo-twilight .ludo-view ': {
            'background-color': 'transparent'
        },

        '.dhtml-chess-view-metadata-game div.ludo-body ': {
            'color': '#333'
        },

        'body.ludo-twilight ': {
            'background-color': 'transparent'
        },
        '.ludo-twilight .ludo-form-button .ludo-body ': {
            'border': '1px solid #9c6f4e',
            'background-color': '#b58159',
            'color': '#fff'
        },

        '.ludo-twilight .ludo-form-button div.ludo-form-button-over ': {
            'border': '1px solid #694b34'
        },

        /* Button click style */
        '.ludo-twilight .ludo-form-button div.ludo-form-button-down ': {
            'background-color': '#9c6f4e',
            'color': '#FFF',
            'border': '1px solid #9c6f4e'
        },

        '.ludo-twilight div.ludo-window ': {
            'background-color': '#b58159'
        },

        '.ludo-twilight .ludo-window > .ludo-body ': {
            'border': '1px solid #9c6f4e',
            'color': '#FFF',
            'padding': '3px'
        },
        'div.ludo-body': {
            'color' : '#444'
        }

    },

    'chess.view.board.Board': {
        background: {
            borderRadius: '0.5%',
            paint: {
                'fill': '#9c6f4c'
            }
        },
        padding:'1%',
        labelPos: 'inside',
        bgWhite: ludo.config.getDocumentRoot() + 'images/board/lighter-wood.png',
        bgBlack: ludo.config.getDocumentRoot() + 'images/board/darker-wood.png',
        plugins: [
            {
                type: 'chess.view.highlight.Arrow',
                styles: {
                    'fill': '#598db5',
                    'stroke': '#406582'
                }
            },
            {
                type: 'chess.view.highlight.ArrowTactic',
                styles: {
                    'fill': '#598db5',
                    'stroke': '#406582'
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
