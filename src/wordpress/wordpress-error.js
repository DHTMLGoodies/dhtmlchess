chess.wordpress.WordpressError= new Class({
    Extends: ludo.View,
    css:{
        'text-align' : 'right',
        'padding-right' : '5px',
        color:'#EF9A9A',
        'font-weight': 'normal',
        'font-size': '12px',
        'line-height' : '25px'
    },

    submodule:'wordpress.WordpressError',

    setController:function(controller){
        this.parent(controller);
        controller.on('wperror', this.showError.bind(this));
    },

    showError:function(error){
        this.html(error);
    }
});