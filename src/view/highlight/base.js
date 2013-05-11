chess.view.highlight.Base = new Class({
    Extends: ludo.Core,
    board:undefined,

	ludoConfig:function (config) {
        this.parent(config);
        this.parentComponent = config.parentComponent;
    },

    getParent:function(){
        return this.parentComponent;
    }
});