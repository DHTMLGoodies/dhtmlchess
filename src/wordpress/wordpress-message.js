chess.wordpress.WordPressMessage= new Class({
    Extends: ludo.View,
    css:{
        'text-align' : 'right',
        'padding-right' : '5px',
        color:'#EF9A9A',
        'font-weight': 'normal',
        'font-size': '12px',
        'line-height' : '25px'
    },

    submodule:'wordpress.wordpressmessage',

    autoHideDelay:3000,
    startTime:undefined,

    __rendered:function(){
        this.parent();
        this.els.message = $('<div style="position:absolute;right:5px"></div>');
        this.getBody().append(this.els.message);
    },

    setController:function(controller){
        this.parent(controller);
        controller.on('wperror', this.showError.bind(this));
        controller.on('wpmessage', this.showMessage.bind(this));
    },

    showError:function(error){
        this.getBody().css('color', '#EF9A9A');
        this.els.message.html(error);
        this.animateIn();
        this.autoHide();
    },

    showMessage:function(message){
        this.getBody().css('color', '#AED581');
        this.els.message.html(message);
        this.animateIn();
        this.autoHide();
    },

    autoHide:function(){
        this.startTime = new Date().getTime();
        this.autoHideComplete.delay(this.autoHideDelay, this);
    },
    animateIn:function(){
        var el = this.els.message;
        el.css('top', this.getBody().height());

        el.animate({
            top:0
        }, {
            duration:200
        });
    },

    animateOut:function(){
        this.els.message.animate({
            top : this.getBody().height()
        }, {
            duration:200
        });
    },

    autoHideComplete:function(){
        var elapsed = new Date().getTime() - this.startTime;
        if(elapsed >= this.autoHideDelay){
            this.animateOut();
        }
    }
});