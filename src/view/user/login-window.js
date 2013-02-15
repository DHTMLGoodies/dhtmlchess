/**
 * Login dialog.
 * @submodule User
 * @namespace chess.view.user
 * @class LoginWindow
 * @extends Window
 */
chess.view.user.LoginWindow = new Class({
    Extends:ludo.Window,
    title:chess.language.login,
    width:400,height:180,
    hidden:true,
    type:'chess.view.user.Login',
    module:'user',
    submodule:'loginWindow',
    form:{
        resource:'Session',
        service:"signIn"
    },
    layout:{
        "type":"linear",
        "orientation":"vertical"
    },
    children:[
        {
            type:'form.Text', name:'username', regex:'[a-zA-Z0-9\-_\.]', label:chess.language.username, required:true, stretchField:true
        },
        {
            type:'form.Password', name:'password', md5:true, label:chess.language.password, required:true, stretchField:true
        },
        {
            type:'form.Checkbox', name:'rememberMe', label:chess.language.rememberMe, value:1
        },
        {
            type:'remote.ErrorMessage', resource:"Session","service": "signIn",
            name:'errorMessage', css:{ color:'red', 'padding-left':10, height:30 }
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

    ludoEvents:function () {
        this.parent();
        this.getFormManager().addEvent('success', this.validLogin.bind(this));
        this.getFormManager().addEvent('success', this.reset.bind(this));
    },
    addControllerEvents:function () {
        this.controller.addEvent('showLogin', this.showCentered.bind(this));
    },
    validLogin:function (json) {
        this.fireEvent('loginSuccess', [ json.data, this.child['rememberMe'].isChecked()]);
        this.hide();
    }
});