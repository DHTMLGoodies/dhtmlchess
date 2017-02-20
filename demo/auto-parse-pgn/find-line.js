chess.FindLine = new Class({

    Extends: Events,
    controller: undefined,
    fen: undefined,
    firstMove: undefined,

    active: false,

    finishedFn: undefined,
    s: undefined,

    timeout: 2000,

    parser: undefined,

    color: undefined,

    parentCmp: undefined,

    initialize: function (config) {
        this.controller = config.controller;

        this.addEvents(config.listeners);
        this.checkTimeout();
        this.finishedFn = this.receiveUpdate.bind(this);
        this.parentCmp = config.parentCmp;

        this.parser = new chess.parser.FenParser0x88();

        this.controller.on('engineupdate', this.finishedFn);
    },

    checkTimeout: function () {
        if (this.active) {
            var elapsed = new Date().getTime() - this.s;
            if (elapsed > this.timeout) {

                this.active = false;
                this.controller.stopEngine();
                if(this.moves.length > 1){
                    this.onFinished.delay(300, this);
                }else{
                   this.fireEvent('abort');
                }
                // this.controller.removeEvent('engineupdate', this.finishedFn);
            }
        }
        this.checkTimeout.delay(20, this);
    },

    findLine: function (fen, firstMove, timeout, color, countMoves) {
        

        this.timeout = timeout || this.timeout;
        
        this.color = color;


        this.s = new Date().getTime();


        this.fen = fen;

        this.parser.setFen(fen);
        this.parser.move(firstMove);
        this.firstMove = firstMove;
        this.firstMoveNotation = this.parser.getNotation();



        this.moves = [this.parser.getNotation()];

        this.controller.setPosition(this.parser.getFen());
        this.controller.currentModel.setPosition(this.parser.getFen());


        this.startSearching.delay(200, this);

    },

    startSearching:function(){
        this.startEngine();
        this.s = new Date().getTime();
        this.active = true;
    },

    startEngine: function () {
        this.controller.startEngine();
    },

    receiveUpdate: function (move) {


        if (!this.active)return;

        var cm = (this.color == 'white' && move.mate != 0 && move.mate >0) || (this.color == 'black' && move.mate != 0 && move.mate < 0);
        if (cm) {
            var moves = this.getParsedMoves(move.bestMoves);

            this.controller.stopEngine();
            this.s = new Date().getTime();
            this.moves = moves;

            this.s = new Date().getTime();

            if (move.mate) {
                //   this.controller.removeEvent('engineupdate', this.finishedFn);
                // this.active = false;
                //this.onFinished.delay(300, this);
            }
        }
    },

    onFinished:function(){
        this.fireEvent('finished', [this.moves]);
    },

    getParsedMoves:function(moves){

        var moveString = moves;
        var ret = [];
        ret.push(this.moves[0]);
        moves = moves.split(/\s/g);

        var map = {q: 'queen', n: 'knight', 'b': 'bishop', 'rook': 'rook'};

        for(var i=0;i<moves.length;i++){
            var m = moves[i];
            var f = m.substr(0,2);
            var t = m.substr(2,2);
            var promoteTo= undefined;
            if(m.length > 4)promoteTo = map[m.substr(4,1)];

            var theMove = {
                from:f, to:t, promoteTo:promoteTo
            };

            this.parser.move(theMove);

            ret.push(this.parser.getNotation());
        }

        if(moveString.indexOf('#') == -1){
            var checkmates = this.parser.getAllCheckmateMoves();
            var lm;

            jQuery.each(checkmates, function (i, checkmate) {
                if (!lm) {
                    lm = checkmates.length == 1 ? checkmate : {
                        move: checkmate,
                        variations: []
                    };
                } else {
                    lm.variations.push(checkmate);
                }
            }.bind(this));

            if (lm) {
                ret.push(lm);
            }

        }

        return ret;


    }

    /*
     receiveUpdate:function(move){


     if(!this.active)return;

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
     */
});