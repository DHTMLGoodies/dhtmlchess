/**
 * Command line message panel
 * @namespace chess.view.command
 * @class Panel
 * @extends View
 */
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
		this.renderLine(chess.getPhrase('commandWelcome'));
	},

    /**
     * Add events to a chess.view.command.Controller instance
     * @method addControllerEvents
     */
	addControllerEvents:function(){
		this.controller.addEvent('sendMessage', this.renderLine.bind(this));
		this.controller.addEvent('sendErrorMessage', this.renderErrorLine.bind(this));
		this.controller.addEvent('clear', this.clear.bind(this));
	},

    /**
     * Clear message panel
     * @method clear
     */
	clear:function(){
		this.getBody().innerHTML = '';
		this.currentLine = undefined;
	},

    /**
     * Render error message inside panel
     * @method renderErrorLine
     * @param {String} text
     */
	renderErrorLine:function(text){
		this.renderLine(text, 'chess-command-panel-error-message');
	},
    /**
     * Render message inside panel assigned to optional CSS class(cls)
     * @method renderLine
     * @param {String} text
     * @param {String} cls
     * @optional
     */
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