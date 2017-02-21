chess.WPTemplate = new Class({
    Extends: Events,
    renderTo: undefined,
    module: undefined,
    _ready: true,
    _loadCounter: 0,
    th:undefined,
    themeObject:undefined,

    initialize: function (config) {
        this.renderTo = jQuery(config.renderTo);
        this.module = String.uniqueID();

        this.themeObject = chess.THEME;
        this.th = config.theme || config.defaultTheme;
        this.th = 'dc-' + this.th;

        if(config.width){
            this.renderTo.css('width', config.width);
        }

        if(config['float']){
            this.renderTo.css('float', config['float']);
        }

        chess.THEME_OVERRIDES = undefined;

        if (config.docRoot) {
            ludo.config.setDocumentRoot(config.docRoot);
        }


        if (config.theme) {
            this._ready = false;
            jQuery('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: ludo.config.getDocumentRoot() + 'themes/' + config.theme + '.css',
                complete: function () {
                    this.onload();
                }.bind(this)
            }).appendTo('head');


            jQuery.ajax({
                url: ludo.config.getDocumentRoot() + 'themes/' + config.theme + '.js',
                dataType: "script",
                complete: function () {
                    this.onload();
                }.bind(this)
            });
        }
    },

    onload: function () {
        this._loadCounter++;
        if (!this._ready && this._loadCounter == 2)this.render();
        this._ready = this._loadCounter == 2;

    },

    canRender: function () {
        return this._ready;
    }


});