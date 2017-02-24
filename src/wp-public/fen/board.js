chess.WPFen = new Class({
    Extends: chess.WPTemplate,
    fen: undefined,
    initialize: function (config) {
        this.parent(config);
        var w = this.renderTo.width();
        this.renderTo.css('height', w);
        this.fen = config.fen;
        if(this.canRender()){
            this.render();
        }
    },

    render: function () {
        new chess.view.Chess({
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'fill'
            },
            children: [
                {
                    type: 'chess.view.board.Board',
                    fen: this.fen,
                    layout: {width: 'matchParent', 'height': 'matchParent'}
                }
            ]
        });
    }

});