/**
 * Class used to show info about current move. This view is updated when one of the following events is fired by the controller, i.e.
 * controllers active game model.
 * setPosition, nextmove, newMove, newGame
 * @namespace chess.view.metadata
 * @class Move
 * @extends View
 */
chess.view.metadata.Move = new Class({
    Extends : ludo.View,
    type : 'chess.view.metadata.Move',
    module:'chess',
    submodule : 'metadata.Move',
	/**
	 tpl is used to configure how to display info about current move. You use curly braces to indicate
	 where to insert move information. You can use the keys available in chess.model.Move
	 @config tpl
	 @default ''
	 @example
	 	tpl:'Current move: {from}-{to}'
	 	...
	 	tpl:'{lm} // long notation
	 	...
	 	tpl:'{m} // short notation
	 */
    tpl : '',

    ludoConfig : function(config){
        this.parent(config);
        this.tpl = config.tpl || this.tpl;
    },

    setController : function(controller){
        this.controller = controller;
        this.controller.addEvent('setPosition', this.updateMetadata.bind(this));
        this.controller.addEvent('nextmove', this.updateMetadata.bind(this));
        this.controller.addEvent('newMove', this.updateMetadata.bind(this));
        this.controller.addEvent('newGame', this.updateMetadata.bind(this));
    },

    ludoRendered : function(){
        this.parent();
    },

    updateMetadata : function(model){
        var metadata = model.getCurrentMove() || '';

        var keys = this.getTplKeys();
        var html = this.tpl;
        var replacement;
        for(var i=0;i<keys.length;i++){
            if(metadata[keys[i]]){
                replacement = metadata[keys[i]];
            }else{
                replacement = '';
            }
            html = html.replace('{' + keys[i] + '}', replacement);
        }
        this.getBody().set('html', html);
    },

    getTplKeys : function(){
        var tokens = this.tpl.match(/{([a-z]+?)\}/g);
        for(var i=0;i<tokens.length;i++){
            tokens[i] = tokens[i].replace(/[{}]/g,'')
        }
        return tokens;
    }
});