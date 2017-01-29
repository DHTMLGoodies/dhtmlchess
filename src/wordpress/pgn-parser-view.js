chess.wordpress.PgnParserView = new Class({
    Extends:ludo.View,
    submodule: 'wordpress.pgnparserview',
    
    parser:undefined,
    
    __construct:function(config){
        this.parent(config);
        
        this.parser = new chess.pgn.Parser();
    },
    
    __rendered:function(){
        this.parent();
        this.on('show', this.updatePgn.bind(this));
    },
    
    setController:function(controller){
        this.parent(controller);
    },
    
    updatePgn:function(){

        var pgn = this.parser.getPgn(this.controller.currentModel);
        this.html(pgn.replace(/\n/g, '<br>'));
        
    }
    
    
});