chess.wordpress.UndoRedo = new Class({

    Extends: Events,

    maxSize: 50,
    stack: undefined,
    current: undefined,

    model: undefined,

    fn: undefined,

    t: 0,

    initialize: function (model) {
        this.model = model;

        this.stack = [];

        if (jQuery.isPlainObject(model.model)) {
            this.model.on('dirty', this.add.bind(this));
        }
        this.add(model);
    },

    listen: function () {
        jQuery(document).keydown(function (e) {
            var t = e.target.tagName.toLowerCase();
            if (e.target && (t == 'textarea' || t == 'input'))return;

            if (e.ctrlKey || (e.key && e.key == 'Meta') || e.metaKey) {

                var k = e.keyCode;

                var undo = k == 90 && this.hasUndo();
                var redo = k == 89 && this.hasRedo();
                if(k == 90 && e.shiftKey){ undo = false; redo = true; }

                if (redo) {
                    this.model.undoRedo(this.redo());
                    e.stopPropagation();
                    return false;
                } else if (undo) {
                    this.model.undoRedo(this.undo());
                    e.stopPropagation();
                    return false;
                }
            }

        }.bind(this));
    },

    hasUndo: function () {
        return this.current > 0;
    },

    hasRedo: function () {
        return this.current < this.stack.length - 1;
    },

    isModel: function (obj) {
        return jQuery.type(obj) == 'object';
    },

    isEqualToNext: function (model) {
        if (!this.hasRedo())return false;
        return this.isEqualTo(model, this.stack[this.current + 1]);
    },

    isEqualTo: function (model, compareTo) {
        if (this.isModel(model)) {
            return compareTo.fen == model.fen();
        } else {
            return model == compareTo;
        }
    },

    getModelForHistory:function(model){
        var m = Object.clone(model.getCurrentMove());
        return {
            model: Object.clone(model.model),
            currentMove: m,
            fen: model.fen()
        };
    },

    add: function (model) {

        var now = new Date().getTime();
        if (now - this.t < 400) {
            return;
        }

        if (this.isEqualToNext(model)) {
            this.current++;
            return;
        }
        if (this.stack.length > 0 && this.isEqualTo(model, this.stack[this.current])) {
            this.stack[this.current] = this.getModelForHistory(model);
            return;
        }

        this.stack.splice(this.current + 1, this.maxSize);


        if (jQuery.type(model) == 'object') {
            this.stack.push(this.getModelForHistory(model));
        } else {
            this.stack.push(model);
        }

        if (this.stack.length > this.maxSize) {
            this.stack.shift();
        }

        this.current = this.stack.length - 1;
        this.t = new Date().getTime();
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