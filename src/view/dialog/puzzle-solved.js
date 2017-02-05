chess.view.dialog.PuzzleSolved = new Class({
    type:'chess.view.dialog.PuzzleSolved',
    Extends: ludo.dialog.Alert,
    layout:{
        width:250,height:150
    },

    __construct:function(config){
        config.title = config.title || chess.getPhrase('Well done - Puzzle complete');
        config.html = config.html || chess.getPhrase('Good job! You have solved this puzzle. Click OK to load next game');
        this.parent(config);
    }
    
});