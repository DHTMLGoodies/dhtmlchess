/**
 * CSS and Appearance rules for the brown theme
 *
 */
chess.THEME = {
    name: 'wood1',
    css: {
        ".dhtml-chess-board": {
            "border": "1px solid #daac78"
        },
        "div.dhtml-chess-notation-panel, span.notation-branch, .notation-chess-move": {
            "color": "#0D47A1"
        },
        "span.notation-chess-move-highlighted": {
            "background-color": "#0D47A1",
            "color": "#FFF",
            "border-radius": "3px"
        },
        ".dhtml-chess-square-highlight": {
            "background-color": "#0D47A1",
            "border-width": "0"
        },
        "div.ludo-window": {
            "background-color": "#535353"
        },
        ".ludo-view": {
            "background-color": "transparent"
        },
        ".dhtml-chess-view-metadata-game div.ludo-body": {
            "color": "#333"
        },
        "body.ludo-twilight": {
            "background-color": "transparent"
        }
    },

    'chess.view.board.Board': {
        pieceLayout:'svg_bw',
        labelStyles:{
            'color': '#FFF'
        },
        background:{
            borderRadius:'1%',
            horizontal:ludo.config.getDocumentRoot() + 'images/board-bg/wood-strip-horizontal.png',
            vertical:ludo.config.getDocumentRoot() + 'images/board-bg/wood-strip-vertical.png'
        },
        bgWhite: ludo.config.getDocumentRoot() + 'images/board/lighter-wood.png',
        bgBlack: ludo.config.getDocumentRoot() + 'images/board/darker-wood.png',
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
    }


};
