if(chess.view.pgn === undefined)chess.view.pgn = {};
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
chess.view.pgn.Grid = new Class({
    Extends:ludo.grid.Grid,
    type:'chess.view.gamelist.Grid',
    module:'chess',
    submodule:'list-of-pgn-files',
    titleBar:false,
    dataSource:{
        'type':'chess.dataSource.PgnList'
    },
    resizable:false,
    statusBar:false,
    fillview:true,


	columns:{
		file:{
			heading:'Pgn files',
			key:'file',
			width:120,
			sortable:true
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
    },
    ludoEvents:function () {
        this.parent();
        this.getDataSource().addEvent('select', this.selectPgnFile.bind(this))
    },

    loadGames:function (databaseId) {
        this.databaseId = databaseId;
        this.getDataSource().sendRequest('games', databaseId);
    },

    selectPgnFile:function (record) {
        /**
         * Event fired on click on game in grid.
         * @event selectPgn
         * @param {Object} game
         */
        this.fireEvent('selectPgn', record.file);
    }
});