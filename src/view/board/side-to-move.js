/**
 * Created by alfmagne1 on 25/03/2017.
 */
chess.view.board.SideToMove = new Class({
    Extends: ludo.View,
    circleSize: 22,
    borderSize: undefined,
    c:0,
    dir:3,
    __construct: function (config) {
        this.parent(config);
        this.__params(config, ['circleSize']);

    },

    setController: function (controller) {
        console.log("set controller");
        this.parent(controller);
        controller.on('newGame', this.update.bind(this));
        controller.on('fen', this.update.bind(this));
        controller.on('instructorFen', this.update.bind(this));
        controller.on('comp', this.updateVisibility.bind(this));
    },

    updateVisibility: function () {
        if (this.controller.compMode) {
            this.show();
        } else {
            this.hide();
        }
    },

    __rendered: function () {
        this.parent();

        var o = this.els.outer = jQuery('<div class="dhtml-chess-side-to-move-outer"></div>');
        o.css({
            top: 0, left: 0, 'position': 'absolute', width: this.circleSize, height: this.circleSize
        });
        var i = this.els.inner = jQuery('<div class="dhtml-chess-side-to-move-inner"></div>');
        i.css({
            'position': 'absolute','box-sizing' : 'border-box'
        });
        this.$b().append(o);
        this.$b().append(i);

        this.tick();
    },

    resize: function (size) {
        this.parent(size);
        this.updateSize();
    },

    show:function(){
        this.parent();
        this.update();
    },

    updateSize:function(){

        var ip = 0;
        var h = this.$b().height();
        var o = (h - this.circleSize) / 2;
        this.els.outer.css('top', o);

        if (this.borderSize == undefined) {
            this.borderSize = parseInt(this.els.outer.css('border-width'));
        }

        var is = this.circleSize - (this.borderSize * 2) - (ip * 2);
        this.els.inner.css({
            width: is, height: is,
            top: o + this.borderSize + ip,
            left: this.borderSize + ip
        });
    },

    update: function () {
        if (this.controller && this.els.outer) {
            var c = this.controller.colorToMove();
            var pre = 'dhtml-chess-side-to-move-';
            var i = this.els.inner;
            i.removeClass(pre + 'white');
            i.removeClass(pre + 'black');
            i.addClass(pre + c)
        }
    },

    tick:function(){

    }
});