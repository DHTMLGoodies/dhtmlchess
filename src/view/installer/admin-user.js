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
			type:'form.Text', autoComplete:false, placeholder:'Username', name:'adminUserName', required:true,minLength:3
		},
		{
			type:'form.Password', autoComplete:false, placeholder:'Password', id:'adminPassword', name:'adminPassword', minLength:1,md5:true
		},
		{
			type:'form.Password', autoComplete:false, placeholder:'Repeat password', name:'adminPasswordRepeated', minLength:1,required:true, twin:'adminPassword',md5:true
		}
	]
});