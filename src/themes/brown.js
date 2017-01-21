/**
 * CSS and Appearance rules for the brown theme
 *
 */
chess.THEME = {
    name: 'brown',
    css: {
        '.dhtml-chess-board-label-inside .dhtml-chess-board-label-file': {
            'text-align': 'right',
            'padding-right': '4px'
        },

        '.dhtml-chess-board-label-inside .dhtml-chess-board-label-rank': {
            'padding-left': '2px',
            'padding-top': '2px'
        },

        '.chess-board-label-inside span ': {
            'padding-left': '2px',
            'padding-right': '2px'
        },

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

        'div.dhtml-chess-notation-panel, span.notation-branch, .notation-chess-move ': {
            'color': '#4E342E'
        },

        /** Highlighted notation styles */
        'span.notation-chess-move-highlighted ': {
            'background-color': '#b48059',
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

        'body.ludo-twilight ': {
            'background-color': 'transparent'
        },
        '.ludo-form-button .ludo-body ': {
            'border': '1px solid #9c6f4e',
            'background-color': '#b58159',
            'color': '#fff'
        },

        '.ludo-form-button div.ludo-form-button-over ': {
            'border': '1px solid #694b34'
        },

        /* Button click style */
        '.ludo-form-button div.ludo-form-button-down ': {
            'background-color': '#9c6f4e',
            'color': '#FFF',
            'border': '1px solid #9c6f4e'
        },

        'div.ludo-window ': {
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
            borderRadius: ludo.isMobile ? '0.5%' : '1%',
            paint: {
                'fill': '#9c6f4c'
            }
        },

        labelOddStyles:ludo.isMobile ? {
            'color': '#b58159'
        }: {
            'color': '#e7caa3'
        },
        labelEvenStyles:{
            'color': '#e7caa3'
        },
        padding:ludo.isMobile ? '1%' : '3%',
        labelPos: ludo.isMobile ? 'inside' : 'outside',
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
