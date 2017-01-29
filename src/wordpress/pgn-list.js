chess.wordpress.PgnList = new Class({
    Extends: ludo.dataSource.JSONArray,
    type : 'chess.dataSource.PgnList',
    autoload:true,
    postData:{
        action:'list_pgns'
    }
});