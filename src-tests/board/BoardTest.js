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

    }


});