/**
 * Special button used to save a game. This button will be automatically disabled
 * for users without save game access
 * @namespace chess.view.button
 * @class SaveGame
 * @extends form.Button
 */
chess.view.button.SaveGame = new Class({
    Extends:ludo.form.Button,
    type:'chess.view.button.SaveGame',
    module:'user',
    submodule:'saveGame',
    value:chess.getPhrase('Save'),
    width:80,
    disabled:true,
    copyEvents:{
        click:'saveGame'
    },

    addControllerEvents:function () {
        this.controller.addEvent('userAccess', this.toggleOnUserAccess.bind(this));
        this.controller.addEvent('invalidSession', this.disable.bind(this));
    },

    /**
     * Toggle enabling of button based on user access
     * @method toggleonUserAccess
     * @param {Number} access
     */
    toggleOnUserAccess:function (access) {
        if ((access & window.chess.UserRoles.EDIT_GAMES)) {
            this.enable();
        } else {
            this.disable();
        }
    }
});