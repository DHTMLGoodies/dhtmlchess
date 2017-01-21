/**
 * A special top in hierarchy chess view with support for theme attribute.
 * The properties described in the theme will be applied to child views
 * (example board, notations etc).
 * @class chess.view.Chess
 * @param {Object} config
 * @param {Object} config.theme
 * @example
 * new chess.view.Chess({
 *      renderTo:$(document.body),
 *      layout:{
 *          height:'matchParent',width:'matchParent'
 *      },
 *      theme:{
                'chess.view.board.Board': {
                    background: {
                        borderRadius: '1%',
                        horizontal: ludo.config.getDocumentRoot() + 'images/board-bg/wood-strip-horizontal.png',
                        vertical: ludo.config.getDocumentRoot() + 'images/board-bg/wood-strip-vertical.png'
                    },
                    bgWhite:ludo.config.getDocumentRoot() + 'images/board/lighter-wood.png',
                    bgBlack:ludo.config.getDocumentRoot() + 'images/board/darker-wood.png',
                    plugins: [
                        {
                            type: 'chess.view.highlight.Arrow'
                        },
                        {
                            type: 'chess.view.highlight.ArrowTactic'
                        },
                        {
                            type: 'chess.view.highlight.SquareTacticHint'
                        }
                    ]
                },
                'chess.view.dialog.PuzzleSolved ':{
                    title: 'Nice one.',
                    html: 'You solved this chess puzzle. Click OK to load next.'
                }


            },
        children:[
            { type:'chess.view.board.Board'
            ...
            }
        ]
 */
chess.view.Chess = new Class({
    Extends: ludo.View,

    __construct:function(config){

        if(config.theme == undefined && chess.THEME != undefined){
            config.theme = chess.THEME;
        }

        if(config.theme != undefined){
            this.theme = config.theme;

            if(this.theme.css){
                this.updateCss();
            }
            config.children = this.parseChildren(config);

        }

        this.parent(config);
    },

    __rendered:function(){
        this.parent();
        if(this.theme && this.theme.name){
            $(document.documentElement).addClass(this.cssClass());
        }
    },

    cssClass:function(){
        return 'chess-theme-' + this.theme.name;
    },

    updateCss:function(){
        new chess.util.DynamicStyles('.' + this.cssClass(), this.theme.css);
    },


    parseChildren:function(config){
        var children =  config.children || this.__children();

        this.parseBranch(children);
        
        return children;
    },
    
    parseBranch:function(children){
        jQuery.each(children, function(i, child){
            if(child.type && this.theme[child.type] != undefined){
                child = Object.merge(child, this.theme[child.type]);
            }
            if(child.children != undefined) {
                this.parseBranch(child.children);
            }

        }.bind(this));
    }
});