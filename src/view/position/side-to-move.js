/**
 * Side to move panel for the position setup dialog
 * @namespace chess.view.position
 * @class SideToMove
 * @extends Panel
 */
chess.view.position.SideToMove = new Class({
    Extends:ludo.Panel,
    height:80,
    title:chess.getPhrase('Side to move'),

    ludoRendered:function () {
        this.parent();
        var options = [
            {
                name:'color',
                checked:true,
                label:chess.getPhrase('White'),
                value : 'w'
            },
            {
                name:'color',
                value : 'b',
                label:chess.getPhrase('Black')
            }
        ];

        for (var i = 0; i < options.length; i++) {
            var obj = options[i];
            obj.height = 25;
            obj.type = 'form.Radio';
            obj.listeners = {
                change : this.receiveInput.bind(this)
            };
            this.addChild(obj);
        }
    },

    receiveInput : function(value){
        this.fireEvent('change', value);
    },

    resetOptions : function(){
        this.setColor('white');
    },

    setColor : function(color){
        if(color == 'white'){
            this.children[0].check();
        }else{
            this.children[1].check();
        }
    }
});