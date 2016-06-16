/**
 * Displays an overwrite move dialog. This dialog listens to
 * overwriteOrVariation of the controller.
 * @submodule Dialog
 * @namespace chess.view.dialog
 * @class OverwriteMove
 * @extends ludo.dialog.Dialog
 */
chess.view.dialog.OverwriteMove = new Class({
	Extends:ludo.dialog.Dialog,
	type:'chess.view.dialog.OverwriteMove',
	module:'chess',
	submodule:'dialogOverwriteMove',
	width:330,
	height:150,
	move:undefined,
	hidden:true,

	closable:false,
	minimizable:false,
	fullScreen:false,
	resizable:false,
	modal:true,
	autoDispose:false,

	ludoConfig:function (config) {
		config = config || {};
		config.buttons = [
			{
				value:chess.getPhrase('Overwrite'),
				listeners:{
					'click':function () {
						/**
						 * Overwrite current move in model with a new move
						 * @event overwriteMove
						 * @param {chess.model.Move} oldMove
						 * @param {chess.model.Move} newMove
						 */
						this.fireEvent('overwriteMove', [ this.move.oldMove, this.move.newMove]);
						this.hide();
					}.bind(this)}
			},
			{
				value:chess.getPhrase('Variation'),
				listeners:{
					'click':function () {
						/**
						 * Create a new variation
						 * @event newVariation
						 * @param {chess.model.Move} oldMove
						 * @param {chess.model.Move} newMove
						 */
						this.fireEvent('newVariation', [ this.move.oldMove, this.move.newMove]);
						this.hide();
					}.bind(this)}
			},
			{
				value:chess.getPhrase('Cancel'),
				listeners:{
					'click':function () {
						/**
						 * Cancel new move, i.e. no overwrite and no new variations.
						 * @event cancelOverwrite
						 */
						this.fireEvent('cancelOverwrite');
						this.hide(this)
					}.bind(this)
				}
			}
		];

		this.parent(config);
	},
	show:function () {
		this.parent();
	},

	setController:function (controller) {
		this.parent(controller);
		this.controller.addEvent('overwriteOrVariation', this.showDialog.bind(this))
	},

	ludoRendered:function () {
		this.parent();
	},

	showDialog:function (model, moves) {
        this.show();
		this.move = moves;
		this.setTitle('Overwrite move ' + moves.oldMove.lm);
		this.setHtml('Do you want to overwrite move <b>' + moves.oldMove.lm + '</b> with <b>' + moves.newMove.lm + '</b> ?');

	}
});