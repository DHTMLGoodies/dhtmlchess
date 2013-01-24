/**
 Model to PGN parser
 @namespace chess.pgn
 @class Parser
 @constructor
 @example
	 var game = new chess.model.Game();
	 game.setMetadataValue('white','Magnus Carlsen');
	 game.setMetadataValue('black','Levon Aronian');
	 game.appendMove('e4');
	 game.appendMove('e5');

	 var parser = new chess.pgn.Parser(game);
 	 console.log(parser.getPgn());
 */
chess.pgn.Parser = new Class({
	/**
	 * @property {chess.model.Game} model
	 */
	model:undefined,

	initialize:function(model){
		this.model = model;
	},

	/**
	 * Return pgn in string format
	 * @method getPgn
	 * @return {*}
	 */
	getPgn:function(){
		return this.getMetadata() + this.getMoves();

	},

    /**
     * @method getMetadata
     * @return {String}
     * @private
     */
	getMetadata:function(){
		var ret = [];
		var metadata = this.model.getMetadata();
		for(var key in metadata){
			if(metadata.hasOwnProperty(key)){
				ret.push('[' + key + ' "' + metadata[key] + '"]');
			}
		}
		return ret.join('\n');
	},
    /**
     * @method getMoves
     * @return {String}
     * @private
     */
	getMoves:function(){
		return '';
	}
});
