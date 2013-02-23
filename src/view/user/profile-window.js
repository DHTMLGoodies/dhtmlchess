/**
 * User profile dialog
 * @submodule User
 * @namespace chess.view.user
 * @class ProfileWindow
 * @extends Window
 */
chess.view.user.ProfileWindow = new Class({
    Extends:ludo.Window,
    type:'chess.view.user.ProfileWindow',
    left:50, top:50,
    width:500, height:250,
    layout:{
        type:'linear',
        orientation:'vertical'
    },
    title:chess.getPhrase('My profile'),
    hidden:true,
    module:'user',
    submodule:'profileWindow',
    model:{
        type : 'chess.view.user.UserModel'
    },
    formConfig:{
        labelWidth:150
    },
    children:[
        {
            type:'form.Text', name:'username', minLength:5, label:chess.getPhrase('Username'), required:true, stretchField:true
        },
        {
            type:'form.Text', name:'full_name', minLength:5, label:chess.getPhrase('Full name'), stretchField:true
        },
        {
            type:'form.DisplayField', name:'email', label:chess.getPhrase('E-mail')
        },
        /*
        {
            type:'chess.view.user.Country', id:'fieldCountry', name:'country', label:chess.getPhrase('Country'), required:false, stretchField:true
        },*/
        {
            type:'form.Password', name:'password', minLength:5, md5:true, twin:'repeat_password', label:chess.getPhrase('Password'), stretchField:true
        },
        {
            type:'form.Password', name:'repeat_password', minLength:5, md5:true, label:chess.getPhrase('Repeat password'), stretchField:true
        },
        {
            hidden:true, name:'errorMessage', css:{ color:'red', 'padding-left':5, height:30 }
        }
    ],

    buttonBar:[
        {
            type:'form.SubmitButton', value:chess.getPhrase('OK')
        },
        {
            type:'form.CancelButton', value:chess.getPhrase('Cancel')
        }

    ],

    ludoEvents:function(){
        this.parent();
        this.getFormManager().getModel().addEvent('success', this.showSaveConfirmMessage.bind(this));
    },

    showSaveConfirmMessage :function(){
        this.child['errorMessage'].show();
        this.child['errorMessage'].setHtml(chess.getPhrase('Changes saved successfully'));
        this.hide.delay(1000, this);
        this.child['errorMessage'].hide.delay(1000, this.child['errorMessage']);
    },
    addControllerEvents:function () {
        this.controller.addEvent('showProfile', this.showProfile.bind(this));
    },

    showProfile:function(){
        this.showCentered();

    },

    hideErrorMessage:function () {
        this.child['errorMessage'].hide();
    }

});