chess.view.button.SaveGame = new Class({
    Extends:ludo.form.Button,
    type:'chess.view.button.SaveGame',
    module:'user',
    submodule:'saveGame',
    value:'Save',
    width:80,
    disabled:true,
    copyEvents:{
        click:'saveGame'
    },

    addControllerEvents:function () {
        this.controller.addEvent('userAccess', this.toggleOnUserAccess.bind(this));
        this.controller.addEvent('invalidSession', this.disable.bind(this));
    },

    toggleOnUserAccess:function (access) {
        if ((access & window.chess.UserRoles.EDIT_GAMES)) {
            this.enable();
        } else {
            this.disable();
        }
    }
});