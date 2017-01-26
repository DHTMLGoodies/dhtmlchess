chess.view.gamelist.WpGrid = new Class({
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
        console.log(record, this.getDataSource().postData.pgn);
        this.fireEvent('selectGame', [record, this.getDataSource().postData.pgn]);
    }
});