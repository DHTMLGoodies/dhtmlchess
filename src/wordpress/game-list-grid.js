chess.wordpress.GameListGrid = new Class({
    Extends: chess.view.gamelist.Grid,
    dataSource: {
        'type': 'chess.dataSource.WpGameList',
        shim: {
            txt: 'Loading games...'
        }
    },

    __rendered:function(){
        this.parent();

    },

    selectGame:function(record){
        this.fireEvent('selectGame', [record, this.getDataSource().postData.pgn]);
    }
});