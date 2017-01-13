/**
 * Data source for list of games. An object of this class is automatically created
 * by chess.view.gamelist.Grid
 * @module DataSource
 * @namespace chess.dataSource
 * @class GameList
 * @extends dataSource.JSONArray
 */
chess.dataSource.GameList = new Class({
    Extends: ludo.dataSource.JSONArray,
    type : 'chess.dataSource.GameList',
    autoload:false,
    singleton: true,
	resource:'Database',
    postData:{
        resource:'Database'
    },
    __construct:function(config){
        this.url = ludo.config.getUrl();
        this.parent(config);

    }
});