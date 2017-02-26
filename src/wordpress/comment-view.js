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
                    "font-weight":"bold",
                    'padding-left' : '4px'
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
        controller.on('startOfGame', this.update.bind(this));
        controller.on('dirty', this.update.bind(this));
    },

    onNewGame:function(){
    },

    saveComment:function(){
        if(this.currentMove){
            this.controller.addCommentAfter(this.child['comment'].val(), this.currentMove);
        }else{
            this.controller.currentModel.setGameComment(this.child['comment'].val());
        }

    },


    update:function(model){
        if(!model)model = this.controller.currentModel;
        var m = model.getCurrentMove();
        if(!m && model.model.moves.length > 0 && model.model.moves[0].comment){
            m = model.model.moves[0];
        }
        if(m == this.currentMove)return;

        this.currentMove = m;
        if(!m){
            this.currentLabel = chess.getPhrase('Game Comment')
        }else{
            this.currentLabel = chess.getPhrase('Annotate')  + ' ' + m.m;
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