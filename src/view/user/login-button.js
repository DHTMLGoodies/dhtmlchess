/**
 * Login button. This button will be hidden automatically when
 * a valid user-session is created. It will be shown when there isn't
 * a valid user session.
 * @submodule User
 * @namespace chess.view.user
 * @class LoginButton
 * @extends form.Button
 */
chess.view.user.LoginButton = new Class({
    Extends:ludo.form.Button,
    type:'chess.view.user.LoginButton',
    module:'user',
    submodule:'loginButton',
    value:chess.getPhrase('Sign in'),
    hidden:true,

    setController:function (controller) {
        this.parent(controller);
        controller.addEvent('invalidSession', this.show.bind(this));
        controller.addEvent('validSession', this.hide.bind(this));
    },

    show:function(){
        this.parent();

    }
});