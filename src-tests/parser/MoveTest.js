TestCase("MoveTest", {
	getMove:function (move, pos) {
		var obj = new chess.parser.Move0x88();
		return obj.getMoveConfig(move, pos);
	},

	"test_should_be_able_to_get_castle_moves":function () {
		// given
		var move = this.getMove({ from:'e1', to:'g1'}, '2k5/8/8/8/8/8/8/R3K2R w KQ - 0 1');

		// then
		assertEquals('O-O', move.m);
	},

	"test_should_be_able_to_get_queen_castle_moves":function () {
		// given
		var move = this.getMove({ from:'e1', to:'c1'}, '2k5/8/8/8/8/8/8/R3K2R w KQ - 0 1');

		// then
		assertEquals('O-O-O', move.m);
	},

	"test_should_be_able_to_get_check_moves":function () {
		// given
		var fenWithKingOnC8AndRookOnC1 = '2k5/2p5/8/8/8/8/8/2R1K2R w K - 0 1';
		// when
		var move = this.getMove({ from:'c1', to:'c7'}, fenWithKingOnC8AndRookOnC1);

		// then
		assertEquals('Rxc7+', move.m);

	},

	"test_should_be_able_to_get_checkmate_notation":function () {
		// given
		var fenWithRookOnC1AndKingOnG7InFrontOf3Pawns = '6k1/5ppp/8/8/8/8/8/2R3K1 w - - 0 1';
		// when
		var move = this.getMove({ from:'c1', to:'c8'}, fenWithRookOnC1AndKingOnG7InFrontOf3Pawns);
		// then
		assertEquals('Rc8#', move.m);
	},

	"test_should_get_correct_order_of_single_moves":function () {
		// given
		var fenWithRookOnC1AndKingOnG7InFrontOf3Pawns = '6k1/5ppp/8/8/8/8/8/2R3K1 w - - 0 1';
		// when
		var move = this.getMove({ from:'c1', to:'c8'}, fenWithRookOnC1AndKingOnG7InFrontOf3Pawns);
		// then
		assertEquals(1, move.moves.length);
		assertEquals('c1', move.moves[0].from);
		assertEquals('c8', move.moves[0].to);
	},

	"test_should_get_correct_order_of_castle_moves":function () {
		// given
		var castleFen = '6k1/8/8/8/8/8/8/4K2R w K - 0 1';
		// when
		var move = this.getMove({ from:'e1', to:'g1'}, castleFen);
		// then
		assertEquals(2, move.moves.length);
		assertEquals('e1', move.moves[0].from);
		assertEquals('g1', move.moves[0].to);
		assertEquals('h1', move.moves[1].from);
		assertEquals('f1', move.moves[1].to);

	},

	"test_should_be_able_to_get_check_move_when_castling":function () {
		// given
		var castleFenWithKingOnF8 = '5k2/8/8/8/8/8/8/4K2R w K - 0 1';
		// when
		var move = this.getMove({ from:'e1', to:'g1'}, castleFenWithKingOnF8);
		// then

		assertEquals('O-O+', move.m);
	}


});