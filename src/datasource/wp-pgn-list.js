chess.dataSource.WpPgnList = new Class({
    Extends: ludo.dataSource.JSONArray,
    type : 'chess.dataSource.PgnList',
    autoload:true,
    singleton: true,
    postData:{
        action:'get_games'
    }
});