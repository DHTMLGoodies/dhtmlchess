chess.view.dialog.PuzzleSolved = new Class({
    type:'chess.view.dialog.PuzzleSolved',
    Extends: ludo.dialog.Alert,
    layout:{
        width:250,height:150
    },

    __construct:function(config){
        config.title = config.title || chess.getPhrase('tacticPuzzleSolvedTitle');
        config.html = config.html || chess.getPhrase('tacticPuzzleSolvedMessage');
        this.parent(config);
    }
    
    
});