/**
 * Created by alfmagne1 on 17/04/2017.
 */
chess.ThemeBuilder = new Class({

    json:undefined,

    css : undefined,

    initialize:function(json, css){
        this.json = json;
        this.css = css;
    },

    set:function(key, val){
        var el = this.findJSONArray(key);
        if(el){
            var k = this.getKey(key);
            if(!isNaN(val))val/=1;
            el[k] = val;
        }
    },

    setCss:function(selector, key, val){
        this.css[selector] = { key: key, val: val};
    },

    getKey:function(path){
        return path.split(/\//g).pop();
    },

    findJSONArray:function(key){
        var tokens = key.split(/\//g);
        tokens.pop();
        var el = this.json;

        jQuery.each(tokens, function(i, t){
            if(el && el[t] != undefined){
                el = el[t];
            }else{
                el = undefined;

            }
        });
        return el;
    }
});