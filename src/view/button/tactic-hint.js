chess.view.button.TacticHint = new Class({
    Extends : ludo.form.Button,
    type : 'chess.view.button.TacticHint',
    module:'chess',
    submodule : 'buttonTacticHint',
    value : 'Hint',
    width : 80,

    ludoEvents : function(){
        this.parent();
        this.addEvent('click', this.showHint.bind(this));
    },

    showHint : function() {
        this.fireEvent('showHint')
    }


});