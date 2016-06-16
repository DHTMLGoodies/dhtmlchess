TestCase("ModelToPgn", {

    "test should return pgn": function(){
        // given
        var parser = new chess.pgn.Parser(this.getModel());
        // when
        var pgn = parser.getPgn();
        // then
        assertNotUndefined(pgn);
    },

    "test should set metadata correctly": function(){
        // given
        var parser = new chess.pgn.Parser(this.getModel());
        // when
        var pgn = parser.getPgn();
        // then
        this.assertHasMetadata(pgn, "event", "Computer chess game");
        this.assertHasMetadata(pgn, "site", "ALFMAGNE-PC");
    },

    assertHasMetadata:function(pgn, key, value){
        var tag = '[' + key + ' "' + value + '"]';
        assertTrue(tag + ' not present in ' + pgn, pgn.indexOf(tag)>=0);
    },

    "test should find moves": function(){
        // given
        var parser = new chess.pgn.Parser(this.getModel());
        // when
        var pgn = parser.getPgn();
        // then
        assertMatch(pgn, "2. Nf3 Nc6");
        assertMatch(pgn, "11. Nb1");
        assertMatch(pgn, "12.. a5");
        assertMatch(pgn, "{preface comment} 1. e4");
    },

    getModel:function(){
        var game = new chess.model.Game();
        game.populate(this.game);
        return game;
    },

    game: {"metadata":{"event":"Computer chess game", "site":"ALFMAGNE-PC", "date":"2012.01.18", "round":"1-0", "white":"Alf Magne", "black":"Alf Magne", "result":"1-0", "blackelo":"2400", "eco":"C77", "opening":"Spanish", "time":"12:41:54", "variation":"Anderssen, 5...b5", "whiteelo":"2400", "timecontrol":"300", "termination":"unterminated", "plycount":"31", "whitetype":"human", "blacktype":"human", "fen":"rnbqkbnr\/pppppppp\/8\/8\/8\/8\/PPPPPPPP\/RNBQKBNR w KQkq - 0 1", "castle":1, "comment": "preface comment"},
        "moves":[
            {"m":"e4", "from":"e2", "to":"e4", "fen":"rnbqkbnr\/pppppppp\/8\/8\/4P3\/8\/PPPP1PPP\/RNBQKBNR b KQkq e3 0 1", "comment": "A test comment"},
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
            // index 20
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
            {"m":"Rdg1", "from":"d1", "to":"g1", "fen":"1r1q1rk1\/2pbbpp1\/p1np3p\/3Bp3\/1p2P2P\/3PBN2\/PPPQ1PP1\/2K3RR b - - 1 13"},
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
        ]}
});