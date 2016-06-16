/**
 * Dialog for editing metadata on a game.
 * @submodule Dialog
 * @namespace chess.view.dialog
 * @class EditGameMetadata
 */
chess.view.dialog.EditGameMetadata = new Class({
    Extends:chess.view.dialog.NewGame,
    type:'chess.view.dialog.EditGameMetadata',
    submodule:'dialogEditGameMetadata',
    title:chess.getPhrase('Edit metadata'),
    model:['white','black','result','event','site','databaseId'],
    addControllerEvents:function () {
        this.controller.addEvent('editMetadata', this.show.bind(this));
    },
    addButtonEvents:function () {
        this.getButton('okButton').addEvent('click', function () {
            /**
             * New game event. When fired it will send all values from the form as only argument.
             * @event editMetadata
             * @param {Array} metadata values
             */
            this.fireEvent('editMetadata', this.getValues());
            this.hide();
        }.bind(this))
    },
    show:function(model){
        this.getForm().fill(model.getMetadata());
        this.parent();
    }
});