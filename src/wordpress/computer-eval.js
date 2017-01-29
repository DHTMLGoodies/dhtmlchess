chess.wordpress.ComputerEval = new Class({

    Extends: ludo.View,
    sumodule: 'wordpress.computereval',
    started:false,
    layout:{
        type:'linear', orientation: 'vertical'
    },

    __children:function(){
        return [
            {
                name:'scoreBar',
                css:{
                    'margin': 5
                },
                type:'chess.view.score.Bar',
                layout:{
                    height:60
                },
                borderRadius:5,
                blackColor:'#444444',
                whiteColor:'#EEEEEE',
                markerColor:'#B71C1C',
                markerTextColor:'#FFF',
                stroke:'#222222',
                range:3
            },
            {
                name:'eval',
                layout:{
                    weight:1
                }
            },
            {
                name:'startStopEngine',
                value:'Start',
                type:'form.Button',
                layout:{
                    height:30
                }
            },
            {
                layout:{
                    height:20
                },
                css:{
                    'text-align' : 'right',
                    'font-style' : 'italic',
                    'font-size' : '0.9em',
                    'padding-right' : '4px'
                },
                html: '<a href="https://github.com/glinscott/Garbochess-JS" onclick="var w = window.open(this.href); return false">' + chess.getPhrase('GarboChess Javascript Engine') + '</a>'
            }
        ]
    },

    setController:function(controller){
        this.parent(controller);
        controller.on('engineupdate', this.receiveEngineUpdate.bind(this));
        controller.on('fen', this.onPositionUpdate.bind(this));
       // controller.on('nextmove', this.onNextMove.bind(this));
    },

    receiveEngineUpdate:function(move){

        if(move == 'Checkmate'){
            this.child['eval'].html('Checkmate');
            this.stopEngine();
            return;
        }

        var s = move.replace(/.*?Score:([\-0-9]+?)[^0-9].*/g, '$1');
        var c = this.controller.getCurrentModel().getColorToMove();
        if(c  == 'black') s*=-1;

        var s2 = (s/1000);
        if(s2 > 100)s2 = 100;
        if(s2 < -100)s2 = -100;
        s2 = s2.toFixed(2);

        // Ply:9 Score:3142 Nodes:341415 NPS:418914  Nxe5 Bf1 d5 d4 Nc6 e5 Bb4+ c3 Bg4 Be2
        var ply = move.replace(/Ply:([0-9]{1,2})[^0-9].*/g, '$1');
        var nps = move.replace(/.*NPS\:([0-9]+?)[^0-9].+/g, '$1');
        var m = move.replace(/.*NPS\:[0-9]+?[^0-9](.+)/g, '$1');
        this.child['eval'].html('Depth: ' + ply + '<br>Nodes/s: ' + nps + '<br><strong>' + s2 + '</strong>' + m);
        this.child['scoreBar'].setScore((s/1000));

        if((Math.abs(s) / 1000) > 1900 ){
            this.controller.sendMessage(chess.getPhrase('Engine stopped'));
            this.stopEngine();
        }
        
    },

    __rendered:function(){
        this.parent();
        this.on('hide', this.stopEngine.bind(this));

        this.child['startStopEngine'].on('click', this.toggleEngine.bind(this));
    },

    onNextMove:function(model, m){
        console.log(arguments);

        if(this.started &&  m.from){
            var c = this.controller;

            console.log(m);

            var from = this.getXY(m.from);
            var to = this.getXY(m.to);

            var moves = GenerateValidMoves();

            var move = null;
            for (var i = 0; i < moves.length; i++) {
                if ((moves[i] & 0xFF) == MakeSquare(from.y, from.x) &&
                    ((moves[i] >> 8) & 0xFF) == MakeSquare(to.y, to.x)) {
                    move = moves[i];
                }
            }

            console.log(move);

            if (move != null) {
                c.engine.postMessage(FormatMove(move));
                MakeMove(move);
                c.searchAndRedraw.delay(20, c);
            }


        }
    },
    files: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    getXY: function (square) {
        var move = square
        move = move.replace(/[^a-z0-9]/g, '');
        var file = this.files.indexOf(move.substr(move.length - 2, 1));
        var rank = move.substr(move.length - 1, 1) - 1;
        return {
            x: file,
            y: 7 - rank
        }
    },

    onPositionUpdate:function(model, fen){
        if(this.started){
            var c = this.controller;
            c.ensureAnalysisStopped();
            c.initializeBackgroundEngine();

            c.engine.postMessage("position " + fen);
            c.engine.postMessage("analyze");


        }
    },

    toggleEngine:function(){
        if(this.started){
            this.stopEngine();
        }else{
            this.startEngine();
        }
    },

    stopEngine:function(){
        if(!this.started)return;

        this.controller.stopEngine();
        this.started = false;
        this.child['startStopEngine'].val('Start');
        this.controller.sendMessage(chess.getPhrase('Engine stopped'))
    },

    startEngine:function(){
        this.controller.startEngine();
        this.started = true;
        this.child['startStopEngine'].val('Stop');
    }

});