chess.wordpress.DraftListView = new Class({
    Extends: ludo.ListView,
    dataSource:{
        type:'chess.wordpress.Drafts'
    },
    emptyText:'No Drafts Found',
    submodule:'wordpress.draftlist',

    __rendered:function(){
        this.parent();
        this.getDataSource().on('select', this.selectGame.bind(this));
    },

    setController:function(controller){
        this.parent(controller);
        controller.on('draftsupdated', function(){
            console.log('reload');
            this.getDataSource().load();
        }.bind(this));

    },

    itemRenderer:function(game){
        return '<div style="border-radius:5px;padding:4px;border:1px solid ' + ludo.$C('border') + '"><strong>' + game.title + '</strong></div>'
            +'<div style="text-align:right;font-size:0.8em">Last updated '+ game.updated + '</div>';

    },

    selectGame:function(record){
        console.log('selected draft ', record);
        this.fireEvent('selectDraft', record.game);
    }

});