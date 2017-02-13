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
                fill:'#666',
                stroke:'#bbb'
            },
            image:{
                fill:'#ccc'
            },
            buttonOver:{
                fill:'#777',
                stroke:'#a3a3a3'
            },
            imageOver:{
                fill:'#eee'
            },
            buttonDown:{
                fill:'#555',
                stroke:'#bbb'
            },
            imageDown:{
                fill:'#bbb'
            },
            buttonDisabled:{
                fill:'#888',
                'fill-opacity' : 0.4,
                stroke : '#888'
            },
            imageDisabled:{
                fill:'#555',
                'fill-opacity' : 0.4,
            }
        }
    }


};
