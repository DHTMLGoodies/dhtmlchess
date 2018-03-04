chess.view.highlight.SquarePool = new Class({

    type: 'chess.view.board.HighlightPool',
    Extends: Events,
    bg: undefined,

    items: undefined,
    hiddenItems: undefined,
    visibleItems: undefined,
    files: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    map: undefined,
    colorMap: undefined,
    onlySingles: false,
    autoToggle: false,
    circular: false,


    initialize: function (config) {
        this.bg = config.board.hitArea();
        this.board = config.board;
        if (config.opacity !== undefined) this.opacity = config.opacity;
        if (config.onlySingles !== undefined) this.onlySingles = config.onlySingles;
        if (config.autoToggle !== undefined) this.autoToggle = config.autoToggle;
        if (config.circular !== undefined) this.circular = config.circular;
        this.board.on('flip', this.flip.bind(this));
        this.items = [];
        this.hiddenItems = [];
        this.visibleItems = [];

        this.map = {};
        this.colorMap = {};
    },

    hideAll: function () {
        while (this.visibleItems.length > 0) {
            var s = this.visibleItems.pop();
            this._hide(s);
        }
        return this;
    },

    toggle: function (square, color) {
        if (this.isShown(square)) {
            this.hide(square);
        } else {
            this.show(square, color);
        }
    },

    toString: function () {
        var ret = [];

        var items = [];
        this.visibleItems.forEach(function (item) {
            var s = item.square;
            items.push({
                square: s, color: this.colorMap[s]
            })

        }.bind(this));

        items.sort(function (a, b) {
            return a.color < b.color ? 1 : -1;
        });

        var curColor = '';

        items.forEach(function (item) {
            var str = item.square;
            if (item.color !== curColor) {
                curColor = item.color;
                str += ";" + curColor;
            }
            ret.push(str);
        });
        return ret.join(',');
    },

    lastSquare: undefined,

    lastBgColor: function () {
        if (this.lastSquare) {
            var el = this.lastSquare.el;
            return this.circular ? el.css("border-color") : el.css("background-color");
        }
    },

    show: function (square, color) {

        var isShown = this.isShown(square);
        if (isShown && this.autoToggle) {
            var sameColor = this.colorMap[square] === color;
            this.hide(square);
            if (sameColor) return;
        }

        if (this.onlySingles && isShown) {
            if (color) {
                if (this.circular) {
                    this.map[square][0].el.css('border', "5px solid " + color);
                } else {
                    this.map[square][0].el.css('background-color', color);
                }
            }
            return;
        }
        var s = this.getSquare();
        this.visibleItems.push(s);
        if (this.map[square] === undefined) {
            this.map[square] = [];
        }
        this.map[square].push(s);
        this.colorMap[square] = color;

        var pos = this.posBySquare(square);

        s.el.css({
            left: pos.x, top: pos.y
        });
        if (color) {
            if (this.circular) {
                s.el.css('border', "5px solid " + color);
                s.el.css('background-color', "transparent");
            } else {
                s.el.css('background-color', color);
            }

        }
        s.el.show();
        s.square = square;

        this.lastSquare = s;

        return this;
    },

    isShown: function (square) {
        return (this.map[square] && this.map[square].length > 0);
    },

    hide: function (square) {
        if (this.map[square]) {
            while (this.map[square].length > 0) {
                var s = this.map[square].pop();
                var i = this.visibleItems.indexOf(s);
                if (i >= 0) {
                    this.visibleItems.splice(i, 1);
                }
                this._hide(s);

                this.colorMap[square] = undefined;
            }
        }
    },

    _hide: function (s) {
        s.el.hide();
        this.hiddenItems.push(s);
        var p = this.map[s.square].indexOf(s);
        if (p >= 0) {
            this.map[s.square].splice(p, 1);
        }
    },

    posBySquare: function (square) {
        var f = square.substr(0, 1);
        var r = 8 - square.substr(1, 1);
        var x = this.files.indexOf(f);
        var y = r;

        if (this.board.isFlipped()) {
            x = 7 - x;
            y = 7 - y;
        }
        return {
            x: (x * 12.5) + '%', y: (y * 12.5) + '%'
        }
    },

    getSquare: function () {
        if (this.hiddenItems.length > 0) {
            return this.hiddenItems.pop();
        }
        var square = jQuery('<div class="dhtml-chess-highlight-square" style="box-sizing:border-box !important;position:absolute;width:12.5%;height:12.5%"></div>');
        this.bg.append(square);

        if (this.circular) {
            square.css("border-radius", 999);
        }

        var obj = {
            square: undefined,
            el: square
        };
        this.items.push(obj);
        return obj;
    },

    flip: function () {
        jQuery.each(this.visibleItems, function (i, square) {
            var pos = this.posBySquare(square.square);
            square.el.css({
                left: pos.x, top: pos.y
            });

        }.bind(this));
    },

    getSquares: function () {
        var ret = [];
        jQuery.each(this.visibleItems, function (i, square) {
            ret.push(square.square);
        });
        return ret;
    }
});