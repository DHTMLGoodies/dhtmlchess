chess.wordpress.WordpressController = new Class({
    Extends: chess.controller.StockfishEngineController,
    posSetup: undefined,
    newGameDialog: undefined,

    __construct: function (config) {
        config.stockfish = ludo.config.getDocumentRoot() + '/stockfish-js/stockfish.js';
        this.parent(config);
        this.currentModel.setClean();

        this.currentModel.on('dirty', this.fireDirty.bind(this));
        this.currentModel.on('clean', this.fireClean.bind(this));

        this.updateButtonVisibility();

        this.setDefaultMetadata();
        this.currentModel.setClean();

        var undoRedo = new chess.wordpress.UndoRedo(this.currentModel);
        undoRedo.listen();

        this.autoSaveDraft.delay(15000, this);

        this.listenForSave();

        jQuery(window).on('beforeunload', this.confirmLeave.bind(this));

        this.addKeyEvents();
    },

    addKeyEvents:function(){
        jQuery(document).keydown(function (e) {
            if(e.key=='ArrowRight'){
                this.currentModel.nextMove();
                return false;
            }else if(e.key=='ArrowLeft'){
                this.currentModel.previousMove();
                return false;
            }

        }.bind(this));
    },

    confirmLeave:function(){

        if(this.currentModel.isDirty()){
            return chess.getPhrase("You have unsaved changed. ")
        }
    },

    listenForSave: function () {
        jQuery(document).keydown(function (e) {
            if(!this.currentModel)return;
            var ctrlOrCommand = e.ctrlKey || (e.key && e.key == 'Meta') || e.metaKey;
            if (e.keyCode == 83 && ctrlOrCommand) {
                var gameId = this.currentModel.getMetadataValue('id');
                if(gameId && !isNaN(gameId)){
                    this.saveUpdates();
                }else{
                    this.saveDraft();
                }
                return false;
            }
        }.bind(this));
    },

    fireDirty: function () {
        this.fireEvent('dirty');
    },

    fireClean: function () {
        this.fireEvent('clean');
    },

    addView: function (view) {
        success = this.parent(view);

        if (success) {
            // console.log(view.submodule);

            switch (view.submodule) {
                case 'wordpress.importpgn':
                    this.views.importPgnButton = view;
                    view.on('click', this.importPgnString.bind(this));
                    break;
                case 'wordpress.standingsbutton':
                    this.views.standingsButton = view;
                    view.on('click', this.showStandings.bind(this));
                    break;
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
                case 'chess.newDatabaseButton':
                    view.on('click', this.showNewDatabaseDialog.bind(this));
                    this.views.newDatabaseButton = view;
                    break;
                case 'wordpress.newdatabasedialog':
                    view.on('newdatabase', this.createDatabase.bind(this));
                    break;
                case 'wordpress.computereval':
                    view.on('appendLine', this.appendLine.bind(this));
                    break;
                case 'notation':
                    this.views.notations = view;
                    break;

            }


        }
    },

    renameDatabase: function () {
        if (!this.pgn) {
            this.showError(chess.getPhrase('No database selected'))
        } else {
            this.getDatabaseRenameDialog().show(this.pgn);
        }
    },

    getDatabaseRenameDialog: function () {
        if (this.renameDbDialog == undefined) {
            this.renameDbDialog = new chess.wordpress.RenameDatabaseDialog({
                layout: {
                    centerIn: this.views.board
                },
                listeners: {
                    'renameDatabase': this.finishRename.bind(this)
                }
            });
        }

        return this.renameDbDialog;
    },

    finishRename: function (pgn, newName) {
        if (newName.trim().length == 0) {
            this.showError('Invalid name');
            return;
        }

        jQuery.ajax({
            url: ludo.config.getUrl(),
            method: 'post',
            cache: false,
            dataType: 'json',
            data: {
                action: 'rename_pgn',
                pgn: pgn.id,
                name: newName
            },
            complete: function (response, success) {
                if (success) {
                    var data = response.responseJSON;
                    if (data.success) {
                        this.fireEvent('wpmessage', chess.getPhrase('Database Renamed'));
                        this.fireEvent('rename_pgn');
                        this.views.gamelisttab.setTitle(data.response.name);
                    } else {
                        this.fireEvent('wperror', data.response);
                    }
                } else {
                    this.fireEvent('wperror', response.responseText);
                }

            }.bind(this)
        });
    },

    appendLine: function (moveString) {
        var appended = this.currentModel.appendLine(moveString, true);
        if (appended) {
            this.views.notations.show();
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
            method: 'post',
            cache: false,
            dataType: 'json',
            data: {
                action: 'discard_draft',
                draft_id: this.currentModel.getMetadataValue('draft_id')
            },
            complete: function (response, success) {
                this.enableButtons();

                if (success) {
                    var data = response.responseJSON;
                    if (data.success) {
                        this.fireEvent('wpmessage', chess.getPhrase('Draft discarded'));
                        this.fireEvent('draftsupdated');
                        this.currentModel.newGame();
                    } else {
                        this.fireEvent('wperror', data.response);
                    }
                } else {
                    this.fireEvent('wperror', response.responseText);
                }

            }.bind(this)
        });
    },

    newGameFen: undefined,

    setDefaultMetadata: function () {
        this.currentModel.setMetadata({
            'white': chess.getPhrase('Player White'),
            'black': chess.getPhrase('Player Black'),
            'date': new Date().format('%x'),
            'result': '*'
        });
    },

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

                        this.currentModel.newGame();

                        this.setDefaultMetadata();

                        if (this.newGameFen) {
                            this.currentModel.setPosition(this.newGameFen);
                        }

                        this.updateButtonVisibility();

                    }.bind(this),
                    'no': function () {

                    }
                }
            });
        }

        return this.newGameDialog;
    },

    importPgnString:function(){
        if(this.importPgnWindow == undefined){
            this.importPgnWindow = new chess.wordpress.ImportPgnDialog({
                title:chess.getPhrase('Import PGN'),
                layout:{
                    left:100,top:100,
                    width:400,height:500
                },
                listeners:{
                    'imported':function(){
                        this.fireEvent('imported');
                    }.bind(this)
                }

            });
            
        }

        this.importPgnWindow.show(this.pgn);
    },

    showStandings: function () {
        if (this.standingsWindow == undefined) {
            this.standingsWindow = new ludo.dialog.Dialog({
                title: chess.getPhrase('Standings'),
                autoRemove: false,
                layout: {
                    type: 'fill',
                    left: 100, top: 100,
                    width: 500, height: 400
                },
                buttonConfig: 'Ok',
                children: [{
                    type: 'chess.wordpress.PgnStandings',
                    module: this.module
                }]
            });
        }
        this.standingsWindow.setTitle(chess.getPhrase('Standings') + ' - ' + this.pgn.pgn_name);
        this.standingsWindow.children[0].setPgn(this.pgn.id);
        this.standingsWindow.show();
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

    showNewDatabaseDialog: function () {
        if (this.newDbDialog == undefined) {
            this.newDbDialog = new chess.wordpress.NewDatabaseDialog({
                module: this.module,
                autoRemove: false
            });

            this.addView(this.newDbDialog);

        }

        this.newDbDialog.show();

        var pos = this.views.newDatabaseButton.getEl().offset();
        var size2 = this.views.newDatabaseButton.getEl().outerHeight();
        this.newDbDialog.showAt(pos.left, pos.top + size2);
    },

    createDatabase: function (dbName) {
        // TODO perhaps confirm database
        jQuery.ajax({
            url: ludo.config.getUrl(),
            method: 'post',
            dataType: 'json',
            cache: false,
            data: {
                action: 'new_pgn',
                pgn_name: dbName
            },
            complete: function (response, success) {
                if (success) {
                    var data = response.responseJSON;

                    this.enableButtons();
                    if (data.response) {
                        if (data.success) {
                            this.fireEvent('new_pgn', data.response);
                            this.fireEvent('wpmessage', chess.getPhrase('New Database created'));
                        } else {
                            this.fireEvent('wpmessage', chess.getPhrase(e.response));
                        }
                    }

                } else {
                    this.fireEvent('wperror', response.responseText);
                }

            }.bind(this)

        });


    },

    onNewGameClick: function () {
        this.newGameFen = undefined;


        if (this.currentModel.isDirty()) {
            this.getNewGameDialog().show();
        } else {
            this.currentModel.newGame();
            this.setDefaultMetadata();
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
                        d.html(chess.getPhrase('Publish game in') + ' <strong>' + this.publish_pgn.pgn_name + '</strong>?');

                    }.bind(this)
                }

            });

            this.addView(this.publishDialog);
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
        this.getPublishDialog().show(this.currentModel.getMetadata(), this.pgn);
    },

    publishComplete: function (pgn) {
        this.currentModel.setMetadata({
            pgn_id: pgn.id
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
                game: JSON.stringify(gameModel),
                pgn: pgn.id
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
                            this.currentModel.setMetadata({'pgn_id': pgn.id});
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
        if (this.views.standingsButton) {
            this.views.standingsButton.show();
        }
        if(this.views.importPgnButton){
            this.views.importPgnButton.show();
        }
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

        if (game.pgn_id && game.id) {
            this.load({
                action: 'game_by_id',
                pgn: game.pgn_id,
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

        if (meta.pgn_id) {
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
                pgn: gameModel.pgn_id,
                game: JSON.stringify(gameModel)
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

    isModelValidForSave: function () {
        var gameModel = this.currentModel.modelForServer();
        if (!gameModel)return false;
        return (gameModel.white && gameModel.black);
    },

    validateAndReturnModel: function (silent) {
        var gameModel = this.currentModel.modelForServer();
        if (!gameModel)return false;
        if (!gameModel.white || !gameModel.black) {
            if (!silent) {
                this.fireEvent('wperror', 'Metadata missing');
                this.views.metadata.show();
            }
            return false;
        }

        if (gameModel.id && isNaN(gameModel.id)) {
            gameModel.id = undefined;
        }

        delete gameModel.metadata;

        return gameModel;
    },

    autoSaveDraft: function () {

        var gameId = this.currentModel.getMetadataValue('id');
        var isDraft = !gameId || isNaN(gameId);
        if (isDraft && this.currentModel.model.moves.length > 0) {
            var m = this.validateAndReturnModel(true);
            if (m) {
                this.saveDraft();
            }
        }

        this.autoSaveDraft.delay(30000, this);
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
                game: JSON.stringify(gameModel)
            },
            complete: function (response, success) {
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

    sendMessage: function (message) {
        this.fireEvent('wpmessage', message);
    },

    sendError: function (error) {
        this.fireEvent('wperror', error);
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
        this.currentModel.setPosition(fen);
    }
});