/**
 * Class used to load games from server. An object of this class is automatically created by
 * chess.model:Game.
 * @namespace chess.remote
 * @class GameReader
 * @extends remote.Reader
 */
chess.remote.GameReader = new Class({
    Extends:chess.remote.Reader,

    loadGame : function(id){
		this.fireEvent('beforeLoad');
		this.query({
			"resource": "Game",
			"service": "read",
			"eventOnLoad": "load",
			"arguments": id
		});
    },

	loadStaticGame:function(pgn, index){
		this.fireEvent('beforeLoad');
		this.query({
			"resource": "ChessFs",
			"service": "getGame",
			"eventOnLoad": "load",
			"arguments": pgn,
			"data" : index
		});
	},

    save:function(game){
        if(this.hasDummyId(game))delete game.id;
		this.query({
			"resource": "Game",
			"service": "save",
			"eventOnLoad": "saved",
			"arguments": game.id,
			"data": game
		});
    },

    hasDummyId:function(game){
        return /[a-z]/g.test(game.id || '');
    },

    loadRandomGame : function(databaseId) {
		this.fireEvent('beforeLoad');
        this.query({
            "resource": "Database",
            "arguments": databaseId,
            "service": 'randomGame'
        });
    },

    loadRandomGameFromFile:function(file){
        this.fireEvent('beforeload');
        this.query({
            'resource' : 'ChessFS',
            'arguments' : file,
            'service' : 'getRandomGame'
        });
    },

    getEngineMove : function(fen){
        this.query({
            "resource": "ChessEngine",
            "arguments": fen,
            "service": 'getMove',
            "eventOnLoad": "newMove"
        });
    }
});