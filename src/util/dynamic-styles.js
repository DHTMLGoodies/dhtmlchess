/**
 * Created by alfmagne1 on 21/01/2017.
 */
chess.util = chess.util || {};
chess.util.DynamicStyles = new Class({

    parentSelector:undefined,

    initialize:function(parentSelector, styles){

        this.parentSelector = parentSelector;
        jQuery.each(styles, function(selector, rules){
            this.insertRule(selector, rules);
        }.bind(this));
    },

    insertRule: function (selector, rules, contxt) {
        var context = contxt || document, stylesheet;
        if(selector.indexOf(',') > 0){
            selector = selector.split(/,/g);
        }
        if(!jQuery.isArray(selector)){
            selector = [selector];
        }

        jQuery.each(selector, function(i, sel){
            if(sel.indexOf('body.') == -1){
                selector[i] = this.parentSelector + ' ' + sel.trim();
            }
        }.bind(this));

        rules = this.rulesAsString(rules);
        if (typeof context.styleSheets == 'object') {
            if (context.styleSheets.length) {
                stylesheet = context.styleSheets[context.styleSheets.length - 1];
            }
            if (context.styleSheets.length) {
                if (context.createStyleSheet) {
                    stylesheet = context.createStyleSheet();
                }
                else {
                    context.getElementsByTagName('head')[0].appendChild(context.createElement('style'));
                    stylesheet = context.styleSheets[context.styleSheets.length - 1];
                }
            }
            if (stylesheet.addRule) {
                for (var i = 0; i < selector.length; ++i) {
                    stylesheet.addRule(selector[i], rules);
                }
            }
            else {
                stylesheet.insertRule(selector.join(',') + '{' + rules + '}', stylesheet.cssRules.length);
            }
        }
    },

    rulesAsString:function(rules){


        if(jQuery.isPlainObject(rules)){
            var ret = "";
            jQuery.each(rules, function(key, val){
                if(ret.length> 0){
                    ret += ';'
                }
                ret += key + ':';
                ret += val;

            });

            return ret;
        }

        return rules;

    }

});