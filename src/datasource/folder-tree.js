/**
 * Data source for list of folders and databases
 * by chess.view.gamelist.Grid
 * @module DataSource
 * @namespace chess.dataSource
 * @class FolderTree
 * @extends dataSource.JSON
 */
chess.dataSource.FolderTree = new Class({
    Extends: ludo.dataSource.JSON,
    type : 'chess.dataSource.FolderTree',
    singleton: true,
    url:window.chess.URL,
    requestId : 'getFolders',
    autoload:true,

	ludoConfig:function(config){
        this.parent(config);
    }
});