/**
 * Command line input field
 * @namespace chess.view.command
 * @class Line
 * @extends form.Text
 */
chess.view.command.Line = new Class({
	Extends: ludo.form.Text,
	type: 'chess.view.command.Line',
	controller:{
		type:'chess.view.command.Controller'
	},

	validateKeyStrokes:true,

    /**
     * Key stroke listener
	 * @method validateKey
     * @param {Event} e
     * @return {Boolean|undefined}
     * @private
     */
	validateKey:function(e){
		if(e.key === 'enter'){
			this.value = this.els.formEl.value;
			this.send();
			this.setValue('');
			return false;
		}
        return undefined;
	},

    /**
     * Fire sendMessage event with value of text field
     * @method send
     * @private
     */
	send:function(){
        /**
         * @event sendMessage
         * @param {String} value of command line input
         */
		this.fireEvent('sendMessage', this.getValue());
	}
});