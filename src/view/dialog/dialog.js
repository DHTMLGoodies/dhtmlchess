chess.view.dialog.Dialog = new Class({
    Extends: ludo.dialog.Dialog,

    showDialog:function(){
        if (this.controller.views.board) {
            this.layout.centerIn = this.controller.views.board.getEl();
            this.getLayout().getRenderer().clearFn();
            this.getLayout().getRenderer().resize();

        }

        this.show();

        if (!this.controller.views.board){
            this.center();
        }
    }
});