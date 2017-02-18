window.chess.isWordPress = true;
chess.WPGameTemplate = new Class({
    Extends: chess.WPTemplate,
    initialize:function(config){
        this.parent(config);
        this.model = config.model || undefined;
        this.gameId = config.gameId;
        if(!this.model && !this.gameId)this.gameId = 2;
    },

    loadGame:function(){


        if(this.gameId){
            jQuery.ajax({
                url: ludo.config.getUrl(),
                method: 'post',
                cache: false,
                dataType: 'json',
                data: {
                    action:'game_by_id',
                    id:this.gameId
                },
                complete: function (response, status) {
                    this.controller.currentModel.afterLoad();
                    if (status == 'success') {
                        var json = response.responseJSON;
                        if (json.success) {
                            var game = json.response;
                            this.controller.currentModel.populate(game);
                        }

                    } else {
                        this.fireEvent('wperrror', chess.getPhrase('Could not load game. Try again later'));
                    }
                }.bind(this),
                fail: function (text, error) {
                    this.fireEvent(error);
                }.bind(this)

            });
        }else if(this.model){
            this.controller.currentModel.populate(this.model);

        }




    }
});