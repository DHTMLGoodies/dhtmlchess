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
        ".ludo-layout-tabs" : {
            "background-color": "inherit; important"
        },
        "body.ludo-twilight": {
            "background-color": "transparent"
        },
        ".ludo-tab-strip": {
            "background-color": "#424242"
        },
        ".ludo-tab-expand-box": {
            "background-color": "#424242"
        },
        ".ludo-tab-strip-tab": {
            "border-color": "#383838"
        },
        ".ludo-tab-close": {
            "background-image": "url(../images/layout/tab-close.png)"
        },
        " .ludo-tab-close-top-over,.ludo-tab-close-bottom-over": {
            "background-image": "url(../images/layout/tab-close-over.png)"
        },
        "div.ludo-tab-strip-tab span": {
            "color": "#aeb0b0",
            "font-size": "0.7em"
        },
        "div.ludo-tab-strip-tab-active span": {
            "color": "#EEE"
        },
        "div.ludo-tab-strip-tab-bg": {
            "border-color": "#383838"
        },
        ".ludo-tab-strip-tab-active div.ludo-tab-strip-tab-bg": {
            "border-color": "#535353 !important"
        },
        ".ludo-tab-strip .ludo-tab-strip-line": {
            "background-color": "#535353",
            "border-color": "#383838"
        },
        ".ludo-tab-strip-bottom .ludo-tab-strip-line": {
            "border-top-width": "0",
            "height": "4px"
        },
        ".ludo-tab-strip-top .ludo-tab-strip-line": {
            "border-bottom-width": "0",
            "height": "4px"
        },
        ".ludo-tab-strip, div.ludo-tab-strip-left div.ludo-body,\n.ludo-tab-strip-top": {
            "border-width": "0"
        },
        "div.ludo-tab-strip-tab-active": {
            "background-color": "#535354"
        },
        " .ludo-grid-Grid .ludo-body": {
            "background-color": "transparent"
        },
        ".ludo-grid div.ludo-resize-handle-active": {
            "background-color": "transparent"
        },
        ".ludo-grid-header-cell": {
            "background-color": "#535353",
            "border-right": "1px solid #424242",
            "border-bottom": "1px solid #424242"
        },
        ".ludo-grid-Grid div.ludo-active-record": {
            "font-weight": "bold",
            "background-color": "#424242"
        },
        ".ludo-grid-Grid .ludo-menu-button-active": {
            "background-color": "#535354",
            "border-left": "1px solid transparent"
        },
        ".ludo-grid-data-container": {
            "color": "#000"
        },
        ".ludo-container-frame": {
            "border-color": "#424242"
        },
        ".ludo-scroller": {
            "background-color": "#535353"
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
