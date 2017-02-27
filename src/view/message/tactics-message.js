/**
 * Tactic message showing wrong move or incorrect move. This view listens to controller events
 * wrongGuess, correctGuess and newGame. On newGame it will display which color to move.
 * @namespace chess.view.message
 * @class TacticMessage
 * @extends View
 */
chess.view.message.TacticsMessage = new Class({
    Extends: ludo.View,
    type: 'chess.view.message.TacticsMessage',
    module: 'chess',
    submodule: 'TacticsMessage',

    // Auto hide messages after milliseconds, pass false or undefined to disable this
    autoHideAfterMs: 3000,
    autoHideWelcomeAfterMs: 0,

    __construct: function (config) {
        this.parent(config);
        this.__params(config, ['autoHideAfterMs', 'autoHideWelcomeAfterMs']);
    },

    ludoDOM: function () {
        this.parent();
        this.$e.addClass('dhtml-chess-tactics-message');
    },
    setController: function (controller) {
        this.parent(controller);
        this.controller.addEvent('wrongGuess', this.showWrongGuess.bind(this));
        this.controller.addEvent('correctGuess', this.showCorrectGuess.bind(this));
        this.controller.addEvent('newGame', this.newGame.bind(this));
    },

    newGame: function (model) {
        var colorToMove = model.getColorToMove();
        this.showMessage(chess.getPhrase(colorToMove) + ' ' + chess.getPhrase('to move'), this.autoHideWelcomeAfterMs);

    },

    showWrongGuess: function () {
        this.showMessage(chess.getPhrase('Wrong move - please try again'), this.autoHideAfterMs);

    },

    showCorrectGuess: function () {
        this.showMessage(chess.getPhrase('Good move'), this.autoHideAfterMs);

    },

    showMessage: function (message, delayBeforeHide) {
        this.show();
        this.$b().animate(
            {opacity: 1},
            {
                duration: 300
            }
        );
        this.$b().html(message);
        if (delayBeforeHide) {
            this.autoHideMessage.delay(delayBeforeHide, this);
        }
    },

    autoHideMessage: function () {
        this.$b().animate({
            opacity: 0
        }, {
            duration: 500,
            complete:function(){
                this.hide();
            }.bind(this)
        });
    }
});