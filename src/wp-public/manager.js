chess.WPManager = new Class({
    Extends: ludo.Core,
    type: 'chess.WPManager',
    singleton: true,
    views: undefined,

    activeView: undefined,

    __construct: function (config) {
        this.parent(config);
        this.views = [];
        this.addKeyEvents();
    },

    add: function (boardView) {
        this.views.push(boardView);
        var fn = function () {
            this.activeView = boardView;
        }.bind(this);
        boardView.renderTo.on('click', fn);
    },

    addKeyEvents: function () {
        jQuery(document).keydown(function (e) {
            if (this.activeView) {
                var c = this.activeView.controller;

                if (e.key === 'ArrowRight' && !c.isBusy) {
                    c.currentModel.nextMove();
                    return false;
                } else if (e.key === 'ArrowLeft' && !c.isBusy) {
                    c.currentModel.previousMove();
                    return false;
                }
            }
        }.bind(this));
    }


});

ludo.factory.createAlias('chess.WPManager', chess.WPManager);