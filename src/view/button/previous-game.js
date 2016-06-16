/**
 * Special button used to navigate to previous button in a database
 * @namespace chess.view.button
 * @class PreviousGame
 * @extends form.Button
 */
chess.view.button.PreviousGame = new Class({
    Extends : ludo.form.Button,
    type : 'chess.view.button.NextGame',
    module:'chess',
    submodule : 'buttonPreviousGame',
    value : '<',
    width : 30,

    ludoEvents : function(){
        this.parent();
        this.addEvent('click', this.previousGame.bind(this));
    },

    previousGame : function() {
        this.fireEvent('previousGame');
    }
});