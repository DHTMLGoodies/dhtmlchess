chess.wordpress.WordPressArchived = new Class({
    Extends: ludo.View,
    layout:{
        type:'linear', orientation:'vertical'
    },
    
    __children:function(){
        
        return [
            {
                type:'form.Text', placeholder:chess.__('Search'),
                listeners:{
                    'key': function(val){
                        this.child['list'].getDataSource().search(val);
                    }.bind(this)
                }
            },
            {
                name:'list',
                type:'ListView',
                swipable:true,
                emptyText: chess.__('No archived databases'),
                dataSource: {
                    'type': 'ludo.dataSource.JSONArray',
                    autoload: true,
                    postData: {
                        action: 'list_archived'
                    }
                },
                itemRenderer: function (record) {
                    return '<div class="pgn_list_item">'
                        + '<div class="pgn_list_name"><strong>' + record.pgn_name + '</strong></div>'
                        + '<div class="pgn_list_pgn_id">ID: ' + record.id + '</div>'
                        + '<div class="pgn_list_count_games">Games: ' + record.count + '</div>'
                        + '<div class="pgn_list_updated">Updated: ' + record.updated + '</div>'
                        + '</div>';
                },

                backSideLeft: function (record) {
                    return '<div style="position:absolute;top:50%;margin-top:-10px;left:10px">' + chess.__('Restore') + '</div>';
                },
                backSideRight: function (record) {
                    return '<div style="text-align:right;position:absolute;top:50%;margin-top:-10px;right:10px">' + chess.__('Delete') + '</div>';
                },

                /** Function returning UNDO html after swipe. If not set, the swipe event will be triggered immediately */
                backSideUndo: function (record) {
                    return '<div style="position:absolute;top:50%;margin-top:-10px;left:10px">' + chess.__('Undo') + '</div>';
                },

                layout:{
                    weight:1
                },
                css:{
                    'border-bottom': '1px solid ' + ludo.$C('border')
                }
            },
            {
                layout:{
                    height:30
                },
                name:'message',
                type:'chess.wordpress.WordPressMessage'
            }
        ]
    },

    __rendered:function(){
        this.parent();
        this.child['list'].on('swipeLeft', this.deletePermanently.bind(this));
        this.child['list'].on('swipeRight', this.restore.bind(this));

    },

    deletePermanently:function(record){

        jQuery.ajax({
            url: ludo.config.getUrl(),
            method: 'post',
            dataType: 'json',
            cache: false,
            data: {
                action: 'delete_pgn',
                pgn: record.id
            },
            complete: function (response, success) {
                if (success) {
                    var json = response.responseJSON;
                    if (json.success) {
                        this.child["list"].remove(record);
                        this.showMessage(chess.__('PGN deleted'));
                    } else {
                        this.showError(chess.__('Not able to delete'));
                        this.child["list"].undoSwipe(record);
                    }
                } else {
                    this.showError(response.responseText);
                    this.child["list"].undoSwipe(record);
                }
            }.bind(this)
        });
    },

    restore:function(record){
        jQuery.ajax({
            url: ludo.config.getUrl(),
            method: 'post',
            dataType: 'json',
            cache: false,
            data: {
                action: 'restore_pgn',
                pgn: record.id
            },
            complete: function (response, success) {
                if (success) {
                    var json = response.responseJSON;
                    if (json.success) {
                        this.child["list"].getDataSource().remove(record);
                        this.showMessage(chess.__('PGN restored'));
                    } else {
                        this.showError(chess.__('Not able to restore'));
                        this.child["list"].undoSwipe(record);
                    }
                } else {
                    this.showError(response.responseText);
                    this.child["list"].undoSwipe(record);
                }
            }.bind(this)
        });
    },

    showError:function(message){
        this.child['message'].showError(message);
    },

    showMessage:function(message){

        this.child['message'].showMessage(message);
    }

});