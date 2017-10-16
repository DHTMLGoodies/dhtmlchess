chess.wordpress.GameListGrid = new Class({
    Extends: chess.view.gamelist.Grid,
    headerMenu: false,
    submodule: 'wordpress.gamelist',
    dataSource: undefined,
    emptyText: chess.__('No games'),
    loadMessage: chess.__('Loading games...'),
    cols: ['white', 'black', 'round', 'result', 'last_moves'],

    __construct: function (config) {
        this.dataSource = {
            id: 'editor_game_list_ds',
            'type': 'ludo.dataSource.JSONArray',
            autoload: false,
            postData: {
                action: 'list_of_games'
            },
            paging: {
                size: 25
            }
        };
        this.parent(config);
    },
    __rendered: function () {
        this.parent();
        this.loadGames();
        this.on('show', this.loadGames.bind(this));

    },

    setController: function (controller) {
        this.parent(controller);
        controller.on('publish', function () {
            if (this.controller.pgn) {
                this.getDataSource().load();
            }
        }.bind(this));

        controller.on('imported', function () {
            if (this.controller.pgn) {
                this.getDataSource().load();
            }
        }.bind(this));
    },

    loadGames: function () {
        if (this.controller) {
            if (this.controller.pgn && this.controller.pgn !== this.getDataSource().postData.pgn) {
                this.load();
            }
        } else if (this.getDataSource().postData.pgn) {
            this.load();
        }

    },

    load: function () {
        if (this.controller && this.controller.pgn) {
            this.getParent().setTitle(chess.__('PGN:') + ' ' + this.controller.pgn.pgn_name);

            this.getDataSource().postData.pgn = this.controller.pgn.id;
            this.getDataSource().load();

        } else if (this.getDataSource().postData.pgn) {
            this.getDataSource().load();
        }
    },

    selectGame: function (record) {
        this.fireEvent('selectGame', [record, this.getDataSource().postData.pgn]);
    }
});