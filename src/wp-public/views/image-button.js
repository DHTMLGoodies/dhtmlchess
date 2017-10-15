chess.ImageButton = new Class({
    Extends: ludo.View,

    img: undefined,
    btnVisible:true,
    elCss:{
        padding:2
    },

    __construct:function(config){
        this.parent(config);
        this.__params(config, ['img','btnVisible']);
    },

    __rendered:function(){
        this.parent();
        var b = this.$b();
        b.addClass('wpc-image-button');

        this.bg(this.img);

        b.mouseenter(this.onEnter.bind(this));
        b.mouseleave(this.onLeave.bind(this));

        if(!this.btnVisible){
            this.hideButton();
        }

        var fn = function(){
            this.fireEvent('click');
        }.bind(this);
        this.$b().on('click', fn);
    },

    onEnter:function(){
        this.$b().addClass('wpc-image-button-over');
    },

    onLeave:function(){
        this.$b().removeClass('wpc-image-button-over');
    },

    bg:function(src){
        this.$b().css('background-image', 'url(' + src + ')');
    },

    hideButton:function(){
        this.$b().css('visibility', 'hidden');
        this.hide();
    },

    showButton:function(){
        if(this.hidden)this.show();
        this.$b().css('visibility', 'visible');
    }


});