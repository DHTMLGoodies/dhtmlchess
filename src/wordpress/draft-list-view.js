chess.wordpress.DraftListView = new Class({
    Extends: ludo.ListView,
    dataSource:{
        type:'chess.wordpress.Drafts'
    },
    emptyText:'No Drafts Found',

    itemRenderer:function(game){
        return '<div style="border-radius:5px;padding:4px;border:1px solid ' + ludo.$C('border') + '"><strong>' + game.title + '</strong></div>';

    }

});