/**
 Model to PGN parser. Takes a
 {{#crossLink "chess.model.Game"}}{{/crossLink}} as only argument
 and returns a PGN string for the game.
 @namespace chess.pgn
 @class Parser
 @constructor
 @param {chess.model.Game} model
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
     * @private
	 */
	model:undefined,


	initialize:function(model){
		this.model = model;
	},

	/**
	 * Return pgn in string format
	 * @method getPgn
	 * @return {String}
	 */
	getPgn:function(){
		return [this.getMetadata(),this.getMoves()].join("\n\n");
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
        return this.getFirstComment() + this.getMovesInBranch(this.model.getMoves(), 0);
	},

    /**
     * Return comment before first move
     * @method getFirstComment
     * @return {String}
     * @private
     */
    getFirstComment:function(){
        var m = this.model.getMetadata();
        if(m['comment']!==undefined && m['comment'].length > 0){
            return '{' + m['comment'] + '} ';
        }
        return '';
    },

    /**
     * Return main line of moves or a variation
     * @method getMovesInBranch
     * @param {Array} moves
     * @param {Number} moveIndex
     * @return {String}
     * @private
     */
    getMovesInBranch:function(moves, moveIndex){
        moveIndex = moveIndex || 0;
        var ret = [];
        var insertNumber = true;
        for(var i=0;i<moves.length;i++){
            if(moves[i]['m'] !== undefined){
                if(moveIndex % 2 === 0 || insertNumber){
                    var isWhite = moveIndex % 2 === 0;
                    ret.push([Math.floor(moveIndex/2) + 1, (isWhite ? '.' : '..')].join(''));
                }
                ret.push(moves[i]['m']);
                moveIndex++;

                insertNumber = false;
            }
            if(moves[i]['comment'] !== undefined){
                ret.push("{" + moves[i]['comment'] + "}");
            }

            if(moves[i]['variations'] !== undefined && moves[i]['variations'].length > 0){
                var variations = moves[i]['variations'];
                for(var j=0;j<variations.length;j++){
                    ret.push("(" + this.getMovesInBranch(variations[j], moveIndex - 1) + ")");

                }
                insertNumber = true;
            }
        }
        return ret.join(' ');
    }
});
