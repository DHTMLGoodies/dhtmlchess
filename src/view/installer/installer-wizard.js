chess.view.installer.Wizard = new Class({
	Extends:ludo.View,
	layout:{
		type:'card',
		animate:true
	},
    form:{
        "resource": "ChessDBInstaller"
    },
	weight:1,
	containerCss:{
		border:0
	},
	children:[
		{
			type:'chess.view.installer.Welcome', name:'welcome'
		},
		{
			type:'chess.view.installer.AdminUser', name:'adminUser'
		},
		{
			type:'chess.view.installer.DbConnection', name:'dbconnection'
		}
	],

	ludoRendered:function () {
		this.parent();
		this.addEvent('submit', this.beforeSubmit.bind(this));
		this.getForm().addEvent('success', this.installationComplete.bind(this));
		this.getForm().addEvent('failure', this.onInstallError.bind(this));
	},

    onInstallError:function(){
        ludo.get('message').setHtml('');
        ludo.get('finishButton').show();
    },

	beforeSubmit:function () {
		ludo.get('message').setHtml('<img src="../images/ajax-loader.gif"> Installing - please wait');
		ludo.get('previousButton').hide();
		ludo.get('finishButton').hide();
	},
	installationComplete:function () {
		ludo.get('message').setHtml('Installation complete');
		ludo.get('completeButton').show();
	}
});