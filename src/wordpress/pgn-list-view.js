chess.wordpress.PgnListView = new Class({
    Extends: ludo.ListView,
    submodule: 'wordpress.pgnlistview',
    itemRenderer: function (record) {
        return '<div style="border-radius:5px;padding:4px;border:1px solid ' + ludo.$C('border') + '"><div><strong>' + record.pgn_name + '</strong></div>'
            +'<div style="text-align:left;font-size:0.8em;width:50%;">Updated: '+ record.updated + '</div>'
            +'<div style="text-align:right;font-size:0.8em;width:50%">Games: '+ record.count + '</div>'
            +'</div>';

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

    setController:function(controller){
        this.parent(controller);
        controller.on('publish', function(){
            this.getDataSource().load();
        }.bind(this));
    },

    selectPgn:function(pgn){
        this.fireEvent('selectpgn', pgn.pgn_name);
    }
});