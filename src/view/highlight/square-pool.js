chess.view.highlight.SquarePool = new Class({

    type: 'chess.view.board.HighlightPool',
    Extends: Events,
    bg: undefined,

    items: undefined,
    hiddenItems: undefined,
    visibleItems: undefined,
    opacity: 0.4,
    files: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],

    map: undefined,

    onlySingles:false,

    initialize: function (config) {
        this.bg = config.board.getDivForInteraction();
        this.board = config.board;
        if (config.opacity != undefined)this.opacity = config.opacity;
        if (config.onlySingles != undefined)this.onlySingles = config.onlySingles;

        this.board.on('flip', this.flip.bind(this));
        this.items = [];
        this.hiddenItems = [];
        this.visibleItems = [];

        this.map = {};
    },

    hideAll: function () {
        while (this.visibleItems.length > 0) {
            var s = this.visibleItems.pop();
            this._hide(s);
        }
    },

    toggle:function(square, color){
        if(this.isShown(square)){
            this.hide(square);
        }else{
            this.show(square, color);
        }
    },

    show: function (square, color) {
        if(this.onlySingles && this.isShown(square)){
            if(color)this.map[square][0].el.css('background-color', color);
            return;
        }
        var s = this.getSquare();
        this.visibleItems.push(s);
        if (this.map[square] == undefined) {
            this.map[square] = [];
        }
        this.map[square].push(s);

        var pos = this.posBySquare(square);

        s.el.css({
            left: pos.x, top: pos.y,
            'background-color': color
        });
        s.el.show();
        s.square = square;
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
        square.css('opacity', this.opacity);
        this.bg.append(square);
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

    getSquares:function(){
        var ret =[];
        jQuery.each(this.visibleItems, function(i, square){
            ret.push(square.square);
        });
        return ret;
    }
});