chess.ColorView = new Class({
    Extends: ludo.View,
    colorView: undefined,
    ccls:undefined,

    __rendered: function () {
        this.parent();
        this.colorView = jQuery('<div class="wpc-color-view"></div>').appendTo(this.$b());
        this.$b().addClass('wpc-color-view-parent');
    },

    colorCls:function(cls){
        if(this.ccls){
            this.colorView.removeClass(this.ccls);
        }
        this.colorView.addClass(cls);
        this.ccls = cls;
    },

    color: function (color) {
        this.colorView.css('background-color', color);
    },

    icon: function (url) {
        this.colorView.css('background-image', 'url(' + url + ')');
    },

    hideView: function () {
        this.animateOut();
    },
    showView: function () {
        this.animateIn();
    },

    animateIn:function(){
        this.colorView.css('top', this.$e.height());
        this.colorView.animate({
            top:0
        });
    },

    animateOut:function(){
        this.colorView.animate({
            top:this.$e.height()
        });
    }
});