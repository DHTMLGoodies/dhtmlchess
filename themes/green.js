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
                'fill': '#357044'
            }
        },
        labelOddStyles:ludo.isMobile ? {
            'color': '#fff'
        }: {
            'color': '#fff'
        },
        labelEvenStyles:{
            'color': '#fff'
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
