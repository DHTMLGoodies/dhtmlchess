/**
 * Class used to load games from server. An object of this class is automatically created by
 * chess.model:Game.
 * @namespace chess.remote
 * @class GameReader
 * @extends remote.Reader
 */
chess.remote.GameReader = new Class({
    Extends:chess.remote.Reader,

    loadGame : function(id, pgn){
        console.log(arguments);
        
		this.fireEvent('beforeLoad');

        var query = {
            "eventOnLoad": "load"
        };

        if(window.chess.isWordPress){
            query.action = 'game_by_id';
            query.pgn = pgn;
            query.id = id;
        }else{
            query.resource = 'Game';
            query.service = 'read';
            query.arguments = id;
        }
		this.query(query);
    },

	loadStaticGame:function(pgn, index){

		this.fireEvent('beforeLoad');
        var query = {
            "eventOnLoad": "load"
        };


        if(window.chess.isWordPress){
            query.action = "game_by_index";
            query.pgn = pgn;
            query.index = index;
        }else{
            query.resource = "ChessFs";
            query.service = "getGame";
            query.arguments = pgn;
            query.data = index;

        }
		this.query(query);
	},

    save:function(game){
        if(this.hasDummyId(game))delete game.id;

        var query = {
            "resource": "Game",
            "service": "save",
            "eventOnLoad": "saved",
            "arguments": game.id,
            "data": game
        };

        if(window.chess.isWordPress){
            query.action = 'save_game';
            query.id = game.id;
            query.game = game;
        }else{
            query.resource = 'Game';
            query.service = 'save';
            query.arguments = game.id;
            query.data = game;
        }

        this.query(query);

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

        if(window.chess.isWordPress){
            this.query({
                'action' : 'random_game',
                'pgn' : file
            });
        }else{
            this.query({
                'resource' : 'ChessFS',
                'arguments' : file,
                'service' : 'getRandomGame'
            });
        }

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