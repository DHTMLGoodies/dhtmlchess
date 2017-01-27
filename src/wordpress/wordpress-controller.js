chess.wordpress.WordpressController = new Class({
    Extends: chess.controller.AnalysisEngineController,

    posSetup: undefined,

    debug: true,

    __construct: function (config) {
        this.parent(config);
        this.currentModel.setClean();

        this.currentModel.on('dirty', this.fireDirty.bind(this));
        this.currentModel.on('clean', this.fireClean.bind(this));

        this.updateButtonVisibility();
    },

    fireDirty: function () {
        console.log('dirty');
        this.fireEvent('dirty');
    },

    fireClean: function () {
        console.log('clean');
        this.fireEvent('clean');
    },

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
                    this.views.saveDraftButton = view;
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
                case 'wordpress.dockinglayout':
                    this.views.docking = view;
                    break;
                case 'wordpress.draftlist':
                    this.views.draftlist = view;
                    view.on('selectDraft', this.selectGame.bind(this));
                    break;
                case 'wordpress.publish':
                    this.views.publishButton = view;
                    view.on('click', this.publishGame.bind(this));
                    break;
                case 'wordpress.updategame':
                    this.views.updateGameButton = view;
                    view.on('click', this.saveUpdates.bind(this));


            }


        }
    },


    publishGame: function () {

    },

    selectPgn: function (pgn) {
        console.log('selected ' + pgn, this.views.gamelist);
        this.pgn = pgn;


        if (this.views.gamelisttab) {
            this.views.gamelisttab.show();
            if (this.views.gamelist)this.views.gamelist.loadGames();
        }
    },

    gameToLoad: undefined,

    getConfirmDialog: function () {
        if (this.confirmDialog == undefined) {
            this.confirmDialog = new ludo.dialog.Confirm({
                html: chess.getPhrase('You have unsaved game data. Do you want to discard these and '),
                autoRemove: false,
                css: {
                    padding: 5
                },
                buttonConfig: 'YesNo',
                layout: {
                    centerIn: this.views.board,
                    width: 300, height: 200
                },
                listeners: {
                    'yes': function () {
                        this.loadPgn(this.gameToLoad);
                        this.gameToLoad = undefined;
                    }.bind(this),
                    'no': function () {
                        this.gameToLoad = undefined;
                        this.hide();
                    }
                }
            });
        }

        return this.confirmDialog;
    },

    selectGame: function (game) {
        console.log(game);

        if (this.currentModel.isDirty()) {
            this.gameToLoad = game;

            this.getConfirmDialog().show();

            this.fireEvent('wperror', 'Current model is dirty');
            return;
        }


        this.loadPgn(game);

    },

    loadPgn: function (game) {

        if (game.pgn && game.id) {
            this.load({
                action: 'game_by_id',
                pgn: game.pgn,
                id: game.id
            });
        } else if (game.draft_id) {
            this.load({
                action: 'get_draft',
                draft_id: game.draft_id
            });
        }
    },

    load: function (data) {

        this.disableButtons();
        this.currentModel.beforeLoad();
        jQuery.ajax({

            url: ludo.config.getUrl(),
            method: 'post',
            cache: false,
            dataType: 'json',
            data: data,
            complete: function (response, status) {
                this.currentModel.afterLoad();
                this.enableButtons();
                if (status == 'success') {
                    var json = response.responseJSON;
                    if (json.success) {
                        if (this.views.docking) {
                            this.views.docking.getLayout().collapse();
                        }
                        var game = json.response;


                        this.currentModel.populate(game);
                        this.currentModel.setClean();

                        this.updateButtonVisibility();
                        console.log(this.currentModel.isDirty());

                        this.fireEvent('game', game);
                    }

                } else {
                    this.fireEvent('wperrror', chess.getPhrase('Could not load game. Try again later'));
                }
            }.bind(this),
            fail: function (text, error) {
                this.fireEvent(error);
            }.bind(this)

        });
    },

    updateButtonVisibility: function () {
        var meta = this.currentModel.getMetadata();

        this.views.updateGameButton.hide();
        this.views.publishButton.hide();
        this.views.saveDraftButton.hide();

        console.log('amk', meta);


        if (meta.pgn) {
            this.views.updateGameButton.show();
        } else {
            this.views.publishButton.show();
            this.views.saveDraftButton.show();
        }
    },

    updateMetadata: function (key, val) {
        if (this.currentModel) {
            this.currentModel.setMetadataValue(key, val);
        }

    },

    deleteDraft: function (game) {

    },

    saveUpdates: function () {
        var gameModel = this.currentModel.modelForServer();

        if (!gameModel)return;
        if (!gameModel.white || !gameModel.black) {
            this.fireEvent('wperror', 'Metadata missing');
            this.views.metadata.show();
            return;
        }

        this.disableButtons();
        jQuery.post(ludo.config.getUrl(), {
            action: 'save_game',
            pgn: gameModel.pgn,
            game: gameModel
        }, function (data) {
            this.enableButtons();
            if (data.response) {
                if (data.success) {
                    this.fireEvent('wpmessage', chess.getPhrase('Game Saved'));
                    this.fireEvent('pgngameupdated');
                    this.currentModel.setClean();
                } else {
                    this.fireEvent('wpmessage', chess.getPhrase('Everything is up to date'));
                }
            }

        }.bind(this));

    },


    saveDraft: function () {
        var gameModel = this.currentModel.modelForServer();

        if (!gameModel)return;
        if (!gameModel.white || !gameModel.black) {
            this.fireEvent('wperror', 'Metadata missing');
            this.views.metadata.show();
            return;
        }

        if (gameModel.id && isNaN(gameModel.id)) {
            gameModel.id = undefined;
        }


        this.disableButtons();
        jQuery.post(ludo.config.getUrl(), {
            action: 'save_draft',
            game: gameModel
        }, function (data) {
            this.enableButtons();
            if (data.response) {
                if (data.success) {
                    this.fireEvent('wpmessage', chess.getPhrase('Draft Saved'));
                    this.fireEvent('draftsupdated');
                    this.currentModel.setMetadata({'draft_id': data.response.draft_id});
                    this.currentModel.setClean();
                } else {
                    this.fireEvent('wpmessage', chess.getPhrase('Everything is up to date'));
                }
            }

        }.bind(this));


        console.log('saving draft', this.currentModel);
    },

    disableButtons: function () {
        this.views.saveDraftButton.setEnabled(false);
        this.views.publishButton.setEnabled(false);
    },

    enableButtons: function () {
        this.views.saveDraftButton.enable.delay(1000, this.views.saveDraftButton);
        this.views.publishButton.enable.delay(1000, this.views.publishButton);
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