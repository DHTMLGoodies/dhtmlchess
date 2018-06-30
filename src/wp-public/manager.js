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
            if (e.target) {
                var t = (e.target.tagName || "").toLowerCase();
                if (t === "input" || t === "select" || t === "textarea") return;
            }
            if (this.activeView) {
                var c = this.activeView.controller;

                if (e.key === 'ArrowRight' && !c.isBusy) {
                    c.keyNext();
                    return false;
                } else if (e.key === 'ArrowLeft' && !c.isBusy) {
                    c.keyBack();
                    return false;
                }
            }
        }.bind(this));
    }


});

ludo.factory.createAlias('chess.WPManager', chess.WPManager);