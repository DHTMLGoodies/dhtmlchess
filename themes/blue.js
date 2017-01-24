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
        },
        figurines:'svg_bw'
    },
    'chess.view.notation.Panel': {
        figurines:'svg_bw'
    },
    'chess.view.buttonbar.Bar':{
        borderRadius:'10%',
        styles:{
            button:{
                fill:'#87bbe8',
                stroke:'#3b5773'
            },
            image:{
                fill:'#3b5773'
            },
            buttonOver:{
                fill:'#3b5773'
            },
            imageOver:{
                fill:'#87bbe8'
            },
            buttonDown:{
                fill:'#2e4359'
            },
            imageDown:{
                fill:'#87bbe8'
            },
            buttonDisabled:{
                fill:'#87bbe8'
            },
            imageDisabled:{
                fill:'#3b5773'
            }
        }
    }


};
