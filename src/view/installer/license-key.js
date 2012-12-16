chess.view.installer.LicenseKey = new Class({
	Extends:ludo.View,
	layout:'rows',
	url:'installer-controller.php',
	lkCache:{},
	children:[
		{
			height:40,
			css:{
				padding:3,
				'font-size':'14px',
				'font-weight':'bold'
			},
			html:'Please enter your DHTML-Chess installation key'
		},
		{
			type:'form.Text', label:'Installation key', required:1, name:'installationKey',id:'installationKey',
			validateKeyStrokes:true,
			validator:{
				name:'installationKey',
				type:'form.validator.Md5'
			},
			listeners:{
				'key_up' : function(){
					var el = ludo.get('installationKey');
					el.value = el.getFormEl().value;
					el.validate();
				}
			}
		},
		{
			type:'form.DisplayField',
			height:25,
			id:'keyDescription',
			name:'description',
			value:'Installation key can be found inside api/php/ChessLicense.php'
		},
		{
			type:'form.Checkbox', label:'Force new installation', name:'forceNewInstall', value:'1'
		}
	]
});