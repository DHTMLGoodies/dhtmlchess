chess.wordpress.UpdateGameButton = new Class({
    Extends: ludo.form.Button,
    submodule:'wordpress.updategame',
    value:chess.getPhrase('Update'),


    setController:function(controller){
        this.parent(controller);

        controller.on('game', this.onNewGame.bind(this));

    },

    onNewGame:function(){

    }
});