TestCase("VariationTest", {


	"test should be able to find previous move":function () {
		// given
		var model = this.getModelWithMoves();
		var move = model.getMoves()[4];
		var expectedId = model.getMoves()[3].uid;

		// when
		var moveToFind = model.getPreviousMove(move);

		// then
		assertEquals(expectedId, moveToFind.uid);
	},
	"test should be able to find next move":function () {
		// given
		var model = this.getModelWithMoves();
		var move = model.getMoves()[4];
		var expectedId = model.getMoves()[5].uid;

		// when
		var moveToFind = model.getNextMove(move);

		// then
		assertEquals(expectedId, moveToFind.uid);
	},

	"test should Be able to start a variation":function () {
		// given
		var model = this.getModelWithMoves();

		// when
		var move = model.model.moves[0];
		model.setCurrentMove(move);
		model.newVariation({ from:'f2', to:'f4' }, move);
		model.appendMove({ from:'e7', to:'e5' });

		// then
		assertEquals(1, move.variations.length);
		assertEquals(2, move.variations[0].length);
		assertEquals('f4', move.variations[0][0].to);
	},

	"test should be able to add multiple variations":function () {
		// given
		var model = this.getModelWithMoves();

		// when
		var move = model.model.moves[0];
		model.setCurrentMove(move);
		model.newVariation({ from:'f2', to:'f4' });
		model.setCurrentMove(move);
		model.newVariation({ from:'g2', to:'g3' });

		// then
		assertEquals(2, move.variations.length);
		assertEquals(1, move.variations[0].length);
		assertEquals(1, move.variations[1].length);
		assertEquals('f4', move.variations[0][0].to);
		assertEquals('g3', move.variations[1][0].to);

	},

	"test should fire new variation event":function () {
		// given
		var model = this.getModelWithMoves();
		var fired = false;
		var move = model.model.moves[0];
		// when
		model.addEvent(window.chess.events.game.newVariation, function () {
			fired = true;
		});
		model.setCurrentMove(move);
		model.newVariation({ from:'f2', to:'f4' });

		assertTrue(fired);
	},

	"test should fire delete variation event when deleting first move in variation":function () {
		// given

		var model = this.getModelWithVariation();
		assertTrue(model.getMoves()[1].variations[0].length > 0);
		assertEquals(2, model.getMoves()[1].variations[0].length);
		var fired = false;

		// when
		var firstMoveInVariation = model.getMoves()[1].variations[0][0];


		model.addEvent(chess.events.game.deleteVariation, function () {
			fired = true;
		});
		model.deleteMove(firstMoveInVariation);
		// Then
		assertTrue(fired);
	},


	"test should be able to delete move inside a variation":function () {
		// given
		var model = this.getModelWithVariation();
		assertTrue(model.getMoves()[1].variations[0].length > 0);
		assertEquals(2, model.getMoves()[1].variations[0].length);


		// when
		var secondMoveInVariation = model.getMoves()[1].variations[0][1];
		model.deleteMove(secondMoveInVariation);

		// then
		assertEquals(1, model.getMoves()[1].variations[0].length);
	},

	"test should be able to find previous move of first move in variation":function () {
		// given
		var model = this.getModelWithVariation();
		assertEquals(2, model.getMoves()[1].variations[0].length);
		var firstMoveInVariation = {id:model.getMoves()[1].variations[0][0].uid };
		var firstMoveInGame = model.getMoves()[0];
		// when
		model.deleteMove(firstMoveInVariation);

		// then
		assertEquals(firstMoveInGame.notation, model.getCurrentMove().notation);
	},

	"test should not be able to add duplicate variation moves":function () {
		// given
		var model = this.getModelWithMoves();
		var move = {
			uid:model.model.moves[1].uid
		};
		model.setCurrentMove(move);
		// when
		model.newVariation({
			from:'d7',
			to:'d5'
		});
		var firstMove = {
			uid:model.model.moves[0].uid
		};
		model.setCurrentMove(firstMove);
		model.newVariation({
			from:'d7',
			to:'d5'
		});
		// then
		assertEquals(1, model.model.moves[1].variations.length);

	},

	"test should fire set move event when appending move which allready exists":function () {
		// given
		var model = this.getModelWithMoves();
		var move = {
            uid:model.model.moves[1].uid
		};
		model.setCurrentMove(move);
		// when
		model.newVariation({
			from:'d7',
			to:'d5'
		});
		model.setCurrentMove(move);
		var fired = false;
		model.addEvent(chess.events.game.newMove, function () {
			fired = true;
		});
		model.newVariation({
			from:'d7',
			to:'d5'
		});
		// then
		assertTrue(fired);
	},
    emptyGame:{ "metadata":{}, moves:[]},
    getModel:function () {
        return new chess.model.Game();
    },

    getModelWithMoves:function () {
        var model = new chess.model.Game();
        var moves = this.getValidMoves();
        for (var i = 0; i < moves.length; i++) {
            model.appendMove(moves[i]);
        }
        return model;
    },

    getModelWithVariation:function () {
        var model = this.getModelWithMoves();
        var move = model.model.moves[1];
        model.setCurrentMove(move);
        model.newVariation({ from:'f7', to:'f5' });
        model.appendMove({ from:'b2', to:'b4' });

        return model;
    },

    getValidMoves:function () {
        return [
            { from:'e2', to:'e4' },
            { from:'e7', to:'e5' },
            { from:'g1', to:'f3' },
            { from:'b8', to:'c6' },
            { from:'f1', to:'c4' },
            { from:'f8', to:'e7' },
            { from:'e1', to:'g1' },
            { from:'g8', to:'f6' },
            { from:'h2', to:'h3' },
            { from:'e8', to:'g8' },
            { from:'b1', to:'c3' },
            { from:'h7', to:'h6' },
            { from:'d2', to:'d3' }
        ]
    },
    defaultGame:{"metadata":{"event":"Computer chess game", "site":"ALFMAGNE-PC", "date":"2012.01.18", "round":"?", "white":"Alf Magne", "black":"Alf Magne", "result":"*", "blackelo":"2400", "eco":"C77", "opening":"Spanish", "time":"12:41:54", "variation":"Anderssen, 5...b5", "whiteelo":"2400", "timecontrol":"300", "termination":"unterminated", "plycount":"31", "whitetype":"human", "blacktype":"human", "fen":"rnbqkbnr\/pppppppp\/8\/8\/8\/8\/PPPPPPPP\/RNBQKBNR w KQkq - 0 1", "castle":1}, "moves":[
        {"m":"e4", "from":"e2", "to":"e4", "fen":"rnbqkbnr\/pppppppp\/8\/8\/4P3\/8\/PPPP1PPP\/RNBQKBNR b KQkq e3 0 1"},
        {"m":"e5", "from":"e7", "to":"e5", "fen":"rnbqkbnr\/pppp1ppp\/8\/4p3\/4P3\/8\/PPPP1PPP\/RNBQKBNR w KQkq e6 0 1"},
        {"m":"Nf3", "from":"g1", "to":"f3", "fen":"rnbqkbnr\/pppp1ppp\/8\/4p3\/4P3\/5N2\/PPPP1PPP\/RNBQKB1R b KQkq - 1 2"},
        {"m":"Nc6", "from":"b8", "to":"c6", "fen":"r1bqkbnr\/pppp1ppp\/2n5\/4p3\/4P3\/5N2\/PPPP1PPP\/RNBQKB1R w KQkq - 2 2"},
        {"m":"Bb5", "from":"f1", "to":"b5", "fen":"r1bqkbnr\/pppp1ppp\/2n5\/1B2p3\/4P3\/5N2\/PPPP1PPP\/RNBQK2R b KQkq - 3 3"},
        {"m":"Nf6", "from":"g8", "to":"f6", "fen":"r1bqkb1r\/pppp1ppp\/2n2n2\/1B2p3\/4P3\/5N2\/PPPP1PPP\/RNBQK2R w KQkq - 4 3"},
        {"m":"Nc3", "from":"b1", "to":"c3", "fen":"r1bqkb1r\/pppp1ppp\/2n2n2\/1B2p3\/4P3\/2N2N2\/PPPP1PPP\/R1BQK2R b KQkq - 5 4"},
        {"m":"Be7", "from":"f8", "to":"e7", "fen":"r1bqk2r\/ppppbppp\/2n2n2\/1B2p3\/4P3\/2N2N2\/PPPP1PPP\/R1BQK2R w KQkq - 6 4"},
        {"m":"d3", "from":"d2", "to":"d3", "fen":"r1bqk2r\/ppppbppp\/2n2n2\/1B2p3\/4P3\/2NP1N2\/PPP2PPP\/R1BQK2R b KQkq - 0 5"},
        {"m":"d6", "from":"d7", "to":"d6", "fen":"r1bqk2r\/ppp1bppp\/2np1n2\/1B2p3\/4P3\/2NP1N2\/PPP2PPP\/R1BQK2R w KQkq - 0 5"},
        {"m":"Be3", "from":"c1", "to":"e3", "fen":"r1bqk2r\/ppp1bppp\/2np1n2\/1B2p3\/4P3\/2NPBN2\/PPP2PPP\/R2QK2R b KQkq - 1 6"},
        {"m":"Bd7", "from":"c8", "to":"d7", "fen":"r2qk2r\/pppbbppp\/2np1n2\/1B2p3\/4P3\/2NPBN2\/PPP2PPP\/R2QK2R w KQkq - 2 6"},
        {"m":"Qd2", "from":"d1", "to":"d2", "fen":"r2qk2r\/pppbbppp\/2np1n2\/1B2p3\/4P3\/2NPBN2\/PPPQ1PPP\/R3K2R b KQkq - 3 7"},
        {"m":"a6", "from":"a7", "to":"a6", "fen":"r2qk2r\/1ppbbppp\/p1np1n2\/1B2p3\/4P3\/2NPBN2\/PPPQ1PPP\/R3K2R w KQkq - 0 7"},
        {"m":"Ba4", "from":"b5", "to":"a4", "fen":"r2qk2r\/1ppbbppp\/p1np1n2\/4p3\/B3P3\/2NPBN2\/PPPQ1PPP\/R3K2R b KQkq - 1 8"},
        {"m":"b5", "from":"b7", "to":"b5", "fen":"r2qk2r\/2pbbppp\/p1np1n2\/1p2p3\/B3P3\/2NPBN2\/PPPQ1PPP\/R3K2R w KQkq b6 0 8"},
        {"m":"Bb3", "from":"a4", "to":"b3", "fen":"r2qk2r\/2pbbppp\/p1np1n2\/1p2p3\/4P3\/1BNPBN2\/PPPQ1PPP\/R3K2R b KQkq - 1 9"},
        {"m":"O-O", "from":"e8", "to":"g8", "fen":"r2q1rk1\/2pbbppp\/p1np1n2\/1p2p3\/4P3\/1BNPBN2\/PPPQ1PPP\/R3K2R w KQ - 2 9"},
        {"m":"O-O-O", "from":"e1", "to":"c1", "fen":"r2q1rk1\/2pbbppp\/p1np1n2\/1p2p3\/4P3\/1BNPBN2\/PPPQ1PPP\/2KR3R b - - 3 10"},
        {"m":"b4", "from":"b5", "to":"b4", "fen":"r2q1rk1\/2pbbppp\/p1np1n2\/4p3\/1p2P3\/1BNPBN2\/PPPQ1PPP\/2KR3R w - - 0 10"},
        {"m":"Nd5", "variations":[
            [
                {"m":"Nb1", "from":"c3", "to":"b1", "fen":"r2q1rk1\/2pbbppp\/p1np1n2\/4p3\/1p2P3\/1B1PBN2\/PPPQ1PPP\/1NKR3R b - - 1 11"},
                {"m":"h6", "from":"h7", "to":"h6", "fen":"r2q1rk1\/2pbbpp1\/p1np1n1p\/4p3\/1p2P3\/1B1PBN2\/PPPQ1PPP\/1NKR3R w - - 0 11"},
                {"m":"h4", "variations":[
                    [
                        {"m":"Nh4", "from":"f3", "to":"h4", "fen":"r2q1rk1\/2pbbpp1\/p1np1n1p\/4p3\/1p2P2N\/1B1PB3\/PPPQ1PPP\/1NKR3R b - - 1 12"},
                        {"m":"g5", "from":"g7", "to":"g5", "fen":"r2q1rk1\/2pbbp2\/p1np1n1p\/4p1p1\/1p2P2N\/1B1PB3\/PPPQ1PPP\/1NKR3R w - g6 0 12"},
                        {"m":"Nf5", "from":"h4", "to":"f5", "fen":"r2q1rk1\/2pbbp2\/p1np1n1p\/4pNp1\/1p2P3\/1B1PB3\/PPPQ1PPP\/1NKR3R b - - 1 13"}
                    ]
                ], "from":"h2", "to":"h4", "fen":"r2q1rk1\/2pbbpp1\/p1np1n1p\/4p3\/1p2P2P\/1B1PBN2\/PPPQ1PP1\/1NKR3R b - h3 0 11"},
                {"m":"a5", "from":"a6", "to":"a5", "fen":"r2q1rk1\/2pbbpp1\/2np1n1p\/p3p3\/1p2P2P\/1B1PBN2\/PPPQ1PP1\/1NKR3R w - - 0 11"},
                {"m":"g4", "from":"g2", "to":"g4", "fen":"r2q1rk1\/2pbbpp1\/2np1n1p\/p3p3\/1p2P1PP\/1B1PBN2\/PPPQ1P2\/1NKR3R b - g3 0 12"},
                {"m":"Nxg4", "from":"f6", "to":"g4", "fen":"r2q1rk1\/2pbbpp1\/2np3p\/p3p3\/1p2P1nP\/1B1PBN2\/PPPQ1P2\/1NKR3R w - - 0 12"}
            ]
        ], "from":"c3", "to":"d5", "fen":"r2q1rk1\/2pbbppp\/p1np1n2\/3Np3\/1p2P3\/1B1PBN2\/PPPQ1PPP\/2KR3R b - - 1 10"},
        {"m":"Nxd5", "from":"f6", "to":"d5", "fen":"r2q1rk1\/2pbbppp\/p1np4\/3np3\/1p2P3\/1B1PBN2\/PPPQ1PPP\/2KR3R w - - 0 10"},
        {"m":"Bxd5", "from":"b3", "to":"d5", "fen":"r2q1rk1\/2pbbppp\/p1np4\/3Bp3\/1p2P3\/3PBN2\/PPPQ1PPP\/2KR3R b - - 0 11"},
        {"m":"Rb8", "from":"a8", "to":"b8", "fen":"1r1q1rk1\/2pbbppp\/p1np4\/3Bp3\/1p2P3\/3PBN2\/PPPQ1PPP\/2KR3R w - - 1 11"},
        {"m":"h4", "from":"h2", "to":"h4", "fen":"1r1q1rk1\/2pbbppp\/p1np4\/3Bp3\/1p2P2P\/3PBN2\/PPPQ1PP1\/2KR3R b - h3 0 12"},
        {"m":"h6", "from":"h7", "to":"h6", "fen":"1r1q1rk1\/2pbbpp1\/p1np3p\/3Bp3\/1p2P2P\/3PBN2\/PPPQ1PP1\/2KR3R w - - 0 12"},
        {"m":"Rludo1", "from":"d1", "to":"g1", "fen":"1r1q1rk1\/2pbbpp1\/p1np3p\/3Bp3\/1p2P2P\/3PBN2\/PPPQ1PP1\/2K3RR b - - 1 13"},
        {"m":"a5", "from":"a6", "to":"a5", "fen":"1r1q1rk1\/2pbbpp1\/2np3p\/p2Bp3\/1p2P2P\/3PBN2\/PPPQ1PP1\/2K3RR w - - 0 13"},
        {"m":"g4", "from":"g2", "to":"g4", "fen":"1r1q1rk1\/2pbbpp1\/2np3p\/p2Bp3\/1p2P1PP\/3PBN2\/PPPQ1P2\/2K3RR b - g3 0 14"},
        {"m":"g5", "from":"g7", "to":"g5", "fen":"1r1q1rk1\/2pbbp2\/2np3p\/p2Bp1p1\/1p2P1PP\/3PBN2\/PPPQ1P2\/2K3RR w - g6 0 14"},
        {"m":"h5", "variations":[
            [
                {"m":"hxg5", "from":"h4", "to":"g5", "fen":"1r1q1rk1\/2pbbp2\/2np3p\/p2Bp1P1\/1p2P1P1\/3PBN2\/PPPQ1P2\/2K3RR b - - 0 15"},
                {"m":"Bxg5", "from":"e7", "to":"g5", "fen":"1r1q1rk1\/2pb1p2\/2np3p\/p2Bp1b1\/1p2P1P1\/3PBN2\/PPPQ1P2\/2K3RR w - - 0 15"},
                {"m":"Nxg5", "from":"f3", "to":"g5", "fen":"1r1q1rk1\/2pb1p2\/2np3p\/p2Bp1N1\/1p2P1P1\/3PB3\/PPPQ1P2\/2K3RR b - - 0 16"},
                {"m":"hxg5", "from":"h6", "to":"g5", "fen":"1r1q1rk1\/2pb1p2\/2np4\/p2Bp1p1\/1p2P1P1\/3PB3\/PPPQ1P2\/2K3RR w - - 0 16"},
                {"m":"Rh5", "from":"h1", "to":"h5", "fen":"1r1q1rk1\/2pb1p2\/2np4\/p2Bp1pR\/1p2P1P1\/3PB3\/PPPQ1P2\/2K3R1 b - - 1 17"}
            ]
        ], "from":"h4", "to":"h5", "fen":"1r1q1rk1\/2pbbp2\/2np3p\/p2Bp1pP\/1p2P1P1\/3PBN2\/PPPQ1P2\/2K3RR b - - 0 14"}
    ]},
    gameWithoutVariations:{"metadata":{"event":"New Orleans", "site":"New Orleans", "date":"1848.??.??", "round":"?", "white":"Morphy, Paul ", "black":"Morphy, Alonzo", "result":"1-0", "whiteelo":"", "blackelo":"", "eco":"C23", "fen":"rnbqkbnr\/pppppppp\/8\/8\/8\/8\/PPPPPPPP\/RNBQKBNR w KQkq - 0 1", "castle":1}, "moves":[
        {"m":"e4", "from":"e2", "to":"e4", "fen":"rnbqkbnr\/pppppppp\/8\/8\/4P3\/8\/PPPP1PPP\/RNBQKBNR b KQkq e3 0 1"},
        {"m":"e5", "from":"e7", "to":"e5", "fen":"rnbqkbnr\/pppp1ppp\/8\/4p3\/4P3\/8\/PPPP1PPP\/RNBQKBNR w KQkq e6 0 1"},
        {"m":"Bc4", "from":"f1", "to":"c4", "fen":"rnbqkbnr\/pppp1ppp\/8\/4p3\/2B1P3\/8\/PPPP1PPP\/RNBQK1NR b KQkq - 1 2"},
        {"m":"f5", "from":"f7", "to":"f5", "fen":"rnbqkbnr\/pppp2pp\/8\/4pp2\/2B1P3\/8\/PPPP1PPP\/RNBQK1NR w KQkq f6 0 2"},
        {"m":"exf5", "from":"e4", "to":"f5", "fen":"rnbqkbnr\/pppp2pp\/8\/4pP2\/2B5\/8\/PPPP1PPP\/RNBQK1NR b KQkq - 0 3"},
        {"m":"Nf6", "from":"g8", "to":"f6", "fen":"rnbqkb1r\/pppp2pp\/5n2\/4pP2\/2B5\/8\/PPPP1PPP\/RNBQK1NR w KQkq - 1 3"},
        {"m":"Nc3", "from":"b1", "to":"c3", "fen":"rnbqkb1r\/pppp2pp\/5n2\/4pP2\/2B5\/2N5\/PPPP1PPP\/R1BQK1NR b KQkq - 2 4"},
        {"m":"d5", "from":"d7", "to":"d5", "fen":"rnbqkb1r\/ppp3pp\/5n2\/3ppP2\/2B5\/2N5\/PPPP1PPP\/R1BQK1NR w KQkq d6 0 4"},
        {"m":"Nxd5", "from":"c3", "to":"d5", "fen":"rnbqkb1r\/ppp3pp\/5n2\/3NpP2\/2B5\/8\/PPPP1PPP\/R1BQK1NR b KQkq - 0 5"},
        {"m":"Bc5", "from":"f8", "to":"c5", "fen":"rnbqk2r\/ppp3pp\/5n2\/2bNpP2\/2B5\/8\/PPPP1PPP\/R1BQK1NR w KQkq - 1 5"},
        {"m":"Nxf6+", "from":"d5", "to":"f6", "fen":"rnbqk2r\/ppp3pp\/5N2\/2b1pP2\/2B5\/8\/PPPP1PPP\/R1BQK1NR b KQkq - 0 6"},
        {"m":"Qxf6", "from":"d8", "to":"f6", "fen":"rnb1k2r\/ppp3pp\/5q2\/2b1pP2\/2B5\/8\/PPPP1PPP\/R1BQK1NR w KQkq - 0 6"},
        {"m":"d3", "from":"d2", "to":"d3", "fen":"rnb1k2r\/ppp3pp\/5q2\/2b1pP2\/2B5\/3P4\/PPP2PPP\/R1BQK1NR b KQkq - 0 7"},
        {"m":"Bxf5", "from":"c8", "to":"f5", "fen":"rn2k2r\/ppp3pp\/5q2\/2b1pb2\/2B5\/3P4\/PPP2PPP\/R1BQK1NR w KQkq - 0 7"},
        {"m":"Nf3", "from":"g1", "to":"f3", "fen":"rn2k2r\/ppp3pp\/5q2\/2b1pb2\/2B5\/3P1N2\/PPP2PPP\/R1BQK2R b KQkq - 1 8"},
        {"m":"Bg4", "from":"f5", "to":"g4", "fen":"rn2k2r\/ppp3pp\/5q2\/2b1p3\/2B3b1\/3P1N2\/PPP2PPP\/R1BQK2R w KQkq - 2 8"},
        {"m":"Bd5", "from":"c4", "to":"d5", "fen":"rn2k2r\/ppp3pp\/5q2\/2bBp3\/6b1\/3P1N2\/PPP2PPP\/R1BQK2R b KQkq - 3 9"},
        {"m":"c6", "from":"c7", "to":"c6", "fen":"rn2k2r\/pp4pp\/2p2q2\/2bBp3\/6b1\/3P1N2\/PPP2PPP\/R1BQK2R w KQkq - 0 9"},
        {"m":"Be4", "from":"d5", "to":"e4", "fen":"rn2k2r\/pp4pp\/2p2q2\/2b1p3\/4B1b1\/3P1N2\/PPP2PPP\/R1BQK2R b KQkq - 1 10"},
        {"m":"Nd7", "from":"b8", "to":"d7", "fen":"r3k2r\/pp1n2pp\/2p2q2\/2b1p3\/4B1b1\/3P1N2\/PPP2PPP\/R1BQK2R w KQkq - 2 10"},
        {"m":"O-O", "from":"e1", "to":"g1", "fen":"r3k2r\/pp1n2pp\/2p2q2\/2b1p3\/4B1b1\/3P1N2\/PPP2PPP\/R1BQ1RK1 b kq - 3 11"},
        {"m":"h6", "from":"h7", "to":"h6", "fen":"r3k2r\/pp1n2p1\/2p2q1p\/2b1p3\/4B1b1\/3P1N2\/PPP2PPP\/R1BQ1RK1 w kq - 0 11"},
        {"m":"c3", "from":"c2", "to":"c3", "fen":"r3k2r\/pp1n2p1\/2p2q1p\/2b1p3\/4B1b1\/2PP1N2\/PP3PPP\/R1BQ1RK1 b kq - 0 12"},
        {"m":"O-O-O", "from":"e8", "to":"c8", "fen":"2kr3r\/pp1n2p1\/2p2q1p\/2b1p3\/4B1b1\/2PP1N2\/PP3PPP\/R1BQ1RK1 w - - 1 12"},
        {"m":"b4", "from":"b2", "to":"b4", "fen":"2kr3r\/pp1n2p1\/2p2q1p\/2b1p3\/1P2B1b1\/2PP1N2\/P4PPP\/R1BQ1RK1 b - b3 0 13"},
        {"m":"Bb6", "from":"c5", "to":"b6", "fen":"2kr3r\/pp1n2p1\/1bp2q1p\/4p3\/1P2B1b1\/2PP1N2\/P4PPP\/R1BQ1RK1 w - - 1 13"},
        {"m":"a4", "from":"a2", "to":"a4", "fen":"2kr3r\/pp1n2p1\/1bp2q1p\/4p3\/PP2B1b1\/2PP1N2\/5PPP\/R1BQ1RK1 b - a3 0 14"},
        {"m":"a6", "from":"a7", "to":"a6", "fen":"2kr3r\/1p1n2p1\/pbp2q1p\/4p3\/PP2B1b1\/2PP1N2\/5PPP\/R1BQ1RK1 w - - 0 14"},
        {"m":"Qb3", "from":"d1", "to":"b3", "fen":"2kr3r\/1p1n2p1\/pbp2q1p\/4p3\/PP2B1b1\/1QPP1N2\/5PPP\/R1B2RK1 b - - 1 15"},
        {"m":"Bxf3", "from":"g4", "to":"f3", "fen":"2kr3r\/1p1n2p1\/pbp2q1p\/4p3\/PP2B3\/1QPP1b2\/5PPP\/R1B2RK1 w - - 0 15"},
        {"m":"Bxf3", "from":"e4", "to":"f3", "fen":"2kr3r\/1p1n2p1\/pbp2q1p\/4p3\/PP6\/1QPP1B2\/5PPP\/R1B2RK1 b - - 0 16"},
        {"m":"g5", "from":"g7", "to":"g5", "fen":"2kr3r\/1p1n4\/pbp2q1p\/4p1p1\/PP6\/1QPP1B2\/5PPP\/R1B2RK1 w - g6 0 16"},
        {"m":"Be3", "from":"c1", "to":"e3", "fen":"2kr3r\/1p1n4\/pbp2q1p\/4p1p1\/PP6\/1QPPBB2\/5PPP\/R4RK1 b - - 1 17"},
        {"m":"g4", "from":"g5", "to":"g4", "fen":"2kr3r\/1p1n4\/pbp2q1p\/4p3\/PP4p1\/1QPPBB2\/5PPP\/R4RK1 w - - 0 17"},
        {"m":"Bxg4", "from":"f3", "to":"g4", "fen":"2kr3r\/1p1n4\/pbp2q1p\/4p3\/PP4B1\/1QPPB3\/5PPP\/R4RK1 b - - 0 18"},
        {"m":"Bc7", "from":"b6", "to":"c7", "fen":"2kr3r\/1pbn4\/p1p2q1p\/4p3\/PP4B1\/1QPPB3\/5PPP\/R4RK1 w - - 1 18"},
        {"m":"Bf3", "from":"g4", "to":"f3", "fen":"2kr3r\/1pbn4\/p1p2q1p\/4p3\/PP6\/1QPPBB2\/5PPP\/R4RK1 b - - 2 19"},
        {"m":"Rhg8", "from":"h8", "to":"g8", "fen":"2kr2r1\/1pbn4\/p1p2q1p\/4p3\/PP6\/1QPPBB2\/5PPP\/R4RK1 w - - 3 19"},
        {"m":"Be4", "from":"f3", "to":"e4", "fen":"2kr2r1\/1pbn4\/p1p2q1p\/4p3\/PP2B3\/1QPPB3\/5PPP\/R4RK1 b - - 4 20"},
        {"m":"Rg4", "from":"g8", "to":"g4", "fen":"2kr4\/1pbn4\/p1p2q1p\/4p3\/PP2B1r1\/1QPPB3\/5PPP\/R4RK1 w - - 5 20"},
        {"m":"f3", "from":"f2", "to":"f3", "fen":"2kr4\/1pbn4\/p1p2q1p\/4p3\/PP2B1r1\/1QPPBP2\/6PP\/R4RK1 b - - 0 21"},
        {"m":"Rg7", "from":"g4", "to":"g7", "fen":"2kr4\/1pbn2r1\/p1p2q1p\/4p3\/PP2B3\/1QPPBP2\/6PP\/R4RK1 w - - 1 21"},
        {"m":"b5", "from":"b4", "to":"b5", "fen":"2kr4\/1pbn2r1\/p1p2q1p\/1P2p3\/P3B3\/1QPPBP2\/6PP\/R4RK1 b - - 0 22"},
        {"m":"axb5", "from":"a6", "to":"b5", "fen":"2kr4\/1pbn2r1\/2p2q1p\/1p2p3\/P3B3\/1QPPBP2\/6PP\/R4RK1 w - - 0 22"},
        {"m":"axb5", "from":"a4", "to":"b5", "fen":"2kr4\/1pbn2r1\/2p2q1p\/1P2p3\/4B3\/1QPPBP2\/6PP\/R4RK1 b - - 0 23"},
        {"m":"Nb6", "from":"d7", "to":"b6", "fen":"2kr4\/1pb3r1\/1np2q1p\/1P2p3\/4B3\/1QPPBP2\/6PP\/R4RK1 w - - 1 23"},
        {"m":"bxc6", "from":"b5", "to":"c6", "fen":"2kr4\/1pb3r1\/1nP2q1p\/4p3\/4B3\/1QPPBP2\/6PP\/R4RK1 b - - 0 24"},
        {"m":"Rludo8", "from":"d8", "to":"g8", "fen":"2k3r1\/1pb3r1\/1nP2q1p\/4p3\/4B3\/1QPPBP2\/6PP\/R4RK1 w - - 1 24"},
        {"m":"Rf2", "from":"f1", "to":"f2", "fen":"2k3r1\/1pb3r1\/1nP2q1p\/4p3\/4B3\/1QPPBP2\/5RPP\/R5K1 b - - 2 25"},
        {"m":"Qd8", "from":"f6", "to":"d8", "fen":"2kq2r1\/1pb3r1\/1nP4p\/4p3\/4B3\/1QPPBP2\/5RPP\/R5K1 w - - 3 25"},
        {"m":"Ra8+", "from":"a1", "to":"a8", "fen":"R1kq2r1\/1pb3r1\/1nP4p\/4p3\/4B3\/1QPPBP2\/5RPP\/6K1 b - - 4 26"},
        {"m":"Bb8", "from":"c7", "to":"b8", "fen":"Rbkq2r1\/1p4r1\/1nP4p\/4p3\/4B3\/1QPPBP2\/5RPP\/6K1 w - - 5 26"},
        {"m":"Bxb6", "from":"e3", "to":"b6", "fen":"Rbkq2r1\/1p4r1\/1BP4p\/4p3\/4B3\/1QPP1P2\/5RPP\/6K1 b - - 0 27"},
        {"m":"Rxg2+", "from":"g7", "to":"g2", "fen":"Rbkq2r1\/1p6\/1BP4p\/4p3\/4B3\/1QPP1P2\/5RrP\/6K1 w - - 0 27"},
        {"m":"Rxg2", "from":"f2", "to":"g2", "fen":"Rbkq2r1\/1p6\/1BP4p\/4p3\/4B3\/1QPP1P2\/6RP\/6K1 b - - 0 28"},
        {"m":"Rxg2+", "from":"g8", "to":"g2", "fen":"Rbkq4\/1p6\/1BP4p\/4p3\/4B3\/1QPP1P2\/6rP\/6K1 w - - 0 28"},
        {"m":"Kxg2", "from":"g1", "to":"g2", "fen":"Rbkq4\/1p6\/1BP4p\/4p3\/4B3\/1QPP1P2\/6KP\/8 b - - 0 29"},
        {"m":"Qg5+", "from":"d8", "to":"g5", "fen":"Rbk5\/1p6\/1BP4p\/4p1q1\/4B3\/1QPP1P2\/6KP\/8 w - - 1 29"},
        {"m":"Kh1", "from":"g2", "to":"h1", "fen":"Rbk5\/1p6\/1BP4p\/4p1q1\/4B3\/1QPP1P2\/7P\/7K b - - 2 30"},
        {"m":"Qc1+", "from":"g5", "to":"c1", "fen":"Rbk5\/1p6\/1BP4p\/4p3\/4B3\/1QPP1P2\/7P\/2q4K w - - 3 30"},
        {"m":"Bg1", "from":"b6", "to":"g1", "fen":"Rbk5\/1p6\/2P4p\/4p3\/4B3\/1QPP1P2\/7P\/2q3BK b - - 4 31"}
    ]}
});