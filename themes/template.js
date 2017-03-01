/**
 * CSS and Appearance rules for the brown theme
 *
 */
chess.THEME = {
    name: 'NAME_OF_THEME',
    css: {
        /* CSS STYLING **/
        ".dhtml-chess-board": {
            "border": "1px solid #a45834"
        },
        ".dhtml-chess-board-label-ranks-container,.dhtml-chess-board-label-files-container": {},
        ".chess-rank-label-odd, .chess-file-label-even": {
            "color": "#f6cc96"
        },
        ".chess-rank-label-even,  .chess-file-label-odd": {
            "color": "#f6cc96"
        },
        /* Styling of notation moves */
        "div.dhtml-chess-notation-panel, span.notation-branch, .notation-chess-move": {
            "color": "#333"
        },
        /* Styling of highlighted notation moves */
        "span.notation-chess-move-highlighted": {
            "background-color": "#0D47A1",
            "color": "#FFF",
            "border-radius": "3px"
        },
        ".dhtml-chess-square-highlight": {
            "background-color": "#0D47A1",
            "border-width": "0"
        },
        /* Styling of popup windows */
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
            'color': '#333'
        },
        padding:'3.5%',
        background:{
            borderRadius:'1%',
            horizontal:'[DOCROOT]images/board-bg/wood-strip5-horizontal.png',
            vertical:'[DOCROOT]images/board-bg/wood-strip5-vertical.png',
            paint:{
                'stroke-width': 1,
                'stroke' : '#a45834'
            }
        },
        bgWhite: '[DOCROOT]images/board/lightest-wood.png',
        bgBlack: '[DOCROOT]images/board/wood-1.png',
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
    },
    'chess.view.notation.TacticPanel': {
        css: {
            'text-align': 'center',
            color: '#444'
        }
    }
};
