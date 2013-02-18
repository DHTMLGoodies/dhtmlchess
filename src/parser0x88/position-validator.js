/**
 * Class used by position setup dialog to validate positions on the board.
 * When the position is valid the "OK" button will be enabled, otherwise it will be disabled.
 * @namespace chess.parser
 * @class PositionValidator
 * @extends chess.parser.FenParser0x88
 */
chess.parser.PositionValidator = new Class({
   Extends : chess.parser.FenParser0x88,

	/**
	 * Returns true if a position is valid.
	 * @method isValid
	 * @param {String} fenPosition
	 * @return {Boolean} valid
	 */
    isValid : function(fenPosition){
		try{
	        this.setFen(fenPosition);
		}catch(e){
			return false;
		}
        if(!this.hasBothKings()){
            return false;
        }
        var oppositeConfig = this.getValidMovesAndResult(this.getOppositeColor());
		return oppositeConfig.check ? false : true;
    },

    getValidMovesAndResult : function(color) {
        if(!this.getKing('white') || !this.getKing('black')){
            return { moves: [], result : 0, check : 0 }
        }
        return this.parent(color);
    },

    hasBothKings : function(){
		return this.getKing('white') && this.getKing('black');
    },

    getOppositeColor : function(){
        return this.getColor() === 'white' ? 'black' : 'white';
    }

});