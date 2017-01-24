/**
 * CSS and Appearance rules for the brown theme
 *
 */
chess.THEME = {
    name: 'wood1',
    css: {
        ".dhtml-chess-board": {
            "border": "1px solid #e1b886"
        },
        ".dhtml-chess-board-label-ranks-container,.dhtml-chess-board-label-files-container": {},
        ".chess-rank-label-even,  .chess-file-label-odd": {
            "color": "#e1b886"
        },
        "div.dhtml-chess-notation-panel, span.notation-branch, .notation-chess-move": {
            "color": "#333"
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
    }


};
