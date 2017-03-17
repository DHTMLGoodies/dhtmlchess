/**
 Add on for chess board. used to indicate current moves by highlighting squares.
 @submodule Board
 @namespace chess.view.highlight
 @class Square
 @constructor
 @param {Object} config
 @example
 	children:[
 	{
		 type:'chess.view.board.Board',
		 labels:true,
		 weight:1,
		 plugins:[
			 {
				 type:'chess.view.highlight.Square'
			 }
		 ]
	 }
 ]
 */
chess.view.highlight.Square = new Class({
	Extends:chess.view.highlight.SquareBase,
	__construct:function (config) {
		this.parent(config);
		this.parentComponent.on('highlight', this.highlight.bind(this));
		this.parentComponent.on('clearHighlight', this.clear.bind(this));
	}
});