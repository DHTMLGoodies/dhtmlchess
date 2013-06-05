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
    type : 'chess.dataSource.PgnGames',
    autoload:true,
    singleton: true,
    resource:'ChessFS',
    service:"listOfGames",
    "primaryKey":"index",
    getCurrentPgn:function(){
        return this.arguments;
    },

    /**
     * Load games from this pgn file
     @method loadFile
     @param file
     @example
        dataSource:{
            id:'gameList',
            "type":'chess.dataSource.PgnGames',
            // "Morphy" is the name of a pgn file inside the "pgn" folder.
            //  You can put games inside that folder and change the argument below.
            "arguments":"Morphy",
            "listeners":{
                "beforeload":function () {
                    ludo.get("searchField").reset();
                },
                "select": function(){
                    ludo.get('gamesApp').getLayout().toggle();
                }
            },
            shim:{
                txt : 'Loading games'
            },
            paging:{
                size:25,
                pageQuery:false,
                cache:false,
                cacheTimeout:1000
            }
        }
     To change pgn file call

     @example
        ludo.get('gameList').loadFile('Lasker');

     i.e. name of pgn file without the file extension.
     */
    loadFile:function(file){
        this.sendRequest(this.service, file);
    }
});