/**
 Eco variation tree view. This view displays available next moves according to ECO.
 @namespace chess.view.eco
 @class VariationTree
 @extends tree.Tree
 @example
 	children:[
 	 ...
 	 {
		 title:'Eco',
		 type:'chess.view.eco.VariationTree'
	 }
 	...
 	]
 */
chess.view.eco.VariationTree = new Class({
	Extends:ludo.tree.Tree,
	type:'chess.view.eco.VariationTree',
	module:'chess',
	submodule:'eco.VariationTree',
	dataSource:{
		requestId:'getEcoVariations',
		url:window.chess.URL,
		autoload:false
	},
	openingCache:{},
	currentFen:'',
	showLines:false,

	nodeTpl:'<span><b>{notation} </b>: {eco} {name}</span>',
	treeConfig:{
		defaultValues:{

		}
	},
	overflow:'auto',
	ludoEvents:function () {
		this.parent();
		this.addEvent('load', this.cacheVariations.bind(this));
		this.addEvent('selectrecord', this.selectMove.bind(this));
	},

	selectMove:function (move) {
		this.fireEvent('selectMove', { from:move.from, to:move.to });
	},

	setController:function (controller) {
		this.parent(controller);
		controller.addEvent('setPosition', this.loadVariations.bind(this));
		controller.addEvent('newMove', this.loadVariations.bind(this));
		controller.addEvent('nextmove', this.loadVariations.bind(this));
	},

	loadVariations:function (model) {
		var pos = model.getCurrentPosition();
		if (this.openingCache[pos]) {
			this.insertJSON(this.openingCache[pos]);
			return;
		}
		this.currentFen = pos;

		this.getDataSource().setQueryParam('fen', pos);
		this.getDataSource().load();
	},

	cacheVariations:function (json) {
		this.openingCache[this.currentFen] = json.data;
	}
});