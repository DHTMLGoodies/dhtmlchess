chess.pgn.Parser = new Class({
	model:undefined,
	/**
	 * @method initialize
	 * @param chess.model.Game model
	 */
	initialize:function(model){
		this.model = model;
	},

	getPgn:function(){
		return this.getMetadata() + this.getMoves();

	},

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

	getMoves:function(){
		return '';
	}
});
