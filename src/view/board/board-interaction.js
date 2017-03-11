chess.view.board.BoardInteraction = new Class({

    Extends: Events,
    flipped:false,
    board:undefined,
    surface:undefined,

    size:undefined,

    initialize:function(config){
        this.board = config.board;
        this.surface = jQuery('<div style="z-index:12002;position:absolute;left:0;top:0;width:100%;height:100%"></div>');
        this.board.els.board.append(this.surface);

        this.enable();

        this.resize();
        this.board.on('resize', this.resize.bind(this));
        this.surface.on('click', this.onClick.bind(this));
    },

    resize:function(){
        this.size = this.board.els.board.width();
    },

    enable:function(){
        this.surface.css('z-index', 200);
    },

    disable:function(){
        this.surface.css('z-index', 1);
    },

    onClick:function(e){
        var square = this.getSquare(e);
        this.fireEvent('click', square);
    },

    getSquare:function(e){

        var offset = this.surface.offset();

        var mouseX = e.pageX - offset.left;
        var mouseY = e.pageY - offset.top;

        var x = Math.floor(mouseX / this.size * 8);
        var y = 8 - Math.floor(mouseY / this.size * 8);

        if(this.board.isFlipped()){
            x = 7-x;y=9-y;
        }

        return 'abcdefgh'.substr(x,1) + (y);
    }

});