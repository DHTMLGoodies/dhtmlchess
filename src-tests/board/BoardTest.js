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
        assertEquals('p', piece.pieceType);

        // when
        piece = board.getPieceOnSquare('e1');
        // then
        assertEquals('k', piece.pieceType);
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
        assertEquals('r', piece.pieceType);
    },

    "test should be able to highlight square": function(){
        var board = new chess.view.board.Board({
            renderTo:document.body,
            layout:{
                width:500,height:500
            }
        });
        var pool = new chess.view.board.HighlightPool({
            board: board
        });
        
        pool.show('e2', '#ff0000');
        pool.show('a1', '#00ff00');
        // then
        assertEquals(2, pool.squares.length);
        assertEquals(2, pool.visibleItems.length);
    },

    "test should be able to hide all": function(){
        var board = new chess.view.board.Board({
            renderTo:document.body,
            layout:{
                width:500,height:500
            }
        });
        var pool = new chess.view.board.HighlightPool({
            board: board
        });

        pool.show('e2', '#ff0000');
        pool.show('a1', '#00ff00');
        // when
        pool.hideAll();

        // then
        assertEquals(2, pool.squares.length);
        assertEquals(0, pool.visibleItems.length);
        assertEquals(2, pool.hiddenSquares.length);
    },

    "test should be able to hide a square": function(){
        var board = new chess.view.board.Board({
            renderTo:document.body,
            layout:{
                width:500,height:500
            }
        });
        var pool = new chess.view.board.HighlightPool({
            board: board
        });

        pool.show('e2', '#ff0000');
        pool.show('d5', '#00ff00');
        pool.show('a1', '#00ff00');
        // when
        pool.hide('d5');

        // then
        assertEquals(3, pool.squares.length);
        assertEquals(2, pool.visibleItems.length);
        assertEquals(1, pool.hiddenSquares.length);

        assertTrue(pool.isShown('e2'));
        assertTrue(pool.isShown('a1'));
        assertFalse(pool.isShown('d5'));

    },

    "test should be able to toggle": function(){
        var board = new chess.view.board.Board({
            renderTo:document.body,
            layout:{
                width:500,height:500
            }
        });
        var pool = new chess.view.board.HighlightPool({
            board: board
        });

        assertFalse(pool.isShown('e4'));
        pool.toggle('e4', '#f00');
        pool.toggle('e5', '#f00');
        pool.toggle('e6', '#f00');
        assertTrue(pool.isShown('e4'));
        pool.toggle('e4', '#f00');
        assertFalse(pool.isShown('e4'));

    }
});