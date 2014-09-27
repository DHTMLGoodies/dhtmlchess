/**
 List of games view. List of games is displayed in a grid.
 @namespace chess.view.gamelist
 @module View
 @submodule Grid
 @class Grid
 @extends grid.Grid
 @constructor
 @param {Object} config
 @example
 	children:[
 	... ,
 	{
		 titleBar:false,
		 type:'chess.view.gamelist.Grid',
		 weight:1,
		 frame:true,
		 fillview:true,
		 cols:['white', 'black', 'result']
	 }
 	...
 	]
 */
chess.view.gamelist.Grid = new Class({
	Extends:ludo.grid.Grid,
	type:'chess.view.gamelist.Grid',
	module:'chess',
	submodule:'gameList',
	titleBar:false,
	dataSource:{
		'type':'chess.dataSource.GameList',
        shim:{
            txt : 'Loading games. Please wait'
        }
	},
	resizable:false,
	statusBar:false,
	fillview:true,

	/**
	 Columns to show in grid. Columns correspondes to metadata of games, example
	 white,black,result, event, eco
	 @config cols
	 @type Array
	 @optional
	 @example
	 	cols:['white','black']
	 */
	cols:undefined,


	columns:{
		white:{
			heading:'White',
			key:'white',
			width:120,
			sortable:true
		},
		black:{
			heading:'Black',
			key:'black',
			width:120,
			sortable:true
		},
		result:{
			heading:'Result',
			key:'result',
			width:50,
			sortable:true,
			removable:true
		},
		event:{
			heading:'Event',
			key:'event',
			weight:1,
			sortable:true,
			removable:true
		},
		last_moves:{
			heading:'Last moves',
			key:'last_moves',
			weight:1,
			sortable:true,
			removable:true
		}

	},
	/**
	 * initial database id. Show the games from this database when the grid is first displayed.
	 * @config databaseId
	 * @type {Number}
	 * @default undefined
	 */
	databaseId:undefined,

	setController:function (controller) {
		this.parent(controller);
		var ds = this.getDataSource();
		controller.addEvent('selectDatabase', this.selectDatabase.bind(this));
		controller.addEvent('nextGame', ds.next.bind(ds));
		controller.addEvent('previousGame', ds.previous.bind(ds));
        controller.addEvent('selectPgn', this.selectPgn.bind(this));
        controller.addEvent('gameSaved', this.onGameSave.bind(this));
	},


    onGameSave:function(game){
        if(game.databaseId)this.selectDatabase({ id: game.databaseId });
    },
	/**
	 Select a new database
	 @method selectDatabase
	 @param {Object} record
	 */
	selectDatabase:function (record) {
		this.loadGames(record.id);
	},

    selectPgn:function(pgn){
        this.getDataSource().sendRequest('listOfGames', pgn);
    },

	ludoConfig:function (config) {
		this.parent(config);
		this.databaseId = config.databaseId || this.databaseId;
		if (config.cols) {
			this.getColumnManager().hideAllColumns();
			for (var i = 0; i < config.cols.length; i++) {
				this.getColumnManager().showColumn(config.cols[i]);
			}
		}

        for(var key in this.columns){
            if(this.columns.hasOwnProperty(key)){
                this.columns[key].heading = chess.getPhrase(this.columns[key].heading);
            }
        }
	},
	ludoEvents:function () {
		this.parent();
		this.getDataSource().addEvent('select', this.selectGame.bind(this))
	},
	ludoRendered:function () {
		this.parent();
		if (this.databaseId) {
			this.loadGames(this.databaseId);
		}
	},

	loadGames:function (databaseId) {
		this.databaseId = databaseId;
		this.getDataSource().sendRequest('games', databaseId);
	},

	selectGame:function (record) {
		/**
		 * Event fired on click on game in grid.
		 * @event selectGame
		 * @param {Object} game
		 */
		if(record.gameIndex !== undefined){
			this.fireEvent('selectGame', [record, this.getDataSource().getCurrentPgn()]);
		}else{
			this.fireEvent('selectGame', record);
		}
	}
});