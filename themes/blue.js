/**
 * CSS and Appearance rules for the brown theme
 *
 */
chess.THEME = {
    name: 'blue',
    borderColor:'#aaa',
    css: {

      

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
