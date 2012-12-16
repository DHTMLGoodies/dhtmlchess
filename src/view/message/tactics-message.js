/**
 * Tactic message showing wrong move or incorrect move. This view listens to controller events
 * wrongGuess, correctGuess and newGame. On newGame it will display which color to move.
 * @namespace chess.view.message
 * @class TacticMessage
 * @extends View
 */
chess.view.message.TacticsMessage = new Class({
    Extends:ludo.View,
    type:'chess.view.message.TacticsMessage',
    module:'chess',
    submodule:'TacticsMessage',

    ludoDOM:function () {
        this.parent();
        this.getEl().addClass('chess-tactics-message');
    },
    setController:function (controller) {
        this.parent(controller);
        this.controller.addEvent('wrongGuess', this.showWrongGuess.bind(this));
        this.controller.addEvent('correctGuess', this.showCorrectGuess.bind(this));
        this.controller.addEvent('newGame', this.newGame.bind(this));
    },

    newGame:function (model) {
        var colorToMove = model.getColorToMove();
        this.showMessage(colorToMove + ' to move');

    },

    showWrongGuess:function () {
        this.showMessage('Wrong move - please try again', 3000);

    },

    showCorrectGuess:function () {
        this.showMessage('Good move', 3000);

    },

    showMessage:function (message, delayBeforeHide) {
        this.getBody().set('html', message);
        if(delayBeforeHide){
            this.autoHideMessage.delay(delayBeforeHide, this);
        }
    },


    autoHideMessage:function (delay) {
        this.getBody().set('html','');
    }
});