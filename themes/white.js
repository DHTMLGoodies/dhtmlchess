chess.THEME = {
    'chess.view.board.Board': {
        background: {
            borderRadius: 0,
            paint: {
                'fill': '#a2bdd9'
            }
        },
        labelOddStyles: {
            color: '#000'
        },
        labelEvenStyles: {
            'color': '#000'
        },
        padding: 1,
        labelPos: 'inside',
        pieceLayout: 'svg_bw',
        plugins: [
            {
                type: 'chess.view.highlight.Arrow',
                styles:{
                    'fill': '#E57373',
                    'stroke':'#D32F2F',
                    'stroke-width' : 1,
                    'stroke-opacity' : 0.6
                }
            },
            {
                type: 'chess.view.highlight.ArrowTactic',
                styles:{
                    'fill': '#7ecf7f',
                    'stroke':'#5f9c60'
                }
            },
            {
                type: 'chess.view.highlight.SquareTacticHint'
            }
        ]
    },
    'chess.view.buttonbar.Bar': {
        borderRadius: '10%',
        styles: {
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