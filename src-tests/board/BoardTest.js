TestCase("BoardTest", {

    "test should create the correct 16 startup pieces": function(){
        // given
        var board = new chess.view.board.Board(
            {
                fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
            }
        );

        // when
        var piece = board.getPieceOnSquare('a2');

        // then
        assertEquals('pawn', piece.pieceType);

        // when
        piece = board.getPieceOnSquare('e1');
        // then
        assertEquals('king', piece.pieceType);
        assertEquals(32, board.pieces.length);
    },

    "test should show pieces at correct position for custom postions": function(){
        // given
        var fen = '6k1/5ppp/8/8/8/8/5PPP/3R2K1 b - - 1 1';

        // when
        var board = new chess.view.board.Board();
        board.showFen(fen);
        var piece = board.getPieceOnSquare('d1');

        // then
        assertEquals('rook', piece.pieceType);
    }
});