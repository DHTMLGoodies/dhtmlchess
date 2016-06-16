ludo.CodeHighlight = new Class({
    previewEl:undefined,
    clipboardPath : '/dhtmlgoodies/dg-web-tools/api/demo/code-highlight/',

    styling:{
        keyWords:{ color:'#000080', 'font-weight':'bold' },
        configs:{ color:'#660e7a', 'font-weight':'bold' },
        numbers:{ color:'#00F' },
        text:{ color:'#008000' },
        comments:{ color:'#888' },
        methods:{ color:'#7a7a2b' },
        variables:{ color:'#458383' }
    },
    initialize:function (sourceCodeEl) {

        if(location.href.indexOf('dhtmlgoodies.com') >=0){
            this.clipboardPath = '/dg-web-tools/api/demo/code-highlight/';
        }
        if(location.href.indexOf('ludojs.com') >=0){
            this.clipboardPath = '/api/demo/code-highlight/';
        }
        if (sourceCodeEl) {
            var blocks = [sourceCodeEl];
        } else {
            blocks = document.body.getElements('.source-code');
            if (blocks.length == 0) {
                blocks = document.body.getElements('.source-code-preview');
            }
        }

        if (sourceCodeEl && sourceCodeEl.hasClass('source-code-preview')) {
            this.previewEl = sourceCodeEl;
        } else {
            //this.previewEl = document.body.getElement('.source-code-preview');
            if (!this.previewEl) {
                this.previewEl = new Element('div');
                document.body.adopt(this.previewEl);
            }
                //this.autoResizePreview();
                //(window).addEvent('resize', this.autoResizePreview.bind(this));

        }

        this.previewEl.setStyles({
            position:'relative',
            padding:5,
            overflow:'auto',
            border:'1px solid #777',
            'background-color':'#EEE'
        });
        if(!this.previewEl.style.height && !this.previewEl.hasClass('ah')){
            this.previewEl.setStyle('height', 300);
            this.previewEl.setStyle('margin', 5);
        }

        this.previewEl.id = 'preview-' + Math.random();

        if(!sourceCodeEl.hasClass('skip-copy')){
            this.createCopyToClipBoardAnchor();
        }
        for (var i = 0, len = blocks.length; i < len; i++) {
            this.highlightBlock(blocks[i], this.previewEl);
        }
    },

    createCopyToClipBoardAnchor:function () {
        if (!window.jQuery) {
            Asset.javascript(this.clipboardPath + 'jquery.js');
            Asset.javascript(this.clipboardPath + 'zclip.js',
                {
                    onLoad:function () {
                        this.createCopyToClipBoardAnchor();
                    }.bind(this)
                });
            return;

        }
        var anchor = this.clipBoardAnchor = new Element('a');
        anchor.href = '#';
        anchor.setStyle('cursor', 'pointer');
        anchor.addClass('copy-to-clipboard');
        anchor.inject(this.previewEl, 'after');
        anchor.set('html', 'Copy to clipboard');

        jQuery(anchor).zclip({
            path: this.clipboardPath + 'ZeroClipboard.swf',
            copy:jQuery(this.previewEl).text(),
            afterCopy:function () {
                var coords = this.clipBoardAnchor.getCoordinates();
                if (!this.copyConfirmedEl) {
                    var el = this.copyConfirmedEl = new Element('div');
                    el.setStyles({
                        'border-radius':'5px',
                        position:'absolute',
                        'border':'1px solid #555',
                        'padding':5,
                        'background-color':'#FFF',
                        'width':75,
                        'font-size':'10px'
                    });
                    el.set('html', 'Code has been copied to clipboard');
                    document.body.adopt(el);

                    this.fx = new Fx.Morph(el, {
                        duration:'short'
                    });

                }

                this.copyConfirmedEl.setStyles({
                    opacity:1,
                    left:coords.left,
                    top:coords.top
                });

                this.fx.start.delay(1000, this.fx, {'opacity':[1, 0]});
            }.bind(this)
        });
    },
    /*
    autoResizePreview:function () {
        this.previewEl.setStyles({
            height:(document.body.clientHeight - this.previewEl.offsetTop) - 10,
            padding:5,
            overflow:'auto'
        })
    },*/

    highlightBlock:function (domEl, previewEl) {
        var html = domEl.get('html');
        html = html.replace(/</g,'&lt');
        previewEl.setStyle('white-space', 'pre');
        previewEl.setStyle('font-family', 'courier');
        previewEl.setStyle('font-size', '12px');
        html = this.stripTabulators(html);
        html = html.trim();
        html = this.highlightComments(html);
        html = this.getFormattedText(html);
        html = this.highlightText(html);
        html = this.highlightVariables(html);
        html = this.highlightKeywords(html);
        html = this.highlightNumbers(html);
        html = this.highlightConfigs(html);
        html = this.highlightMethods(html);
        html = this.highlightClassDeclarations(html);
        html = this.insertComments(html);

        previewEl.set('html', html);
    },

    stripTabulators:function (html) {
        var lines = html.split(/\n/g);
        var min = 100;
        for (var i = 0; i < lines.length; i++) {

            if (lines[i].length && /[^\s]/g.test(lines[i])) {
                var len = lines[i].length;
                var lenStripped = lines[i].replace(/\s+?([^\s].*)/g, '$1').length;
                min = Math.min(min, len - lenStripped);
            }
        }
        if(min>0){
            html = '';
            for(i=0;i<lines.length;i++){
                html = html + lines[i].substr(min) + '\n';
            }
        }
        return html;
    },

    getFormattedText:function (html) {
        html = html.replace(/ *: */g, ':');
        html = html.replace(/</g, '&lt;');
        return html;
    },

    highlightKeywords:function (html) {

        spanCode = this.getSpanCode('configs');
        html = html.replace(/new ([^\)]+?)\(/g, 'new ' + spanCode + '$1</span>(');
        html = html.replace(/function ([^\\)]+?)\(/g, 'function ' + spanCode + '$1</span>(');

        spanCode = this.getSpanCode('keyWords');
        html = html.replace(/new /g, spanCode + 'new </span>');
        html = html.replace(/var /g, spanCode + 'var </span>');
        html = html.replace(/([\s])case /g, '$1' + spanCode + 'case </span>');
        html = html.replace(/([\s])(if)([\s]?) /g, '$1' + spanCode + '$2</span>$3');
        html = html.replace(/switch\(/g, spanCode + 'switch</span>(');
        html = html.replace(/function /g, spanCode + 'function </span>');
        html = html.replace(/:function/g, ':' + spanCode + 'function</span>');
        html = html.replace(/:true/g, ':' + spanCode + 'true</span>');
        html = html.replace(/:false/g, ':' + spanCode + 'false</span>');
        html = html.replace(/break;/g, spanCode + 'break</span>;');
        return html;
    },

    highlightConfigs:function (html) {

        var pattern = '([\\s,])([a-z]+):';
        var reg = new RegExp(pattern, 'gi');
        var spanCode = this.getSpanCode('configs');
        return html.replace(reg, '$1' + spanCode + '$2</span>:');
    },

    comments:[],

    highlightComments:function (html) {
        var pattern = /(\/\*[^\/]+\/)/;

        var match = html.match(pattern);
        var index = 0;
        while (match && index < 100) {
            this.comments.push(match[0]);
            html = html.replace(pattern, '[COMMENT' + index + ']');
            html.match(pattern);
            index++;
            match = html.match(pattern);
        }

        html = html.replace(pattern, this.getSpanCode('comments') + '$1</span>');
        return html;
    },

    insertComments:function (html) {
        for (var i = 0; i < this.comments.length; i++) {
            html = html.replace('[COMMENT' + i + ']', this.getSpanCode('comments') + this.comments[i] + '</span>');
        }
        return html;
    },

    highlightNumbers:function (html) {
        html = html.replace(/:([0-9\.]+)/g, ':' + this.getSpanCode('numbers') + '$1</span>');
        return html;
    },

    highlightText:function (html) {

        html = html.replace(/"([^"]*?)"/g, '&quot;' + this.getSpanCode('text') + '$1</span>&quot;');
        html = html.replace(/'([^']*?)'/g, "&#039;" + this.getSpanCode('text') + "$1</span>&#039;");
        return html;
    },

    highlightClassDeclarations:function(html){

        var pattern = /\n(ludo\.[^\s]+? = )/g;
        html = html.replace(pattern, '\n' + this.getSpanCode('configs') + '$1</span>');


        pattern = /:([a-z0-9\.]+?),/gi;
        html = html.replace(pattern, ':' + this.getSpanCode('configs') + '$1</span>,');
        return html;
    },

    highlightMethods:function (html) {
        var pattern = /\.([a-z][A-Za-z0-9]+?)\(/g;
        html = html.replace(pattern, '.' + this.getSpanCode('methods') + '$1</span>(');
        return html;
    },

    highlightVariables:function (html) {
        var pattern = /var ([a-zA-Z0-9]+?)(\s?)=/g;
        html = html.replace(pattern, 'var ' + this.getSpanCode('variables') + '$1</span>$2=');
        return html;
    },

    getSpanCode:function (keyWord) {
        var styling = this.styling[keyWord];
        var ret = ['<span style="'];
        for (var prop in styling) {
            ret.push(prop + ':' + styling[prop] + ';');
        }
        ret.push('">');
        return ret.join('');
    }
});

window.addEvent('domready', function () {
    var els = document.body.getElements('.source-code');


    var divEls = document.body.getElements('.source-code-preview');
    for (var i = 0; i < divEls.length; i++) {
        els.push(divEls[i]);
    }

    for (i = 0; i < els.length; i++) {
        new ludo.CodeHighlight(els[i]);
    }
});
