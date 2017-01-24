/**
 * CSS and Appearance rules for the brown theme
 *
 */
chess.THEME = {
    name: 'wood1',
    borderColor:'#aaa',
    css: {

        
    },

    'chess.view.board.Board': {
        pieceLayout:'svg_bw',
        labelStyles:{
            'color': '#FFF'
        },
        background:{
            borderRadius:'1%',
            horizontal:'[DOCROOT]images/board-bg/wood-strip-horizontal.png',
            vertical:'[DOCROOT]images/board-bg/wood-strip-vertical.png'
        },
        bgWhite: '[DOCROOT]images/board/lighter-wood.png',
        bgBlack: '[DOCROOT]images/board/darker-wood.png',
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
    'chess.view.notation.TacticPanel': {
        css: {
            'text-align': 'center',
            color: '#444'
        }
    }


};


