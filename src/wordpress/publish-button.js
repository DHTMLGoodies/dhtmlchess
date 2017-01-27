chess.wordpress.PublishButton = new Class({
    Extends: ludo.form.Button,
    submodule:'wordpress.publish',
    value:chess.getPhrase('Publish'),


    setController:function(controller){
        this.parent(controller);

        controller.on('game', this.onNewGame.bind(this));

    },

    onNewGame:function(){

    }
});