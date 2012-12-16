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
    title:chess.language.myProfile,
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
            type:'form.Text', name:'username', minLength:5, label:chess.language.username, required:true, stretchField:true
        },
        {
            type:'form.Text', name:'full_name', minLength:5, label:chess.language.fullname, stretchField:true
        },
        {
            type:'form.DisplayField', name:'email', label:chess.language.email
        },
        {
            type:'chess.view.user.Country', id:'fieldCountry', name:'country', label:chess.language.country, required:false, stretchField:true
        },
        {
            type:'form.Password', name:'password', minLength:5, md5:true, twin:'repeatpassword', label:chess.language.password, stretchField:true
        },
        {
            type:'form.Password', name:'repeatpassword', minLength:5, md5:true, label:chess.language.repeatPassword, stretchField:true
        },
        {
            hidden:true, name:'errorMessage', css:{ color:'red', 'padding-left':5, height:30 }
        }
    ],

    buttonBar:[
        {
            type:'form.SubmitButton', value:chess.language.ok
        },
        {
            type:'form.CancelButton', value:chess.language.cancel
        }

    ],

    ludoEvents:function(){
        this.parent();
        this.getFormManager().getModel().addEvent('success', this.showSaveConfirmMessage.bind(this));
    },

    showSaveConfirmMessage :function(){
        this.child['errorMessage'].show();
        this.child['errorMessage'].setHtml(chess.language.changesSaved);
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