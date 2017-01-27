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
            }


        }
    },

    updateMetadata: function (key, val) {
        if (this.currentModel) {
            this.currentModel.setMetadataValue(key, val);
        }

    },

    saveDraft: function () {
        var gameModel = this.currentModel.modelForServer();

        console.log(this.currentModel.isDirty());

        if(!gameModel)return;
        console.log(gameModel);
        if(!gameModel.white || !gameModel.black){
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