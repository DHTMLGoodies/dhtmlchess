chess.view.command.Panel = new Class({
	Extends: ludo.View,
	useController:true,
	cssSignature : 'chess-command-panel',
	controller:{
		type:'chess.view.command.Controller'
	},
	currentLine:undefined,

	ludoRendered:function(){
		this.parent();
		this.renderLine(chess.language.commandWelcome);
	},

	addControllerEvents:function(){
		this.controller.addEvent('sendMessage', this.renderLine.bind(this));
		this.controller.addEvent('sendErrorMessage', this.renderErrorLine.bind(this));
		this.controller.addEvent('clear', this.clear.bind(this));
	},

	clear:function(){
		this.getBody().innerHTML = '';
		this.currentLine = undefined;
	},

	renderErrorLine:function(text){
		this.renderLine(text, 'chess-command-panel-error-message');
	},
	renderLine:function(text, cls){
		if(this.currentLine)ludo.dom.addClass(this.currentLine, 'chess-command-panel-message-old');
		var el = document.createElement('div');
		el.className = cls || 'chess-command-panel-message';
		el.innerHTML = text;
		this.getBody().adopt(el);
		this.getBody().scrollTop += 100;
		this.currentLine = el;
	}
});