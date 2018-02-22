chess.action.Handler = new Class({

    board: undefined,
    arrowPool: undefined,
    highlightPool: undefined,

    arrowStyles: {
        stroke: '#BF360C',
        fill: '#0288D1'
    },

    curStyling: undefined,
    curSquareColor: undefined,
    /*
     case "R":
     color = "#F44336";
     break;
     case "G":
     color = "#4CAF50";
     break;
     case "B":
     color = "#2196F3";
     break;

     */
    colors: undefined,

    initialize: function (config) {
        this.board = config.board;

        this.colors = {
            R: "#F44336", G: "#4CAF50", "B": "#2196F3"
        };
        config.controller.on('clearActions', this.clear.bind(this));
        config.controller.on('action', this.receiveAction.bind(this));

        if (chess.OVERRIDES !== undefined) {
            if (chess.OVERRIDES.arrow_styles_actions !== undefined) {
                var s = chess.OVERRIDES.arrow_styles_actions.split(/;/g);
                jQuery.each(s, function (i, style) {
                    var tokens = style.split(/:/);
                    this.arrowStyles[tokens[0]] = tokens[1];
                }.bind(this));
            }

            if (chess.OVERRIDES.clr_R) this.colors.R = chess.OVERRIDES.clr_R;
            if (chess.OVERRIDES.clr_G) this.colors.G = chess.OVERRIDES.clr_G;
            if (chess.OVERRIDES.clr_B) this.colors.B = chess.OVERRIDES.clr_B;

        }
        if (config.arrowStyles)this.arrowStyles = Object.merge(this.arrowStyles, config.arrowStyles);
        this.curStyling = {};
    },

    clear: function () {
        if (this.highlightPool) {
            this.highlightPool.hideAll();
        }
        if (this.arrowPool) {
            this.arrowPool.hideAll();
        }

    },

    receiveAction: function (model, action) {
        switch (action.type) {
            case 'highlight':
                this.highlight(action);
                break;
            case 'arrow':
                this.showArrow(action);
                break;
            default:
        }

    },

    highlight: function (action) {
        if (this.highlightPool === undefined) {
            this.highlightPool = new chess.view.highlight.SquarePool({
                board: this.board
            });
        }
        this.highlightPool.show(action.square, action.color || this.curSquareColor);

        if (action.color) {
            this.curSquareColor = action.color;
        } else {
            action.color = this.highlightPool.lastBgColor();
        }
    },

    showArrow: function (action) {
        if (this.arrowPool === undefined) {
            this.arrowPool = new chess.view.highlight.ArrowPool({
                board: this.board,
                arrowStyles: this.arrowStyles
            });
        }

        if (action.color) {
            var clr = this.toRgb(action.color);
            this.curStyling = {
                fill: clr, stroke: clr
            }
        } else {
            if (this.curStyling && this.curStyling.fill) {
                action.color = this.curStyling.fill;
            } else {
                action.color = this.arrowPool.arrowStyles.fill;
            }
        }

        var styling = Object.merge(this.arrowStyles, this.curStyling);
        this.arrowPool.show(action.from, action.to, styling);
    },

    toRgb: function (color) {
        return this.colors[color] ? this.colors[color] : color;
    }


});