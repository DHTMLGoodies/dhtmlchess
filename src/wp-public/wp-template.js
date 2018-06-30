chess.WPTemplate = new Class({
    Extends: Events,
    renderTo: undefined,
    module: undefined,
    _ready: true,
    _loadCounter: 0,
    th: undefined,
    themeObject: undefined,
    controller: undefined,
    heading_tpl: undefined,
    wpm_h: 20,
    nav: true,
    sound: false,
    boardId: undefined,
    _p: false,
    compToggle: false,
    pgn: undefined,
    pgnAll: undefined,
    animationDuration: .2,

    arrowSolution: undefined,
    board: undefined,
    arrow: undefined,
    hint: undefined,

    dr: undefined,
    url: undefined,

    lp: undefined,

    navH: undefined,
    to_end: false,
    forward: 0,

    mobile: undefined,

    custom: false,

    chessButtons: undefined,

    initialize: function (config) {
        var res = window.screen.width;
        this.mobile = ludo.isMobile && (res) < 600;
        this.renderTo = jQuery(config.renderTo);
        this.animationDuration = .2;
        if (config.animation_duration !== undefined) this.animationDuration = config.animation_duration;
        this.prep(config);
    },

    prep: function (config) {
        if (this.render === undefined) return;
        var w = this.renderTo.width();
        if (w === 0) {
            this.prep.delay(50, this, config);
            return;
        }
        this.__construct(config);

    },

    __construct: function (config) {
        if (config.docRoot) {
            ludo.config.setDocumentRoot(config.docRoot);
        }

        this.navH = this.mobile ? 38 : 40;
        this.lp = this.mobile ? 'inside' : 'outside';
        this.dr = ludo.config.getDocumentRoot();
        this.url = ludo.config.getUrl();


        this.module = String.uniqueID();
        this.boardId = 'dhtml_chess' + String.uniqueID();

        this.board = config.board || {};
        this.arrow = config.arrow || {};
        this.arrowSolution = config.arrowSolution || {};
        this.hint = config.hint || {};
        this.to_end = config.to_end || false;
        this.forward = config.forward || 0;

        if (config.buttons) {
            this.buttons = this.configureButtons(config.buttons);
        }

        if (config.pgn !== undefined) {
            if (jQuery.isArray(config.pgn)) {
                this.pgn = config.pgn[0];
                this.pgnAll = config.pgn;
            } else {
                this.pgn = config.pgn;
                this.pgnAll = [config.pgn];
            }
        }


        if (config.comp_toggle) this.compToggle = config.comp_toggle;

        if (config._p !== undefined) this._p = config._p;
        if (this._p) this.wpm_h = 0;


        this.th = config.theme || config.defaultTheme;
        this.th = 'dc-' + this.th;

        if (config.sound !== undefined) this.sound = config.sound;
        if (config.heading_tpl !== undefined) this.heading_tpl = config.heading_tpl;

        if (config.css) {
            var rules = config.css.split(/;/g);
            jQuery.each(rules, function (i, rule) {
                if (rule) {
                    var keyVal = rule.split(/:/);
                    this.renderTo.css(keyVal[0], keyVal[1]);
                }
            }.bind(this));
        }

        var w;
        if (config.width_mobile) {
            w = config.width_mobile;
        } else if (!this.mobile) {
            w = config.width;
        }

        if (w) {
            this.renderTo.css('width', w);

            if (config['float']) {
                this.renderTo.css('float', config['float']);
            }
        }

        chess.THEME_OVERRIDES = undefined;

        var t = config.theme || config.defaultTheme;

        if (t === 'custom') {
            this.custom = true;
            chess.THEME = chess.CUSTOMTHEME;
            this.themeObject = Object.clone(chess.CUSTOMTHEME);
        }
        chess.THEMES = chess.THEMES || {};
        chess.CSSLOADED = chess.CSSLOADED || {};
        if (t && t !== 'custom') {
            this._ready = false;

            if (!chess.CSSLOADED[t]) {
                jQuery('<link/>', {
                    rel: 'stylesheet',
                    type: 'text/css',
                    href: this.dr + 'themes/' + t + '.css',
                    complete: function () {
                        chess.CSSLOADED[t] = true;
                        this.onload();
                    }.bind(this)
                }).appendTo('head');
            } else {
                this.onload();
            }

            if (chess.THEMES[t] !== undefined) {
                this.themeObject = chess.THEMES[t];
                this.onload();
            }
            else {
                jQuery.ajax({
                    url: this.dr + 'themes/' + t + '.js',
                    dataType: "script",
                    complete: function () {
                        this.themeObject = Object.clone(chess.THEME);
                        chess.THEMES[t] = this.themeObject;
                        this.onload();
                    }.bind(this)
                });
            }
        }

        if (this.nav) {
            var manager = ludo._new('chess.WPManager');
            manager.add(this);
        }
    },


    configureButtons: function (buttonString) {
        var btns = buttonString.split(/,/g);
        var buttons = [];
        btns.forEach(function (button) {
            button = button.toLowerCase().substr(0, 2);
            switch (button) {
                case "st": buttons.push("start"); break;
                case "pr": buttons.push("previous"); break;
                case "pl": buttons.push("play"); break;
                case "ne": buttons.push("next"); break;
                case "en": buttons.push("end"); break;
                case "fl": buttons.push("flip"); break;
                case "co": buttons.push("comp"); break;
            }
        });
        return buttons;
    },

    beforeRender: function () {
        if (this.canRender()) {
            this.render();
        }
    },

    renderWidth: function () {
        return this.renderTo.width();
    },

    adjustButtonArray: function (buttons) {
        if (this.compToggle) buttons.push('comp');
    },

    controllerType: function () {
        return this._p ? 'ComputerController' : 'Controller';
    },

    randomPgn: function () {
        var i = Math.floor(Math.random() * this.pgnAll.length);
        return this.pgnAll[i];
    },


    curModel: function () {
        return this.controller.currentModel;
    },

    allPgnIdsString: function () {
        var ret = [];
        jQuery.each(this.pgnAll, function (i, pgn) {
            ret.push(pgn.id);
        });
        return ret.join('_');
    },

    isValidPgn: function (pgnId) {
        for (var i = 0; i < this.pgnAll.length; i++) {
            if (this.pgnAll[i].id == pgnId) return true;
        }
        return false;
    },

    onload: function () {
        this._loadCounter++;
        if (!this._ready && this._loadCounter == 2 && this.render !== undefined) this.render();
        this._ready = this._loadCounter == 2;
    },

    canRender: function () {
        return this._ready;
    },

    createController: function () {
        var c = this.controller;
        c.on('enginestatus', this.showEngineStatusDialog.bind(this));
        c.on('compGameOver', this.onGameOver.bind(this));
        c.on('comp', this.hideOverlays.bind(this));
    },

    hideOverlays: function () {
        if (this.game_over_div) {
            this.game_over_div.hide();
        }
    },

    onGameOver: function (result) {

        if (this.game_over_div == undefined) {
            var v = this.game_over_div = jQuery('<div class="dhtml_chess_overlay_parent">' +
                '<div class="dhtml_chess_overlay"></div>' +
                '<div class="dhtml_chess_game_over_text"></div></div>');
            ludo.$(this.boardId).boardEl().append(v);
        }

        var txt = result == 1 ? '1 - 0' : result == -1 ? '0 - 1' : '0.5 - 0.5';

        var h = this.game_over_div.height();
        this.game_over_div.find('.dhtml_chess_game_over_text')
            .css('line-height', h + 'px')
            .css('font-size', Math.round(h / 4) + 'px')
            .html(txt);
        this.game_over_div.show();
    },

    showEngineStatusDialog: function () {
        var d = this.computerDialog();
        if (this.controller.engineLoaded()) {
            d.hide();
        } else {
            d.show();
        }
    },

    cs_dialog: undefined,
    computerDialog: function () {
        if (this.cs_dialog == undefined) {
            var v = jQuery('<div class="dhtml_chess_loading">' +
                '<div class="dhtml_chess_overlay"></div>' +
                '<div class="dhtml_chess_centered_bg dhtml_chess_loading_image"></div></div>');
            ludo.$(this.boardId).boardEl().append(v);


            this.cs_dialog = v;
        }

        return this.cs_dialog;
    }
});