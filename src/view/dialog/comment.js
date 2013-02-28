/**
 * Move comment dialog. This dialog is by default created by a chess game controller. It listens to controller events
 * "commentAfter" and "commentBefore". When these events are fired
 * @namespace chess.view.dialog
 * @class Comment
 * @extends dialog.Dialog
 */
chess.view.dialog.Comment = new Class({
    Extends:ludo.dialog.Dialog,
    module:'chess',
    submodule:'dialogComment',
    layout:'rows',
    width:300,
    height:330,
    hidden:true,
    title:chess.getPhrase('Add comment'),
    move:undefined,
    autoDispose:false,
    buttonConfig:'OkCancel',
    commentPos:undefined,
    css:{
        'padding':0
    },
    children:[
        {
            type:'form.Textarea',
            name:'comment',
            weight:1,
            css:{
                'padding':0
            }
        }
    ],
    setController:function (controller) {
        this.parent(controller);
        this.controller.addEvent('commentAfter', this.commentAfter.bind(this));
        this.controller.addEvent('commentBefore', this.commentBefore.bind(this));
    },

    ludoEvents:function () {
        this.parent();
        this.addEvent('ok', this.sendComment.bind(this));
    },
    ludoRendered:function () {
        this.parent();
    },

    sendComment:function () {
        var ev = this.commentPos == 'before' ? 'commentBefore' : 'commentAfter';
        var comment = this.child['comment'].getValue().trim();
        this.fireEvent(ev, [comment, this.move]);
    },
	/**
	 * Show comments before a move. Automatically executed when commentAfter event is fired by controller
	 * @method commentBefore
	 * @param {chess.model.Game} model
	 * @param {Object} move
	 */
    commentBefore:function (model, move) {
        this.commentPos = 'before';
        this.showDialog(model, move);
    },

	/**
	 * Show comments after a move. Automatically executed when commentAfter event is fired by controller
	 * @method commentAfter
	 * @param {chess.model.Game} model
	 * @param {Object} move
	 */
    commentAfter:function (model, move) {
        this.commentPos = 'after';
        console.log(move);
        this.showDialog(model, move);
    },

    showDialog:function (model, move) {
        this.show();
        this.move = model.getMove(move);
        var comment = this.commentPos == 'before' ? model.getCommentBefore(this.move) : model.getCommentAfter(this.move);
        this.child['comment'].setValue(comment);
        this.setTitle(this.getDialogTitle());
    },

    getDialogTitle:function(){
        return chess.getPhrase( this.commentPos == 'before' ? 'addCommentBefore' : 'addCommentAfter') + ' (' + this.move.lm + ')';
    }
});