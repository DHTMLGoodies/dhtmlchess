/**
 * Special button used to show tactic hint in tactic puzzle mode
 * @namespace chess.view.button
 * @class TacticHint
 * @extends form.Button
 */
chess.view.button.TacticHint = new Class({
    Extends : ludo.form.Button,
    type : 'chess.view.button.TacticHint',
    module:'chess',
    submodule : 'buttonTacticHint',
    value : chess.getPhrase('Hint'),
    width : 80,

    ludoEvents : function(){
        this.parent();
        this.addEvent('click', this.showHint.bind(this));
    },

    showHint : function() {
        this.fireEvent('showHint')
    }
});