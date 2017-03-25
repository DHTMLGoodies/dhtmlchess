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
        this.parent(controller);
        controller.on('newGame', this.update.bind(this));
        controller.on('fen', this.update.bind(this));
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

        this.els.outer = jQuery('<div class="dhtml-chess-side-to-move-outer"></div>');
        this.els.outer.css({
            top: 0, left: 0, 'position': 'absolute', width: this.circleSize, height: this.circleSize
        });
        this.els.inner = jQuery('<div class="dhtml-chess-side-to-move-inner"></div>');
        this.els.inner.css({
            'position': 'absolute','box-sizing' : 'border-box'
        });
        this.$b().append(this.els.outer);
        this.$b().append(this.els.inner);

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
        var h = this.$b().height();
        var o = (h - this.circleSize) / 2;
        this.els.outer.css('top', o);

        if (this.borderSize == undefined) {
            this.borderSize = parseInt(this.els.outer.css('border-width'));
        }

        var is = this.circleSize - (this.borderSize * 2) - 4;
        this.els.inner.css({
            width: is, height: is,
            top: o + this.borderSize + 2,
            left: this.borderSize + 2
        });
    },

    update: function () {
        if (this.controller && this.els.outer) {
            var c = this.controller.currentModel.getColorToMove();
            var pre = 'dhtml-chess-side-to-move-inner-';
            this.els.inner.removeClass(pre + 'white');
            this.els.inner.removeClass(pre + 'black');
            this.els.inner.addClass(pre + c)
        }
    },

    tick:function(){
        this.c+= this.dir;
        if(this.c > 100){
            this.c = 99;
            this.dir *=-1;
        }else if(this.dir < 0 && this.c <= 50){
            this.c = 50;
            this.dir *=-1;
        }
        this.els.inner.css('opacity', this.c / 100);
        this.tick.delay(50, this);
    }
});