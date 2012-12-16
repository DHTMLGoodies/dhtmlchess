/**
 * Login dialog.
 * @submodule User
 * @namespace chess.view.user
 * @class LoginWindow
 * @extends Window
 */
chess.view.user.LoginWindow = new Class({
    Extends:ludo.Window,
    left:50, top:50,
    width:400, height:180,
    title:chess.language.login,
    hidden:true,
    type:'chess.view.user.Login',
    module:'user',
    submodule:'loginWindow',
    form:{
        name : 'login',
        url:window.chess.URL
    },
    layout : 'rows',
    children:[
        {
            type:'form.Text', name:'username', regex : '[a-zA-Z0-9\-_\.]', label:chess.language.username, required:true, stretchField:true
        },
        {
            type:'form.Password', name:'password', md5:true, label:chess.language.password, required:true, stretchField:true
        },
        {
            type:'form.Checkbox', name:'rememberMe', label:chess.language.rememberMe, value:1
        },
        {
            hidden:true, name:'errorMessage', css: { color : 'red', 'padding-left' : 10, height:30 }
        }
    ],

    buttonBar:[
        {
            type:'form.SubmitButton', value:chess.language.login
        },
        {
            type:'form.CancelButton', value:chess.language.cancel
        }
    ],

    ludoEvents:function(){
        this.parent();
        this.getFormManager().addEvent('beforesubmit', this.hideErrorMessage.bind(this));
        this.getFormManager().addEvent('success', this.validLogin.bind(this));
        this.getFormManager().addEvent('success', this.reset.bind(this));
        this.getFormManager().addEvent('failure', this.invalidLogin.bind(this));
    },
    addControllerEvents:function(){
        this.controller.addEvent('showLogin', this.showCentered.bind(this));
    },
    validLogin:function(json){
        this.fireEvent('loginSuccess', [ json.data, this.child['rememberMe'].isChecked()]);
        this.hide();
    },

    hideErrorMessage:function(){
        this.child['errorMessage'].hide();
    },
    invalidLogin:function(){
        this.child['errorMessage'].show();
        this.child['errorMessage'].setHtml(chess.language.invalidUserNameOrPassword)
    }

});