chess.FindLine = new Class({

    Extends: Events,
    controller:undefined,
    fen:undefined,
    firstMove:undefined,
    
    active:false,

    finishedFn:undefined,
    s: undefined,

    timeout:1200,

    parser:undefined,

    color:undefined,

    initialize:function(config){
        this.controller = config.controller;

        this.addEvents(config.listeners);
        this.checkTimeout();
        this.finishedFn = this.receiveUpdate.bind(this);

        this.parser = new chess.parser.FenParser0x88();

        this.controller.on('engineupdate', this.finishedFn);
    },

    checkTimeout:function(){
        if(this.active){
            var elapsed = new Date().getTime() - this.s;
            if(elapsed > this.timeout){
                this.active = false;
                this.controller.stopEngine();
                this.fireEvent('abort');
               // this.controller.removeEvent('engineupdate', this.finishedFn);
            }
        }
        this.checkTimeout.delay(20, this);
    },
    
    findLine:function(fen, firstMove, timeout, color){

        this.timeout = timeout || this.timeout;
        this.color = color;


        this.s = new Date().getTime();
        this.active = true;

        this.fen = fen;

        this.parser.setFen(fen);
        this.parser.move(firstMove);
        this.firstMove = firstMove ;
        this.moves = [this.parser.getNotation()];



        this.controller.setPosition(fen);
        this.controller.currentModel.appendRemoteMove(firstMove);
        this.controller.startEngine();
        this.s = new Date().getTime();

    },

    receiveUpdate:function(move){


        if(!this.active)return;



        var s = move.replace(/.*?Score:([\-0-9]+?)[^0-9].*/g, '$1');
        var c = this.controller.currentModel.getColorToMove();
        var score = (s / 1000);
        if (!isNaN(score) && c == 'black')score *= -1;

        var best = move.replace(/^.*?NPS:[0-9]+?[^0-9](.*)$/g, '$1').trim();
        var moves = best.split(/\s/g);

        var current = moves[0];

        var cm = (this.color == 'white' && score >= 100) || (this.color == 'black' && score < -100);
        if(cm){

            this.controller.stopEngine();

            this.s = new Date().getTime();

            this.controller.currentModel.appendRemoteMove(current);

            this.moves.push(current);
            if(current.indexOf('#') > 0){
             //   this.controller.removeEvent('engineupdate', this.finishedFn);
                this.active = false;
                console.log('Found line ', this.moves);
                this.fireEvent('finished', [this.moves]);

            }else{
                this.controller.startEngine();

            }
        }else{
            this.controller.startEngine();
        }
    }
});