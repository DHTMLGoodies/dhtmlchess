chess.wordpress.UndoRedo = new Class({

    maxSize: 50,
    stack: undefined,
    current: undefined,

    model: undefined,

    initialize: function (model) {
        this.model = model;

        this.stack = [];

        if (jQuery.isPlainObject(model.model)) {
            this.model.on('dirty', this.add.bind(this));
        }
        this.add(model);
    },

    hasUndo: function () {
        return this.current > 0;
    },

    hasRedo: function () {
        return this.current < this.stack.length - 1;
    },

    isModel:function(obj){
        return jQuery.type(model) == 'object';
    },

    isEqualToNext:function(model){
        if(!this.hasRedo())return false;
        if (this.isModel(model)) {
            return this.stack[this.current+1].fen == model.fen;
        }else{
            return this.stack[this.current+1] = model;
        }
    },

    add: function (model) {
        if(this.isEqualToNext(model)){
            this.current++;
            return;
        }

        if (jQuery.type(model) == 'object') {
            var m = Object.clone(model.getCurrentMove());
            console.log(m);
            var obj = {
                model: Object.clone(model.model),
                currentMove : m
            };
            this.stack.push(obj);
        } else {
            this.stack.push(model);
        }

        if(this.stack.length > this.maxSize){
            this.stack.shift();
        }

        this.current = this.stack.length - 1;

        console.log(this.len(), this.current, this.stack);
    },

    undo: function () {
        if (this.current > 0) {
            return this.stack[--this.current];
        }
    },

    redo: function () {
        if (this.current < this.stack.length - 1) {
            return this.stack[++this.current];
        }
    },

    len: function () {
        return this.stack.length;
    }


});