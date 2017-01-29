chess.wordpress.WordpressController = new Class({
    Extends: chess.controller.AnalysisEngineController,

    posSetup: undefined,

    debug: true,

    newGameDialog: undefined,

    __construct: function (config) {
        this.parent(config);
        this.currentModel.setClean();

        this.currentModel.on('dirty', this.fireDirty.bind(this));
        this.currentModel.on('clean', this.fireClean.bind(this));

        this.updateButtonVisibility();

        this.currentModel.setClean();
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
                    view.on('setPosition', this.onNewPositionClick.bind(this));
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
                case 'wordpress.discarddraft':
                    this.views.discardDraftButton = view;
                    view.on('click', this.discardDraft.bind(this));
                    break;
                case 'wordpress.updategame':
                    this.views.updateGameButton = view;
                    view.on('click', this.saveUpdates.bind(this));
                    break;
                case 'wordpress.newgame':
                    view.on('click', this.onNewGameClick.bind(this));
                    break;


            }


        }
    },

    getDiscardDraftDialog: function () {
        if (this.discardDraftDialog == undefined) {
            this.discardDraftDialog = new chess.wordpress.DiscardDraftDialog({
                listeners: {
                    'yes': this.discardDraftConfirmed.bind(this)
                },
                layout: {
                    centerIn: this.views.board
                }
            });
        }
        return this.discardDraftDialog;
    },

    discardDraft: function () {
        this.getDiscardDraftDialog().show();
    },

    discardDraftConfirmed: function () {
        this.disableButtons();

        jQuery.ajax({
            url: ludo.config.getUrl(),
            method:'post',
            cache:false,
            dataType:'json',
            data:{
                action:'discard_draft',
                draft_id: this.currentModel.getMetadataValue('draft_id')
            },
            complete:function(response, success){
                this.enableButtons();

                if(success){
                    var data = response.responseJSON;
                    if(data.success){
                        this.fireEvent('wpmessage', chess.getPhrase('Draft discarded'));
                        this.fireEvent('draftsupdated');
                        this.currentModel.newGame();
                    }else{
                        this.fireEvent('wperror', data.response);
                    }
                }else{
                    this.fireEvent('wperror', response.responseText);
                }

            }.bind(this)
        });
    },

    newGameFen: undefined,

    getNewGameDialog: function () {
        if (this.newGameDialog == undefined) {
            this.newGameDialog = new ludo.dialog.Confirm({
                html: chess.getPhrase('You have unsaved game data. Do you want to discard these?'),
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
                        this.currentModel.setDefaultModel();
                        if (this.newGameFen) {
                            this.currentModel.setPosition(this.newGameFen);
                        }
                    }.bind(this),
                    'no': function () {

                    }
                }
            });
        }

        return this.newGameDialog;
    },


    onNewPositionClick: function (fen) {
        this.newGameFen = fen;
        if (this.currentModel.isDirty()) {
            this.getNewGameDialog().show();
        } else {
            this.currentModel.setDefaultModel();
            this.currentModel.setPosition(fen);
            this.updateButtonVisibility();
            this.views.metadata.show();

        }
    },

    onNewGameClick: function () {
        this.newGameFen = undefined;


        if (this.currentModel.isDirty()) {
            this.getNewGameDialog().show();
        } else {
            this.currentModel.newGame();
            this.updateButtonVisibility();
            this.views.metadata.show();
        }
    },

    getPublishDialog: function () {
        if (this.publishDialog == undefined) {
            this.publishDialog = new chess.wordpress.PublishDialog({
                autoRemove: false,
                layout: {
                    centerIn: this.views.board
                },
                listeners: {
                    'selectpgn': function (pgn) {
                        this.publish_pgn = pgn;
                        var d = this.getPublishConfirmDialog();
                        d.show();
                        d.html(chess.getPhrase('Publish game in') + ' <strong>' + this.publish_pgn + '</strong>?');

                    }.bind(this)
                }

            });
        }
        return this.publishDialog;

    },

    getPublishConfirmDialog: function () {
        if (this.publishConfirmDialog == undefined) {
            this.publishConfirmDialog = new ludo.dialog.Confirm({
                html: '',
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
                        this.publishComplete(this.publish_pgn);
                    }.bind(this),
                    'no': function () {
                        this.hide();
                    }
                }
            });

        }
        return this.publishConfirmDialog;
    },


    publishGame: function () {
        var m = this.validateAndReturnModel();
        if (!m)return;
        this.getPublishDialog().show(this.currentModel.getMetadata());
    },

    publishComplete: function (pgn) {
        this.currentModel.setMetadata({
            pgn: pgn
        });

        var gameModel = this.validateAndReturnModel();

        if (!gameModel)return;


        this.disableButtons();

        jQuery.ajax({
            url: ludo.config.getUrl(),
            method: 'post',
            dataType: 'json',
            cache: false,
            data: {
                action: 'publish_game',
                game: gameModel,
                pgn: pgn
            },
            complete: function (response, success) {
                if (success) {
                    var data = response.responseJSON;

                    this.enableButtons();
                    if (data.response) {
                        if (data.success) {
                            this.currentModel.draft_id = undefined;

                            this.fireEvent('wpmessage', chess.getPhrase('Game published'));
                            this.fireEvent('draftsupdated');
                            this.fireEvent('publish');
                            this.currentModel.setMetadata({'draft_id': undefined});
                            this.currentModel.setMetadata({'id': data.response});
                            this.currentModel.setClean();

                            this.updateButtonVisibility();

                        } else {
                            this.fireEvent('wpmessage', chess.getPhrase('Everything is up to date'));
                        }
                    }

                } else {
                    this.fireEvent('wperror', response.responseText);
                }

            }.bind(this)

        });
    },

    selectPgn: function (pgn) {
        this.pgn = pgn;
        this.fireEvent('pgn', pgn);
        if (this.views.gamelisttab) {
            this.views.gamelisttab.show();
            if (this.views.gamelist)this.views.gamelist.loadGames();
        }
    },

    gameToLoad: undefined,

    getConfirmDialog: function () {
        if (this.confirmDialog == undefined) {
            this.confirmDialog = new ludo.dialog.Confirm({
                html: chess.getPhrase('You have unsaved game data. Do you want to discard these?'),
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
        if (this.currentModel.isDirty()) {
            this.gameToLoad = game;

            this.getConfirmDialog().show();

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

        this.views.discardDraftButton.toggle();

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

        jQuery.ajax({
            url: ludo.config.getUrl(),
            method: 'post',
            cache: false,
            data: {
                action: 'save_game',
                pgn: gameModel.pgn,
                game: gameModel
            },
            complete: function (response, success) {
                this.enableButtons();
                if (success) {
                    var json = response.responseJSON;
                    if (json.success) {
                        this.fireEvent('wpmessage', chess.getPhrase('Game Saved'));
                        this.fireEvent('publish');
                        this.currentModel.setClean();

                    } else {
                        this.fireEvent('wpmessage', chess.getPhrase(json.response));
                    }

                }
            }.bind(this)
        });


    },

    validateAndReturnModel: function () {
        var gameModel = this.currentModel.modelForServer();
        if (!gameModel)return false;
        if (!gameModel.white || !gameModel.black) {
            this.fireEvent('wperror', 'Metadata missing');
            this.views.metadata.show();
            return false;
        }

        if (gameModel.id && isNaN(gameModel.id)) {
            gameModel.id = undefined;
        }

        return gameModel;

    },

    saveDraft: function () {
        var gameModel = this.validateAndReturnModel();

        if (!gameModel)return;


        this.disableButtons();

        jQuery.ajax({
            url: ludo.config.getUrl(),
            dataType: 'json',
            method: 'post',
            data: {
                action: 'save_draft',
                game: gameModel
            },
            complete: function (response, success) {
                console.log(arguments);
                this.enableButtons();
                if (success) {
                    var data = response.responseJSON;
                    if (data.success) {
                        this.fireEvent('wpmessage', chess.getPhrase('Draft Saved'));
                        this.fireEvent('draftsupdated');
                        this.currentModel.setMetadata({'draft_id': data.response.draft_id});
                        this.currentModel.setClean();
                    } else {
                        this.fireEvent('wpmessage', chess.getPhrase('Everything is up to date'));
                    }

                } else {
                    this.fireEvent('wperror', response.responseText);
                }
            }.bind(this)

        });
    },

    sendMessage:function(message){
        this.fireEvent('wpmessage', message);
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
                layout: {
                    centerIn: this.views.board
                },
                listeners: {
                    'setPosition': this.receiveNewPosition.bind(this)
                }
            });

            this.posSetup.on('setPosition', this.onNewPositionClick.bind(this));
        }


        this.posSetup.show();

    },

    receiveNewPosition: function (fen) {
        console.log('received ', fen);

        this.currentModel.setPosition(fen);

    }


});