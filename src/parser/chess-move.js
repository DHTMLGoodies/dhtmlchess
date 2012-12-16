ludo.chess.parser.ChessMove = new Class({

    data : {
        moves : [],
        type : '',
        capture : undefined,
        promoteTo : undefined,
        check : false,
        checkMate : false,
        suffix : ''
    },


    initialize : function(data){
        this.data = Object.merge(this.data, data);
    },

    getMoves : function(){
        return this.data.moves;
    },

    getCapturedPiece : function(){
        return this.data.capture;
    },

    getPromoteTo : function(){
        return this.data.promoteTo;
    },

    isCheck : function(){
        return this.data.check;
    },

    isCheckMate : function(){
        return this.data.checkMate;
    },

    getNotation : function(){

    },

    getFullNotation : function(){

    },

    getTypePrefix : function() {
        switch(this.type){
            case 'knight':
                return 'N';
            case 'bishop':
                return 'B';
            case 'queen':
                return 'Q';
            case 'rook':
                return 'R';
        }
    }

})