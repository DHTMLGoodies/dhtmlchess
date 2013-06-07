chess.view.highlight.SquareTacticHint = new Class({
    Extends:chess.view.highlight.SquareBase,
    delay : 1,

	ludoConfig:function (config) {
        this.parent(config);
        if(config.delay !== undefined)this.delay = config.delay;
        this.parentComponent.addEvent('showHint', this.showHint.bind(this));
    },

    showHint:function(move){
        this.highlightSquare(move.from);
        this.clear.delay(this.delay * 1000, this);
    }
});