window.chess.isWordPress = true;
chess.WPGameTemplate = new Class({
    Extends: chess.WPTemplate,
    fen: undefined,
    start: undefined,

    __construct: function (config) {
        //console.time("render");
        this.parent(config);
        this.model = config.model || undefined;
        this.start = config.start;
        this.gameId = config.gameId;

        if (config.fen) {
            this.fen = config.fen;
        }
        if (!this.model && !this.gameId && !this.fen) this.gameId = 2;

        //console.timeEnd("render");
    },


    createController: function () {
        this.controller = new chess.controller[this.controllerType()]({
            applyTo: [this.module],
            stockfish: ludo.config.getDocumentRoot() + '/stockfish-js/stockfish.js',
            sound: this.sound
        });
        if (this.fen) {
            this.controller.setPosition(this.fen);
        }
        this.parent();
        this.loadGame();
    },

    getGame: function (game) {
        return game;
    },


    loadGame: function () {

        if (this.gameId) {
            jQuery.ajax({
                url: ludo.config.getUrl(),
                method: 'post',
                cache: false,
                dataType: 'json',
                data: {
                    action: 'game_by_id',
                    id: this.gameId
                },
                complete: function (response, status) {
                    this.controller.currentModel.afterLoad();
                    if (status === 'success') {
                        var json = response.responseJSON;
                        if (json.success) {
                            var game = json.response;
                            var model = this.controller.currentModel;
                            model.populate(game, this.start);
                            if (this.to_end) {
                                model.toEnd();
                            }
                            if (this.forward) {
                                model.forward(this.forward);
                            }
                        }
                    } else {
                        this.fireEvent('wperrror', chess.__('Could not load game. Try again later'));
                    }
                }.bind(this),
                fail: function (text, error) {
                    this.fireEvent(error);
                }.bind(this)

            });
        } else if (this.model) {
            this.controller.currentModel.populate(this.model, this.start);
        }
    }
});