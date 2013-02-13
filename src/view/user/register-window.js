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
    title:chess.language.login,
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
            type:'form.Text', name:'username', minLength:5, label:chess.language.username, required:true, stretchField:true
        },
        {
            type:'form.Email', name:'email', label:chess.language.email, required:true, stretchField:true
        },
        {
            type:'form.Password', name:'password', minLength:5, md5:true, twin:'repeat_password', label:chess.language.password, required:true, stretchField:true
        },
        {
            type:'form.Password', name:'repeat_password', minLength:5, md5:true, label:chess.language.repeatPassword, required:true, stretchField:true
        },
        {
            type:'form.Checkbox', name:'rememberMe', label:chess.language.rememberMe, value:1
        },
        {
            hidden:true, name:'errorMessage', css:{ color:'red', 'padding-left':10, height:30 }
        }
    ],

    buttonBar:[
        {
            type:'form.SubmitButton', value:chess.language.register
        },
        {
            type:'form.CancelButton', value:chess.language.cancel
        }

    ],

    ludoRendered:function () {
        this.parent();
        this.getFormManager().addEvent('beforesubmit', this.hideErrorMessage.bind(this));
        this.getFormManager().addEvent('success', this.successfulRegistration.bind(this));
        this.getFormManager().addEvent('failure', this.registrationFailed.bind(this));
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
        this.fireEvent('registerSuccess', [json.data, this.child['rememberMe'].isChecked()]);
        this.hide();
    },
    registrationFailed:function (json) {
        this.child['errorMessage'].show();
        this.child['errorMessage'].setHtml(chess.language[json.message]);
    },

    hideErrorMessage:function () {
        this.child['errorMessage'].hide();
    }

});