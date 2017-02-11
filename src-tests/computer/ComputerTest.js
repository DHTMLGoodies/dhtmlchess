TestCase("ComputerTest", {
    

    setUp:function(){
        ludo.getLocalStorage().empty();
        var elo = new chess.computer.Elo();
        elo.clearAll();

        this.clock = sinon.useFakeTimers();

    },

    "test should set initial elo": function(){
        var obj = new chess.computer.Elo();
        // when
        var elo = obj.getElo('blitz');
        // then
        assertEquals(1200, elo);
    },

    "tests should increment games played when adding result": function(){
        var elo = new chess.computer.Elo();
        
        // when
        elo.saveResult(0,1200,"blitz", "white");
        elo.saveResult(0,1300,"blitz", "white");
        elo.saveResult(0,1400,"bullet", "white");

        // then
        assertEquals(2, elo.countGames('blitz'));
        assertEquals(1, elo.countGames('bullet'));
    },


    "test should set provisional rating": function(){
        var elo = new chess.computer.Elo();

        // when
        elo.saveResult(1, 1200, "blitz", "white");
        // then
        assertEquals(1600, elo.getElo('blitz'));

        // when
        elo.saveResult(-1, 1300, "blitz", "white");
        // then
        assertEquals((1200+400+1300-400)/2, elo.getElo('blitz'));
    },

    "test should set real rating": function(){
        // given
        var elo = new chess.computer.Elo();
        elo.saveResult(1, 1200, "blitz", "white");
        elo.saveResult(1, 1200, "blitz", "white");
        elo.saveResult(1, 1200, "blitz", "white");
        elo.saveResult(1, 1200, "blitz", "white");
        elo.saveResult(1, 1200, "blitz", "white");
        elo.saveResult(1, 1200, "blitz", "white");
        elo.saveResult(1, 1200, "blitz", "white");
        elo.saveResult(1, 1200, "blitz", "white");

        // then
        assertEquals(1600, elo.getElo('blitz'));

        // when
        elo.saveResult(1, 1600, 'blitz', 'white');

        // then
        assertEquals(1612, Math.round(elo.getElo('blitz')));
    },


    "test should set real rating for black": function(){
        // given
        var elo = new chess.computer.Elo();
        elo.saveResult(1, 1200, "blitz", "white");
        elo.saveResult(1, 1200, "blitz", "white");
        elo.saveResult(1, 1200, "blitz", "white");
        elo.saveResult(1, 1200, "blitz", "white");
        elo.saveResult(1, 1200, "blitz", "white");
        elo.saveResult(1, 1200, "blitz", "white");
        elo.saveResult(1, 1200, "blitz", "white");
        elo.saveResult(1, 1200, "blitz", "white");

        // then
        assertEquals(1600, elo.getElo('blitz'));

        // when
        elo.saveResult(0, 1600, 'blitz', 'white');

        // then
        assertEquals(1582, Math.round(elo.getElo('blitz')));
    },



    "test should get game type by time": function(){
        var expected = [
            [60,0, "bullet"],
            [120,0, "bullet"],
            [179,0, "bullet"],
            [180,0, "blitz"],
            [120,2, "blitz"],
            [120,12, "blitz"],
            [300,5, "blitz"],
            [300,5, "blitz"],
            [8 * 60,2, "classical"],
            [15 * 60,0, "classical"]
        ];
        // given
        var elo = new chess.computer.Elo();

        jQuery.each(expected, function(i, entry){

            var type = entry[2];
            var s = entry[0];
            var inc = entry[1];

            assertEquals(JSON.stringify(entry), type,  elo.getGameType(s,inc));
        });

    },

    "test should have clock": function(){

        // given
        var clock = new chess.computer.Clock();
        clock.setTime(60, 0);

        clock.start();

        this.clock.tick(1000);

        // when
        var time = clock.getTime('white');

        // then
        assertEquals(59*1000, time);
    },

    "test should able to click clock": function(){
        var clock = new chess.computer.Clock();
        clock.setTime(60, 0);

        clock.start();
        this.clock.tick(1000);
        clock.tap();
        this.clock.tick(2000);

        // then
        assertEquals(59*1000, clock.getTime('white'));
        assertEquals(58*1000, clock.getTime('black'));
    },

    "test should handle increments": function(){
        var clock = new chess.computer.Clock();
        clock.setTime(60, 2);
        clock.start();

        this.clock.tick(3000); // w-1s
        clock.tap();
        this.clock.tick(5000); // b-3s
        clock.tap();
        this.clock.tick(7000); // w-5
        clock.tap();
        this.clock.tick(10000); // b-8
        clock.tap();

        assertEquals(54 * 1000, clock.getTime('white'));
        assertEquals(49 * 1000, clock.getTime('black'));

    },

    "test clock should fire change event on tap": function(){
        // given
        var clock = new chess.computer.Clock();
        var fired = false;
        clock.on('change', function(){
            fired = true;
        });

        // when
        clock.setTime(60, 2);
        clock.start();
        assertTrue(fired);

        fired = false;
        this.clock.tick(1000);
        clock.tap();

        // then
        assertTrue(fired);
    },

    "test should get time as object with hours, minutes, seconds and 1/100 s": function(){
        // given
        var clock = new chess.computer.Clock();
        clock.start((60 * 90) + 5 + 0.450, 15);

        // when
        var t = clock.timeAsObject('white');

        // then
        assertEquals('1', t.h);
        assertEquals('30', t.m);
        assertEquals('05', t.s);
        assertUndefined(t.d);

        // given
        clock.setTime(9.4, 15);
        // when
        t = clock.timeAsObject('white');
        // then
        assertEquals('0', t.h);
        assertEquals('00', t.m);
        assertEquals('09', t.s);
        assertEquals('4', t.d);
        assertEquals(9.4, t.totalSeconds);

    },
   
    "test should fire end event when time is up": function(){
        
        
    },

    "test should be able to call stop": function(){

        var clock = new chess.computer.Clock();
        clock.setTime(60, 2);
        clock.start();

        this.clock.tick(3000); // w-1s
        clock.tap();
        this.clock.tick(5000); // b-3s
        clock.tap();
        this.clock.tick(7000); // w-5
        clock.tap();
        this.clock.tick(10000); // b-8
        clock.tap();

        assertEquals(54 * 1000, clock.getTime('white'));
        assertEquals(49 * 1000, clock.getTime('black'));

        clock.stop();

        this.clock.tick(10000);

        assertEquals(54 * 1000, clock.getTime('white'));
        assertEquals(49 * 1000, clock.getTime('black'));

    },

    "test should stop automatically": function(){
        var clock = new chess.computer.Clock();
        clock.setTime(60, 0);
        clock.start();

        this.clock.tick(13000); // w-13s
        clock.tap();
        this.clock.tick(5000); // b-3s
        clock.tap();
        this.clock.tick(7000); // w-7
        clock.tap();
        this.clock.tick(10000); // b-8
        clock.tap();
        this.clock.tick(53000); // w-53

        clock.validateTime();


        assertEquals(0, clock.getTime('white'));


    }




});