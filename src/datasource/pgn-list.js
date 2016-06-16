/**
 * Data source for list of games. An object of this class is automatically created
 * by chess.view.gamelist.Grid
 * @module DataSource
 * @namespace chess.dataSource
 * @class GameList
 * @extends dataSource.Collection
 */
chess.dataSource.PgnList = new Class({
    Extends: ludo.dataSource.Collection,
    type : 'chess.dataSource.PgnList',
    autoload:true,
    singleton: true,
    resource:'ChessFSPgn',
    service:'read'
});