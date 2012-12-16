chess.view.command.Line = new Class({
	Extends: ludo.form.Text,
	type: 'chess.view.command.Line',
	controller:{
		type:'chess.view.command.Controller'
	},

	validateKeyStrokes:true,

	validateKey:function(e){
		if(e.key === 'enter'){
			this.value = this.els.formEl.value;
			this.send();
			this.setValue('');
			return false;
		}
	},

	send:function(){
		this.fireEvent('sendMessage', this.getValue());
	}
});