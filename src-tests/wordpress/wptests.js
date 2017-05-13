TestCase("WPTest", {


    parsed: function (content) {

        if (!content)return undefined;

        var pFen = /^\[fen.*?\[\/fen\]$/;
        if (pFen.test(content)) {
            return this.getFenContent(content);
        }

        var pPgn = /^\[pgn[\s\S]+\[\/pgn]$/g;
        if (pPgn.test(content)) {
            return this.getPgnContent(content);
        }

        var pChess = /^\[chess.*?\]$/;
        if (pChess.test(content)) {
            return this.getChessContent(content);
        }

        return undefined;
    },

    getFenContent: function (content) {
        return {
            code: 'fen',
            attr: this.attributes(content),
            content: this.content(content)
        }
    },
    getPgnContent: function (content) {
        return {
            code: 'pgn',
            attr: this.attributes(content),
            content: this.content(content)
        }
    },

    getChessContent: function (content) {
        return {
            code: 'chess',
            attr: this.attributes(content),
            content: ""
        }

    },

    content: function (content) {
        var pattern = /\[.+?\]([^\[]+?)\[/;
        return content.match(pattern)[1];
    },

    attributes: function (content) {
        var p = /[a-z_]+?=.+?[\s\]]/gi;

        var ret = {};

        var matches = content.match(p);

        matches.forEach(function (match) {
            try {
                var key = match.match(/([a-z_]+?)=.+?[\s\]]/i)[1];
                var val = match.match(/[a-z_]+?=(.+?)[\s\]]/i)[1];
                val = val.replace(/["']/g, "");
                ret[key] = val;
            } catch (e) {

            }
        });


        return ret;
    },

    "test should get fen content": function () {
        // given
        var content = '[pgn theme="custom" sound=1]\n[Event "Immortal game"]\n[Site "London"]\n[Date "1851.??.??"]\n[Round "?"]\n[White "Anderssen,A"]\n[Black "Kieseritzky,L"]\n'
            + '[Result "1-0"]\n'
            + '1.e4 e5 2.f4 exf4 3.Bc4 Qh4+ 4.Kf1 b5 5.Bxb5 Nf6 6.Nf3 Qh6 7.d3 Nh5 8.Nh4 Qg5 9.Nf5 c6 10.g4 Nf6 '
            + '11.Rg1 cxb5 12.h4 Qg6 13.h5 Qg5 14.Qf3 Ng8 15.Bxf4 Qf6 16.Nc3 Bc5 17.Nd5 Qxb2 18.Bd6 Qxa1+ 19.Ke2 Bxg1 20.e5 Na6 21.Nxg7+ Kd8 22.Qf6+ Nxf6 23.Be7+ 1-0\n'
            + '[/pgn]';

        // when
        var parsed = this.parsed(content);

        // then
        assertEquals('pgn', parsed.code);
        assertEquals("custom", parsed.attr.theme);
        assertEquals("1", parsed.attr.sound);

    },

    "test should find fen content": function () {
        // given
        var content = '[fen theme="wood4" width="500" float="left"]6k1/5ppp/8/8/8/8/5PPP/3R2K1 w KQkq - 0 0[/fen]';

        // when
        var parsed = this.parsed(content);

        // then
        assertEquals('fen', parsed.code);
        assertEquals("wood4", parsed.attr.theme);
        assertEquals("6k1/5ppp/8/8/8/8/5PPP/3R2K1 w KQkq - 0 0", parsed.content);
    },

    "test should find chess content": function () {
        // given
        var content = '[chess game=1 theme="light-grey"]';

        // when
        var parsed = this.parsed(content);

        // then
        assertEquals("Wrong code", 'chess', parsed.code);
        assertEquals("Wrong theme", "light-grey", parsed.attr.theme);
        assertEquals("game was wrong", 1, parsed.attr.game);
    },

    "test should not return anything when selected is not a tag": function () {

        var contents = [
            'fen theme="wood4" width="500" float="left"]6k1/5ppp/8/8/8/8/5PPP/3R2K1 w KQkq - 0 0[/fen]',
            '[fen theme="wood4" width="500" float="left"]6k1/5ppp/8/8/8/8/5PPP/3R2K1 w KQkq - 0 0[/fen',
            'aa[pgn theme="wood4" width="500" float="left"]content[/pgn]',
            '[pgn theme="wood4" width="500" float="left"]content[/pgn] end',
            '[chess game="2"',

        ];

        contents.forEach(function (content) {
            assertUndefined(this.parsed(content));
        }.bind(this));
    }


});