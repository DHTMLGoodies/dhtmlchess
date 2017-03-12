chess.view.notation.LastComment = new Class({
    Extends: ludo.View,

    __rendered:function(){
        this.parent();
        this.$b().css('overflow-y', 'auto');
        this.$b().addClass('dhtml_chess_current_annotation');
    },
    setController: function (controller) {
        this.parent(controller);
        controller.on('fen', this.update.bind(this));
        controller.on('newmove', this.update.bind(this));
    },

    update:function(model){

        var m = model.getCurrentMove();
        if (!m && model.model.moves.length > 0 && model.model.moves[0].comment) {
            m = model.model.moves[0];
        }
        if(!m){
            this.$b().html('');return;
        }
        var c = m.comment ? m.comment : '';
        this.$b().html(c);
    }

});