chess.view.installer.AdminUser = new Class({
	Extends:ludo.View,
	layout:'rows',
	formConfig:{
		labelWidth:140
	},
	children:[
		{
			html:'<h3>Enter administrators username and password:</h3>'
		},
		{
			type:'form.Text', label:'Username', name:'adminUserName'
		},
		{
			type:'form.Password', label:'Password', id:'adminPassword', name:'adminPassword', minLength:5,md5:true
		},
		{
			type:'form.Password', label:'Repeat password', name:'adminPasswordRepeated', twin:'adminPassword',md5:true
		}
	]
});