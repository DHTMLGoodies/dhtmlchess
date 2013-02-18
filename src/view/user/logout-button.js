/**
 * Log out button. This button is hidden when there are no valid
 * user sessions. It will be shown when a valid user session exists.
 * @submodule User
 * @namespace chess.view.user
 * @class LogoutButton
 * @extends form.Button
 */
chess.view.user.LogoutButton = new Class({
    Extends:ludo.form.Button,
    type:'chess.view.user.LoginButton',
    module:'user',
    submodule:'logoutButton',
    hidden : true,
    value : chess.getPhrase('Sign out'),

    addControllerEvents:function(){
        this.controller.addEvent('invalidSession', this.hide.bind(this));
        this.controller.addEvent('validSession', this.show.bind(this));
    }
});