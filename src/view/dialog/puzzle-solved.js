chess.view.dialog.PuzzleSolved = new Class({
    type: 'chess.view.dialog.PuzzleSolved',
    Extends: ludo.dialog.Confirm,
    layout: {
        width: 250, height: 150
    },
    css: {'text-align': 'center'},
    buttonConfig:'OkClose',

    __construct: function (config) {
        config.title = config.title || chess.__('Well done - Puzzle complete');
        config.html = config.html || chess.__('Good job! You have solved this puzzle. Click OK to load next game.');
        this.parent(config);
    }

});