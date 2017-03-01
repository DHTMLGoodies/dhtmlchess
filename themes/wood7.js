/**
 * CSS and Appearance rules for the brown theme
 *
 */
chess.THEME = {
    name: 'wood7',
    borderColor:'#aaa',
    css: {


    },

    'chess.view.board.Board': {
        pieceLayout:'svg_bw',
        labelStyles:{
            'color': '#FFF'
        },
        background:{
            borderRadius:'1.5%',
            paint:{
                fill:'#444',
                stroke:'#666',
                'stroke-width': 1
            }
        },
        bgWhite: '[DOCROOT]images/board/lighter-wood.png',
        bgBlack: '[DOCROOT]images/board/dark-wood.png',
        plugins: [
            {
                type: 'chess.view.highlight.Arrow',
                styles:{
                    'fill':'#669479',
                    'stroke':'#333',
                    'stroke-opacity':1,
                    'stroke-width':1
                }
            },
            {
                type: 'chess.view.highlight.ArrowTactic',
                styles:{
                    'fill':'#669479',
                    'stroke':'#333',
                    'stroke-opacity':1,
                    'stroke-width':1
                }
            },
            {
                type: 'chess.view.highlight.SquareTacticHint'
            }
        ]
    },
    'chess.view.dialog.PuzzleSolved ': {
    },
    'chess.view.notation.TacticPanel': {
        css: {
            'text-align': 'center',
            color: '#444'
        }
    },
    'chess.view.notation.Panel': {
        figurines:'svg_egg'
    },
    'chess.view.notation.Table': {
        figurines:'svg_egg'
    },
    'chess.view.buttonbar.Bar':{
        borderRadius:'10%',
        styles:{
            button:{
                fill:'#444444',
                stroke:'#444444'
            },
            image:{
                fill:'#ddd'
            },
            buttonOver:{
                fill:'#333',
                stroke:'#444444'
            },
            imageOver:{
                fill:'#eee'
            },
            buttonDown:{
                fill:'#aaa',
                stroke:'#444444'
            },
            imageDown:{
                fill:'#444'
            },
            buttonDisabled:{
                fill:'#d5d5d5',
                stroke : '#b3b3b3',
                'stroke-opacity' : 0.3
                // , 'fill-opacity': 0.3
            },
            imageDisabled:{
                fill:'#555',
                'fill-opacity' : 0.3
            }
        }
    }


};


