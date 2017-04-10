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
            'color': '#000'
        },
        background:{
            borderRadius:'1.5%',
            paint:{
                'fill' : '#c59447',
                'stroke' : '#8f672e',
                'stroke-width' : 1
            },
            iePaint:{
                fill:'#c59447'
            }
        },
        bgWhite: '[DOCROOT]images/board/lightest-wood.png',
        bgBlack: '[DOCROOT]images/board/light-wood.png',
        plugins: [
            {
                type: 'chess.view.highlight.Arrow',
                styles:{
                    'fill':'#45994f',
                    'stroke':'#45994f',
                    'stroke-opacity':0.8,
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
            button: {
                'fill-opacity': 0,
                'stroke-opacity': 0
            },
            image: {
                fill: '#777'
            },
            buttonOver: {
                'fill-opacity': 0,
                'stroke-opacity': 0
            },
            imageOver: {
                fill: '#555'
            },
            buttonDown: {
                'fill-opacity': 0,
                'stroke-opacity': 0
            },
            imageDown: {
                fill: '#444'
            },
            buttonDisabled: {
                'fill-opacity': 0,
                'stroke-opacity': 0
                // , 'fill-opacity': 0.3
            },
            imageDisabled: {
                fill: '#555',
                'fill-opacity': 0.3
            }
        }
    }


};


