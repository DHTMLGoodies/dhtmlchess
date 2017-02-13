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
        pieceLayout:'svg_alpha_egg',
        labelStyles:{
            'color': '#FFF'
        },
        background:{
            borderRadius:'1%',
            horizontal:'[DOCROOT]images/board-bg/wood-strip2-horizontal.png',
            vertical:'[DOCROOT]images/board-bg/wood-strip2-vertical.png'
        },
        bgWhite: '[DOCROOT]images/board/lightest-wood.png',
        bgBlack: '[DOCROOT]images/board/wood-cherry.png',
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
        },
        figurines:'svg_bw'
    },
    'chess.view.notation.Panel': {
        figurines:'svg_bw'
    },
    'chess.view.notation.Table': {
        figurines:'svg_bw'
    },
    'chess.view.buttonbar.Bar':{
        borderRadius:'10%',
        styles:{
            button:{
                fill:'#9d4a2a',
                stroke:'#9d4a2a'
            },
            image:{
                fill:'#fed6a1'
            },
            buttonOver:{
                fill:'#b86544',
                stroke:'#9d4a2a'
            },
            imageOver:{
                fill:'#fed6a1'
            },
            buttonDown:{
                fill:'#fed6a1',
                stroke:'#9d4a2a'
            },
            imageDown:{
                fill:'#9d4a2a'
            },
            buttonDisabled:{
                fill:'#eddcd5',
                stroke : '#b38578',
                'stroke-opacity' : 0.3
            },
            imageDisabled:{
                fill:'#9d4a2a',
                'fill-opacity' : 0.5
            }
        }
    }


};
