/**
 * Castling panel for the position setup dialog
 * @namespace chess.view.position
 * @class Castling
 * @extends Panel
 */
chess.view.position.Castling = new Class({
    Extends:ludo.Panel,
    height:125,
    title:chess.getPhrase('Castling'),
    values : {
        'K' : 'K',
        'Q' : 'Q',
        'k' : 'k',
        'q' : 'q'
    },

    value : 'KQkq',
    checkboxes : [],

    ludoRendered:function () {
        this.parent();
        var options = [
            {
                name:'K',
                value : 'K',
                checked:true,
                label:'White O-O'
            },
            {
                name:'Q',
                value : 'Q',
                checked:true,
                label:'White O-O-O'
            },
            {
                name:'k',
                value : 'k',
                checked:true,
                label:'Black O-O'
            },
            {
                name:'q',
                value : 'q',
                checked:true,
                label:'Black O-O-O'
            }

        ];

        for(var i=0;i<options.length;i++){
            var obj = options[i];
            obj.height = 25;
            obj.type = 'form.Checkbox';
            obj.listeners = {
                change : this.receiveInput.bind(this)
            };
            this.checkboxes[i] = this.addChild(obj);
        }
    },

    resetOptions: function() {
        for(var i=0;i<this.checkboxes.length;i++){
            this.checkboxes[i].check();
        }
    },
    /**
     * Set castle value, example value: 'qKQ'
	 * @method setValue
     * @param {String} castle
     * @return undefined
     */
    setValue:function(castle){
        for(var i=0;i<this.checkboxes.length;i++)this.checkboxes[i].setChecked(false);
        for(i=0;i<castle.length;i++){
            var key = castle.substr(i,1);
            if(this.child[key])this.child[key].check();
        }
    },

    getValue : function() {
        var keys = ['K','Q','k','q'];
        var ret = '';
        for(var i=0;i<keys.length;i++){
            ret = ret + this.values[keys[i]];
        }
        if(ret.length==0)ret = '-';
        return ret;
    },
    receiveInput : function(value, obj){
        this.values[obj.getName()] = value;
        this.fireEvent('change', this.getValue());
    }
});