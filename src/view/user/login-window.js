/**
 * Login dialog.
 * @submodule User
 * @namespace chess.view.user
 * @class LoginWindow
 * @extends Window
 */
chess.view.user.LoginWindow = new Class({
    Extends:ludo.Window,
    title:chess.getPhrase('Sign in'),
    left:50,top:50,
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
            type:'form.Text', name:'username', regex:/[a-zA-Z0-9\-_\.]/, label:chess.getPhrase('Username'), required:true, stretchField:true
        },
        {
            type:'form.Password', name:'password', md5:true, label:chess.getPhrase('Password'), required:true, stretchField:true
        },
        {
            type:'form.Checkbox', name:'rememberMe', label:chess.getPhrase('Remember me'), value:1
        },
        {
            type:'remote.ErrorMessage', listenTo:"Session.signIn",
            name:'errorMessage', css:{ color:'red', 'padding-left':10, height:30 }
        }
    ],

    buttonBar:[
        {
            type:'form.SubmitButton', value:chess.getPhrase('Sign in')
        },
        {
            type:'form.CancelButton', value:chess.getPhrase('Cancel')
        }
    ],

    ludoEvents:function () {
        this.parent();
        this.getForm().addEvent('success', this.validLogin.bind(this));
        this.getForm().addEvent('success', this.getForm().reset.bind(this.getForm()));
    },
    addControllerEvents:function () {
        this.controller.addEvent('showLogin', this.showCentered.bind(this));
    },

    validLogin:function (json) {
        this.fireEvent('loginSuccess', [ [json.response.token, json.response.access]]);
        this.hide();
    }
});