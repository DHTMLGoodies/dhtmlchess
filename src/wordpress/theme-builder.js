/**
 * Created by alfmagne1 on 17/04/2017.
 */
chess.ThemeBuilder = new Class({

    json: undefined,

    css: undefined,

    initialize: function (json, css) {
        this.json = json;
        this.css = css;
    },

    mergeJSON: function (json) {
        this.json = Object.merge(this.json, json);
    },

    set: function (key, val) {
        // Some exceptions
        if (key == 'chess.view.board.Board/labelStyles/color') {
            this.set('chess.view.board.Board/labelOddStyles', undefined)
            this.set('chess.view.board.Board/labelEvenStyles', undefined)
        }


        var el = this.findJSONArray(key);
        if (el) {
            var k = this.getKey(key);
            if (!isNaN(val)) val /= 1;
            el[k] = val;
        }
    },

    setCss: function (selector, key, type, val) {
        if(type == 'px')val += 'px';
        if (!this.css) this.css = {};
        if (!this.css[selector]) this.css[selector] = {};
        this.css[selector][key] = val;
    },

    getKey: function (path) {
        return path.split(/\//g).pop();
    },

    findJSONArray: function (key) {
        var tokens = key.split(/\//g);
        tokens.pop();
        var el = this.json;

        jQuery.each(tokens, function (i, t) {
            if (el && el[t] != undefined) {
                el = el[t];
            } else {
                el = undefined;
            }
        });
        return el;
    },

    cssString: function () {
        var ret = [];
        jQuery.each(this.css, function (selector, rules) {

            jQuery.each(rules, function (key, val) {
                if (val.indexOf('images') >= 0) {
                    val = 'url(' + val + ')';
                    val = val.replace('[DOCROOT]', ludo.config.getDocumentRoot());
                }
                ret.push('.dc-custom ' + selector + '{' + key + ":" + val + ' !important }');
            });

        });
        return ret.join('');
    }
});