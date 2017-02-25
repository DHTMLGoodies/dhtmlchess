/**
 * CSS and Appearance rules for the brown theme
 *
 */
chess.THEME = {
    name: 'grey',
    borderColor:'#aaa',
    css: {


    },

    'chess.view.board.Board': {
        background: {
            borderRadius: ludo.isMobile ? '0.5%' : '1%',
            paint: {
                'fill': '#1a2026'
            }
        },
        pieceLayout:'svg_darkgrey',
        labelOddStyles:ludo.isMobile ? {
            'color': '#fff'
        }: {
            'color': '#fff'
        },
        labelEvenStyles:{
            'color': '#fff'
        },
        padding:ludo.isMobile ? '1%' : '3%',
        labelPos: ludo.isMobile ? 'inside' : 'outside',
        plugins: [
            {
                type: 'chess.view.highlight.Arrow',
                styles: {
                    'fill': '#f77cc5',
                    'stroke': '#888'
                }
            },
            {
                type: 'chess.view.highlight.ArrowTactic',
                styles: {
                    'fill': '#f77cc5',
                    'stroke': '#888'
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
        figurines:'svg_bw'
    },
    'chess.view.notation.Table': {
        figurines:'svg_bw'
    },
    'chess.view.buttonbar.Bar':{
        borderRadius:'10%',
        styles:{
            button:{
                'fill-opacity' : 0,
                'stroke-opacity' : 0
            },
            image:{
                fill:'#777'
            },
            buttonOver:{
                'fill-opacity' : 0,
                'stroke-opacity' : 0
            },
            imageOver:{
                fill:'#555'
            },
            buttonDown:{
                'fill-opacity' : 0,
                'stroke-opacity' : 0
            },
            imageDown:{
                fill:'#444'
            },
            buttonDisabled:{
                'fill-opacity' : 0,
                'stroke-opacity' : 0
                // , 'fill-opacity': 0.3
            },
            imageDisabled:{
                fill:'#555',
                'fill-opacity' : 0.3
            },
            overlay:{
                'fill-opacity' : 0
            }
        }
    }


};
