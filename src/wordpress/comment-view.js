chess.wordpress.CommentView = new Class({
    Extends: ludo.View,
    submodule:'wordpress.CommentView',
    layout:{
        type:'linear',orientation:'vertical',
        width:'matchParent',height:'matchParent'
    },

    currentLabel:'',
    currentComment:'',
    currentMove:undefined,

    notification:undefined,
    
    __children:function(){
        return [
            {
                name:"move",
                css:{
                    "font-weight":"bold"
                },
                layout:{
                    height:30
                },
                html:this.currentLabel

            },
            {
                type:'form.Textarea',
                placeholder:'Enter Comment',
                name:'comment',
                layout:{
                    weight:1
                },
                listeners:{
                    'key_up' : this.saveComment.bind(this)
                }
            }
        ];
    },

    __rendered:function(){
        this.parent();
        this.on('show', this.updateViews.bind(this));
    },

    setController:function(controller){
        this.parent(controller);

        controller.on('fen', this.update.bind(this));
        controller.on('newGame', this.update.bind(this));
    },

    onNewGame:function(){
        console.log('New game');
    },

    saveComment:function(){
        if(this.currentMove){
            this.controller.addCommentAfter(this.child['comment'].val(), this.currentMove);
        }
    },


    update:function(model, fen){
        var m = model.getCurrentMove();
        this.currentMove = m;
        if(!m){
            this.currentLabel = 'Game Comment'
        }else{
            this.currentLabel = 'Comment for ' + m.lm;
            this.currentComment = m.comment;

        }

        if(this.children.length){
            this.child['move'].html(this.currentLabel);

            this.child['comment'].val('');
            this.child['comment'].val(this.currentComment);
        }

    },

    updateViews:function(){
        if(this.children.length){
            this.child['move'].html(this.currentLabel);

            if(this.currentComment)this.child['comment'].val(this.currentComment);
        }
    }
    
});