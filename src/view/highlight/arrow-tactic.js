chess.view.highlight.ArrowTactic = new Class({
    Extends:chess.view.highlight.ArrowBase,
    /**
     * Delay before automatically hiding arrow
     * @config {Number} delay
     * @default 1
     */
    delay:1,

	ludoConfig:function (config) {
        this.parent(config);
        if(config.delay !== undefined)this.delay = config.delay;
        this.parentComponent.addEvent('showSolution', this.showSolution.bind(this));
    },

    showSolution:function(move){
        this.showMove(move);
        this.hide.delay(this.delay * 1000, this);
    }
});