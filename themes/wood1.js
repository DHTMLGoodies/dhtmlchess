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
    },
    'chess.view.notation.Panel': {
        figurines:'svg_egg'
    },
    'chess.view.buttonbar.Bar':{
        borderRadius:'10%',
        styles:{
            button:{
                fill:'#6e3f31',
                stroke:'#6e3f31'
            },
            image:{
                fill:'#e8bfa0'
            },
            buttonOver:{
                fill:'#6e483c',
                stroke:'#6e3f31'
            },
            imageOver:{
                fill:'#e8bfa0'
            },
            buttonDown:{
                fill:'#8c6445',
                stroke:'#6e3f31'
            },
            imageDown:{
                fill:'#e8bfa0'
            },
            buttonDisabled:{
                fill:'#d5c8c5',
                stroke : '#b38578',
                'stroke-opacity' : 0.3
                // , 'fill-opacity': 0.3
            },
            imageDisabled:{
                fill:'#6e483c',
                'fill-opacity' : 0.3
            }
        }
    }


};


