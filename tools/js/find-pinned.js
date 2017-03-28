/**
 * Created by alfmagne1 on 05/03/2017.
 */

chess.FindPinned = new Class({

    Extends: chess.view.Chess,
    controller: undefined,

    pgn: undefined,
    out: undefined,
    index: 0,
    parser: undefined,
    minPinned: 2,
    movesToParse: undefined,

    lastLoadedGame: undefined,

    pgns:undefined,

    currentModel:undefined,

    white:undefined,
    black:undefined,

    __construct: function (config) {
        this.parent(config);

        if (config.append != undefined)this.append = config.append;

        if(config.pgns != undefined){
            this.pgns = config.pgns;
            this.pgn = this.pgns[0];
        }else{
            this.pgn = config.pgn;

        }
        this.out = config.out;

        this.parser = new chess.parser.FenParser0x88();

        if (!this.append) {
            this.createPgn();
        }

    },

    createPgn: function () {
        $.ajax(
            {
                url: 'controller.php',
                method: 'post',
                data: {
                    pgn: this.out,
                    initialize: true
                }
            }
        )
    },

    __rendered: function () {
        this.parent();
        this.controller = new chess.controller.Controller({
            pgn: this.pgn,
            listeners: {
                loadGame: this.onGameLoaded.bind(this)
            }
        });

        this.controller.loadGameFromFile(this.index);
    },

    __children: function () {
        return [{
            type: 'chess.view.board.Board',
            layout: {
                type: 'fill',
                width: 'matchParent',
                height: 'matchParent'
            }

        }];
    },

    onGameLoaded: function () {

        this.movesToParse = this.controller.currentModel.getMoves();

        this.white = this.controller.currentModel.getMetadataValue('white');
        this.black = this.controller.currentModel.getMetadataValue('black');

        var lastFen = this.movesToParse[this.movesToParse.length-1].fen;

        if (lastFen == this.lastLoadedGame){
            console.log('finished');

            if(this.pgns){
                var index = this.pgns.indexOf(this.pgn);
                if(index < this.pgns.length - 1){
                    this.pgn = this.pgns[index+1];
                    this.controller.pgn = this.pgn;
                    this.index = 0;
                    this.controller.loadGameFromFile(++this.index);
                }
            }
            return;
        }
        console.log(lastFen, this.lastLoadedGame);

        this.lastLoadedGame = lastFen;

        var pinnedArray = [];
        for (var i = this.movesToParse.length - 1; i >= 0; i--) {
            var m = this.movesToParse[i];
            this.parser.setFen(m.fen);

            var color = this.parser.getColor();
            var colorToCheck = color == 'white' ? 'black' : 'white';
            var pinned = this.parser.getPinnedReadable(colorToCheck);
            if (pinned.length > 0 && m.m.indexOf('#') == -1) {
                pinnedArray.push({
                    ply: i,
                    color: colorToCheck,
                    fen: m.fen,
                    pinned: pinned
                });
            }

        }
        pinnedArray.sort(function (a, b) {
            if (a.pinned.length == b.pinned.length) return a.ply > b.ply ? -1 : 1;
            return a.pinned.length > b.pinned.length ? -1 : 1;
        });


        if (pinnedArray.length && pinnedArray[0].pinned.length >= this.minPinned) {
            this.controller.currentModel.setPosition(pinnedArray[0].fen);
            this.saveGame(pinnedArray[0]);
        } else {
            this.loadNext.delay(200, this);
        }
    },

    saveGame: function (pinned) {
        var squares = [];
        jQuery.each(pinned.pinned, function(i,obj){
            squares.push(obj.pinned)
        }.bind(this));

        var obj = {
            white :  this.white,
            black :  this.black,
            site: 'Find ' + pinned.pinned.length + ' pinned pieces',
            pgn: this.pgn,
            color: pinned.color,
            index: this.index,
            fen: pinned.fen,
            count: pinned.pinned.length,
            pinned: squares.join(',')
        };

        $.ajax({
            url: "controller.php",
            method: "post",
            data: {
                pgn: this.out,
                game: obj,
                append: true
            },

            success: function () {
                new ludo.Notification({
                    duration: 1.5,
                    html: 'Game #' + (this.index + 1) + ' saved'
                });
                this.loadNext.delay(2000, this);
            }.bind(this)
        });

    },

    loadNext: function () {
        this.controller.loadGameFromFile(++this.index);
    }
});
