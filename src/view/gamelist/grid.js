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
    Extends: ludo.grid.Grid,
    type: 'chess.view.gamelist.Grid',
    module: 'chess',
    submodule: 'gameList',
    titleBar: false,
    dataSource: {
        'type': 'chess.dataSource.GameList',
        shim: {
            txt: 'Loading games. Please wait'
        }
    },
    resizable: false,
    statusBar: false,
    fillview: true,
    headerMenu:false,

    /**
     Columns to show in grid. Columns corresponds to metadata of games, example
     white,black,result, event, eco
     @config cols
     @type Array
     @optional
     @example
     cols:['white','black']
     */
    cols: undefined,


    columns: {
        white: {
            heading: 'White',
            key: 'white',
            width: 120,
            sortable: true,
            renderer:function(val){
                return val != undefined ? val : '';
            }
        },
        black: {
            heading: 'Black',
            key: 'black',
            width: 120,
            sortable: true,
            renderer:function(val){
                return val != undefined ? val : '';
            }
        },
        round: {
            heading: 'Round',
            key: 'round',
            width: 70,
            sortable: true,
            renderer:function(val){
                return val != undefined ? val : '';
            }
        },
        result: {
            heading: 'Result',
            key: 'result',
            width: 70,
            sortable: true,
            removable: true,
            renderer:function(val){
                return val != undefined ? val : '';
            }
        },
        event: {
            heading: 'Event',
            key: 'event',
            weight: 1,
            sortable: true,
            removable: true,
            renderer:function(val){
                return val != undefined ? val : '';
            }
        },
        last_moves: {
            heading: 'Last moves',
            key: 'last_moves',
            weight: 1,
            sortable: true,
            removable: true,
            renderer:function(val){
                return val != undefined ? val : '';
            }
        }

    },
    /**
     * initial database id. Show the games from this database when the grid is first displayed.
     * @config databaseId
     * @type {Number}
     * @default undefined
     */
    databaseId: undefined,

    setController: function (controller) {
        this.parent(controller);
        var ds = this.getDataSource();
        controller.on('selectDatabase', this.selectDatabase.bind(this));
        controller.on('nextGame', ds.next.bind(ds));
        controller.on('previousGame', ds.previous.bind(ds));
        controller.on('selectPgn', this.selectPgn.bind(this));
        controller.on('gameSaved', this.onGameSave.bind(this));
    },


    onGameSave: function (game) {
        if (game.databaseId)this.selectDatabase({id: game.databaseId});
    },
    /**
     Select a new database
     @method selectDatabase
     @param {Object} record
     */
    selectDatabase: function (record) {
        this.loadGames(record.id);
    },

    selectPgn: function (pgn) {

        var r = this.getDataSource().postData.resource;

        this.getDataSource().postData.arguments = pgn;

        this.getDataSource().sendRequest({
            resource: r,
            service: 'listOfGames',
            arguments: pgn
        });
    },

    __construct: function (config) {
        this.parent(config);
        this.databaseId = config.databaseId || this.databaseId;

        jQuery.each(this.columns, function(i, col){
           col.heading = chess.__(col.heading);
        });
        var cols = config.cols || this.cols;
        if (cols) {
            this.getColumnManager().hideAllColumns();
            for (var i = 0; i < cols.length; i++) {
                this.getColumnManager().showColumn(cols[i]);
            }
        }


    },
    ludoEvents: function () {
        this.parent();
        this.getDataSource().addEvent('select', this.selectGame.bind(this))
    },
    __rendered: function () {
        this.parent();
        if (this.databaseId) {
            this.loadGames(this.databaseId);
        }
    },

    loadGames: function (databaseId) {
        this.databaseId = databaseId;
        this.getDataSource().sendRequest('games', databaseId);
    },

    selectGame: function (record) {

        /**
         * Event fired on click on game in grid.
         * @event selectGame
         * @param {Object} game
         */
        if (record.gameIndex !== undefined) {
            this.fireEvent('selectGame', [record, this.getDataSource().getCurrentPgn()]);
        } else {
            this.fireEvent('selectGame', record);
        }
    }
});