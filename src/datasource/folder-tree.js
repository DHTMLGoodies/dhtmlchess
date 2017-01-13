/**
 * Data source for list of folders and databases
 * by chess.view.gamelist.Grid
 * @module DataSource
 * @namespace chess.dataSource
 * @class FolderTree
 * @extends dataSource.JSONTree
 */
chess.dataSource.FolderTree = new Class({
    Extends: ludo.dataSource.JSONTree,
    type : 'chess.dataSource.FolderTree',
    singleton: true,
    resource : 'Folders',
    service : 'read',
    autoload:true,
	primaryKey:['id','type'],

    postData:{
        resource : 'Folders',
        service : 'read'
    },

    __construct:function(config){
        this.url = ludo.config.getUrl();
        this.parent(config);

    }
});