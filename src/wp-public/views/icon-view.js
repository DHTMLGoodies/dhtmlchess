chess.IconView = new Class({
    Extends: ludo.View,

    iconView:undefined,

    __rendered:function(){
        this.parent();
        this.iconView = jQuery('<div class="wpc-icon-view"></div>');
        this.$b().append(this.iconView);
    },

    setIcon:function(url){
        this.iconView.css('background-image', 'url(' + url + ')');
        this.animateIn();
    },

    animateIn:function(){
        this.iconView.css('top', this.$e.height());
        this.iconView.animate({
            top:0
        });
    },

    animateOut:function(){
        this.iconView.animate({
            top:this.$e.height()
        });
    }

});