/**
 * This class shows metadata(example: white,black etc) of current game. It listens to the "newGame" event of the controller
 * @namespace chess.view.metadata
 * @class Game
 * @extends View
 */
chess.view.metadata.Game = new Class({
    Extends : ludo.View,
    type : 'chess.view.metadata.Game',
    module:'chess',
    submodule : 'metadata.Game',

	/**
	 How metadata are displayed is configured using "tpl".
	 @config tpl
	 @type String
	 @example
	 	'{white} vs {black}, {result}'
	 */
    tpl : '',
    overflow:'hidden',

    ludoConfig : function(config){
        this.parent(config);
        this.tpl = config.tpl || this.tpl;
    },

    setController : function(controller){
        this.controller = controller;
        this.controller.addEvent('newGame', this.updateMetadata.bind(this));
    },

    ludoRendered : function(){
        this.parent();
    },

    updateMetadata : function(model){
        var metadata = model.getMetadata();
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