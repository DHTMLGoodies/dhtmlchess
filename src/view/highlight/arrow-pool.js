/**
 * Created by alfmagne1 on 10/03/2017.
 */
chess.view.highlight.ArrowPool = new Class({
    type: 'chess.view.highlight.ArrowPool',
    bg: undefined,
    pool: undefined,
    hiddenPool: undefined,
    board: undefined,
    svgNode: undefined,
    single: false,
    autoToggle: false,

    arrowStyles: {
        'stroke-linejoin': 'round',
        stroke: '#006064',
        fill: '#006064',
        'stroke-width': .8,
        'stroke-opacity': 1,
        'fill-opacity': .5
    },

    initialize: function (config) {
        this.board = config.board;
        this.bg = jQuery('<div style="z-index:10000;position:absolute;left:0;top:0;width:100%;height:100%"></div>');
        this.board.boardEl().append(this.bg);
        this.pool = [];
        this.hiddenPool = [];
        if (config.arrowStyles !== undefined) this.arrowStyles = Object.merge(this.arrowStyles, config.arrowStyles);
        if (config.single !== undefined) this.single = config.single;

        this.board.on('resize', this.resize.bind(this));
        this.board.on('flip', this.resize.bind(this));

        this.svgNode = new ludo.svg.Canvas({
            renderTo: this.bg
        });
        this.svgNode.fitParent();

        var w = jQuery(window);

        w.on(ludo.util.getDragMoveEvent(), this.dragPiece.bind(this));
        w.on(ludo.util.getDragEndEvent(), this.stopDragPiece.bind(this));

        this.bg.on(ludo.util.getDragStartEvent(), this.initDragPiece.bind(this));

        this.bg.hide();
    },

    dragPiece: function (e) {
        this.board.dragPiece(e);
    },
    stopDragPiece: function (e) {
        this.board.stopDragPiece(e);
    },

    resize: function () {
        var s = this.bg.width();
        this.svgNode.fitParent();
        jQuery.each(this.pool, function (i, arrow) {
            arrow.el.showArrow(arrow.from, arrow.to, s, this.board.flipped);
        }.bind(this))
    },

    show: function (from, to, styling) {

        styling = Object.merge(this.arrowStyles, styling);
        this.bg.show();
        var arrow = this.getArrow();

        arrow.from = from;
        arrow.to = to;
        arrow.color = styling.fill;

        this.pool.push(arrow);

        arrow.el.show();
        arrow.el.showArrow(from, to, this.bg.width(), this.board.flipped);
        arrow.el.css(styling);

        return arrow;
    },

    update: function (arrow, toSquare) {
        if(!toSquare)return;
        arrow.to = toSquare;
        arrow.el.showArrow(arrow.from, toSquare, this.bg.width(), this.board.flipped);
    },

    removeArrow: function (arrow) {
        var index = this.pool.indexOf(arrow);
        if (index >= 0) {
            this.pool.splice(index, 1);
        }
        index = this.hiddenPool.indexOf(arrow);
        if (index === -1) {
            this.hiddenPool.push(arrow);
        }
    },


    hideAll: function () {
        jQuery.each(this.pool, function (i, arrow) {
            this.hiddenPool.push(arrow);
            arrow.el.hide();
        }.bind(this));
        this.pool = [];
        this.bg.hide();
        return this;
    },

    getArrow: function () {
        if (this.hiddenPool.length > 0) {
            return this.hiddenPool.pop();
        } else if (this.single && this.pool.length > 0) {
            return this.pool[0];
        }
        var arrow = new chess.view.board.ArrowNode();
        this.svgNode.append(arrow);
        return {
            el: arrow
        };
    },

    initDragPiece: function (e) {
        if (this.board.ddEnabled) {
            var pos = this.board.getBoard().offset();

            var p = ludo.util.pageXY(e);
            var c = {
                x: p.pageX - pos.left,
                y: p.pageY - pos.top
            };

            var ss = this.board.getSquareSize();

            c.x -= (c.x % ss);
            c.y -= (c.y % ss);

            var square = Board0x88Config.numberToSquareMapping[this.board.getSquareByCoordinates(c.x, c.y)];
            var piece = this.board.getPieceOnSquare(square);

            if (piece) {
                return piece.initDragPiece(e);
            }
        }
    },

    toString: function () {
        var ret = [];
        var curColor = "";

        this.pool.sort(function (a, b) {
            return a.color < b.color ? 1 : -1;
        });

        this.pool.forEach(function (arrow) {
            var arrowString = arrow.from + arrow.to;
            if (arrow.color !== curColor) {
                curColor = arrow.color;
                arrowString += ";" + arrow.color;
            }
            ret.push(arrowString);

        });
        return ret.join(",");
    }
});