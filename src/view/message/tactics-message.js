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
    showIntro:true,

    __construct: function (config) {
        this.parent(config);
        this.__params(config, ['showIntro','autoHideAfterMs', 'autoHideWelcomeAfterMs']);
    },

    ludoDOM: function () {
        this.parent();
        this.$e.addClass('dhtml-chess-tactics-message');
    },
    setController: function (controller) {
        this.parent(controller);
        controller.on('wrongGuess', this.showWrongGuess.bind(this));
        controller.on('correctGuess', this.showCorrectGuess.bind(this));
        controller.on('loadGame', this.newGame.bind(this));
    },

    newGame: function (model) {
        if(!this.showIntro)return;
        var d = this.autoHideWelcomeAfterMs;
        var res = model.getResult();
        if(res != 0){
            if(res == -1){
                this.showMessage(chess.__("You play black"), d);
            }else{
                this.showMessage(chess.__("You play white"), d);
            }
        }else{
            var colorToMove = model.getColorToMove();
            this.showMessage(chess.__(colorToMove) + ' ' + chess.__('to move'), d);
        }
    },

    showWrongGuess: function () {
        this.showMessage(chess.__('Wrong move - please try again'), this.autoHideAfterMs);
    },

    showCorrectGuess: function () {
        this.showMessage(chess.__('Good move'), this.autoHideAfterMs);
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