TestCase("ParserTest", {

	getParser:function (fen) {
		if (fen === undefined) {
			fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
		}
		return new chess.parser.FenParser0x88(fen);
	},

	getNumericSquare:function (square) {
		return Board0x88Config.mapping[square] !== undefined ? Board0x88Config.mapping[square] : undefined;
	},

	"test should Find All Pieces":function () {
		// given
		var parser = this.getParser();

		// when
		var pieces = parser.getPiecesOfAColor('white');
		// then
		assertEquals(16, pieces.length);
		// when
		pieces = parser.getPiecesOfAColor('black');

		// then
		assertEquals(16, pieces.length);

	},

	"test should Find enPassant Square":function () {
		// given
		var fen = '5k2/8/8/3pP3/8/8/8/7K w - d6 0 1';

		// when
		var parser = new chess.parser.FenParser0x88(fen);

		// then
		assertEquals('d6', parser.getEnPassantSquare());
	},

	"test should Find Full Moves":function () {
		// given
		var fen = '5k2/8/8/3pP3/8/8/8/7K w - d6 0 25';

		// when
		var parser = new chess.parser.FenParser0x88(fen);

		// then
		assertEquals('25', parser.getFullMoves());
	},

	"test should Find Half Moves":function () {
		// given
		var fen = '5k2/8/8/3pP3/8/8/8/7K w - d6 12 25';

		// when
		var parser = new chess.parser.FenParser0x88(fen);

		// then
		assertEquals('12', parser.getHalfMoves());
	},

	"test should Determine If TwoSquares Are On Same Rank":function () {
		// given
		var parser = this.getParser();

		assertTrue(parser.isOnSameRank(this.getNumericSquare('a1'), this.getNumericSquare('h1')));
		assertFalse(parser.isOnSameRank(this.getNumericSquare('a1'), this.getNumericSquare('a2')));
	},

	"test should Determine If Two Squares Are On Same File":function () {
		// given
		var parser = this.getParser();

		assertFalse(parser.isOnSameFile(this.getNumericSquare('a1'), this.getNumericSquare('h1')));
		assertTrue(parser.isOnSameFile(this.getNumericSquare('a1'), this.getNumericSquare('a2')));
	},

	"test should Find Castle":function () {
		// given
		var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

		// when
		var parser = new chess.parser.FenParser0x88(fen);
		// then

		assertTrue(parser.canCastleKingSide('white') ? true : false);
		assertTrue(parser.canCastleKingSide('black') ? true : false);
		assertTrue(parser.canCastleQueenSide('white') ? true : false);
		assertTrue(parser.canCastleQueenSide('black') ? true : false);

		// given
		fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w Kq - 0 1';
		// when
		parser = new chess.parser.FenParser0x88(fen);
		// then
		assertTrue(parser.canCastleKingSide('white') ? true : false);
		assertFalse(parser.canCastleKingSide('black') ? true : false);
		assertFalse(parser.canCastleQueenSide('white') ? true : false);
		assertTrue(parser.canCastleQueenSide('black') ? true : false);
	},

	"test should Find Color To Move":function () {
		// given
		var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
		// when
		var parser = new chess.parser.FenParser0x88(fen);
		// then
		assertEquals('white', parser.getColor());

	},

	/**
	 * Easy access to available moves from a square given an array of available moves in a position
	 * @method getValidMovesForSquare
	 * @param {Array} moves
	 * @param {String} square
	 * @return {Array}
	 */
	getValidMovesForSquare:function (moves, square) {
		return moves[Board0x88Config.mapping[square]];
	},

	"test should Find Legal Pawn Moves":function () {
		// given
		var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
		// when
		var parser = new chess.parser.FenParser0x88(fen);

		var pLegal = parser.getValidMovesAndResult('white').moves;

		var pawnMoves = this.getValidMovesForSquare(pLegal, 'a2');
		// then
		assertEquals(2, pawnMoves.length);

		// when
		parser = new chess.parser.FenParser0x88(fen);
		pLegal = parser.getValidMovesAndResult('black').moves;

		pawnMoves = this.getValidMovesForSquare(pLegal, 'a7');
		// then
		assertEquals(2, pawnMoves.length);

		// given
		parser = new chess.parser.FenParser0x88('6r1/4pk2/8/8/8/5p2/6P1/6K1 b - - 0 1');
		pLegal = parser.getValidMovesAndResult('black').moves;
		pawnMoves = this.getValidMovesForSquare(pLegal, 'e7');
		// then
		assertEquals(2, pawnMoves.length);

		parser = new chess.parser.FenParser0x88('7k/7p/7P/8/8/8/8/3K2R1 b - - 0 1');
		pLegal = parser.getValidMovesAndResult('black').moves;
		pawnMoves = this.getValidMovesForSquare(pLegal, 'h7');
		// then
		assertEquals(0, pawnMoves.length);

		parser = new chess.parser.FenParser0x88('r1bq1rk1/ppppbppp/2n2n2/4p3/2B1P3/2N2N1P/PPPP1PP1/R1BQ1RK1 b - - 0 1');
		pLegal = parser.getValidMovesAndResult('black').moves;
		pawnMoves = this.getValidMovesForSquare(pLegal, 'h7');
		// then
		assertEquals(2, pawnMoves.length);

		parser = new chess.parser.FenParser0x88('rnbq1rk1/pppp1pp1/5n1p/2b1p3/2BPP3/2P2N2/PP3PPP/RNBQ1RK1 b - - 0 6');
		pLegal = parser.getValidMovesAndResult('black').moves;
		pawnMoves = this.getValidMovesForSquare(pLegal, 'e5');
		// then
		assertEquals(1, pawnMoves.length);

		parser = new chess.parser.FenParser0x88('r1bq3r/ppp3pp/1b6/n2nk3/2B5/B1P2Q2/P2P1PPP/RN4K1 w - - 0 14');
		pLegal = parser.getValidMovesAndResult('white').moves;
		pawnMoves = this.getValidMovesForSquare(pLegal, 'd2');
		var expectedSquares = ['d3', 'd4'];

		// then
		this.assertHasSquares(expectedSquares, pawnMoves);

		parser = new chess.parser.FenParser0x88('6r1/2p1kp1p/p1Bp1p2/bp6/4P3/5bB1/Pp3P1P/R4RK1 b - - 3 20');
		pLegal = parser.getValidMovesAndResult('black').moves;
		pawnMoves = this.getValidMovesForSquare(pLegal, 'b2');
		expectedSquares = ['a1', 'b1'];

		// then
		this.assertHasSquares(expectedSquares, pawnMoves);
	},

	assertHasSquares:function (squares, moves) {
		if (moves.indexOf(',') >= 0) {
			moves = moves.substr(1, moves.length - 2).split(',');
		}
		for (var i = 0; i < squares.length; i++) {
			assertTrue(squares[i] + ' is not in path', this.isSquareInPaths(squares[i], moves));
		}

		assertEquals(squares.length, moves.length);
	},

	/**
	 * Returns true if a square is in path. Path is an array of numeric squares, i.e.
	 * squares returned from parser.getValidMovesAndResult().moves. square is a human
	 * readable square, example "e4".
	 * @param {String} square
	 * @param {Array} path
	 * @return {Boolean} inPath
	 */
	isSquareInPaths:function (square, path) {
		for (var i = 0; i < path.length; i++) {
			if (path[i] == Board0x88Config.mapping[square]) {
				return true;
			}

		}
		return false;
	},

	"test should Find Legal Capture Pawn Moves":function () {
		// given
		var fenWithPawnOnF2AndOpponentPieceOnG3 = '6k1/8/8/8/8/6p1/5P2/6K1 w - - 0 1';
		var parser = this.getParser(fenWithPawnOnF2AndOpponentPieceOnG3);

			// when
		var pLegal = parser.getValidMovesAndResult('white').moves;
		var pawnMoves = this.getValidMovesForSquare(pLegal, 'f2');

		// then
		assertEquals(3, pawnMoves.length);

		assertTrue(this.isSquareInPaths('f3', pawnMoves))

	},
	"test should Find Legal Bishop Moves":function () {

		// given
		var fenWithBishopOnC2OwnPawnOnB3AndOpponentPieceOnG6 = '6k1/8/6p1/8/8/1P6/2B5/5K2 w - - 0 1';
		var parser = this.getParser(fenWithBishopOnC2OwnPawnOnB3AndOpponentPieceOnG6);

		// when
		var pLegal = parser.getValidMovesAndResult('white').moves;
		var bishopMoves = this.getValidMovesForSquare(pLegal, 'c2');

		// then

		assertTrue(this.isSquareInPaths('b1', bishopMoves));
		assertTrue(this.isSquareInPaths('d1', bishopMoves));
		assertTrue(this.isSquareInPaths('d3', bishopMoves));
		assertTrue(this.isSquareInPaths('e4', bishopMoves));
		assertTrue(this.isSquareInPaths('f5', bishopMoves));
		assertTrue(this.isSquareInPaths('g6', bishopMoves));
		assertFalse(this.isSquareInPaths('h7', bishopMoves));

		assertEquals(6, bishopMoves.flatten().length)

	},

	"test should Find Legal Black Bishop Moves":function () {

		// given
		var fenWithBishopOnC2OpponentPawnOnB3AndOwnPieceOnG6 = '6k1/8/6p1/8/8/1P6/2b5/5K2 w - - 0 1';
		var parser = this.getParser(fenWithBishopOnC2OpponentPawnOnB3AndOwnPieceOnG6);

		// when
		var pLegal = parser.getValidMovesAndResult('black').moves;
		var bishopMoves = this.getValidMovesForSquare(pLegal, 'c2');

		// then

		assertTrue(this.isSquareInPaths('b1', bishopMoves));
		assertTrue(this.isSquareInPaths('b3', bishopMoves));
		assertTrue(this.isSquareInPaths('d1', bishopMoves));
		assertTrue(this.isSquareInPaths('d3', bishopMoves));
		assertTrue(this.isSquareInPaths('e4', bishopMoves));
		assertTrue(this.isSquareInPaths('f5', bishopMoves));
		assertFalse(this.isSquareInPaths('g6', bishopMoves));


		assertEquals(6, bishopMoves.flatten().length)

	},


	"test should Find Legal Rook Moves":function () {

		var fenWithRookOnC2BlackOna2g3WhiteOnC6 = '6k1/8/2P5/8/8/8/p1R3p1/6K1 w - - 0 1';
		var parser = this.getParser(fenWithRookOnC2BlackOna2g3WhiteOnC6);

		// when
		var pLegal = parser.getValidMovesAndResult('white').moves;
		var rookMoves = this.getValidMovesForSquare(pLegal, 'c2');
		var expectedSquares = ['b2', 'a2', 'd2', 'e2', 'f2', 'g2', 'c1', 'c3', 'c4', 'c5'];

		// then
		this.assertHasSquares(expectedSquares, rookMoves);
	},

	"test should Find Legal Black Rook Moves":function () {

		var fen = '3p2k1/1p1r1p2/8/3P4/8/8/8/6K1 b - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);

		// when
		var pLegal = parser.getValidMovesAndResult('black').moves;
		var rookMoves = this.getValidMovesForSquare(pLegal, 'd7');
		var expectedSquares = ['c7', 'e7', 'd6', 'd5'];

		// then
		this.assertHasSquares(expectedSquares, rookMoves);
	},

	"test should FindLegalKnightSquares":function () {

		var fen = '6k1/8/8/8/2P1p3/8/3N4/6K1 w - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		var pLegal = parser.getValidMovesAndResult('white').moves;
		var knightMoves = this.getValidMovesForSquare(pLegal, 'd2');
		var expectedSquares = ['b1', 'f1', 'b3', 'f3', 'e4'];

		// then
		this.assertHasSquares(expectedSquares, knightMoves);

		// given
		fen = 'rnb1qrk1/ppp3pp/3b4/3pN1BN/3Pp1n1/8/PPPQ1P1P/R3KB1R w KQ - 0 12';
		parser = new chess.parser.FenParser0x88(fen);
		// when
		pLegal = parser.getValidMovesAndResult('white').moves;

		knightMoves = this.getValidMovesForSquare(pLegal, 'e5');
		expectedSquares = ['d7', 'f7', 'g6', 'g4', 'f3', 'd3', 'c6', 'c4'];


		// then
		this.assertHasSquares(expectedSquares, knightMoves);
	},

	"test should Find Legal Black Knight Squares":function () {

		var fen = '6k1/8/2P5/5p2/3n4/8/2P5/6K1 w - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		var pLegal = parser.getValidMovesAndResult('black').moves;
		var knightMoves = this.getValidMovesForSquare(pLegal, 'd4');
		var expectedSquares = ['c2', 'e2', 'b3', 'f3', 'b5', 'c6', 'e6'];
		// then
		this.assertHasSquares(expectedSquares, knightMoves);
	},

	"test should Find Legal King Moves":function () {
		var fen = '5k2/8/8/8/8/8/5P2/6K1 w - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		var pLegal = parser.getValidMovesAndResult('white').moves;
		var kingMoves = this.getValidMovesForSquare(pLegal, 'g1');
		var expectedSquares = ['f1', 'g2', 'h1', 'h2'];

		// then
		this.assertHasSquares(expectedSquares, kingMoves);

		fen = 'Rbkq4/1p6/1BP4p/4p3/4B3/1QPP1P2/6rP/6K1 w - - 0 29';
		parser = new chess.parser.FenParser0x88(fen);
		// when
		pLegal = parser.getValidMovesAndResult('white').moves;
		kingMoves = this.getValidMovesForSquare(pLegal, 'g1');
		expectedSquares = ['f1', 'g2', 'h1'];

		// then
		this.assertHasSquares(expectedSquares, kingMoves);

	},
	"test should Find Legal Black King Moves":function () {
		var fen = '8/5k2/5p2/8/8/8/5P2/6K1 b - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		var pLegal = parser.getValidMovesAndResult('black').moves;
		var kingMoves = this.getValidMovesForSquare(pLegal, 'f7');
		var expectedSquares = ['e8', 'e7', 'e6', 'f8', 'g8', 'g7', 'g6'];

		// then
		this.assertHasSquares(expectedSquares, kingMoves);
	},

	"test should Find Legal Castle Moves":function () {
		var fen = '8/5k2/5p2/8/8/8/5P2/R3K2R b KQ - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		var pLegal = parser.getValidMovesAndResult('white').moves;
		var kingMoves = this.getValidMovesForSquare(pLegal, 'e1');
		var expectedSquares = ['f1', 'd1', 'e2', 'd2', 'g1', 'c1'];

		// then
		this.assertHasSquares(expectedSquares, kingMoves);
	},


	"test should Find Legal Black Castle Moves":function () {
		var fen = 'r3k2r/8/5p2/8/8/8/5P2/R3K2R b KQk - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		var pLegal = parser.getValidMovesAndResult('black').moves;

		var kingMoves = this.getValidMovesForSquare(pLegal, 'e8');
		var expectedSquares = ['d8', 'd7', 'e7', 'f8', 'f7', 'g8'];

		// then
		this.assertHasSquares(expectedSquares, kingMoves);
	},

	"test should Find Opponents Capture And Protective Moves":function () {
		// given
		var fen = '7k/4b2p/8/8/8/8/8/5K2 w - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		var pLegal = parser.getCaptureAndProtectiveMoves('black');

		pLegal = pLegal.substr(1, pLegal.length - 2).split(',');

		var expectedSquares = 'd6,c5,b4,a3,d8,f8,f6,g5,h4,g6,g8,g7,h7';
		expectedSquares = expectedSquares.split(',');
		// then
		this.assertHasSquares(expectedSquares, pLegal);
	},
	"test should FindOpponentsCaptureAndProtectiveMovesContinued":function () {
		// given
		var fen = '6k1/8/8/2b5/8/8/5p2/5K2 w - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		var pLegal = parser.getCaptureAndProtectiveMoves('black');


		var expectedSquares = 'e1,g1,b6,a7,b4,a3,d6,e7,f8,d4,e3,f2,f8,f7,g7,h7,h8';
		expectedSquares = expectedSquares.split(',');
		// then
		this.assertHasSquares(expectedSquares, pLegal);
	},

	"test should Exclude Invalid King Moves":function () {
		var fen = '6k1/8/8/2b5/8/8/5p2/5K2 w - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		var pLegal = parser.getValidMovesAndResult('white').moves;
		var kingMoves = this.getValidMovesForSquare(pLegal, 'f1');
		var expectedSquares = ['e2', 'g2'];
		// then
		this.assertHasSquares(expectedSquares, kingMoves);
	},
	"test should Exclude Invalid Black King Moves":function () {
		var fen = '6k1/5p2/5P2/2B5/8/8/5p2/5K2 b - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		var pLegal = parser.getValidMovesAndResult('black').moves;
		var kingMoves = this.getValidMovesForSquare(pLegal, 'g8');
		var expectedSquares = ['h7', 'h8'];
		// then
		this.assertHasSquares(expectedSquares, kingMoves);
	},

	"test should Find Queen Moves":function () {
		// given
		var fen = '6k1/6pp/3P2p1/8/8/3Q1P2/8/1P3K2 w - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		var pLegal = parser.getValidMovesAndResult('white').moves;
		var queenMoves = this.getValidMovesForSquare(pLegal, 'd3');
		var expectedSquares = 'c2,d2,d1,e2,d4,d5,c4,b5,a6,e4,f5,g6,c3,b3,a3,e3';
		expectedSquares = expectedSquares.split(',');
		// then
		this.assertHasSquares(expectedSquares, queenMoves);
	},


	"test should Exclude Invalid King Castle Moves":function () {
		var fen = '1k4r1/8/3r4/8/8/1b6/4P3/4K2R w K - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		var pLegal = parser.getValidMovesAndResult('white').moves;
		var kingMoves = this.getValidMovesForSquare(pLegal, 'e1');
		var expectedSquares = ['f1', 'f2'];
		// then
		this.assertHasSquares(expectedSquares, kingMoves);
	},

	"test should LegalEnPassantMoves":function () {
		var fen = '7k/4b2p/8/3pP3/8/8/8/5K2 w - d6 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		var pLegal = parser.getValidMovesAndResult('white').moves;
		var pawnMoves = this.getValidMovesForSquare(pLegal, 'e5');
		var expectedSquares = ['d6', 'e6'];
		// then
		this.assertHasSquares(expectedSquares, pawnMoves);
	},

	"test should FindSlidingPiecesInPathOfKing":function () {
		// given
		var fen = '6k1/5pp1/8/8/8/8/BB6/5KR1 w - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		var pieces = parser.getSlidingPiecesAttackingKing('white');

		// then
		assertEquals(2, pieces.length);
		assertEquals(Board0x88Config.mapping['g1'], pieces[1].s);
		assertEquals(Board0x88Config.mapping['a2'], pieces[0].s);

		//given
		fen = '6k1/Q5n1/4p3/8/8/8/B7/5KR1 b - - 0 1';
		parser = new chess.parser.FenParser0x88(fen);
		// when
		pieces = parser.getSlidingPiecesAttackingKing('white');

		// then
		assertEquals(2, pieces.length);

		// given
		fen = 'R5k1/8/8/8/8/8/8/5K2 b - - 0 1';
		parser = new chess.parser.FenParser0x88(fen);
		// when
		pieces = parser.getSlidingPiecesAttackingKing('white');

		// then
		assertEquals(1, pieces.length);
		assertEquals(1, pieces[0].p);
	},

	"test should FindCheckPositions":function () {
		// given
		var fen = '6k1/6pp/5p2/8/8/8/B7/6K1 b - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);

		var moves = parser.getCaptureAndProtectiveMoves('white');

		assertEquals(1, parser.getCountChecks('black', moves));
	},

	"test should FindDoubleChecks":function () {
		// given
		var fen = '3R2k1/6pp/5p2/8/8/8/B7/6K1 b - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);

		var moves = parser.getCaptureAndProtectiveMoves('white');

		assertEquals(2, parser.getCountChecks('black', moves));
	},
	"test Only King Should be able ToMoveOnDoubleCheck":function () {

		// given
		var fen = '3R2k1/6p1/5p1p/8/8/8/B7/6K1 b - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		var pLegal = parser.getValidMovesAndResult('black').moves;

		var pawnMoves = this.getValidMovesForSquare(pLegal, 'g8');
		var expectedSquares = ['h7'];
		// then
		this.assertHasSquares(expectedSquares, pawnMoves);

	},

	"test Attacking Moves Should Include Squares After King":function () {
		// given
		var fen = '3R2k1/6p1/5p1p/8/8/8/B7/6K1 b - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);

		// when
		var moves = parser.getCaptureAndProtectiveMoves('white');

		assertTrue(moves.indexOf(Board0x88Config.mapping['h8']) >= 0);
	},

	"test should be able ToFindDistanceBetweenTwoSquares":function () {
		// given
		var parser = this.getParser();
		// when
		var square2 = this.getNumericSquare('e1');
		var square1 = this.getNumericSquare('f3');
		// then
		assertEquals(2, parser.getDistance(square1, square2));
		// when
		square2 = this.getNumericSquare('h5');
		square1 = this.getNumericSquare('b1');
		// then
		assertEquals(6, parser.getDistance(square1, square2));

		// when
		square2 = this.getNumericSquare('a1');
		square1 = this.getNumericSquare('b2');
		assertEquals(1, parser.getDistance(square1, square2));

		// when
		square2 = this.getNumericSquare('b6');
		square1 = this.getNumericSquare('e1');
		// then
		assertEquals('a6 vs e1', 5, parser.getDistance(square1, square2));
		// when
		square2 = this.getNumericSquare('f3');
		square1 = this.getNumericSquare('e1');
		// then
		assertEquals('f3 vs e1', 2, parser.getDistance(square1, square2));
		// when
		square2 = this.getNumericSquare('a1');
		square1 = this.getNumericSquare('h8');
		// then
		assertEquals(7, parser.getDistance(square1, square2));
		// when
		square2 = this.getNumericSquare('h1');
		square1 = this.getNumericSquare('a8');
		// then
		assertEquals(7, parser.getDistance(square1, square2));

		square1 = this.getNumericSquare('a1');
		for (var i = 2; i <= 8; i++) {
			square2 = this.getNumericSquare('a' + i);
			assertEquals('a' + i, i - 1, parser.getDistance(square1, square2));
		}
		square1 = this.getNumericSquare('a1');
		for (i = 2; i <= 8; i++) {
			square2 = this.getNumericSquare('b' + i);
			assertEquals('b' + i, i - 1, parser.getDistance(square1, square2));
		}
		square1 = this.getNumericSquare('a8');
		for (i = 7; i >= 1; i--) {
			square2 = this.getNumericSquare('b' + i);
			assertEquals('b' + i, 8 - i, parser.getDistance(square1, square2));
		}
	},

	assertSquareIsPinnedBy:function (square, pinnedBy, pinned) {
		assertEquals(this.getNumericSquare(pinnedBy), pinned[this.getNumericSquare(square)].by);
	},

	"test should FindPinningPieces":function () {
		// given
		var fen = '6k1/Q5n1/4p3/8/8/1B6/B7/5KR1 b - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);

		// when
		var pinned = parser.getPinned('black');

		// then
		this.assertSquareIsPinnedBy('e6', 'b3', pinned);
		this.assertSquareIsPinnedBy('g7', 'g1', pinned);

	},


	"test KnightShouldNotbe able ToMoveWhenPinned":function () {
		// given
		var fen = '6k1/6p1/4n3/8/8/8/B7/6K1 b - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);

		// when
		var pLegal = parser.getValidMovesAndResult('black').moves;
		var knightMoves = this.getValidMovesForSquare(pLegal, 'e6');
		var expectedSquares = [];
		// then
		this.assertHasSquares(expectedSquares, knightMoves);

	},

	"test PawnShouldNotbe able ToMoveWhenPinnedByRook":function () {
		// given
		var fenPawnOnG2KingOnH2BlackRookOnA2 = '5k2/8/8/8/8/8/r5PK/8 w - - 0 1';
		var parser = this.getParser(fenPawnOnG2KingOnH2BlackRookOnA2);
		var pinned = parser.getPinned('white');

		// then
		this.assertSquareIsPinnedBy('g2', 'a2', pinned);
		// when
		var pLegal = parser.getValidMovesAndResult('white').moves;
		var pawnMoves = this.getValidMovesForSquare(pLegal, 'g2');
		var expectedSquares = [];
		// then
		this.assertHasSquares(expectedSquares, pawnMoves);

		// when
		var fen = '5kr1/8/8/8/8/5p2/6P1/6K1 w - - 0 1';
		parser = new chess.parser.FenParser0x88(fen);
		pLegal = parser.getValidMovesAndResult('white').moves;
		pawnMoves = this.getValidMovesForSquare(pLegal, 'g2');
		expectedSquares = ['g3', 'g4'];
		// then
		this.assertHasSquares(expectedSquares, pawnMoves);

		// when
		fen = '6r1/R3pk2/8/8/8/5p2/6P1/6K1 b - - 0 1';
		parser = new chess.parser.FenParser0x88(fen);
		pLegal = parser.getValidMovesAndResult('black').moves;
		pawnMoves = this.getValidMovesForSquare(pLegal, 'e7');
		expectedSquares = [];
		// then
		assertEquals(0, pawnMoves.length);
		this.assertHasSquares(expectedSquares, pawnMoves);

		// when
		fen = '4k1r1/4p3/3P4/8/8/5p2/6P1/4R1K1 b - - 0 1';
		parser = new chess.parser.FenParser0x88(fen);
		pLegal = parser.getValidMovesAndResult('black').moves;
		pawnMoves = this.getValidMovesForSquare(pLegal, 'e7');
		expectedSquares = ['e6', 'e5'];
		// then
		assertEquals(2, pawnMoves.length);
		this.assertHasSquares(expectedSquares, pawnMoves);
	},

	"test PinnedBishopSlidingPiecesShouldOnlybe able ToBetweenPinningAndKing":function () {
		// given
		var fenBishopA2AndE6KingOng8 = '6k1/8/4b3/8/8/8/B7/6K1 b - - 0 1';
		var parser = this.getParser(fenBishopA2AndE6KingOng8);
		var pLegal = parser.getValidMovesAndResult('black').moves;
		// when
		var bishopMoves = this.getValidMovesForSquare(pLegal, 'e6');
		var expectedSquares = ['d5', 'c4', 'b3', 'a2', 'f7'];
		// then
		this.assertHasSquares(expectedSquares, bishopMoves);

	},

	"test PinnedRookSlidingPiecesShouldOnlybe able ToBetweenPinningAndKing":function () {
		// given
		var fenRookOnE5AndE2KingOnE8 = '4k3/8/8/4r3/8/8/4R3/6K1 b - - 0 1';
		var parser = this.getParser(fenRookOnE5AndE2KingOnE8);
		var pLegal = parser.getValidMovesAndResult('black').moves;
		// when
		var rookMoves = this.getValidMovesForSquare(pLegal, 'e5');
		var expectedSquares = ['e4', 'e3', 'e2', 'e6', 'e7'];
		// then
		this.assertHasSquares(expectedSquares, rookMoves);
	},

	"test should FindPawnCheckMoves":function () {
		// given
		var fenPawnOnE6CheckingKingOnF7 = '8/rn3k2/1b2P3/8/8/8/1QN5/2BRK3 b - - 0 1';
		var parser = this.getParser(fenPawnOnE6CheckingKingOnF7);
		// when
		var checks = parser.getValidSquaresOnCheck('black');

		// then
		assertEquals(1, checks.length);
		assertEquals(this.getNumericSquare('e6'), checks[0]);
	},
	"test should FindBlackPawnCheckMoves":function () {
		// given
		var fenPawnOng2CheckingKingOng1 = '5k2/8/8/8/8/8/5p2/6K1 w - - 0 1';
		var parser = this.getParser(fenPawnOng2CheckingKingOng1);
		// when
		var checks = parser.getValidSquaresOnCheck('white');

		// then
		assertEquals(1, checks.length);
		assertEquals(this.getNumericSquare('f2'), checks[0]);
	},

	"test should FindValidSquaresWhenCheckedByKnight":function () {
		// given
		var fenKnightOnF6CheckingKingOnG8 = '5rk1/5pp1/5N2/8/8/8/8/5KR1 b - - 0 1';
		var parser = this.getParser(fenKnightOnF6CheckingKingOnG8);
		// when
		var checks = parser.getValidSquaresOnCheck('black');

		// then
		assertEquals(1, checks.length);
		assertEquals(this.getNumericSquare('f6'), checks[0]);

	},

	"test should FindValidSquaresWhenCheckedByBishop":function () {
		// given
		var fenBishopOnB3CheckingKingOnG7 = '6k1/6pp/8/8/8/1B6/8/6K1 b - - 0 1';
		var parser = this.getParser(fenBishopOnB3CheckingKingOnG7);
		// when
		var checks = parser.getValidSquaresOnCheck('black');
		var expectedSquares = 'b3,c4,d5,e6,f7'.split(',');
		// then

		this.assertHasSquares(expectedSquares, checks);
	},

	"test should FindValidSquaresWhenCheckedByRook":function () {
		// given
		var fenRookOnF3CheckingKingOnF8 = '5kb1/4p3/3p4/2p5/1p6/p4R2/8/7K b - - 0 1';
		var parser = this.getParser(fenRookOnF3CheckingKingOnF8);
		// when
		var checks = parser.getValidSquaresOnCheck('black');
		var expectedSquares = 'f3,f4,f5,f6,f7'.split(',');
		// then

		this.assertHasSquares(expectedSquares, checks);
	},

	"test should FindValidSquaresWhenCheckedByRookOnSameRank":function () {
		// given
		var fenRookOnA8CheckingKingOnF8 = 'R4kb1/4p3/3p4/2p5/1p6/p7/8/7K b - - 0 1';
		var parser = this.getParser(fenRookOnA8CheckingKingOnF8);
		// when
		var checks = parser.getValidSquaresOnCheck('black');
		var expectedSquares = 'a8,b8,c8,d8,e8'.split(',');
		// then
		this.assertHasSquares(expectedSquares, checks);
	},

	"test should FindValidSquaresWhenCheckedByQueen":function () {
		// given
		var fenQueenOnF3CheckingKingOnF8 = '5kb1/4p3/3p4/2p5/1p6/p4Q2/8/7K b - - 0 1';
		var parser = this.getParser(fenQueenOnF3CheckingKingOnF8);
		// when
		var checks = parser.getValidSquaresOnCheck('black');
		var expectedSquares = 'f3,f4,f5,f6,f7'.split(',');
		// then

		this.assertHasSquares(expectedSquares, checks);


		// given
		var fenQueenOnB3CheckingKingOnG7 = '6k1/6pp/8/8/8/1Q6/8/6K1 b - - 0 1';
		parser = this.getParser(fenQueenOnB3CheckingKingOnG7);
		// when
		checks = parser.getValidSquaresOnCheck('black');
		expectedSquares = 'b3,c4,d5,e6,f7'.split(',');
		// then

		this.assertHasSquares(expectedSquares, checks);

	},

	"test PieceShouldOnlybe able ToMoveToValidSquaresOnCheck":function () {
		// given
		// Queen on f3 checkign king on f8
		// Bishop on g8 should only be able to move to f7
		var fen = '5kb1/4p3/3p4/2p5/1p6/p4Q2/8/7K b - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		var pLegal = parser.getValidMovesAndResult('black').moves;
		// when
		var moves = this.getValidMovesForSquare(pLegal, 'g8');
		var expectedSquares = ['f7'];
		// then
		this.assertHasSquares(expectedSquares, moves);


	},

	"test should FindCheckMate":function () {
		// given
		var notCheckMateFens = ['4k3/5p2/2B3p1/8/8/8/4R3/5K2 b - - 0 1',
			'5k2/5p1p/6p1/2B5/8/8/4R3/5K2 b - - 0 1'];

		for (var i = 0; i < notCheckMateFens.length; i++) {
			// when
			var parser = this.getParser(notCheckMateFens[i]);
			var moves = parser.getValidMovesAndResult('black');
			// then
			assertNotEquals(1, moves.result);
		}

		// given
		var checkMateFens = ['5kr1/5ppp/8/2B5/8/8/4R3/5K2 b - - 0 1',
			'3qkbn1/2rpp3/8/5n1Q/8/8/8/5K2 b - - 0 1',
			'3qkr2/3ppp2/3N4/8/8/8/8/4R1K1 b - - 0 1',
			'6rk/5Npp/8/8/8/1P6/2PP4/3K4 b - - 0 1',
			'6pk/6p1/8/8/8/8/8/2K4R b - - 0 1',
			'4b1pk/5rpp/6N1/8/8/8/8/2K4R b - - 0 1'

		];

		for (i = 0; i < checkMateFens.length; i++) {
			// when
			parser = this.getParser(checkMateFens[i]);
			moves = parser.getValidMovesAndResult();

			// then
			assertEquals('Position: ' + i, 1, moves.result);
		}
	},
	"test should FindStalemate":function () {
		// given
		var stalematePos = ['7k/7p/7P/8/8/8/8/3K2R1 b - - 0 1',
			'1R4bk/6pp/7P/8/8/8/1B6/5K2 b - - 0 1'];
		// when
		for (var i = 0; i < stalematePos.length; i++) {
			var parser = this.getParser(stalematePos[i]);
			var moves = parser.getValidMovesAndResult();
			assertEquals(stalematePos[i], .5, moves.result);
		}
	},

	"test ShoulludoetFenForAMove":function () {
		// given
		var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);

		// when
		parser.move({ from:'e2', 'to':'e4'});
		var newFen = parser.getFen();
		var expectedFen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1';
		// then

		assertEquals(expectedFen, newFen);
	},

	"test ShoulludoetFenForAPromotionMove":function () {
		// given
		var fen = '7k/2P3p1/7p/8/8/4p3/8/7K w - - 0 1';

		var parser = new chess.parser.FenParser0x88(fen);

		// when
		parser.move({ from:'c7', to:'c8', promoteTo:'queen' });
		var newFen = parser.getFen();
		var expectedFen = '2Q4k/6p1/7p/8/8/4p3/8/7K b - - 0 1';
		// then
		assertEquals(expectedFen, newFen);
		// given
		fen = '7k/8/8/8/8/8/2p5/7K b - - 0 1';

		parser = new chess.parser.FenParser0x88(fen);
		// when
		parser.move({ from:'c2', to:'c1', promoteTo:'queen'});
		newFen = parser.getFen({ from:'c2', to:'c1', promoteTo:'queen'});
		expectedFen = '7k/8/8/8/8/8/8/2q4K w - - 0 2';
		// then
		assertEquals(expectedFen, newFen);

	},

	"test ShoulludoetFenForEnPassantMoves":function () {

		// given
		var fen = 'rnbqkbnr/1ppppppp/p7/4P3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2';
		var parser = new chess.parser.FenParser0x88(fen);

		// when
		parser.move({ from:'d7', to:'d5' });
		var newFen = parser.getFen();

		var expectedFen = 'rnbqkbnr/1pp1pppp/p7/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3';
		assertEquals(expectedFen, newFen);
	},

	"test should be able ToGetFenForCastleMoves":function () {

		// given
		var fen = 'r3k2r/4pppp/8/8/8/8/4PPPP/R3K2R w KQkq - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);

		// when
		parser.move({ from:'e1', to:'g1' });
		var newFen = parser.getFen();
		var expectedFen = 'r3k2r/4pppp/8/8/8/8/4PPPP/R4RK1 b kq - 1 1';

		assertEquals(expectedFen, newFen);

		// given
		fen = '3k4/4p3/5p2/6p1/7p/8/8/R3K3 w Q - 0 1';
		parser = new chess.parser.FenParser0x88(fen);
		// when
		parser.move({ from:'e1', to:'c1' });
		newFen = parser.getFen({ from:'e1', to:'c1' });
		expectedFen = '3k4/4p3/5p2/6p1/7p/8/8/2KR4 b - - 1 1';

		assertEquals(expectedFen, newFen);

	},
	"test should be able ToGetFenForBlackCastleMoves":function () {

		// given
		var fen = 'r3k2r/6pp/8/8/8/8/8/6K1 b kq - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);

		// when
		parser.move({ from:'e8', to:'c8' });
		var newFen = parser.getFen({ from:'e8', to:'c8' });
		var expectedFen = '2kr3r/6pp/8/8/8/8/8/6K1 w - - 1 2';

		assertEquals(expectedFen, newFen);

		// given
		fen = 'r3k2r/6pp/8/8/8/8/8/6K1 b kq - 0 1';
		parser = new chess.parser.FenParser0x88(fen);
		// when
		parser.move({ from:'e8', to:'g8' });
		newFen = parser.getFen({ from:'e8', to:'g8' });
		expectedFen = 'r4rk1/6pp/8/8/8/8/8/6K1 w - - 1 2';

		assertEquals(expectedFen, newFen);


	},

	"test ShoulludoetFenForCaptureMoves":function () {
		var fen = '5rk1/4Qppp/8/8/8/1B6/8/5RK1 w - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);

		// when
		parser.move({ from:'b3', to:'f7' });
		var newFen = parser.getFen();

		var expectedFen = '5rk1/4QBpp/8/8/8/8/8/5RK1 b - - 0 1';
		assertEquals(expectedFen, newFen);
	},

	"test should IncrementFullMoves":function () {
		// given
		var fen = 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 3';
		var parser = new chess.parser.FenParser0x88(fen);

		// when
		parser.move({ from:'g8', to:'f6' });
		var newFen = parser.getFen();
		var expectedFen = 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 1 4';

		// then
		assertEquals(expectedFen, newFen);
	},

	"test should IncrementHalfMoves":function () {
		// given
		var fen = 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 0 4';
		var parser = new chess.parser.FenParser0x88(fen);

		// when
		parser.move({ from:'f8', to:'c5' });
		var newFen = parser.getFen();
		var expectedFen = 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 1 5';

		// then
		assertEquals(expectedFen, newFen);

	},
	"test should ExcludeCastleSquaresWhenMovingKing":function () {
		var fen = '5k2/5p2/6p1/7p/8/8/8/R3K2R w KQ - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		parser.move({ from:'e1', to:'f1' });
		var newFen = parser.getFen();
		var expectedFen = '5k2/5p2/6p1/7p/8/8/8/R4K1R b - - 1 1';

		// then
		assertEquals(expectedFen, newFen);

		// given
		fen = 'r3k2r/1p3p2/p1p1p1p1/3p4/P6P/1P4P1/2P2P2/R3K2R b KQkq - 0 1';
		parser = new chess.parser.FenParser0x88(fen);
		// when
		parser.move({ from:'e8', to:'e7' });
		newFen = parser.getFen();
		expectedFen = 'r6r/1p2kp2/p1p1p1p1/3p4/P6P/1P4P1/2P2P2/R3K2R w KQ - 1 2';

		// then
		assertEquals(expectedFen, newFen);
	},

	"test should ExcludeCastleWhenRookIsMoving":function () {
		// given
		var fen = 'r3k2r/1p3p2/p1p1p1p1/3p4/P6P/1P4P1/2P2P2/R3K2R w KQkq - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		// when
		parser.move({ from:'a1', to:'b1' });
		var newFen = parser.getFen();
		var expectedFen = 'r3k2r/1p3p2/p1p1p1p1/3p4/P6P/1P4P1/2P2P2/1R2K2R b Kkq - 1 1';

		// then
		assertEquals(expectedFen, newFen);

		// given
		fen = 'r3k2r/1p3p2/p1p1p1p1/3p4/P6P/1P4P1/2P2P2/R3K2R w KQkq - 0 1';
		parser = new chess.parser.FenParser0x88(fen);
		// when
		parser.move({ from:'h1', to:'g1' });
		newFen = parser.getFen();
		expectedFen = 'r3k2r/1p3p2/p1p1p1p1/3p4/P6P/1P4P1/2P2P2/R3K1R1 b Qkq - 1 1';

		// then
		assertEquals(expectedFen, newFen);

		// given
		fen = 'r3k2r/1p3p2/p1p1p1p1/3p4/P6P/1P4P1/2P2P2/R3K2R b KQkq - 0 1';
		parser = new chess.parser.FenParser0x88(fen);
		// when
		parser.move({ from:'h8', to:'g8' });
		newFen = parser.getFen();
		expectedFen = 'r3k1r1/1p3p2/p1p1p1p1/3p4/P6P/1P4P1/2P2P2/R3K2R w KQq - 1 2';

		// then
		assertEquals(expectedFen, newFen);

	},

	"test should FindMovedAndRemovedPiecesForAMove":function () {
		// given
		var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);

		// when
		parser.move({ from:'e2', to:'e4' });
		var moves = parser.getPiecesInvolvedInLastMove();

		// then
		assertEquals(1, moves.length);
		assertEquals('e2', moves[0].from);
		assertEquals('e4', moves[0].to);

		// given
		fen = '7k/8/8/3Pp3/8/8/8/7K w - e6 0 1';
		parser = new chess.parser.FenParser0x88(fen);

		// when
		moves = parser.getPiecesInvolvedInMove({ from:'d5', to:'e6' });

		// then
		assertEquals(2, moves.length);
		assertEquals('d5', moves[0].from);
		assertEquals('e6', moves[0].to);
		assertEquals('e5', moves[1].capture);

		// given
		fen = '8/P6k/8/8/8/8/8/5K2 w - - 0 1';
		parser = new chess.parser.FenParser0x88(fen);
		// when
		moves = parser.getPiecesInvolvedInMove({ from:'a7', to:'a8', 'promoteTo':'queen'});
		assertEquals(2, moves.length);

	},

	"test should FindMovedPiecesForACastleMove":function () {
		// given
		var fen = 'r3k2r/5ppp/8/8/8/1B6/5PPP/R3K2R w KQkq - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);

		// when
		var moves = parser.getPiecesInvolvedInMove({ from:'e1', to:'g1' });
		// then
		assertEquals(2, moves.length);
		assertEquals('e1', moves[0].from);
		assertEquals('g1', moves[0].to);
		assertEquals('h1', moves[1].from);
		assertEquals('f1', moves[1].to);

	},

	"test should Find Correct Notation For A Move":function () {

		var fens = [
			'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
			'rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 1',
			'7k/2P2ppp/8/8/8/8/8/7K w - - 0 1',
			'4r2k/6p1/7p/8/8/8/8/4R2K w - - 0 1',
			'6k1/1R3p2/6p1/7p/8/8/5R2/6K1 w - - 0 1',
			'6k1/1R3p2/6p1/7p/8/8/5R2/6K1 w - - 0 1',
			'6k1/5p2/1N4p1/3p3p/1N6/8/5R2/6K1 w - - 0 1',
			'2k5/8/8/8/8/8/8/R3K2R w KQ - 0 1',
			'3k4/4p3/5p2/6p1/7p/8/8/R3K3 w Q - 0 1'

		];
		var moves = ['e2e4', 'e5d6' , { from:'c7', to:'c8', promoteTo:'queen'}, 'e1e8', 'f2f7', 'b7f7', 'b6d5', 'e1g1', 'e1c1'];
		var expected = ['e4', 'exd6', 'c8=Q#', 'Rxe8+', 'Rfxf7', 'Rbxf7', 'N6xd5', 'O-O', 'O-O-O+'];

		for (var i = 0; i < fens.length; i++) {
			var parser = this.getParser(fens[i]);
			if (!moves[i].promoteTo) {
				moves[i] = {
					from:moves[i].substr(0, 2),
					to:moves[i].substr(2, 2)
				}
			}
			parser.move(moves[i]);
			var notation = parser.getNotation();
			assertEquals(expected[i], expected[i], notation);
		}
	},
	"test should FindCorrectLongNotationForAMove":function () {
		var fens = [
			'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
			'rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 1',
			'7k/2P2ppp/8/8/8/8/8/7K w - - 0 1',
			'4r2k/6p1/7p/8/8/8/8/4R2K w - - 0 1',
			'6k1/1R3p2/6p1/7p/8/8/5R2/6K1 w - - 0 1',
			'6k1/1R3p2/6p1/7p/8/8/5R2/6K1 w - - 0 1',
			'6k1/5p2/1N4p1/3p3p/1N6/8/5R2/6K1 w - - 0 1',
			'2k5/8/8/8/8/8/8/R3K2R w KQ - 0 1',
			'3k4/4p3/5p2/6p1/7p/8/8/R3K3 w Q - 0 1'

		];
		var moves = ['e2e4', 'e5d6' , { from:'c7', to:'c8', promoteTo:'queen'}, 'e1e8', 'f2f7', 'b7f7', 'b6d5', 'e1g1', 'e1c1'];
		var expected = ['e2-e4', 'e5xd6', 'c7-c8=Q#', 'Re1xe8+', 'Rf2xf7', 'Rb7xf7', 'Nb6xd5', 'O-O', 'O-O-O+'];

		for (var i = 0; i < fens.length; i++) {
			var parser = this.getParser(fens[i]);
			if (!moves[i].promoteTo) {
				moves[i] = {
					from:moves[i].substr(0, 2),
					to:moves[i].substr(2, 2)
				}
			}
			parser.move(moves[i]);
			var notation = parser.getLongNotation();
			assertEquals(expected[i], expected[i], notation);
		}

	},

	"test should be able ToMakeSeveralMovesAndThenGetFen":function () {
		// given

		var parser = this.getParser();

		parser.move({ from:'e2', to:'e4'});
		parser.move({ from:'e7', to:'e5'});
		parser.move({ from:'g1', to:'f3'});
		parser.move({ from:'g8', to:'f6'});
		parser.move({ from:'f1', to:'c4'});
		parser.move({ from:'f8', to:'c5'});
		parser.move({ from:'e1', to:'g1'});
		parser.move({ from:'e8', to:'g8'});
		parser.move({ from:'c2', to:'c3'});
		parser.move({ from:'h7', to:'h6'});
		parser.move({ from:'d2', to:'d4'});
		parser.move({ from:'e5', to:'d4'});
		parser.move({ from:'c3', to:'d4'});
		parser.move({ from:'c5', to:'b4'});
		parser.move({ from:'a2', to:'a3'});
		parser.move({ from:'b4', to:'a5'});
		parser.move({ from:'b2', to:'b4'});
		parser.move({ from:'a5', to:'b6'});
		parser.move({ from:'f1', to:'e1'});


		var expectedFen = 'rnbq1rk1/pppp1pp1/1b3n1p/8/1PBPP3/P4N2/5PPP/RNBQR1K1 b - - 2 10';
		var fen = parser.getFen();

		// then
		assertEquals(expectedFen, fen);

		// given
		parser = this.getParser('3r2k1/pp1r4/1b3Q1P/5B2/8/8/P2p1PK1/8 b - - 3 41');
		parser.move({ from:'d2', to:'d1', promoteTo:'queen'});

		expectedFen = '3r2k1/pp1r4/1b3Q1P/5B2/8/8/P4PK1/3q4 w - - 0 42';
		fen = parser.getFen();
		assertEquals(expectedFen, fen);
	},


	"test should be able ToMakePromotionMove":function () {
		// given
		var fen = '6k1/8/8/8/8/8/1p5P/7K b - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);

		// when
		var expectedFen = '6k1/8/8/8/8/8/7P/1q5K w - - 0 2';
		parser.move({ from:'b2', to:'b1', promoteTo:'queen'});

		// then
		assertEquals(expectedFen, parser.getFen());


	},


	"test should be able ToFindFromAndToFromNotation":function () {
		// given
		var parser = this.getParser();
		var moves = ['e2e4', 'e7e5', 'g1f3', 'g8f6', 'f1c4', 'f8c5', 'e1g1', 'e8g8', 'c2c3', 'h7h6', 'd2d4', 'e5d4', 'c3d4', 'c5b4'];
		var notations = ['e4', 'e5', 'Nf3', 'Nf6', 'Bc4', 'Bc5', 'O-O', 'O-O', 'c3', 'h6', 'd4', 'exd4', 'cxd4', 'Bb4'];

		for (var i = 0; i < moves.length; i++) {
			var move = parser.getFromAndToByNotation(notations[i]);
			// Then
			assertEquals(notations[i], moves[i].substr(0, 2), move.from);
			assertEquals(notations[i], moves[i].substr(2, 2), move.to);

			parser.makeMove({ from:moves[i].substr(0, 2), to:moves[i].substr(2, 2)});

		}

		// Given
		parser = this.getParser('6k1/R4p2/6p1/7p/8/8/B4R2/7K w - - 0 1');
		// when
		move = parser.getFromAndToByNotation('Rfxf7');
		// then
		assertEquals('f2', move.from);
		assertEquals('f7', move.to);

		// given
		parser = this.getParser('rnbqkb1r/pppppppp/8/3nP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3');
		// when
		move = parser.getFromAndToByNotation('g6');
		// then
		assertEquals('g7', move.from);
		assertEquals('g6', move.to);


		// Given
		parser = this.getParser('4nkn1/R4pn1/6p1/7p/8/8/B4R2/7K w - - 0 1');
		// when
		move = parser.getFromAndToByNotation('Raxf7#');
		// then
		assertEquals('a7', move.from);
		assertEquals('f7', move.to);

		// Given
		parser = this.getParser('Rbkq4/1p6/1BP4p/4p3/4B3/1QPP1P2/6rP/6K1 w - - 0 29');
		// when
		move = parser.getFromAndToByNotation('Kxg2');
		// then
		assertEquals('g1', move.from);
		assertEquals('g2', move.to);
		// Given
		parser = this.getParser('r1bqkb1r/ppp3pp/2n5/3nppN1/2B5/2NP4/PPP2PPP/R1BQ1RK1 b kq - 1 8');
		// when
		move = parser.getFromAndToByNotation('Nce7');
		// then
		assertEquals('c6', move.from);
		assertEquals('e7', move.to);
		// Given
		parser = this.getParser('3r2k1/pp1r4/1b3Q1P/5B2/8/8/P2p1PK1/8 b - - 3 41');
		// when
		move = parser.getFromAndToByNotation('d1=Q');
		// then
		assertEquals('d2', move.from);
		assertEquals('d1', move.to);
		assertEquals('queen', move.promoteTo);
		// Given
		parser = this.getParser('r1bqk1nr/ppp2ppp/1b1p2n1/3PP1N1/2B5/8/P4PPP/RNBQ1RK1 b kq - 2 11');
		// when
		move = parser.getFromAndToByNotation('N8e7');
		// then
		assertEquals('g8', move.from);
		assertEquals('e7', move.to);
		// Given
		parser = this.getParser('r1bq3r/ppp3pp/1b6/n2nk3/2B5/B1P2Q2/P2P1PPP/RN4K1 w - - 0 14');
		// when
		move = parser.getFromAndToByNotation('d4+');
		// then
		assertEquals('d2', move.from);
		assertEquals('d4', move.to);


	},

	"test should get piece type by notation":function () {
		var parser = this.getParser();
		var notations = ['Nf3', 'Nxf6', 'Rxf8=Q', 'Nfxf8', 'O-O', 'exe5', 'Kxg2', 'Nxd6', 'd1=Q'];
		var expected = 'NNRNKPKNP';

		for (var i = 0; i < notations.length; i++) {
			var expectedValue = expected.substr(i, 1);
			if (expectedValue === 'P') {
				expectedValue = '';
			}
			assertEquals(expectedValue, Board0x88Config.notationMapping[parser.getPieceTypeByNotation(notations[i])]);
		}

	},

	"test should Find From Rank By Notation":function () {
		// given
		var parser = this.getParser();
		var expectedValue;
		// when
		var notations = ['R7e4', 'N5xf5', 'Ne5', 'N8e7'];
		var expected = [6, 4, null, 7];
		for (var i = 0; i < notations.length; i++) {
			if (expected[i] !== null) {
				expectedValue = expected[i] * 16
			} else {
				expectedValue = null;
			}
			assertEquals(expectedValue, parser.getFromRankByNotation(notations[i]));

		}

	},

	"test should FindFromFileByNotation":function () {
		// given
		var parser = this.getParser();

		// when
		var notations = ['Ree4', 'Naxf5', 'Ne5', 'exd8=Q', 'axb5', 'Nce7', 'bxa1'];
		var expected = [4, 0, null, 4, 0, 2, 1];
		for (var i = 0; i < notations.length; i++) {
			assertEquals(notations[i], expected[i], parser.getFromFileByNotation(notations[i]));
		}
	},

	"test should FindFromToSquareByNotation":function () {
		// given
		var parser = this.getParser();
		// when
		var notations = ['Ree4', 'Naxf5', 'Ne5', 'exd8=Q'];
		var expected = ['e4', 'f5', 'e5', 'd8'];
		for (var i = 0; i < notations.length; i++) {
			var expectedValue = Board0x88Config.mapping[expected[i]];
			assertEquals(notations[i], expectedValue, parser.getToSquareByNotation(notations[i]));

		}
	},

	"test_should_find_promotion_when_no_equal_sign_in_notation":function () {
		// given
		var parser = this.getParser();

		var notations = ['a8=R+', 'g8Q', 'axb1=R', 'b8'];
		var expectedResults = ['rook', 'queen', 'rook', ''];

		// when
		for (var i = 0; i < notations.length; i++) {
			assertEquals('Notation ' + notations[i] + ' failed ', expectedResults[i], parser.getPromoteByNotation(notations[i]));
		}
	},

	"test getSpasskyFischerGameWith3FoldReptition": function(){
		// given
		var parser = new chess.parser.FenParser0x88();
		// when
		var fens = this.getFenFromSpasskyFischer();
		// then
		assertTrue(parser.hasThreeFoldRepetition(fens));

	},

	"test should find hanging pieces": function(){


	},


	getFenFromSpasskyFischer:function(){
		var parser = this.getParser();
  		var moves = 'e4,d6,d4,g6,Nc3,Nf6,f4,Bg7,Nf3,c5,dxc5,Qa5,Bd3,Qxc5,Qe2,O-O,Be3,Qa5,O-O,Bg4,Rad1,Nc6,Bc4,Nh5,Bb3,Bxc3,bxc3,Qxc3,f5,Nf6,h3,Bxf3,Qxf3,Na5,Rd3,Qc7,Bh6,Nxb3,cxb3,Qc5+,Kh1,Qe5,Bxf8,Rxf8,Re3,Rc8,fxg6,hxg6,Qf4,Qxf4,Rxf4,Nd7,Rf2,Ne5,Kh2,Rc1,Ree2,Nc6,Rc2,Re1,Rfe2,Ra1,Kg3,Kg7,Rcd2,Rf1,Rf2,Re1,Rfe2,Rf1,Re3,a6,Rc3,Re1,Rc4,Rf1,Rdc2,Ra1,Rf2,Re1,Rfc2,g5,Rc1,Re2,R1c2,Re1,Rc1,Re2,R1c2';
  		moves = moves.split(/,/g);
		var ret = [];
		for(var i=0;i<moves.length;i++){
			parser.makeMoveByNotation(moves[i]);
			ret.push(parser.getFen());
		}
		return ret;
	}
});