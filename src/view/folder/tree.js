/**
 * This view displays a list of folders and databases as a tree.
 * @submodule Tree
 * @namespace chess.view.folder
 * @class Tree
 */
chess.view.folder.Tree = new Class({
	Extends:ludo.tree.Tree,
	module:'chess',
	submodule:'folder.tree',

	tpl:'<img src="' + ludo.config.getDocumentRoot() + 'images/{icon}"><span>{title}</span>',
	expandDepth:3,
	defaults:{
		'folder':{
			icon:'folder.png'

		},
		'database':{
			icon:'database.png'
		}
	},
	categoryConfig:{
		'folder':{
			selectable:false
		},
		'database':{
			selectable:true
		}

	},

	/**
	 Reference to seleted record
	 @config {Object} selected
	 @example
	 selected : { "id" . 1, "type": "database" }
	 */
	selected:undefined,
	defaultDS:'chess.dataSource.FolderTree',

	ludoConfig:function (config) {
		this.parent(config);
		this.setConfigParams(config, ['selected']);
	},

	ludoEvents:function () {
		this.parent();
		this.getDataSource().addEvent('select', this.selectDatabase.bind(this));
		if (this.selected) {

		}
	},

	selectDatabase:function (record) {
		/**
		 Fired on click on database in the tree.
		 @event selectDatabase
		 @param {Object} record
		 @example
		 { id:4, type:'database' }
		 is example of record sent with the event.
		 */
		this.fireEvent('selectDatabase', record.getData());
	}
});