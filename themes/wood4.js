/**
 * CSS and Appearance rules for the brown theme
 *
 */
chess.THEME = {
    name: 'wood1',
    css: {},

    'chess.view.board.Board': {
        pieceLayout: 'svg_alpha_egg',
        labelStyles: {
            'color': '#333'
        },
        padding: '3.5%',
        background: {
            borderRadius: '1%',
            horizontal: '[DOCROOT]images/board-bg/wood-strip5-horizontal.png',
            vertical: '[DOCROOT]images/board-bg/wood-strip5-vertical.png',
            paint: {
                'stroke-width': 1,
                'stroke': '#a45834'
            },
            iePaint: {fill: '#d09f6e'}
        },
        bgWhite: '[DOCROOT]images/board/lightest-wood.png',
        bgBlack: '[DOCROOT]images/board/wood6.png',
        plugins: [
            {
                type: 'chess.view.highlight.Arrow',
                styles: {
                    'fill': '#039BE5',
                    'stroke': '#0D47A1'
                }
            },
            {
                type: 'chess.view.highlight.ArrowTactic',
                styles: {
                    'fill': '#039BE5',
                    'stroke': '#0D47A1'
                }
            },
            {
                type: 'chess.view.highlight.SquareTacticHint'
            }
        ]
    },
    'chess.view.dialog.PuzzleSolved ': {},
    'chess.view.notation.TacticPanel': {
        css: {
            'text-align': 'center',
            color: '#444'
        }
    },
    'chess.view.notation.Panel': {
        figurines: 'svg_bw'
    },
    'chess.view.notation.Table': {
        figurines: 'svg_bw'
    },
    'chess.view.buttonbar.Bar': {
        borderRadius: '10%',
        styles: {
            button: {
                fill: '#c67a49',
                stroke: '#c67a49'
            },
            image: {
                fill: '#fcd5a0'
            },
            buttonOver: {
                fill: '#ad6c40',
                stroke: '#c67a49'
            },
            imageOver: {
                fill: '#fcd5a0'
            },
            buttonDown: {
                fill: '#fcd5a0',
                stroke: '#c67a49'
            },
            imageDown: {
                fill: '#c67a49'
            },
            buttonDisabled: {
                fill: '#f0d7c9',
                stroke: '#b38578',
                'stroke-opacity': 0.3
            },
            imageDisabled: {
                fill: '#c67a49',
                'fill-opacity': 0.5
            }
        }
    }


};
