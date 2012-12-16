

ludo.ChessCache = {};

ludo.chess.parser.FenObjectCache  = new Class({
    Extends : Events,

    fenCacheExists : function(){
        return ludo.ChessCache[this.fen] !== undefined;
    },

    isInCache : function(keys){
        return ludo.ChessCache[this.fen][keys] !== undefined;
    },

    deleteKey : function(key){
        delete ludo.ChessCache[this.fen][this.getStringKey(keys)];
    },

    getFromCache : function(keys){
        return ludo.ChessCache[this.fen][keys];
    },

    appendToCache : function(key, obj){
        ludo.ChessCache[this.fen] = ludo.ChessCache[this.fen] || {};

        ludo.ChessCache[this.fen][key] = ludo.ChessCache[this.fen][key] || [];
        ludo.ChessCache[this.fen][key].push(obj);
    },

    setCache : function(key, obj){
        ludo.ChessCache[this.fen] = ludo.ChessCache[this.fen] || {};
        ludo.ChessCache[this.fen][key] = obj;
    },

    getStringKey : function(keys){
        return keys.join('_');
    },

    getPrimaryKey : function() {
        return this.fen;
    }

});