chess.view.button.TacticSolution = new Class({
    Extends : ludo.form.Button,
    type : 'chess.view.button.TacticSolution',
    module:'chess',
    submodule : 'buttonTacticSolution',
    value : 'Solution',
    width : 80,

    ludoEvents : function(){
        this.parent();
        this.addEvent('click', this.showSolution.bind(this));
    },

    showSolution : function() {
        this.fireEvent('showSolution')
    }


});