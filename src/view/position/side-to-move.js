/**
 * Side to move panel for the position setup dialog
 * @namespace chess.view.position
 * @class SideToMove
 * @extends Panel
 */
chess.view.position.SideToMove = new Class({
    Extends:ludo.FramedView,
    height:80,
    title:chess.getPhrase('Side to move'),
    layout:{
        type:'table',
        columns:[{width:30},{weight:1}],
        simple:true
    },

    __children:function () {

        var options = [
            {
                name:'color',
                checked:true,
                type:'form.Radio',
                placeholder:chess.getPhrase('White'),
                value : 'w'
            },
            {
                type:'form.Label',
                labelFor:'color_w',
                label:chess.getPhrase('White')
            },
            {
                name:'color',
                value : 'b',
                type:'form.Radio',
                placeholder:chess.getPhrase('Black')
            },
            {
                type:'form.Label',
                labelFor:'color_b',
                label:chess.getPhrase('Black')
            }
        ];

        jQuery.each(options, function(i, opt){
            opt.height= 25;
            if(opt.type == 'form.Radio'){
                opt.listeners = {
                    change : this.receiveInput.bind(this)
                };
            }
        }.bind(this));
        return options;
    },

    receiveInput : function(value){
        console.log(arguments);
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