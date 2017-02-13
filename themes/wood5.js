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
            'color': '#e1b886'
        },
        padding:'3.5%',
        background:{
            borderRadius:'1%',
            horizontal:'[DOCROOT]images/board-bg/wood-strip6-horizontal.png',
            vertical:'[DOCROOT]images/board-bg/wood-strip6-vertical.png',
            paint:{
                'stroke-width': 1,
                'stroke' : '#e1b886'
            }
        },
        bgWhite: '[DOCROOT]images/board/lighter-wood.png',
        bgBlack: '[DOCROOT]images/board/wood8.png',
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
    'chess.view.notation.Table': {
        figurines:'svg_bw'
    },
    'chess.view.buttonbar.Bar':{
        borderRadius:'10%',
        styles:{
            button:{
                fill:'#926a31',
                stroke:'#926a31'
            },
            image:{
                fill:'#e5b787'
            },
            buttonOver:{
                fill:'#805c2b',
                stroke:'#926a31'
            },
            imageOver:{
                fill:'#e5b787'
            },
            buttonDown:{
                fill:'#e5b787',
                stroke:'#926a31'
            },
            imageDown:{
                fill:'#926a31'
            },
            buttonDisabled:{
                fill:'#e5dacc',
                stroke : '#b38578',
                'stroke-opacity' : 0.3
                // , 'fill-opacity' : 0.25
            },
            imageDisabled:{
                fill:'#926a31',
                'fill-opacity' : 0.5
            }
        }
    }


};
