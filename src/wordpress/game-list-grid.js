chess.wordpress.GameListGrid = new Class({
    Extends: chess.view.gamelist.Grid,
    headerMenu:false,
    submodule:'wordpress.gamelist',
    dataSource: {
        'type': 'ludo.dataSource.JSONArray',
        autoload:false,
        postData:{
            action:'list_of_games'
        },
        shim: {
            txt: 'Loading games...'
        }
    },



    __rendered:function(){
        this.parent();

        this.loadGames();

        this.on('show', this.loadGames.bind(this));

    },

    loadGames:function(){
        console.log('loading games ', this.controller.pgn);

        if(this.controller.pgn && this.controller.pgn != this.getDataSource().postData.pgn){
            this.load();
        }
    },

    load:function(){
        this.getDataSource().postData.pgn = this.controller.pgn;
        this.getDataSource().load();
    },

    selectGame:function(record){
        this.fireEvent('selectGame', [record, this.getDataSource().postData.pgn]);
    }
});