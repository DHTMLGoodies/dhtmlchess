/**
 Special controller for analysis boards. It extends chess.controller.Controller but calls the
 enableDragAndDrop method of the board when the events "setPosition", "nextmove" and "newMove" is
 fired by current game model.
 @namespace chess.controller
 @class AnalysisController
 @extends chess.controller.Controller
 @constructor
 @param {Object} config
 @example
 	new chess.controller.AnalysisController();
 */
chess.controller.AnalysisController = new Class({
	Extends:chess.controller.Controller,

	modelEventFired:function (event, model, param) {
		if (event === 'setPosition' || event === 'nextmove' || event == 'newMove') {
			this.views.board.enableDragAndDrop(model);
		}
	}

});