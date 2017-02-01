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
    },
    'chess.view.buttonbar.Bar':{
        borderRadius:'10%',
        styles:{
            button:{
                fill:'#695f5d',
                stroke:'#695f5d'
            },
            image:{
                fill:'#b7b3b2'
            },
            buttonOver:{
                fill:'#5c5352',
                stroke:'#695f5d'
            },
            imageOver:{
                fill:'#b7b3b2'
            },
            buttonDown:{
                fill:'#b7b3b2',
                stroke:'#695f5d'
            },
            imageDown:{
                fill:'#695f5d'
            },
            buttonDisabled:{
                fill:'#dad7d7',
                stroke : '#b38578',
                'stroke-opacity' : 0.3
               // , 'fill-opacity' : 0.25
            },
            imageDisabled:{
                fill:'#695f5d',
                'fill-opacity' : 0.5
            }
        }
    }


};
