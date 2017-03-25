/**
 * CSS and Appearance rules for the brown theme
 *
 */
chess.THEME = {
    name: 'brown',
    borderColor:'#aaa',
    css: {
   

    },

    'chess.view.board.Board': {
        background: {
            borderRadius: ludo.isMobile ? '0.5%' : '1%',
            paint: {
                'fill': '#9c6f4c'
            }
        },

        labelOddStyles:ludo.isMobile ? {
            'color': '#b58159'
        }: {
            'color': '#e7caa3'
        },
        labelEvenStyles:{
            'color': '#e7caa3'
        },
        padding:ludo.isMobile ? '1%' : '3%',
        labelPos: ludo.isMobile ? 'inside' : 'outside',
        plugins: [
            {
                type: 'chess.view.highlight.Arrow',
                styles: {
                    'fill': '#598db5',
                    'stroke': '#406582'
                }
            },
            {
                type: 'chess.view.highlight.ArrowTactic',
                styles: {
                    'fill': '#598db5',
                    'stroke': '#406582'
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
    'chess.view.notation.LastMove': {
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
