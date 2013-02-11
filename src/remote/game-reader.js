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
		this.query({
			"resource": "Game",
			"service": "read",
			"eventOnLoad": "load",
			"arguments": id
		});
    },

	loadStaticGame:function(pgn, index){

		this.query({
			"resource": "ChessFs",
			"service": "getGame",
			"eventOnLoad": "load",
			"arguments": pgn,
			"data" : index
		});
	},

    save:function(game){
		this.query({
			"resource": "Game",
			"service": "save",
			"eventOnLoad": "saved",
			"arguments": id,
			"data": game
		});
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
        this.query('EngineMove',undefined, 'newMove');
    }
});