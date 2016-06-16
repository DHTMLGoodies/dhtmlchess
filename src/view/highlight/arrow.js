/**
 Highlight a moves with an arrow. An object of this class is automatically created by
 chess.view.board.Board when added using "addOns".
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
		 addOns:[
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
        var p = this.getParent();
		p.addEvent('highlight', this.showMove.bind(this));
		p.addEvent('clearHighlight', this.hide.bind(this));
	}
});