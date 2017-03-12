/**
 * Side to move panel for the position setup dialog
 * @namespace chess.view.position
 * @class SideToMove
 * @extends Panel
 */
chess.view.position.SideToMove = new Class({
    Extends:ludo.FramedView,
    height:80,
    title:chess.__('Side to move'),
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
                placeholder:chess.__('White'),
                value : 'w'
            },
            {
                type:'form.Label',
                labelFor:'color_w',
                label:chess.__('White')
            },
            {
                name:'color',
                value : 'b',
                type:'form.Radio',
                placeholder:chess.__('Black')
            },
            {
                type:'form.Label',
                labelFor:'color_b',
                label:chess.__('Black')
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