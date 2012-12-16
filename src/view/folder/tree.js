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
	dataSource:{
		type:'chess.dataSource.FolderTree'
	},
	nodeTpl:'<img src="' + window.chess.ROOT + 'images/{icon}"><span>{title}</span>',
	expandDepth:3,

	recordConfig:{
		'folder':{
			selectable:false,
			defaults:{
				icon:'folder.png'
			}
		},
		'database':{
			selectable:true,
			defaults:{
				icon:'database.png'
			}
		}
	},

	treeConfig:{
		defaultValues:{
			icon:'folder.png'
		}
	},

	ludoEvents:function () {
		this.parent();

		this.addEvent('selectrecord', this.selectDatabase.bind(this));
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
		this.fireEvent('selectDatabase', record);
	}
});