chess.wordpress.PgnListView = new Class({
    Extends: ludo.ListView,
    submodule: 'wordpress.pgnlistview',
    itemRenderer: function (record) {
        return '<div><strong>' + record.pgn_name + '</strong></div><div style="text-align:right">' + record.count + '</div> '
    },
    swipable: false,

    __construct:function(config){
        this.dataSource = {
            type: 'chess.wordpress.PgnList',
            listeners:{
                'select' : this.selectPgn.bind(this)
            }
        };
        this.parent(config);
    },

    selectPgn:function(pgn){
        this.fireEvent('selectpgn', pgn.pgn_name);
    }
});