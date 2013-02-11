/**
 * Data source for list of games in a static pgn file. An object of this class is automatically created
 * by chess.view.gamelist.Grid
 * @module DataSource
 * @namespace chess.dataSource
 * @class GameList
 * @extends dataSource.Collection
 */
chess.dataSource.PgnGames = new Class({
    Extends: ludo.dataSource.Collection,
    type : 'chess.dataSource.GameList',
    autoload:true,
    singleton: true,
    resource:'ChessFS',
    service:"listOfGames",
    "primaryKey":"index",
    url:window.chess.URL,

    getCurrentPgn:function(){
        return this.arguments;
    }
});