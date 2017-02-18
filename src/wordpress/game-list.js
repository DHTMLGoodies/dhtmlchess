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


        this.sortFn = this.sortFn || {};

        this.sortFn.round = {
            'asc' : function(a,b){
                return this.compareRound(a,b, 1);

            }.bind(this),
            'desc' : function(a,b){
                return this.compareRound(a,b, 0);
            }.bind(this)

        }


    },

    compareRound:function(a,b,ascending){
        var v1 = this.sortVal(a);
        var v2 = this.sortVal(b);
        var ret = v1 < v2 ? 1 : -1;
        if(!ascending)ret *=-1;
        return ret;

    },

    sortVal:function(game){
        var round = game.round;
        if(!round)return 1;

        var t = round.split(/\./g);
        if(t.length == 1){
            return parseInt(t[0]);
        }

        return parseInt(t[0]*1000) + parseInt(t[1]);
    },

    loadPgn:function(pgn){
        this.postData.pgn = pgn;
        this.sendRequest(this.service, pgn);
    }
});