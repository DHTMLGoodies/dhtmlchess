/**
 * Data source for list of games. An object of this class is automatically created
 * by chess.view.gamelist.Grid
 * @module DataSource
 * @namespace chess.dataSource
 * @class GameList
 * @extends dataSource.JSONArray
 */
chess.dataSource.PgnList = new Class({
    Extends: ludo.dataSource.JSONArray,
    type : 'chess.dataSource.PgnList',
    autoload:true,
    singleton: true,
    postData:{
        resource:'ChessFSPgn',
        service:'read'
    }
});