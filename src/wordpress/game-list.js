/**
 * Data source for list of games. An object of this class is automatically created
 * by chess.view.gamelist.Grid
 * @module DataSource
 * @namespace chess.dataSource
 * @class GameList
 * @extends dataSource.JSONArray
 */
chess.wordpress.GameList = new Class({
    Extends: ludo.dataSource.JSONArray,
    type : 'chess.wordpress.GameList',
    autoload:false,
    singleton: true,
    resource:'Database',
    postData:{
        action:'list_of_games'
    },
    __construct:function(config){
        this.url = ludo.config.getUrl();
        this.parent(config);

    },

    loadPgn:function(pgn){
        this.postData.pgn = pgn;
        this.sendRequest(this.service, pgn);
    }
});