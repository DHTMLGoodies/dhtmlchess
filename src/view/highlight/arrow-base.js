chess.view.highlight.ArrowBase = new Class({
    Extends: chess.view.highlight.Base,
    module: 'chess',
    submodule: 'arrowHiglight',
    canvas: undefined,
    files: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    arrowPaint: undefined,

    currentMove: undefined,

    arrowPool: undefined,

    arrowStyles: {
        'stroke-linejoin': 'round',
        stroke: '#a7311e',
        fill: '#a7311e',
        'stroke-opacity': .8,
        'fill-opacity': .5
    },
    __construct: function (config) {
        this.parent(config);
        if (config.styles !== undefined) {
            this.arrowStyles = Object.merge(this.arrowStyles, config.styles);
        }

        // TODO refactor
        if (chess.OVERRIDES != undefined && chess.OVERRIDES.arrow_styles != undefined) {
            var s = chess.OVERRIDES.arrow_styles.split(/;/g);
            jQuery.each(s, function (i, style) {
                var tokens = style.split(/:/);
                this.arrowStyles[tokens[0]] = tokens[1];
            }.bind(this))
        }


        this.arrowPool = new chess.view.highlight.ArrowPool({
            single:true,
            board: this.getParent(),
            arrowStyles: this.arrowStyles
        });

    },

    showMove: function (move) {
        this.arrowPool.show(move.from, move.to);
    },

    getEl: function () {
        return this.el;
    },

    hide: function () {
        this.arrowPool.hideAll();
    }


});

