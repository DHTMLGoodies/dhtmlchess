/**
 * CSS and Appearance rules for the brown theme
 *
 */
chess.THEME = {
    name: 'brown',
    borderColor:'#aaa',
    css: {
   

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
        bgWhite: '[DOCROOT]images/board/lighter-wood.png',
        bgBlack: '[DOCROOT]images/board/darker-wood.png',
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
    },
    'chess.view.notation.Panel': {
        figurines:'svg_egg'
    }


};
