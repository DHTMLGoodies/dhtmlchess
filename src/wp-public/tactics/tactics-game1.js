/**
 * Created by alfmagne1 on 11/03/2017.
 */
chess.WPTacticsGame1 = new Class({
    Extends: chess.WPTemplate,
    nav:false,
    
    initialize:function(config){
        this.parent(config);
        var r = this.renderTo;
        var w = r.width();
        this.model = config.model || undefined;
        r.css('height', w + this.wpm_h);
        this.boardId = 'board' + String.uniqueID();
        if (this.canRender()) {
            this.render();
        }

    },

    render:function(){

        new chess.view.Chess({
            cls:this.th,
            renderTo: this.renderTo,
            layout: {
                type: 'linear',
                orientation:'vertical'
            },
            children: [
                {
                    module:this.module,
                    id:this.boardId,
                    type: 'chess.view.board.Board',
                    fen: this.fen,
                    layout: {width: 'matchParent', weight: 1}
                },
                {
                    type:'chess.WPComMessage'
                }
            ]
        });


        this.controller = new chess.controller.TacticControllerGui({
            applyTo: [this.module],
            autoMoveDelay: 400,
            noDialogs:true,
            gameEndHandler: this.onGameEnd.bind(this)
        });
        this.controller.currentModel.populate(this.model);

        
    },
    
    onGameEnd:function(){
        var v = jQuery('<div class="dhtml_chess_game_solved"><div class="dhtml_chess_game_solved_overlay"></div><div class="dhtml_chess_game_solved_image"></div></div>');
        ludo.$(this.boardId).boardEl().append(v);
    }
});