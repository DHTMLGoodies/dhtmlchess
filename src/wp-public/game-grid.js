chess.WPGameGrid = new Class({
    Extends: chess.view.gamelist.Grid,
    headerMenu: false,
    dataSource: {
        'type': 'ludo.dataSource.JSONArray',
        autoload: false,
        postData: {
            action: 'list_of_games'
        }
    },
    emptyText: chess.__('No games'),
    loadMessage: chess.__('Loading games...'),
    cols: ['white', 'black', 'round', 'result', 'last_moves'],

    __construct: function (config) {
        this.cols = config.cols || this.cols;
        
        this.parent(config);
    },

    loadGames: function () {
        if (this.getDataSource().postData.pgn) {
            this.load();
        }
    },

    selectGame: function (record) {
        this.fireEvent('selectGame', [record, this.getDataSource().postData.pgn]);
    }
});