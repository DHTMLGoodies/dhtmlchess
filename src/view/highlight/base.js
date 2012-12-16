chess.view.highlight.Base = new Class({
    Extends: ludo.Core,
    board:undefined,

	ludoConfig:function (config) {
        this.parent(config);
        this.view = config.view;
    }
});