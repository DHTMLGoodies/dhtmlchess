TestCase("UndoRedo", {

    defaultFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',

    "test should set initial values": function(){
        // given
        var model = new chess.model.Game();
        var ur = new chess.wordpress.UndoRedo(model);

        // then
        assertFalse(ur.hasRedo());
        assertFalse(ur.hasUndo());
    },


    "test should automatically add model to stack on change": function() {
        // given
        var model = new chess.model.Game();
        var ur = new chess.wordpress.UndoRedo(model);

        // when
        model.appendLine('e2e4 e7e5');

        // then
        assertTrue(ur.hasUndo());
        assertFalse(ur.hasRedo());
    },

    "test should be able to undo": function(){
        // given
        var model = new chess.model.Game();
        var ur = new chess.wordpress.UndoRedo(model);

        // when
        model.appendLine('e2e4 e7e5');

        assertEquals(2, ur.len());

        var m = ur.undo();
        assertNotUndefined(m);
        model.populate(m.model);

        // then
        assertEquals(this.defaultFen, model.fen());
    },
    
    "test should be able to work on simple objects": function(){
        var ur = new chess.wordpress.UndoRedo("A");
        
        ur.add("b");
        ur.add("c");
        ur.add("d");
        ur.add("e");
        ur.add("f");

        assertEquals(6, ur.len());
        assertEquals('e', ur.undo());
        assertEquals('d', ur.undo());
        assertEquals('c', ur.undo());
        assertEquals('b', ur.undo());
        assertEquals('A', ur.undo());
        assertEquals('b', ur.redo());
        assertEquals('c', ur.redo());
        assertEquals('d', ur.redo());
        assertEquals('e', ur.redo());
        assertEquals('f', ur.redo());
        
    },
    
    "test should cut stack when adding in middle": function(){

        var ur = new chess.wordpress.UndoRedo("A");

        ur.add("b");
        ur.add("c");
        ur.add("d");
        ur.add("e");
        ur.add("f");

        assertEquals('e', ur.undo());
        assertEquals('d', ur.undo());
        
        ur.add('alf');
        
        var val = ur.stack.join('');

        assertEquals('Abcdalf', val);
        

    },
    
    "test should be able to set max stack size": function(){
        var ur = new chess.wordpress.UndoRedo("0");
        for(var i=1;i<=100;i++){
            ur.add(''+ i);
        }

        // then
        assertEquals('51', ur.stack[0]);
        
    }



});