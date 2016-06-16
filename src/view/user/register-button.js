/**
 * "Register" button. This button is shown when there's no valid user session.
 * If a valid user session exists, it will be hidden. This button fires a click
 * event which is picked up by chess.view.user.Controller.
 * @submodule User
 * @namespace chess.view.user
 * @class RegisterButton
 * @extends form.Button
 */
chess.view.user.RegisterButton = new Class({
    Extends:ludo.form.Button,
    type:'chess.view.user.LoginButton',
    module:'user',
    submodule:'registerButton',
    value:chess.getPhrase('Register'),
    hidden:true,

    addControllerEvents:function () {
        this.controller.addEvent('invalidSession', this.show.bind(this));
        this.controller.addEvent('validSession', this.hide.bind(this));
    }
});