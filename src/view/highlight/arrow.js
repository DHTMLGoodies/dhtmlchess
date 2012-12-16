/**
 Highlight a moves with an arrow. An object of this class is automatically created by
 chess.view.board.Board when added using "addons".
 @submodule Board
 @namespace chess.view.highlight
 @class Arrow
 @extends chess.view.highlight.ArrowBase
 @constructor
 @param {Object} config
 @example
 	children:[
 	{
		 type:'chess.view.board.Board',
		 labels:true,
		 weight:1,
		 addons:[
			 {
				 type:'chess.view.highlight.Arrow',
				 properties:{
					 'stroke-width' : 0
				 }
			 }
		 ]
	 }
 ]

 */
chess.view.highlight.Arrow = new Class({
	Extends:chess.view.highlight.ArrowBase,

	ludoConfig:function (config) {
		this.parent(config);
		this.view.addEvent('highlight', this.showMove.bind(this));
		this.view.addEvent('clearHighlight', this.hide.bind(this));
	}
});