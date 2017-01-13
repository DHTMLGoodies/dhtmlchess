/**
 * Data source for list of games in a static pgn file. An object of this class is automatically created
 * by chess.view.gamelist.Grid
 * @module DataSource
 * @namespace chess.dataSource
 * @class GameList
 * @extends dataSource.JSONArray
 */
chess.dataSource.PgnGames = new Class({
    Extends: ludo.dataSource.JSONArray,
    type : 'chess.dataSource.PgnGames',
    autoload:true,
    singleton: true,
    resource:'ChessFS',
    service:"listOfGames",
    "primaryKey":"index",
    postData:{
        "resource": "ChessFS",
        "service": "listOfGames",
        "arguments":undefined
    },
    getCurrentPgn:function(){
        return this.postData.arguments;
    },

    __construct:function(config){
        this.url = ludo.config.getUrl();
        if(config.pgn != undefined)this.postData.arguments= config.pgn;
        this.parent(config);
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
        this.postData.arguments = file;
        this.sendRequest(this.service, file);
    },

    getPgnFileName:function(){
        return this.postData.arguments;
    }
});