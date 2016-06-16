TestCase("ModelTest", {

    checkMateGame:{

        "event":" White to move.",
        "site":"?",
        "date":"1998.??.??",
        "round":"?",
        "white":"1001 Brilliant Ways",
        "black":"to Checkmate",
        "result":"*",
        "annotator":"Magne,Alf",
        "setup":"1",
        "fen":"r1b2rk1\/pp1p1pp1\/1b1p2B1\/n1qQ2p1\/8\/5N2\/P3RPPP\/4R1K1 w - - 0 1",
        "plycount":"7",
        "eventdate":"1998.??.??",
        "castle":1,
        "database_id":1,
        "metadata":{},
        "moves":[
            {"m":"Qxf7+!", "from":"d5", "to":"f7", "fen":"r1b2rk1\/pp1p1Qp1\/1b1p2B1\/n1q3p1\/8\/5N2\/P3RPPP\/4R1K1 b - - 0 1"},
            {"m":"Rxf7", "from":"f8", "to":"f7", "fen":"r1b3k1\/pp1p1rp1\/1b1p2B1\/n1q3p1\/8\/5N2\/P3RPPP\/4R1K1 w - - 0 2"},
            {"m":"Re8+", "from":"e2", "to":"e8", "fen":"r1b1R1k1\/pp1p1rp1\/1b1p2B1\/n1q3p1\/8\/5N2\/P4PPP\/4R1K1 b - - 1 2"},
            {"m":"Rf8", "from":"f7", "to":"f8", "fen":"r1b1Rrk1\/pp1p2p1\/1b1p2B1\/n1q3p1\/8\/5N2\/P4PPP\/4R1K1 w - - 2 3"},
            {"m":"Rxf8+", "from":"e8", "to":"f8", "fen":"r1b2Rk1\/pp1p2p1\/1b1p2B1\/n1q3p1\/8\/5N2\/P4PPP\/4R1K1 b - - 0 3"},
            {"m":"Kxf8", "from":"g8", "to":"f8", "fen":"r1b2k2\/pp1p2p1\/1b1p2B1\/n1q3p1\/8\/5N2\/P4PPP\/4R1K1 w - - 0 4"},
            {"m":"Re8#", "from":"e1", "to":"e8", "fen":"r1b1Rk2\/pp1p2p1\/1b1p2B1\/n1q3p1\/8\/5N2\/P4PPP\/6K1 b - - 1 4"}
        ]},

    gameWithVariations:{

        "event":"Computer chess game",
        "site":"ALFMAGNE-PC",
        "date":"2012.01.18",
        "round":"1-0",
        "white":"Alf Magne",
        "black":"Alf Magne",
        "result":"1-0",
        "blackelo":"2400",
        "eco":"C77",
        "opening":"Spanish",
        "time":"12:41:54",
        "variation":"Anderssen, 5...b5",
        "whiteelo":"2400",
        "timecontrol":"300",
        "termination":"unterminated",
        "plycount":"31",
        "fen":"rnbqkbnr\/pppppppp\/8\/8\/8\/8\/PPPPPPPP\/RNBQKBNR w KQkq - 0 1",
        "metadata":{
            "blacktype":"human",
            "whitetype":"human",
            "castle":1
        },
        "moves":[
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

    gameWithoutVariations61Moves:{"metadata":{"event":"New Orleans", "site":"New Orleans", "date":"1848.??.??", "round":"?", "white":"Morphy, Paul ", "black":"Morphy, Alonzo", "result":"1-0", "whiteelo":"", "blackelo":"", "eco":"C23", "fen":"rnbqkbnr\/pppppppp\/8\/8\/8\/8\/PPPPPPPP\/RNBQKBNR w KQkq - 0 1", "castle":1}, "moves":[
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
    ]},

    emptyGame:{ "metadata":{}, moves:[]},

    getModel:function () {
        return new chess.model.Game();
    },

    "getModelWithCheckMateGame":function () {
        var model = new chess.model.Game();
        model.populate(this.checkMateGame);
        return model;
    },

    "getModelWithMoves":function () {
        var model = new chess.model.Game();
        var moves = this.getValidMoves();
        for (var i = 0; i < moves.length; i++) {
            model.appendMove(moves[i]);
        }
        return model;
    },

    "getModelWithVariations":function () {
        var model = new chess.model.Game();
        model.populate(this.gameWithVariations);
        return model;
    },

    "getModelWithCommentAsFirstMove":function () {
        var model = new chess.model.Game();

        var moves = this.getValidMoves();
        for (var i = 0; i < moves.length; i++) {
            model.appendMove(moves[i]);
        }
        model.setCommentBefore('This is my comment', model.model.moves[0]);
        return model;
    },

    "getValidMoves":function () {
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

    "test should be able to set metadata":function () {
        // given
        var model = this.getModel();
        // when
        model.setMetadataValue('white', 'Alf Magne');

        // then
        assertEquals('Alf Magne', model.getMetadataValue('white'));
    },

    "test should fire event when metadata is changed":function () {
        // given
        var model = this.getModel();
        var eventFired = false;
        var metadataKey = '';
        var metadataValue = '';
        // when

        model.addEvent(chess.events.game.updateMetadata, function (event, model, metadata) {
            eventFired = true;
            metadataKey = metadata.key;
            metadataValue = metadata.value;

        });
        model.setMetadataValue('white', 'Alf Magne');
        // Then
        assertTrue(eventFired);
        assertEquals('white', metadataKey);
        assertEquals('Alf Magne', metadataValue);
    },

    "test should be able to set a starting position":function () {
        // given
        var model = this.getModelWithMoves();
        var position = '6bk/7p/8/8/8/8/5B2/6K1 w - - 0 1';
        // when
        model.setPosition(position);
        // then
        assertTrue(model.getMoves().length === 0);
        assertEquals(position, model.getStartPosition());
    },

    "test should fire new game event on new position":function () {
        // given
        var model = this.getModel();
        var position = '6bk/7p/8/8/8/8/5B2/6K1 w - - 0 1';

        // when
        var eventFired = false;
        model.addEvent(chess.events.game.newGame, function () {
            eventFired = true;
        });
        model.setPosition(position);

        // Then
        assertTrue(eventFired);
    },

    "test should be able to append moves":function () {

        // given
        var model = this.getModel();

        var moves = this.getValidMoves();

        for (var i = 0; i < moves.length; i++) {
            // when
            model.appendMove(moves[i]);
            // then
            var countMoves = i + 1;
            assertEquals(moves[i].from + ' to ' + moves[i].to, countMoves, model.getMoves().length);
        }
    },

    "test should fireNewMoveEventWhenValidMoveIsAppended":function () {
        // given
        var model = this.getModel();

        var eventFired = false;
        // when
        model.addEvent(chess.events.game.newMove, function () {
            eventFired = true;
        });
        model.appendMove({ from:'e2', to:'e4' });

        // then
        assertTrue(eventFired);
    },

    "test should fire invalid move event when wrong move is appended":function () {
        // given
        var model = this.getModel();
        var eventFired = false;
        // when
        model.addEvent(chess.events.game.invalidMove, function () {
            eventFired = true;
        });
        model.appendMove({ from:'e7', to:'e5'});

        // then
        assertTrue(eventFired);
    },

    "test should fire last move in branch event when current move is last move":function () {
        // given
        var model = this.getModel();
        var eventFired = false;
        // when
        model.addEvent(chess.events.game.endOfBranch, function () {
            eventFired = true;
        });
        model.appendMove({ from:'e2', to:'e4'});

        // then
        assertTrue(eventFired);

    },

    "test should be able to delete moves":function () {
        // given
        var model = this.getModel();
        var moves = this.getValidMoves();

        for (var i = 0; i < moves.length; i++) {
            model.appendMove(moves[i]);
        }

        // when
        var move = model.model.moves[5];
        model.deleteMove(move);

        // Then
        assertEquals(5, model.getMoves().length);
    },

    "test should fire move deleted event when move is deleted":function () {
        // given
        var model = this.getModelWithMoves();

        var eventFired = false;
        var deletedMove = {};
        // when
        var move = model.model.moves[5];
        model.addEvent(chess.events.game.deleteMove, function (event, model, m) {
            eventFired = true;
            deletedMove = m;

        });
        model.deleteMove(move);

        // Then
        assertTrue(eventFired);
        assertEquals(move.uid, deletedMove.uid);
    },

    "test should fire last move in branch event when move is deleted":function () {
        // given
        var model = this.getModelWithMoves();
        var eventFired = false;

        // when
        var move = model.model.moves[5];
        model.addEvent(chess.events.game.endOfBranch, function () {
            eventFired = true;
        });
        model.deleteMove(move);

        // Then
        assertTrue(eventFired);
    },

    "test should fire no moves event when first node in branch is deleted":function () {
        // given
        var model = this.getModelWithMoves();

        var eventFired = false;
        // when
        var move = model.model.moves[0];
        model.addEvent(chess.events.game.noMoves, function () {
            eventFired = true;

        });
        model.deleteMove(move);

        // Then
        assertTrue(eventFired);
    },

    "test should set previous move current when a move is deleted":function () {
        // given
        var model = this.getModelWithMoves();

        // when
        var move = model.model.moves[1];
        model.deleteMove(move);

        // then
        assertEquals(model.getMoves()[0].uid, model.getCurrentMove().uid)
    },

    "test should be able to find previous move of first move in variation":function () {
        // given
        var model = this.getModelWithVariations();
        var variationMove = model.model.moves[20].variations[0][0];

        model.setCurrentMove(variationMove);

        var expectedPrevious = model.model.moves[19];

        // when
        model.previousMove();


        // then
        assertEquals(expectedPrevious, model.currentMove);

        // given
        model = this.getModel();

        // when
        model.appendMove({ from:'e2', to:'e4'});
        model.appendMove({ from:'e7', to:'e5'});
        model.appendMove({ from:'g1', to:'f3'});

        model.newVariation({ from:'b1', to:'c3'});


        var prMove = model.getPreviousMove(model.currentMove);

        assertEquals('e7', prMove.from);


    },

    "test should fire no moves event when there is no moves in game":function () {
        // given
        var model = this.getModel();
        var eventFired = false;
        // when
        model.addEvent(chess.events.game.noMoves, function () {
            eventFired = true;
        });
        model.newGame();

        // then
        assertTrue('no moves event not fired', eventFired);

        // given
        model = this.getModel();
        eventFired = false;
        model.addAction({ action:'pause', duration:'2'});
        eventFired = false;
        model.appendMove({ from:'e2', to:'e4'});
        model.addAction({ action:'pause', duration:'2'});

        // when
        model.addEvent(chess.events.game.noMoves, function () {
            eventFired = true;
        });
        model.deleteMove(model.model.moves[1]);

        // then
        assertEquals(1, model.getMoves().length);
        assertTrue('no moves event not fired 2', eventFired);
    },

    "test should be able to set current move":function () {
        // given
        var model = this.getModelWithMoves();
        var move = {
            uid:model.model.moves[4].uid
        };
        // when
        model.setCurrentMove(move);

        // then
        assertEquals(move.uid, model.getCurrentMove().uid);
    },

    "test should be able to add action to empty game":function () {
        // given
        var model = this.getModel();
        // when
        model.addAction({ action:'pause', duration:2 });
        // then
        assertTrue(model.getMoves().length === 1);
        assertTrue(model.getMoves()[0].action === 'pause');
    },

    "test should be able to add action":function () {
        // given
        var model = this.getModelWithMoves();
        var move = {
            uid:model.model.moves[4].uid
        };
        model.setCurrentMove(move);
        var nextMove = model.model.moves[5];
        var index = nextMove.index;
        // when
        model.addAction({ action:'pause', duration:2 });

        // then
        assertEquals(index + 1, nextMove.index);

        var moves = model.getMoves();
        for (var i = 0; i < moves.length; i++) {
            assertEquals(i, moves[i].index);
        }

        assertTrue(model.getMoves()[5].action === 'pause')
    },

    "test should fire new action event when action is added":function () {
        // given
        var model = this.getModel();
        // when
        var eventFired = false;
        // when
        model.addEvent(chess.events.game.newaction, function () {
            eventFired = true;
        });
        model.addAction({ action:'pause', duration:2 });
        // then
        assertTrue(eventFired);
    },

    "test should be able to delete action":function () {
        // given
        var model = this.getModelWithMoves();

        // when
        model.setCurrentMove(model.model.moves[5]);
        model.addAction({ action:'pause', duration:1});

        var action = model.getMoves()[6];
        assertTrue(action.action === 'pause');

        var eventFired = false;
        var eventMoveDelete = false;
        // when
        model.addEvent(chess.events.game.deleteAction, function () {
            eventFired = true;
        });
        model.addEvent(chess.events.game.deleteMove, function () {
            eventMoveDelete = true;
        });
        model.deleteMove(action);

        // then
        assertTrue(eventFired);
        assertFalse(eventMoveDelete);
    },

    "test should be able to grade moves":function () {
        // given
        var model = this.getModelWithMoves();
        var firstMove = { uid:model.getMoves()[0].uid };

        // when
        model.gradeMove(firstMove, '!?');

        // then
        assertEquals('e4!?', model.getMoves()[0].m);

        // when
        model.gradeMove(firstMove, '??');
        assertEquals('e4??', model.getMoves()[0].m);
    },

    "test should fire grade move event":function () {
        // given
        var model = this.getModelWithMoves();
        var firstMove = { uid:model.getMoves()[0].uid };
        var fired = false;

        // when
        model.addEvent(chess.events.game.updateMove, function () {
            fired = true;
        });
        model.gradeMove(firstMove, '!?');

        assertTrue(fired);
    },

    "test should be able to add comment before move":function () {
        // given
        var model = this.getModelWithMoves();
        var secondMove = { uid:model.getMoves()[1].uid };
        var comment = 'This is my comment';

        // when
        model.setCommentBefore(comment, secondMove);

        // then
        assertEquals(comment, model.getMoves()[0].comment);
    },

    "test should be able to add comment before first move in branch":function () {
        // given
        var model = this.getModelWithMoves();
        var firstMove = model.getMoves()[0];
        var comment = 'This is my comment';

        // when
        model.setCommentBefore(comment, firstMove);

        // then
        assertEquals(comment, model.getMoves()[0].comment);
        assertEquals(firstMove.m, model.getMoves()[1].m);

        // when
        var newComment = 'Another comment';
        firstMove = model.getMoves()[1];
        model.setCommentBefore(newComment, firstMove);

        // then
        assertEquals(newComment, model.getMoves()[0].comment);

    },

    "test should be able to add comment after move":function () {
        // given
        var model = this.getModelWithMoves();
        var secondMove = { uid:model.getMoves()[1].uid };
        var comment = 'This is my comment';

        // when
        model.setCommentAfter(comment, secondMove);

        // then
        assertEquals(comment, model.getMoves()[1].comment);
    },

    "test should be able to go to next move":function () {
        // given
        var model = this.getModelWithMoves();
        var move = {
            uid:model.model.moves[4].uid
        };
        var nextMove = model.model.moves[5];
        model.setCurrentMove(move);
        // when
        model.nextMove();

        // then
        assertEquals(nextMove.uid, model.getCurrentMove().uid);

    },

    "test should be able to go to next move from start of game":function () {
        // given
        var model = this.getModelWithMoves();
        var nextMove = model.model.moves[0];

        // when
        model.clearCurrentMove();
        model.nextMove();

        // then
        assertEquals(nextMove.uid, model.getCurrentMove().uid);
    },

    "test should be able to go to next move from start of game when game starts with comment":function () {
        // given
        var model = this.getModelWithCommentAsFirstMove();
        var nextMove = model.model.moves[1];

        // when
        model.clearCurrentMove();
        model.nextMove();

        // then
        assertEquals(nextMove.uid, model.getCurrentMove().uid);
    },

    "test should fire end of branch when going to next move and its the last":function () {
        // given
        var model = this.getModelWithMoves();
        var move = model.model.moves[model.model.moves.length - 2];
        var sEventFired = false;
        // when
        model.setCurrentMove(move);
        // when
        model.addEvent(chess.events.game.endOfBranch, function () {
            sEventFired = true;
        });
        model.nextMove();

        // then
        assertTrue(sEventFired);
    },

    "test should be able to go to start of game":function () {
        // given
        var model = this.getModelWithMoves();

        // when
        model.toStart();

        // then
        assertEquals(model.model.moves, model.currentBranch);
        assertNull(model.getCurrentMove());
    },

    "test should fire correct events when going to start of game":function () {
        // given
        var model = this.getModelWithMoves();
        var sEventFired = false;
        var nEventFired = false;
        // when
        model.addEvent(chess.events.game.startOfGame, function () {
            sEventFired = true;
        });
        model.addEvent(chess.events.game.clearCurrentMove, function () {
            nEventFired = true;
        });

        model.toStart();

        // then
        assertTrue(sEventFired);
        assertTrue(nEventFired);
    },
    "test should fire set move event when set current move":function () {
        // given
        var model = this.getModelWithMoves();
        var move = {
            uid:model.model.moves[4].uid
        };
        var nEventFired = false;

        // when
        model.addEvent(chess.events.game.setPosition, function () {
            nEventFired = true;
        });

        model.goToMove(move);
        assertTrue(nEventFired);

    },

    "test should fire next move event when set current move to next":function () {
        // given
        var model = this.getModelWithMoves();
        var move = {
            uid:model.model.moves[4].uid
        };
        model.setCurrentMove(move);
        var nEventFired = false;
        // when
        model.addEvent(chess.events.game.nextmove, function () {
            nEventFired = true;
        });
        model.nextMove();

        assertTrue(nEventFired);
    },


    "test should be able to go to previous move":function () {
        // given
        var model = this.getModelWithMoves();
        model.setCurrentMove(model.model.moves[5]);
        var prevMove = model.model.moves[4];

        // when
        model.previousMove();

        // then
        assertEquals(prevMove.uid, model.getCurrentMove().uid);

    },


    "test should fire overwrite or variation event when trying to append move in middle of game":function () {
        // given
        var model = this.getModelWithMoves();
        var move = {
            uid:model.model.moves[0].uid
        };
        model.setCurrentMove(move);
        var fired = false;
        // when
        model.addEvent(chess.events.game.overwriteOrVariation, function () {
            fired = true;
        });
        model.appendMove({
            from:'d7',
            to:'d5'
        });
        // then
        assertTrue(fired);

        // given
        model = this.getModelWithMoves();
        model.toStart(move);
        fired = false;

        // when
        model.appendMove({from:'e2', to:'e4' });
        var movesToOverwrite = null;
        model.addEvent(chess.events.game.overwriteOrVariation, function (event, model, moves) {
            fired = true;
            movesToOverwrite = moves;
        });
        model.appendMove({
            from:'g8',
            to:'f6'
        });
        // then
        assertTrue(fired);
        assertEquals('g8', movesToOverwrite.newMove.from);
        assertEquals('e7', movesToOverwrite.oldMove.from);
    },


    "test should not fire overwrite or variation event when appended move is in variation":function () {
        // given
        var model = this.getModelWithMoves();
        var move = {
            uid:model.model.moves[1].uid
        };
        model.setCurrentMove(move);
        model.newVariation({
            from:'d7',
            to:'d5'
        });
        assertEquals(1, model.model.moves[1].variations.length);


        move = {
            uid:model.model.moves[0].uid
        };
        model.setCurrentMove(move);
        // when
        model.appendMove({
            from:'d7', to:'d5'
        });

        assertEquals(1, model.model.moves[1].variations.length);
    },


    "test should fire set move event when appending move which already exists":function () {
        // given
        var model = this.getModelWithMoves();
        var move = {
            uid:model.model.moves[0].uid
        };
        model.setCurrentMove(move);
        var fired = true;
        // when
        model.addEvent(chess.events.game.setPosition, function () {
            fired = true;
        });
        var newMove = {
            from:'e7',
            to:'e5'
        };
        model.appendMove(newMove);

        // then
        assertTrue(model.model.moves.length > 3);
        assertTrue(fired);
    },

    "test should fire promote event when moving pawn to last rank":function () {
        // given
        var model = this.getModel();
        var fenWithPawnOnA7 = '8/P6k/8/8/8/8/8/5K2 w - - 0 1';
        model.setPosition(fenWithPawnOnA7);
        var fired = false;
        var eventMove = {};
        // when
        model.addEvent(chess.events.game.verifyPromotion, function (event, model, move) {
            eventMove = move;
            fired = true;
        });
        model.appendMove({ from:'a7', to:'a8'});

        // then
        assertTrue(fired);
        assertEquals('a7', eventMove.from);
        assertEquals('a8', eventMove.to);
        assertEquals(0, model.model.moves.length);
    },


    "test should not fire promote event when moving pawn to last rank and move has promote info":function () {
        // given
        var model = this.getModel();
        var fenWithPawnOnA7 = '8/P6k/8/8/8/8/8/5K2 w - - 0 1';
        model.setPosition(fenWithPawnOnA7);
        var fired = false;
        var eventMove = {};
        // when
        model.addEvent(chess.events.game.verifyPromotion, function (model, move) {
            eventMove = move;
            fired = true;
        });
        model.appendMove({ from:'a7', to:'a8', 'promoteTo':'queen'});

        // then
        assertFalse(fired);
        assertEquals(2, model.model.moves[0].moves.length);
    },

    "test should be able to populate model with game data":function () {
        // given
        var model = this.getModel();
        var gameData = this.gameWithoutVariations61Moves;

        // when
        model.populate(gameData);
        var moves = model.getMoves();

        // then
        assertEquals(61, moves.length);
        assertEquals(1, moves[0].moves.length);

    },

    "test should be able to populate model with game with variation":function () {
        // given
        var model = this.getModel();
        var gameData = this.gameWithVariations;

        // when
        model.populate(gameData);
        var moves = model.getMoves();
        // then
        assertEquals(31, moves.length);
        assertEquals(1, moves[0].moves.length);

        assertEquals(1, moves[20].variations.length);

        assertEquals(1, moves[20].variations[0][0].moves.length);
        assertEquals(1, moves[20].variations[0][2].variations[0][0].moves.length);
    },

    "test should be able to go to end of game":function () {
        // given
        var model = this.getModelWithMoves();
        var move = {
            uid:model.model.moves[model.model.moves.length - 1].uid
        };
        model.toStart();
        var sEventFired = false;
        var pEventFired = false;
        // when
        model.addEvent(chess.events.game.endOfBranch, function () {
            sEventFired = true;
        });
        model.addEvent(chess.events.game.setPosition, function () {
            pEventFired = true;
        });
        model.toEnd();

        assertEquals(move.uid, model.getCurrentMove().uid);
        assertTrue(sEventFired);
        assertTrue(pEventFired);
    },

    "test should fire start of branch event when moving back from move number one":function () {
        // given
        var model = this.getModelWithMoves();
        model.toStart();
        model.nextMove();
        var sEventFired = false;
        // when
        model.addEvent(chess.events.game.startOfGame, function () {
            sEventFired = true;
        });
        model.previousMove();

        // then
        assertTrue(sEventFired);
    },

    "test should fire start of branch event when comment is first move":function () {

        // given
        var model = this.getModel();

        model.appendMove({ from:'e2', to:'e4'});
        var move = model.model.moves[0];
        model.setCommentBefore('Alf', move);
        assertEquals(2, model.getMoves().length);

        model.setCurrentMove(move);
        var sEventFired = false;
        // when
        model.addEvent(chess.events.game.startOfGame, function () {
            sEventFired = true;
        });
        model.previousMove();
        // then
        assertTrue(sEventFired);
    },

    firedEvents:[],
    eventsArray:[],
    eventsNotToBeFired:{},
    eventFireOrder:0,
    assignEvents:function (model, events) {
        this.firedEvents = {};
        this.eventsArray = [];
        this.eventFireOrder = 0;
        for (var i = 0; i < events.length; i++) {
            this.firedEvents[events[i]] = false;
            this.addModelEvent(model, events[i]);
            this.eventsArray.push(events[i]);
        }
        this.assignTriggersForEventsNotToBeFired(model, events);
    },

    addModelEvent:function (model, event) {
        model.addEvent(chess.events.game[event], function () {
            this.firedEvents[event] = this.eventFireOrder;
            this.eventFireOrder++;
        }.bind(this));
    },

    assignTriggersForEventsNotToBeFired:function (model, eventsToBeFired) {
        this.eventsNotToBeFired = {};
        for (var key in window.chess.events.game) {
            if (window.chess.events.game.hasOwnProperty(key)) {
                if (eventsToBeFired.indexOf(key) == -1) {
                    this.eventsNotToBeFired[key] = false;
                    this.addModelEvent(model, key);
                }
            }
        }
    },

    "assertEventsFired":function () {
        for (var i = 0; i < this.eventsArray.length; i++) {
            assertEquals(this.eventsArray[i], i, this.firedEvents[this.eventsArray[i]]);
        }

        for (var key in this.eventsNotToBeFired) {
            if (this.eventsNotToBeFired.hasOwnProperty(key)) {
                assertFalse(key, this.eventsNotToBeFired[key]);
            }
        }
    },

    "test should fire correct events when moving to start":function () {
        // given
        var model = this.getModelWithMoves();
        var move = {
            uid:model.model.moves[2].uid
        };
        model.goToMove(move);

        // when
        var expectedEvents = ['startOfGame', 'clearCurrentMove', 'setPosition', 'notEndOfBranch'];

        this.assignEvents(model, expectedEvents);
        model.toStart();

        // then
        this.assertEventsFired();

        // Model without moves
        // given
        model = this.getModel();
        // when
        expectedEvents = ['startOfGame', 'clearCurrentMove', 'setPosition', 'endOfBranch'];

        this.assignEvents(model, expectedEvents);
        model.toStart();

        // then
        this.assertEventsFired();
    },

    "test should fire correct events when going to previous move":function () {

        // given
        var model = this.getModelWithMoves();
        var move = {
            uid:model.model.moves[1].uid
        };
        model.setCurrentMove(move);

        // when
        this.assignEvents(model, ['notStartOfGame', 'notEndOfBranch', 'notEndOfGame', 'setPosition']);
        model.previousMove();

        // then
        this.assertEventsFired();

    },

    "test should fire correct events when moving forward":function () {

        // given
        var model = this.getModelWithMoves();
        var move = {
            uid:model.model.moves[2].uid
        };
        model.setCurrentMove(move);

        // when
        var expectedEvents = ['notStartOfGame', 'notEndOfBranch', 'notEndOfGame', 'nextmove'];
        this.assignEvents(model, expectedEvents);
        model.nextMove();

        // then
        this.assertEventsFired();
    },

    "testshouldFireCorrectEventWhenMovingToEnd":function () {
        // given
        var model = this.getModelWithMoves();

        // when
        var expectedEvents = ['setPosition', 'endOfBranch', 'notStartOfGame', 'endOfGame'];
        this.assignEvents(model, expectedEvents);
        model.toEnd();

        // then
        this.assertEventsFired();
    },

    "test should return first move when at start and calling get next move":function () {
        // given
        var model = this.getModelWithMoves();
        var moveId = model.model.moves[0].uid;
        // when
        model.toStart();
        var nextMove = model.getNextMove();

        // then
        assertEquals(moveId, nextMove.uid);
    },

    "test should be able to overwrite move":function () {
        // given
        var model = this.getModelWithMoves();
        var move = model.model.moves[1];
        // when

        model.overwriteMove(move, { from:'g8', to:'f6'});

        // then
        assertEquals('g8', model.model.moves[1].from);
        assertEquals('f6', model.model.moves[1].to);
        assertEquals(2, model.model.moves.length);

    },

    "test should be able to guess next move":function () {
        // given
        var model = this.getModelWithMoves();
        var move = model.model.moves[0];
        model.goToMove(move);

        // when
        var guess = { from:'e7', 'to':'e5' };

        // then
        assertTrue(model.tryNextMove(guess));
    },


    "test should be able to guess next move including variations":function () {
        // given
        var model = this.getModelWithVariations();
        var sourceMove = model.model.moves[20];


        // when
        var guesses = 'f6d5,c3b1';
        // then

        var tokens = guesses.split(',');
        for (var i = 0; i < tokens.length; i++) {
            model.goToMove(sourceMove);
            var move = { from:tokens[i].substr(0, 2), to:tokens[i].substr(2, 2) };
            assertTrue(tokens[i], model.tryNextMove(move));
        }
    },


    "test should fire events when guessing next move":function () {
        // given
        var model = this.getModelWithMoves();
        var move = model.model.moves[0];
        model.goToMove(move);
        var fired = false;
        // when
        var guess = { from:'e7', 'to':'e5' };
        model.addEvent(chess.events.game.correctGuess, function () {
            fired = true;
        });
        model.tryNextMove(guess);
        // then
        assertTrue(fired);

        // given
        fired = false;
        // when
        guess = { from:'d7', 'to':'d5' };
        model.addEvent(chess.events.game.wrongGuess, function () {
            fired = true;
        });
        model.tryNextMove(guess);
        // then
        assertTrue(fired);

    },

    "test should be able to get winning color of game from metadata":function () {
        // given
        var model = this.getModelWithVariations();
        // when
        var expectedResult = 1;
        // then
        assertEquals(expectedResult, model.getResult());
    },

    "test should be able to get winning color from last position":function () {
        var model = this.getModelWithCheckMateGame();
        // when
        var expectedResult = 1;
        // then
        assertEquals(expectedResult, model.getResult());

    },

    "test should be ble to find previous move in branch":function () {
        // given
        var model = this.getModelWithMoves();
        var move = model.model.moves[2];
        model.goToMove(move);

        // when
        var expectedMove = model.model.moves[1];

        // then
        assertEquals(expectedMove.uid, model.getPreviousMoveInBranch(move).uid);

        // given
        model = this.getModelWithVariations();
        move = model.model.moves[20].variations[0][2];
        model.goToMove(move);

        // when
        expectedMove = model.model.moves[20].variations[0][1];
        // then
        assertEquals(expectedMove.uid, model.getPreviousMoveInBranch(move).uid);

        // when
        move = model.model.moves[20].variations[0][0];
        // then
        assertNull(model.getPreviousMoveInBranch(move));
    },

    "test should be able to set comment before first move":function () {
        // given
        var model = this.getModelWithMoves();
        var move = { uid:model.model.moves[0].uid };

        // when
        model.setCommentBefore('My comment', move);
        var expectedComment = 'My comment';

        // then
        assertEquals(expectedComment, model.getCommentBefore(move));
    },

    "test should be able to create new model with metadata":function () {
        // given
        var model = new chess.model.Game({
            metadata:{
                white:'Carlsen, Magnus',
                black:'Aronian, Levon'
            },
            databaseId:1
        });

        // then
        assertEquals('Carlsen, Magnus', model.getMetadataValue('white'));
        assertEquals('Aronian, Levon', model.getMetadataValue('black'));
        assertEquals(1, model.getDatabaseId());
    },

    "test should set model dirty when creating new model":function () {
        // given
        var model = new chess.model.Game({
            metadata:{
                white:'Carlsen, Magnus',
                black:'Aronian, Levon'
            },
            databaseId:1
        });

        // then
        assertTrue(model.isDirty());

    },

    "test should set model clean when saving model":function () {
        // given
        var model = new chess.model.Game({
            metadata:{
                white:'Carlsen, Magnus',
                black:'Aronian, Levon'
            },
            databaseId:1
        });

        // when
        model.save();

        // then
        assertFalse(model.isDirty());

    },

    "test should set model dirty when modifying metadata":function () {
        // given
        var model = new chess.model.Game({
            metadata:{
                white:'Carlsen, Magnus',
                black:'Aronian, Levon'
            },
            databaseId:1
        });

        // when
        model.save();
        model.setMetadataValue('white', 'Kamsky');

        // then
        assertTrue(model.isDirty());
    },

    "test should set default fen for new games":function () {
        // given
        var model = new chess.model.Game({
            metadata:{
                white:'Carlsen, Magnus',
                black:'Aronian, Levon'
            },
            databaseId:1
        });

        // when
        var expectedFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

        // then
        assertEquals(expectedFen, model.getModel().metadata.fen);


    },
    "test should set model dirty when adding move":function () {
        // given
        var model = new chess.model.Game({
            metadata:{
                white:'Carlsen, Magnus',
                black:'Aronian, Levon'
            },
            databaseId:1
        });

        // when
        model.save();
        model.appendMove({
            from:'e2',
            to:'e4'
        });

        // then
        assertTrue(model.isDirty());

    },


    "test should set model dirty when modifying comment":function () {
        // given
        var model = this.getModelWithMoves();
        var secondMove = { uid:model.getMoves()[1].uid };
        var comment = 'This is my comment';

        // when
        model.setClean();
        model.setCommentBefore(comment, secondMove);

        // then
        assertTrue(model.isDirty());
    },

    "test should fire dirty event":function () {
        // given
        var model = this.getModelWithMoves();
        var secondMove = { uid:model.getMoves()[1].uid };
        var eventFired = false;

        // when
        model.addEvent('dirty', function () {
            eventFired = true
        });
        model.setClean();
        model.setCommentBefore('This is my comment', secondMove);

        // then
        assertTrue(eventFired);

    },

    "test should be able to move by notation":function () {
        var model = new chess.model.Game();

        // when
        model.appendMove('e4');

        // then
        assertEquals('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', model.getCurrentPosition());
    },

    "test should be able to determine draw by 3 fold repetition":function () {

        var moves = 'e4,d6,d4,g6,Nc3,Nf6,f4,Bg7,Nf3,c5,dxc5,Qa5,Bd3,Qxc5,Qe2,O-O,Be3,Qa5,O-O,Bg4,Rad1,Nc6,Bc4,Nh5,Bb3,Bxc3,bxc3,Qxc3,f5,Nf6,h3,Bxf3,Qxf3,Na5,Rd3,Qc7,Bh6,Nxb3,cxb3,Qc5+,Kh1,Qe5,Bxf8,Rxf8,Re3,Rc8,fxg6,hxg6,Qf4,Qxf4,Rxf4,Nd7,Rf2,Ne5,Kh2,Rc1,Ree2,Nc6,Rc2,Re1,Rfe2,Ra1,Kg3,Kg7,Rcd2,Rf1,Rf2,Re1,Rfe2,Rf1,Re3,a6,Rc3,Re1,Rc4,Rf1,Rdc2,Ra1,Rf2,Re1,Rfc2,g5,Rc1,Re2,R1c2,Re1,Rc1,Re2,R1c2'.split(/,/g);
        var model = new chess.model.Game();

        for (var i = 0; i < moves.length; i++) {
            model.appendMove(moves[i]);
        }

        assertTrue(model.canClaimDraw())

    },

    "test should be able to get all position fens":function () {

        var moves = 'e4,d6,d4,g6,Nc3,Nf6,f4,Bg7,Nf3,c5,dxc5,Qa5,Bd3,Qxc5,Qe2,O-O,Be3,Qa5,O-O,Bg4,Rad1,Nc6,Bc4,Nh5,Bb3,Bxc3,bxc3,Qxc3,f5,Nf6,h3,Bxf3,Qxf3,Na5,Rd3,Qc7,Bh6,Nxb3,cxb3,Qc5+,Kh1,Qe5,Bxf8,Rxf8,Re3,Rc8,fxg6,hxg6,Qf4,Qxf4,Rxf4,Nd7,Rf2,Ne5,Kh2,Rc1,Ree2,Nc6,Rc2,Re1,Rfe2,Ra1,Kg3,Kg7,Rcd2,Rf1,Rf2,Re1,Rfe2,Rf1,Re3,a6,Rc3,Re1,Rc4,Rf1,Rdc2,Ra1,Rf2,Re1,Rfc2,g5,Rc1,Re2,R1c2,Re1,Rc1,Re2,R1c2'.split(/,/g);
        var model = new chess.model.Game();

        for (var i = 0; i < moves.length; i++) {
            model.appendMove(moves[i]);
        }

        assertEquals(moves.length, model.getAllFens().length);
    },

    "test should be able to move back":function () {
        // given
        var model = this.getModelWithMoves();
        var expectedMove = model.getMoves()[3];
        var move = { uid:model.getMoves()[6].uid };
        model.goToMove(move);

        // when
        model.back(3);

        // then
        assertEquals(expectedMove.lm, model.getCurrentMove().lm);

    },

    "test should be able to move back in variations":function () {
        // gameWithVariations
        // given
        var model = this.getModelWithVariations();
        var move = model.getMoves()[20].variations[0][5];
        var expected = model.getMoves()[15];
        model.goToMove(move);

        // when
        model.back(10);

        // then
        assertEquals(expected, model.getCurrentMove());
    },

    "test should validate variations as correct move":function () {
        var game = {"metadata":{"setup":"1", "eventdate":"1938.11.??", "eventrounds":"14", "eventcountry":"NED", "source":"ChessBase", "sourcedate":"1997.11.17", "castle":1}, "event":"AVRO", "site":"Holland", "date":"1938.??.??", "round":"?", "white":"Botvinnik, Mikhail M", "black":"Capablanca, Jose Raul", "result":"1-0", "eco":"E49", "annotator":"Illescas Cordoba, Miguel", "fen":"8\/p3q1kp\/1p2Pnp1\/3pQ3\/2pP4\/1nP3N1\/1B4PP\/6K1 w - - 0 30", "plycount":"23", "moves":[
            {"m":"Ba3", "from":"b2", "to":"a3", "fen":"8\/p3q1kp\/1p2Pnp1\/3pQ3\/2pP4\/BnP3N1\/6PP\/6K1 b - - 1 30"},
            {"m":"Qxa3", "from":"e7", "to":"a3", "fen":"8\/p5kp\/1p2Pnp1\/3pQ3\/2pP4\/qnP3N1\/6PP\/6K1 w - - 0 31"},
            {"m":"Nh5+", "from":"g3", "to":"h5", "fen":"8\/p5kp\/1p2Pnp1\/3pQ2N\/2pP4\/qnP5\/6PP\/6K1 b - - 1 31"},
            {"m":"gxh5", "from":"g6", "to":"h5", "fen":"8\/p5kp\/1p2Pn2\/3pQ2p\/2pP4\/qnP5\/6PP\/6K1 w - - 0 32"},
            {"m":"Qg5+", "from":"e5", "to":"g5", "fen":"8\/p5kp\/1p2Pn2\/3p2Qp\/2pP4\/qnP5\/6PP\/6K1 b - - 1 32"},
            {"m":"Kf8", "from":"g7", "to":"f8", "fen":"5k2\/p6p\/1p2Pn2\/3p2Qp\/2pP4\/qnP5\/6PP\/6K1 w - - 2 33"},
            {"m":"Qxf6+", "from":"g5", "to":"f6", "fen":"5k2\/p6p\/1p2PQ2\/3p3p\/2pP4\/qnP5\/6PP\/6K1 b - - 0 33"},
            {"m":"Kg8", "from":"f8", "to":"g8", "fen":"6k1\/p6p\/1p2PQ2\/3p3p\/2pP4\/qnP5\/6PP\/6K1 w - - 1 34"},
            {"m":"e7", "variations":[
                [
                    {"m":"Qf7+", "from":"f6", "to":"f7", "fen":"6k1\/p4Q1p\/1p2P3\/3p3p\/2pP4\/qnP5\/6PP\/6K1 b - - 2 34"},
                    {"m":"Kh8", "from":"g8", "to":"h8", "fen":"7k\/p4Q1p\/1p2P3\/3p3p\/2pP4\/qnP5\/6PP\/6K1 w - - 3 35"},
                    {"m":"g3", "from":"g2", "to":"g3", "fen":"7k\/p4Q1p\/1p2P3\/3p3p\/2pP4\/qnP3P1\/7P\/6K1 b - - 0 35"},
                    {"m":"Nxd4", "from":"b3", "to":"d4", "fen":"7k\/p4Q1p\/1p2P3\/3p3p\/2pn4\/q1P3P1\/7P\/6K1 w - - 0 36"},
                    {"m":"e7", "from":"e6", "to":"e7", "fen":"7k\/p3PQ1p\/1p6\/3p3p\/2pn4\/q1P3P1\/7P\/6K1 b - - 0 36"},
                    {"m":"Qc1+", "from":"a3", "to":"c1", "fen":"7k\/p3PQ1p\/1p6\/3p3p\/2pn4\/2P3P1\/7P\/2q3K1 w - - 1 37"},
                    {"m":"Kg2", "from":"g1", "to":"g2", "fen":"7k\/p3PQ1p\/1p6\/3p3p\/2pn4\/2P3P1\/6KP\/2q5 b - - 2 37"},
                    {"m":"Qc2+", "from":"c1", "to":"c2", "fen":"7k\/p3PQ1p\/1p6\/3p3p\/2pn4\/2P3P1\/2q3KP\/8 w - - 3 38"},
                    {"m":"Kh3", "from":"g2", "to":"h3", "fen":"7k\/p3PQ1p\/1p6\/3p3p\/2pn4\/2P3PK\/2q4P\/8 b - - 4 38"}
                ]
            ], "from":"e6", "to":"e7", "fen":"6k1\/p3P2p\/1p3Q2\/3p3p\/2pP4\/qnP5\/6PP\/6K1 b - - 0 34"},
            {"m":"Qc1+", "from":"a3", "to":"c1", "fen":"6k1\/p3P2p\/1p3Q2\/3p3p\/2pP4\/1nP5\/6PP\/2q3K1 w - - 1 35"},
            {"m":"Kf2", "from":"g1", "to":"f2", "fen":"6k1\/p3P2p\/1p3Q2\/3p3p\/2pP4\/1nP5\/5KPP\/2q5 b - - 2 35"},
            {"m":"Qc2+", "from":"c1", "to":"c2", "fen":"6k1\/p3P2p\/1p3Q2\/3p3p\/2pP4\/1nP5\/2q2KPP\/8 w - - 3 36"},
            {"m":"Kg3", "from":"f2", "to":"g3", "fen":"6k1\/p3P2p\/1p3Q2\/3p3p\/2pP4\/1nP3K1\/2q3PP\/8 b - - 4 36"},
            {"m":"Qd3+", "from":"c2", "to":"d3", "fen":"6k1\/p3P2p\/1p3Q2\/3p3p\/2pP4\/1nPq2K1\/6PP\/8 w - - 5 37"},
            {"m":"Kh4", "from":"g3", "to":"h4", "fen":"6k1\/p3P2p\/1p3Q2\/3p3p\/2pP3K\/1nPq4\/6PP\/8 b - - 6 37"},
            {"m":"Qe4+", "from":"d3", "to":"e4", "fen":"6k1\/p3P2p\/1p3Q2\/3p3p\/2pPq2K\/1nP5\/6PP\/8 w - - 7 38"},
            {"m":"Kxh5", "from":"h4", "to":"h5", "fen":"6k1\/p3P2p\/1p3Q2\/3p3K\/2pPq3\/1nP5\/6PP\/8 b - - 0 38"},
            {"m":"Qe2+", "from":"e4", "to":"e2", "fen":"6k1\/p3P2p\/1p3Q2\/3p3K\/2pP4\/1nP5\/4q1PP\/8 w - - 1 39"},
            {"m":"Kh4", "from":"h5", "to":"h4", "fen":"6k1\/p3P2p\/1p3Q2\/3p4\/2pP3K\/1nP5\/4q1PP\/8 b - - 2 39"},
            {"m":"Qe4+", "from":"e2", "to":"e4", "fen":"6k1\/p3P2p\/1p3Q2\/3p4\/2pPq2K\/1nP5\/6PP\/8 w - - 3 40"},
            {"m":"g4", "from":"g2", "to":"g4", "fen":"6k1\/p3P2p\/1p3Q2\/3p4\/2pPq1PK\/1nP5\/7P\/8 b - g3 0 40"},
            {"m":"Qe1+", "from":"e4", "to":"e1", "fen":"6k1\/p3P2p\/1p3Q2\/3p4\/2pP2PK\/1nP5\/7P\/4q3 w - - 1 41"},
            {"m":"Kh5", "from":"h4", "to":"h5", "fen":"6k1\/p3P2p\/1p3Q2\/3p3K\/2pP2P1\/1nP5\/7P\/4q3 b - - 2 41"}
        ], "games":{"i":"14", "c":19}};
        var model = new chess.model.Game();
        model.populate(game);

        var move = model.getMoves()[7];
        model.goToMove(move);

        var correctMove = {
            from : 'f6', to:'f7'
        };

        assertEquals(10, model.getAllNextMoves(model.getCurrentMove()).length);
        assertTrue(model.tryNextMove(correctMove));

        console.log(model.getCurrentMove().from)


    }


});