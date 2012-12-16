chess.view.installer.AdminUser = new Class({
	Extends:ludo.View,
	layout:'rows',
	formConfig:{
		labelWidth:140
	},
	children:[
		{
			html:'<h3>Enter administrators username and password</h3>'
		},
		{
			type:'form.Text', label:'Username', name:'adminUserName'
		},
		{
			type:'form.Password', label:'Password', id:'adminPassword', name:'adminPassword', minLength:5
		},
		{
			type:'form.Password', label:'Repeat password', name:'adminPasswordRepeated', twin:'adminPassword'
		},
		{
			type:'form.Checkbox', label:'Force new installation', name:'forceNewInstall', value:'1'
		}

	]
});