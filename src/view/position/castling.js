/**
 * Castling panel for the position setup dialog
 * @namespace chess.view.position
 * @class Castling
 * @extends Panel
 */
chess.view.position.Castling = new Class({
    Extends: ludo.FramedView,
    height: 125,
    title: chess.getPhrase('Castling'),
    values: {
        'K': 'K',
        'Q': 'Q',
        'k': 'k',
        'q': 'q'
    },
    layout: {
        type: 'table',
        height: 125,
        columns: [
            {width: 30 }, {weight: 1}
        ],
        simple: true
    },
    value: 'KQkq',
    checkboxes: [],

    __children: function () {
        var options = [
            {
                name: 'K',
                value: 'K',
                type: 'form.Checkbox',
                checked: true,
                label: 'White O-O'
            },
            {
                type: 'form.Label', labelFor: 'K', label: 'White O-O'
            },
            {
                name: 'Q',
                value: 'Q',
                checked: true,
                type: 'form.Checkbox',
                label: 'White O-O-O'
            },
            {
                type: 'form.Label', labelFor: 'q', label: 'White O-O-O'
            },
            {
                name: 'k',
                value: 'k',
                checked: true,
                type: 'form.Checkbox',
                label: 'Black O-O'
            },
            {
                type: 'form.Label', labelFor: 'k', label: 'Black O-O'
            },
            {
                name: 'q',
                value: 'q',
                checked: true,
                type: 'form.Checkbox',
                label: 'Black O-O-O'
            },
            {
                type: 'form.Label', labelFor: 'q', label: 'Black O-O-O'
            }

        ];

        for (var i = 0; i < options.length; i++) {
            var obj = options[i];
            obj.height = 25;

            if (obj.type == 'form.Checkbox') {
                obj.listeners = {
                    change: this.receiveInput.bind(this)
                };
            }

        }

        return options;

    },


    __rendered: function () {
        this.parent();
        this.checkboxes = [];
        jQuery.each(this.children, function (i, c) {
            if (c.type == 'form.Checkbox'){
                this.checkboxes.push(c);
                thi
            }
        }.bind(this))

    },

    resetOptions: function () {
        for (var i = 0; i < this.checkboxes.length; i++) {
            this.checkboxes[i].check();
        }
    },
    /**
     * Set castle value, example value: 'qKQ'
     * @method setValue
     * @param {String} castle
     * @return undefined
     */
    setValue: function (castle) {
        for (var i = 0; i < this.checkboxes.length; i++)this.checkboxes[i].setChecked(false);
        for (i = 0; i < castle.length; i++) {
            var key = castle.substr(i, 1);
            if (this.child[key])this.child[key].check();
        }
    },

    val: function () {
        var keys = ['K', 'Q', 'k', 'q'];
        var ret = '';
        for (var i = 0; i < keys.length; i++) {
            ret = ret + this.values[keys[i]];
        }
        if (ret.length == 0)ret = '-';
        return ret;
    },
    receiveInput: function (value, obj) {
        this.values[obj.getName()] = value;
        this.fireEvent('change', value);
    }
});