ludo.chess.parser.GameParser = new Class({
    Extends : ludo.chess.parser.FenParser,

    game : undefined,

    squareParser : null,

    initialize : function(game){
        this.game = game;
        this.parent(game.fen);
        this.squareParser = new ludo.chess.parser.SquareParser();
    },

    move : function(fromSquare, toSquare, promoteTo){
        if(this.isMoveValid(fromSquare, toSquare)){
            var fenBuilder = new ludo.chess.parser.FenBuilder(this.fen);
            fenBuilder.move(fromSquare, toSquare, promoteTo);
            var obj = {};
            this.fireEvent('move', obj);
        }
    }
});
