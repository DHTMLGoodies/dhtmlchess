/**
 * Special button used to show the solution, i.e. next move in a puzzle
 * @namespace chess.view.button
 * @class TacticSolution
 * @extends form.Button
 */
chess.view.button.TacticSolution = new Class({
    Extends : ludo.form.Button,
    type : 'chess.view.button.TacticSolution',
    module:'chess',
    submodule : 'buttonTacticSolution',
    value : chess.getPhrase('Solution'),
    width : 80,

    ludoEvents : function(){
        this.parent();
        this.addEvent('click', this.showSolution.bind(this));
    },

    showSolution : function() {
        this.fireEvent('showSolution')
    }
});