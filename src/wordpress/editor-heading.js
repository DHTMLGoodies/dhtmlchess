chess.wordpress.EditorHeading = new Class({
    Extends: ludo.View,
    submodule:'wordpress.editorheading',

    css:{
        'font-size' : '11px',
        'font-style' : 'italic',
        'text-align' : 'right',
        'padding' : '5px'
    },

    __rendered:function(){
        this.parent();

        this.getNumberOfGames();
    },

    setController:function(controller){
        this.parent(controller);
    },

    getNumberOfGames:function(){
        jQuery.post(
            ludo.config.getUrl(), {
                action:'count_games'
            },
            function(response){
                if(response.success){
                    this.html(chess.getPhrase('Games in Database: ' + response.response));
                }
            }.bind(this)

        );

    }
});