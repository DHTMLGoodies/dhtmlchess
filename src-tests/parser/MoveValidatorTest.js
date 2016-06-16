TestCase("MoveValidatorTest", {


	getParser:function () {
		return new chess.parser.Move0x88();
	},

	"test should validate a move":function () {
		// given
		var parser = this.getParser();

		// then
		assertTrue(parser.isValid({ from:'e2', to:'e4' }, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'));
		assertTrue(parser.isValid({ from:'h7', to:'h6' }, 'r1bq1rk1/ppppbppp/2n2n2/4p3/2B1P3/2N2N1P/PPPP1PP1/R1BQ1RK1 b - 2 6'));
		assertTrue(parser.isValid({ from:'a7', to:'a8' }, '8/P6k/8/8/8/8/8/5K2 w - - 0 1'));
	},


	"test should be able to get correct config for a move":function () {
		// given
		var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
		var parser = this.getParser();

		// when
		var config = parser.getMoveConfig({ from:'e2', to:'e4'}, fen);

		// then
		assertEquals('e4', config.m);
		assertEquals('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', config.fen);
		assertEquals(1, config.moves.length);
		assertEquals('pieces involved', 'e2', config.moves[0].from);
		assertEquals('pieces involved', 'e4', config.moves[0].to);
		assertEquals(0, config.variations.length);
		assertEquals('from', 'e2', config.from);
		assertEquals('e4', config.to);
	},

	"test should accept space moves":function () {
		// given
		var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
		var parser = this.getParser();

		// when
		var expectedFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1';
		var config = parser.getMoveConfig({ m:'--'}, fen);
		// then
		assertEquals(expectedFen, config.fen);
	},

	"test should be able to determine promotion moves":function () {
		var fen = '7k/2P5/8/8/8/8/1p6/6K1 w - - 0 1';
		var parser = this.getParser();

		assertTrue(parser.isPromotionMove({ from:'c7', to:'c8'}, fen));


		fen = '7k/2P5/8/8/8/8/1p6/6K1 b - - 0 1';
		parser = this.getParser();

		assertTrue(parser.isPromotionMove({ from:'b2', to:'b1'}, fen));

		fen = '7k/2P5/8/8/8/3b3B/1p6/6K1 w - - 0 1';
		parser = this.getParser();

		assertFalse(parser.isPromotionMove({ from:'h3', to:'c8'}, fen));

		fen = '7k/2PR4/8/8/8/3b3B/1p6/6K1 w - - 0 1'; // Rook on d7
		parser = this.getParser();

		assertFalse(parser.isPromotionMove({ from:'d7', to:'d8'}, fen));
	}

});