chess.wordpress.CommentView = new Class({
    Extends: ludo.View,
    submodule: 'wordpress.CommentView',
    layout: {
        type: 'linear', orientation: 'vertical',
        width: 'matchParent', height: 'matchParent'
    },

    currentLabel: '',
    currentComment: '',
    currentMove: undefined,

    notification: undefined,

    __children: function () {
        return [
            {
                name: 'top',
                layout: {
                    type: 'linear', orientation: 'horizontal',
                    height: 30
                },
                css: {
                    'padding-top': 2
                },
                children: [
                    {
                        name: "move",
                        css: {
                            "font-weight": "bold",
                            'padding-left': '4px',
                            'line-height': '30px'
                        },
                        layout: {
                            weight: 1
                        },
                        html: this.currentLabel

                    },
                    {
                        type: 'form.Button', value: '!', layout: {width: 30}
                    },
                    {
                        type: 'form.Button', value: '?', layout: {width: 30}
                    },
                    {
                        type: 'form.Button', value: '!!', layout: {width: 30}
                    },
                    {
                        type: 'form.Button', value: '??', layout: {width: 30}
                    },
                    {
                        type: 'form.Button', value: '?!', layout: {width: 30}
                    },
                    {
                        type: 'form.Button', value: '!?', layout: {width: 30}
                    },
                    {
                        type: 'form.Button', name: 'clear', value: chess.__('Clear')
                    }
                ]

            },

            {
                type: 'form.Textarea',
                placeholder: 'Enter Comment',
                name: 'comment',
                layout: {
                    weight: 1
                },
                listeners: {
                    'key_up': this.saveComment.bind(this)
                }
            }
        ];
    },

    __rendered: function () {
        this.parent();
        this.on('show', this.updateViews.bind(this));

        this.getForm().on('btnClick', this.onBtnClick.bind(this));
    },

    onBtnClick: function (name, val) {
        if (this.currentMove) {
            if (name == 'clear') {
                this.controller.currentModel.gradeMove(this.currentMove, '');
            } else {
                this.controller.currentModel.gradeMove(this.currentMove, val);
            }
            this.updateHeading();
        }
    },

    setController: function (controller) {
        this.parent(controller);

        controller.on('fen', this.update.bind(this));
        controller.on('newGame', this.update.bind(this));
        controller.on('startOfGame', this.update.bind(this));
        controller.on('dirty', this.update.bind(this));
    },

    onNewGame: function () {
    },

    saveComment: function () {
        if (this.currentMove) {
            this.controller.addCommentAfter(this.child['comment'].val(), this.currentMove);
        } else {
            this.controller.currentModel.setGameComment(this.child['comment'].val());
        }
    },


    update: function (model) {
        if (!model)model = this.controller.currentModel;
        var m = model.getCurrentMove();
        if (!m && model.model.moves.length > 0 && model.model.moves[0].comment) {
            m = model.model.moves[0];
        }
        if (m == this.currentMove)return;

        this.currentMove = m;
        this.updateHeading();

        if (this.children.length) {
            this.child['comment'].val('');
            this.child['comment'].val(this.currentComment);
        }
    },

    updateHeading:function(){
        if (!this.currentMove) {
            this.currentLabel = chess.__('Game Comment')
        } else {
            this.currentLabel = chess.__('Annotate') + ' ' + this.currentMove.m;
            this.currentComment = this.currentMove.comment;
        }

        if(this.children.length){
            this.child['top'].child['move'].html(this.currentLabel);
        }
    },

    updateViews: function () {
        if (this.children.length) {
            this.child['top'].child['move'].html(this.currentLabel);
            if (this.currentComment)this.child['comment'].val(this.currentComment);
        }
    }

});