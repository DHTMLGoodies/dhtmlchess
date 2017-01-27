chess.wordpress.WordpressController = new Class({
    Extends: chess.controller.AnalysisEngineController,

    posSetup: undefined,
    addView: function (view) {
        success = this.parent(view);

        if (success) {
            console.log(view.submodule);

            switch (view.submodule) {
                case 'wordpress.newposition':
                    view.on('click', this.showPositionSetup.bind(this));
                    break;
                case 'wordpress.position':

                    break;
                case 'wordpress.savedraft':
                    view.on('click', this.saveDraft.bind(this));
                    break;
                case 'wordpress.gameMetadata':
                    view.on('metadata', this.updateMetadata.bind(this));
                    this.views.metadata = view;
                    break;
                case 'wordpress.pgnlistview':
                    view.on('selectpgn', this.selectPgn.bind(this));
                    break;
                case 'wordpress.gamelist':
                    this.views.gamelist = view;
                    view.on('selectGame', this.selectGame.bind(this));
                    break;
                case 'wordpress.gamelisttab':

                    this.views.gamelisttab = view;
                    break;
            }


        }
    },

    selectPgn: function (pgn) {
        console.log('selected ' + pgn, this.views.gamelist);
        this.pgn = pgn;
        if (this.views.gamelisttab) {
            this.views.gamelisttab.show();
            if (this.views.gamelist)this.views.gamelist.loadGames();
        }
    },

    selectGame: function (game) {
        console.log(game);

        if (game.pgn && game.id) {
            this.load({
                action: 'game_by_id',
                pgn: game.pgn,
                id: game.id
            });
            // this.currentModel.loadWordPressGameById(game.pgn, game.id);
        }
    },

    load:function(data){

        this.currentModel.beforeLoad();
        jQuery.ajax({

            url: ludo.config.getUrl(),
            method: 'post',
            cache: false,
            dataType: 'json',
            data: data,
            complete: function (response, status) {
                this.currentModel.afterLoad();

                this._loaded = true;
                if (status == 'success') {
                    var json = response.responseJSON;
                    if(json.success){
                        this.currentModel.populate(json.response);
                    }
                    console.log(json);

                } else {

                }
            }.bind(this),
            fail: function (text, error) {
            }.bind(this)

        });

    },

    updateMetadata: function (key, val) {
        if (this.currentModel) {
            this.currentModel.setMetadataValue(key, val);
        }

    },

    saveDraft: function () {
        var gameModel = this.currentModel.modelForServer();

        console.log(this.currentModel.isDirty());

        if (!gameModel)return;
        console.log(gameModel);
        if (!gameModel.white || !gameModel.black) {
            this.fireEvent('wperror', 'Metadata missing');
            this.views.metadata.show();
            return;
        }

        if (gameModel.id && isNaN(gameModel.id)) {
            gameModel.id = undefined;
        }

        jQuery.post(ludo.config.getUrl(), {
            action: 'save_draft',
            game: gameModel
        }, function (response) {
            console.log(response);
        });


        console.log('saving draft', this.currentModel);
    },

    showPositionSetup: function () {

        if (this.posSetup == undefined) {
            this.posSetup = new chess.view.position.Dialog({
                submodule: 'wordpress.position',
                module: this.applyTo[0],
                layout: {
                    centerIn: this.views.board
                },
                listeners: {
                    'setPosition': this.receiveNewPosition.bind(this)
                }
            });
        }


        this.posSetup.show();

    },

    receiveNewPosition: function (fen) {
        console.log('received ', fen);

        this.currentModel.setPosition(fen);

    }


});