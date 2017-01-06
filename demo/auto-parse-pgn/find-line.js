chess.FindLine = new Class({

    Extends: Events,
    controller:undefined,
    fen:undefined,
    firstMove:undefined,
    
    active:false,

    finishedFn:undefined,
    s: undefined,

    timeout:500,

    initialize:function(config){
        this.controller = config.controller;
        this.finishedFn = this.receiveUpdate.bind(this);
        this.addEvents(config.listeners);
        this.checkTimeout();
    },

    checkTimeout:function(){
        if(this.active){
            var elapsed = new Date().getTime() - this.s;
            if(elapsed > this.timeout){
                console.log('aborted');
                this.active = false;
                this.controller.stopEngine();
                this.fireEvent('abort');
                this.controller.removeEvent('engineupdate', this.finishedFn);
            }
        }
        this.checkTimeout.delay(100, this);
    },
    
    findLine:function(fen, firstMove, timeout){

        this.timeout = timeout || 500;

        this.s = new Date().getTime();
        this.active = true;
        this.moves = [firstMove];
        this.fen = fen;
        this.firstMove = firstMove;

        this.controller.on('engineupdate', this.finishedFn);
        this.controller.setPosition(fen);
        this.controller.currentModel.appendRemoteMove(firstMove);
        this.controller.startEngine();
        console.log("searching for line ", fen, firstMove);
        
    },

    receiveUpdate:function(move){
        console.log(move);

        var s = move.replace(/.*?Score:([\-0-9]+?)[^0-9].*/g, '$1');
        var c = this.controller.currentModel.getColorToMove();
        var score = (s / 1000);
        if (!isNaN(score) && c == 'black')score *= -1;

        this.controller.stopEngine();

        var best = move.replace(/^.*?NPS:[0-9]+?[^0-9](.*)$/g, '$1').trim();
        var moves = best.split(/\s/g);

        var current = moves[0];

        if(Math.abs(score) > 100){

            this.s = new Date().getTime();

            this.controller.currentModel.appendRemoteMove(current);

            this.moves.push(current);
            if(current.indexOf('#') > 0){
                this.controller.removeEvent('engineupdate', this.finishedFn);
                this.active = false;
                this.fireEvent('finished', [this.moves]);
            }else{
                this.controller.startEngine();

            }
        }else{
            this.controller.startEngine();
        }
    }
});