/**
 * Data source for list of folders and databases
 * by chess.view.gamelist.Grid
 * @module DataSource
 * @namespace chess.dataSource
 * @class FolderTree
 * @extends dataSource.TreeCollection
 */
chess.dataSource.FolderTree = new Class({
    Extends: ludo.dataSource.TreeCollection,
    type : 'chess.dataSource.FolderTree',
    singleton: true,
    resource : 'Folders',
    service : 'read',
    autoload:true,
	primaryKey:['id','type']
});