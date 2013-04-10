/**
 * User registration window.
 * @submodule User
 * @namespace chess.view.user
 * @class RegisterWindow
 * @extends Window
 */
chess.view.user.RegisterWindow = new Class({
    Extends:ludo.Window,
    type:'chess.view.user.Login',
    left:50, top:50,
    width:500, height:225,
    title:chess.getPhrase('Register'),
    hidden:true,
    module:'user',
    submodule:'registerWindow',
    form:{
        resource:'Player',
        service:'register'
    },
    layout:{
        "type": "linear",
        "orientation": "vertical"
    },
    formConfig:{
        labelWidth:150
    },
    children:[
        {
            type:'form.Text', name:'username', minLength:5, label:chess.getPhrase('Username'), required:true, stretchField:true
        },
        {
            type:'form.Email', name:'email', label:chess.getPhrase('E-mail'), required:true, stretchField:true
        },
        {
            type:'form.Password', name:'password', minLength:5, md5:true, twin:'repeat_password', label:chess.getPhrase('Password'), required:true, stretchField:true
        },
        {
            type:'form.Password', name:'repeat_password', minLength:5, md5:true, label:chess.getPhrase('Repeat password'), required:true, stretchField:true
        },
        {
            type:'form.Checkbox', name:'rememberMe', label:chess.getPhrase('Remember me'), value:1
        },
        {
            hidden:true, name:'errorMessage', css:{ color:'red', 'padding-left':10, height:30 }
        }
    ],

    buttonBar:[
        {
            type:'form.SubmitButton', value:chess.getPhrase('Register')
        },
        {
            type:'form.CancelButton', value:chess.getPhrase('Cancel')
        }

    ],

    ludoRendered:function () {
        this.parent();
        this.getForm().addEvent('beforesubmit', this.hideErrorMessage.bind(this));
        this.getForm().addEvent('success', this.successfulRegistration.bind(this));
        this.getForm().addEvent('failure', this.registrationFailed.bind(this));
    },

    addControllerEvents:function () {
        this.controller.addEvent('showRegister', this.showCentered.bind(this));
    },

    successfulRegistration:function (json) {
		/**
		 * Event fired when user registration was successful.
		 * @event registerSuccess
		 * @param {Object} JSON
		 * @param {Boolean} rememberMe
		 */
        this.fireEvent('registerSuccess', [json.response.token, json.response.access]);
        this.hide();
        this.reset();
    },
    registrationFailed:function (json) {
        this.child['errorMessage'].show();
        this.child['errorMessage'].setHtml(chess.language[json.message]);
    },

    hideErrorMessage:function () {
        this.child['errorMessage'].hide();
    }

});