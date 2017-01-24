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
            'color': '#f6cc96'
        },
        background:{
            borderRadius:'1%',
            horizontal:'[DOCROOT]images/board-bg/red-wood-strip-horizontal.png',
            vertical:'[DOCROOT]images/board-bg/red-wood-strip-vertical.png'
        },
        bgWhite: '[DOCROOT]images/board/lightest-wood.png',
        bgBlack: '[DOCROOT]images/board/dark-wood-2.png',
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
    },
    'chess.view.notation.Panel': {
        figurines:'svg_bw'
    },
    'chess.view.buttonbar.Bar':{
        borderRadius:'10%',
        styles:{
            button:{
                fill:'#380a06',
                stroke:'#9c6f4c'
            },
            image:{
                fill:'#f5cc98'
            },
            buttonOver:{
                fill:'#541f1a',
                stroke:'#9c6f4c'
            },
            imageOver:{
                fill:'#e8bfa0'
            },
            buttonDown:{
                fill:'#f5cc98',
                stroke:'#380a06'
            },
            imageDown:{
                fill:'#380a06'
            },
            buttonDisabled:{
                fill:'#c5b6b5',
                stroke : '#380a06',
                'stroke-opacity' : 0.3
            },
            imageDisabled:{
                fill:'#380a06'
            }
        }
    }


};
