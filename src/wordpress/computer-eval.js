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

        if((Math.abs(s) / 1000) > 1900 )this.stopEngine();
        
    },

    __rendered:function(){
        this.parent();
        this.on('hide', this.stopEngine.bind(this));

        this.child['startStopEngine'].on('click', this.toggleEngine.bind(this));
    },

    toggleEngine:function(){
        if(this.started){
            this.stopEngine();
        }else{
            this.startEngine();
        }
    },

    stopEngine:function(){
        this.controller.stopEngine();
        this.started = false;
        this.child['startStopEngine'].val('Start');
    },

    startEngine:function(){
        this.controller.startEngine();
        this.started = true;
        this.child['startStopEngine'].val('Stop');
    }

});