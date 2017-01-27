chess.wordpress.DraftButton = new Class({
    Extends: ludo.form.Button,
    submodule:'wordpress.savedraft',
    value:chess.getPhrase('Save Draft'),


    setController:function(controller){
        this.parent(controller);
    }
});