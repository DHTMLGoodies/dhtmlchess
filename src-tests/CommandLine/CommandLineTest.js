TestCase("CommandLine",{
	"test should be able to create command line": function(){
		new chess.view.command.Line();
	},

	"test should be able to create controller automatically": function(){
		// given
		var l = new chess.view.command.Line();

		// then
		assertNotUndefined(l.controller);
	},

	"test should assign same controller to panel and line": function(){
		// given
		var l = new chess.view.command.Line();
		var p = new chess.view.command.Panel();

		// then
		assertEquals(l.controller, p.controller);
	},

	"test should parse commands sent to controller": function(){
		// given
		var c = new chess.view.command.Controller();

		// then
		assertEquals('help', c.getValidCommand('help me'));
		assertEquals('move', c.getValidCommand('move e4'));
	},

	"test should parse command arguments": function(){
		// given
		var c = new chess.view.command.Controller();

		// then
		assertEquals('e4', c.getCommandArguments('move', 'move e4'));
		assertEquals('e4', c.getCommandArguments('move', 'e4'));
		assertEquals('Nf3', c.getCommandArguments('move', 'nf3'));
		assertEquals('6k1/8/6p1/8/8/1P6/2b5/5K2 w - - 0 1', c.getCommandArguments('fen', 'fen 6k1/8/6p1/8/8/1P6/2b5/5K2 w - - 0 1'));

	},

	"test should parse chess moves": function(){
		// given
		var c = new chess.view.command.Controller();

		// then
		assertTrue(c.isChessMove('e4'));
		assertTrue(c.isChessMove('Nf3'));
		assertTrue(c.isChessMove('nf3'));
		assertTrue(c.isChessMove('oo'));
		assertFalse(c.isChessMove('Inv'));
	},

	"test should find grade moves": function(){
        // given
        var c = new chess.view.command.Controller();

        // when
        var cmd = 'grade !';
        // then
        assertEquals('grade', c.getValidCommand(cmd));
        assertEquals('!', c.getCommandArguments('grade', cmd));
	}
});