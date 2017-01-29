chess.wordpress.PgnStandings = new Class({
    submodule: 'wordpress.pgnstandings',
    Extends: ludo.grid.Grid,
    currentPgn: undefined,
    dataSource: {
        type: 'dataSource.JSONArray',
        autoload: false,
        postData: {
            action: 'get_standings'
        }
    },
    headerMenu:false,
    sofiaRules:false,

    __columns:function(){
        return {
            'player': {
                heading: 'Player',
                sortable: true,
                width:200,
                key: 'player'
            },
            'w': {
                heading: 'Wins',
                sortable: true,
                width:50
            },
            'd': {
                heading: 'Draws',
                sortable: true,
                width:50
            },
            'l': {
                heading: 'Losses',
                sortable: true,
                width:50
            },
            'score': {
                heading: 'Score',
                sortable:true,
                renderer: function (val, record) {
                    if(this.sofiaRules){
                        return (record.w * 3) + record.d;
                    }
                    return record.w + (record.d / 2)
                }.bind(this)
            }
        };
    },
    
    __construct:function(config){
        this.parent(config);
        this.setConfigParams(config, ['sofiaRules']);
    },

    __rendered: function () {
        this.parent();

        this.getDataSource().setSortFn('score', {
            'desc': function (a, b) {
                var s1 = a.w + (a.d / 2);
                var s2 = b.w + (b.d / 2);
                return s1 < s2 ? 1 : -1;
            },
            'asc': function (a, b) {
                var s1 = a.w + (a.d / 2);
                var s2 = b.w + (b.d / 2);
                return s1 < s2 ? -1 : 1;
            }
        });

        this.getDataSource().on('load', this.autoSort.bind(this));

        this.on('show', this.updateStandings.bind(this));
    },

    setController: function (controller) {
        this.parent(controller);
        controller.on('pgn', this.receivePgn.bind(this));
    },

    receivePgn:function(pgn){
        if(pgn != this.currentPgn){
            this.currentPgn = pgn;
        }
        this.updateStandings();
    },

    autoSort:function(){
        this.getDataSource().by('score').descending().sort();
    },

    updateStandings: function () {
        if(!this.currentPgn)return;
        if(this.controller.pgn != this.currentPgn)return;
        this.getDataSource().setPostParam('pgn', this.currentPgn);
        this.getDataSource().load();
    }

});