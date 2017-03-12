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
    title:chess.__('My profile'),
    hidden:true,
    module:'user',
    submodule:'profileWindow',
    form:{
		resource:'CurrentPlayer',
		autoLoad:true
	},
    formConfig:{
        labelWidth:150
    },
    children:[
        {
            type:'form.DisplayField', name:'username', minLength:5, label:chess.__('Username'), required:true, stretchField:true
        },
        {
            type:'form.Text', name:'full_name', minLength:5, label:chess.__('Full name'), stretchField:true
        },
        {
            type:'form.DisplayField', name:'email', label:chess.__('E-mail')
        },

        {
            type:'chess.view.user.Country', id:'fieldCountry', name:'country', label:chess.__('Country'), required:false, stretchField:true
        },
        {
            type:'form.Password', name:'password', minLength:5, md5:true, twin:'repeat_password', label:chess.__('Password'), stretchField:true
        },
        {
            type:'form.Password', name:'repeat_password', minLength:5, md5:true, label:chess.__('Repeat password'), stretchField:true
        },
        {
            type:'remote.Message', listenTo:'CurrentPlayer.save', name:'errorMessage', css:{ color:'red', 'padding-left':5, height:30 }
        }
    ],

    buttonBar:[
        {
            type:'form.SubmitButton', value:chess.__('OK')
        },
        {
            type:'form.CancelButton', value:chess.__('Cancel')
        }

    ],

    ludoEvents:function(){
        this.parent();
        this.getForm().addEvent('success', this.showSaveConfirmMessage.bind(this));
    },

    showSaveConfirmMessage :function(){
        this.hide.delay(1000, this);
    },
    addControllerEvents:function () {
        this.controller.addEvent('showProfile', this.showProfile.bind(this));
    },

    showProfile:function(){
        this.showCentered();
    }
});