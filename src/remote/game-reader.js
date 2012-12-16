/**
 * Class used to load games from server. An object of this class is automatically created by
 * chess.model:Game.
 * @namespace chess.remote
 * @class GameReader
 * @extends remote.Reader
 */
chess.remote.GameReader = new Class({
    Extends:chess.remote.Reader,

    params : {
        getGame : 1
    },

    loadGame : function(id){
        this.params = {
            id : id
        };
        this.query('getGame');
    },

    save:function(game){
        this.params = {
            game:game
        };
        this.query('saveGame', 'saved');
    },

    loadRandomGame : function(databaseId) {
        this.params = {
            databaseId : databaseId || 0
        };
        this.query('getRandomGame');
    },

    getEngineMove : function(fen){
        this.params = {
            fen : fen
        };
        this.query('getEngineMove','newMove');
    }
});