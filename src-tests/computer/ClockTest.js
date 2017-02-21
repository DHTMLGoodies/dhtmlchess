TestCase("ClockTest", {

 

    "test should parse time quickly": function(){

        var clock = new chess.computer.Clock();
        clock.start((60 * 90) + 5 + 0.450, 15);

        var s = new Date().getTime();
        for(var i=0;i<100000;i++){
            clock.timeAsObject('white');
        }
        var elapsed = new Date().getTime() - s;

        clock.start((60 * 90) + 5 + 0.450, 15);
        s = new Date().getTime();
        for(var i=0;i<100000;i++){
            clock.timeAsObject2('white');
        }
        var elapsed2 = new Date().getTime() - s;

        console.log(elapsed + 'vs' + elapsed2);

        assertEquals(elapsed + ' vs new ' + elapsed2, elapsed, elapsed2);

    }

});