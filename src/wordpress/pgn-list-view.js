chess.wordpress.PgnListView = new Class({
    Extends: ludo.ListView,
    swipable: true,
    submodule: 'wordpress.pgnlistview',

    emptyText: chess.__('No Databases found'),

    idToSelect:undefined,

    itemRenderer: function (record) {
        return '<div class="pgn_list_item">'
            + '<div class="pgn_list_name"><strong>' + record.pgn_name + '</strong></div>'
            + '<div class="pgn_list_pgn_id">ID: ' + record.id + '</div>'
            + '<div class="pgn_list_count_games">Games: ' + record.count + '</div>'
            + '<div class="pgn_list_updated">Updated: ' + record.updated + '</div>'
            + '</div>';

    },

    __rendered:function(){
        this.parent();
        this.getDataSource().on('load', function(){
            if(this.idToSelect){
                this.getDataSource().selectRecord({ id : this.idToSelect });
            }
        }.bind(this));
    },

    /** Function returning back side when swiping to the left */
    backSideLeft: function () {
        return '<div style="position:absolute;top:50%;margin-top:-10px;left:10px">' + chess.__('Archive Database') + '</div>';
    },

    /** Function returning UNDO html after swipe. If not set, the swipe event will be triggered immediately */
    backSideUndo: function () {
        return '<div style="position:absolute;top:50%;margin-top:-10px;left:10px">' + chess.__('Undo') + '</div>';
    },

    __construct: function (config) {
        this.dataSource = {
            type: 'chess.wordpress.PgnList',
            listeners: {
                'select': this.selectPgn.bind(this)
            }
        };
        this.parent(config);
        this.on('swipe', function (record) {
            jQuery.ajax({
                url: ludo.config.getUrl(),
                method: 'post',
                dataType: 'json',
                cache: false,
                data: {
                    action: 'archive_pgn',
                    pgn: record.id
                },
                complete: function (response, success) {
                    if (success) {
                        var json = response.responseJSON;
                        if (json.success) {
                            this.getDataSource().remove(record);
                            this.controller.sendMessage(chess.__('PGN archived'));
                        } else {
                            this.controller.sendError('Unable to Archive: ' + json.response);
                            this.undoSwipe(record);
                        }
                    } else {
                        this.controller.sendError(response.responseText);
                        this.undoSwipe(record);
                    }
                }.bind(this)
            });

        }.bind(this));
    },

    setController: function (controller) {
        this.parent(controller);
        controller.on('publish', function () {
            this.getDataSource().load();
        }.bind(this));
        controller.on('new_pgn', function (id) {
            this.idToSelect = id;
            this.getDataSource().load();
        }.bind(this));

        controller.on('rename_pgn', function () {
            this.getDataSource().load();
        }.bind(this));

        controller.on('imported', function () {
            this.getDataSource().load();
        }.bind(this));
    },

    selectPgn: function (pgn) {
        this.fireEvent('selectpgn', pgn);
    }
});