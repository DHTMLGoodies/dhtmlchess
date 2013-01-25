/**
 * Special button used to navigate to next game in a database
 * @namespace chess.view.button
 * @class NextGame
 * @extends form.Button
 */
chess.view.button.NextGame = new Class({
    Extends : ludo.form.Button,
    type : 'chess.view.button.NextGame',
    module:'chess',
    submodule : 'buttonNextGame',
    value : '>',
    width : 30,

    ludoEvents : function(){
        this.parent();
        this.addEvent('click', this.nextGame.bind(this));
    },

    nextGame : function() {
        this.fireEvent('nextGame');
    }
});