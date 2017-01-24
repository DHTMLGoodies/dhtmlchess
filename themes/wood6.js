/**
 * CSS and Appearance rules for the brown theme
 *
 */
chess.THEME = {
    name: 'grey-wood',
    borderColor:'#aaa',
    css: {

    },

    'chess.view.board.Board': {
        pieceLayout:'svg_bw',
        labelStyles:{
            'color': '#FFF'
        },

        background:{
            borderRadius:'0.7%',
            horizontal:'[DOCROOT]images/board-bg/grey-wood-strip-horizontal.png',
            vertical:'[DOCROOT]images/board-bg/grey-wood-strip-vertical.png'
        },
        bgWhite: '[DOCROOT]images/board/light-grey-wood.png',
        bgBlack: '[DOCROOT]images/board/grey-wood.png',
        plugins: [
            {
                type: 'chess.view.highlight.Arrow',
                styles:{
                    'fill': '#039BE5',
                    'stroke':'#0D47A1'
                }
            },
            {
                type: 'chess.view.highlight.ArrowTactic',
                styles:{
                    'fill': '#039BE5',
                    'stroke':'#0D47A1'
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
    'chess.view.notation.Panel': {
        figurines:'svg_bw'
    },
    'chess.view.notation.TacticPanel': {
        figurines:'svg_bw',
        css: {
            'text-align': 'center',
            color: '#444'
        }
    }


};
