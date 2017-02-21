chess.view.buttonbar.Bar = new Class({

    Extends: ludo.View,
    type:'chess.view.buttonbar.Bar',
    module: 'chess',
    submodule: 'buttonbar.bar',

    buttons: ['start', 'previous', 'play', 'next', 'end', 'flip'],

    styles: undefined,

    orientation: undefined,

    borderRadius: '8%',
    // Percent spacing of button size
    spacing: 10,

    background: undefined,


    activeButton: undefined,
    buttonDown: undefined,

    disabledButtons: undefined,

    isAtEndOfBranch: false,

    defaultStyles: undefined,

    overlay:undefined,

    anchor:undefined,

    pr:undefined,

    __construct: function (config) {

        this.pr = String.uniqueID();


        this.parent(config);
        this.anchor = [0.5, 0];
        this.__params(config, ['buttonSize', 'background', 'buttons', 'styles',
            'spacing', 'anchor', 'imageStyles', 'imageStylesDown', 'imageStylesDisabled', 'imageStylesOver', 'borderRadius']);

        this.disabledButtons = [];
        this.defaultStyles = {
            button: {
                'stroke': '#888',
                'fill': '#aeb0b0',
                'stroke-width': 1
            },
            image: {fill: '#444'},


            buttonOver: {
                'stroke': '#777',
                'fill': '#aeb0b0',
                'stroke-width': 1
            },
            imageOver: {fill: '#222'},

            buttonDown: {
                'stroke': '#555',
                'fill': '#999',
                'stroke-width': 1
            },
            imageDown: {fill: '#222'},


            buttonDisabled: {
                'stroke': '#888',
                'fill': '#aeb0b0',
                'stroke-width': 1
            },
            imageDisabled: {
                fill: '#444',
                'fill-opacity': 0.4,
                'stroke-opacity': 0.2
            },


            buttonPlay: {
                'stroke': '#C8E6C9',
                'fill': '#388E3C',
                'stroke-width': 1
            },


            imagePlay: {fill: '#C8E6C9'},

            overlay : {
                'fill-opacity' : 0,
                'fill': '#000'
            }
        };

        this.styles = this.styles || {};



        this.styles.button = Object.merge(this.defaultStyles.button, this.styles.button || {});
        this.styles.buttonOver = Object.merge(this.defaultStyles.buttonOver, this.styles.buttonOver || {});
        this.styles.buttonDown = Object.merge(this.defaultStyles.buttonDown, this.styles.buttonDown || {});
        this.styles.buttonDisabled = Object.merge(this.defaultStyles.buttonDisabled, this.styles.buttonDisabled || {});

        this.styles.buttonPlay = Object.merge(this.defaultStyles.buttonPlay, this.styles.buttonPlay || {});


        this.styles.image = Object.merge(this.defaultStyles.image, this.styles.image || {});
        this.styles.imageOver = Object.merge(this.defaultStyles.imageOver, this.styles.imageOver || {});
        this.styles.imageDown = Object.merge(this.defaultStyles.imageDown, this.styles.imageDown || {});
        this.styles.imageDisabled = Object.merge(this.defaultStyles.imageDisabled, this.styles.imageDisabled || {});
        this.styles.imagePlay = Object.merge(this.defaultStyles.imagePlay, this.styles.imagePlay || {});
        this.styles.overlay = Object.merge(this.defaultStyles.overlay, this.styles.overlay || {});



        jQuery(document.documentElement).on('mouseup', this.onMouseUp.bind(this));
    },

    __rendered: function () {
        this.parent();

        this.$b().css('overflow','hidden');
        this.createStylesheets();

        if (this.background) {
            this.bg = new chess.view.board.Background(
                Object.merge({
                    view: this,
                    square: false
                }, this.background)
            )
        }

        this.els.buttons = {};
        this.els.buttonRects = {};
        this.els.buttonPaths = {};
        this.els.overlays = {};
        this.els.clipRects = {};

        jQuery.each(this.buttons, function (i, btn) {
            if (btn != 'pause') {
                this.createButton(btn);
                if (btn != 'flip')this.disableButton(btn);
            }
        }.bind(this));


    },

    createStylesheets: function () {
        var s = this.svg();
        jQuery.each(this.styles, function (name, styles) {
            s.addStyleSheet(this.pr + 'dc-' + name, styles);
        }.bind(this));
    },

    createButton: function (name) {
        var s = this.svg();

        var cp = s.$('clipPath');
        var cr = s.$('rect');
        cp.append(cr);
        s.appendDef(cp);
        this.els.clipRects[name] = cr;

        var g = s.$('g');
        g.attr('data-name', name);

        g.attr('aria-label', name);
        g.css('cursor', 'pointer');
        g.set('x', 0);
        g.set('y', 0);
        s.append(g);
        this.els.buttons[name] = g;
        var rect = s.$('rect');
        rect.addClass(this.pr + 'dc-button');
        this.els.buttonRects[name] = rect;
        g.append(rect);

        var o = s.$('path');
        o.css(this.styles.overlay);
        o.clip(cp);
        this.els.overlays[name] = o;
        g.append(o);

        var p = s.$('path');
        p.set('line-join', 'round');
        p.set('line-cap', 'round');
        p.set('fill-rule', 'even-odd');
        this.els.buttonPaths[name] = p;
        p.addClass(this.pr + 'dc-image');
        g.append(p);



        g.on('mouseenter', this.fn('enterButton', name));
        g.on('mouseleave', this.fn('leaveButton', name));
        g.on('mousedown', this.fn('downButton', name));
        g.on('click', this.fn('clickButton', name));

    },


    fn: function (fnName, btnName) {
        var that = this;
        return function () {
            that[fnName].call(that, btnName);
        }
    },

    enterButton: function (btnName) {
        if (!this.isDisabled(btnName)) {
            this.cssButton(btnName, 'Over');
        }
    },

    leaveButton: function (btnName) {
        if (!this.isDisabled(btnName)) {
            this.cssButton(btnName, '');
        }
    },

    downButton: function (btnName) {
        if (!this.isDisabled(btnName)) {
            this.cssButton(btnName, 'Down');
            this.buttonDown = btnName;

        }

    },

    isDisabled: function (btn) {
        return this.disabledButtons.indexOf(btn) >= 0;
    },

    onMouseUp: function () {
        if (this.buttonDown) {
            var n = this.buttonDown;
            this.els.buttonRects[n].removeClass(this.pr + 'dc-buttonDown');
            this.els.buttonPaths[n].removeClass(this.pr + 'dc-imageDown');
            this.buttonDown = undefined;
        }
    },


    clickButton: function (btnName) {
        if (!this.isDisabled(btnName)) {
            this.cssButton(btnName, '');
            if (btnName == 'play' && this.autoPlayMode)btnName = 'pause';
            this.fireEvent(btnName);
        }
        return false;
    },

    cssButton: function (name, className) {

        if(this.buttons.indexOf(name) == -1)return;

        if (name == 'play' && this.autoPlayMode)className = 'Play';

        if (this.isDisabled(name)) {
            className = 'Disabled';

        }


        var r = this.els.buttonRects[name];
        var p = this.els.buttonPaths[name];

        r.removeAllClasses();
        p.removeAllClasses();

        r.addClass(this.pr + 'dc-button' + className);
        p.addClass(this.pr + 'dc-image' + className);


    },

    resize: function (size) {
        this.parent(size);
        this.resizeBar();

        this.fireEvent('boardResized', {
            left: 0, top: 0, width: this.svg().width, height: this.svg().height
        });

    },

    btnSize: undefined,

    resizeBar: function () {
        var s = this.svg();
        this.orientation = s.width > s.height ? 'horizontal' : 'vertical';
        this.size = Math.min(s.width, s.height);

        if (this.orientation == 'horizontal') {
            this.resizeHorizontal();
        } else {
            this.resizeVertical();
        }

        var r = this.getButtonRadius();

        jQuery.each(this.els.buttonRects, function (name, rect) {
            rect.css({
                rx: r, ry: r
            });
        });
    },

    overlayPath:function(c){


        var cy = c.y + (c.height * 0.55);
        var b = c.y + c.height;
        var r = c.x + c.width;
        // A rx ry x-axis-rotation large-arc-flag sweep-flag x y

        var ry = c.height * 0.05;
        return ['M',
            c.x, cy,
            'a',  c.width, c.height, 90, 0, 1, c.width/2, -ry,
            'a',  c.width, c.height, 90, 0, 1, c.width/2, ry,
            'L', r, b, c.x, b,
            'Z'
        ].join(' ');
    },

    getButtonRadius: function () {
        if (isNaN(this.borderRadius)) {

            var r = parseFloat(this.borderRadius);
            r = Math.min(50, r);

            return this.btnSize * r / 100;

        }
        return Math.min(this.btnSize / 2, this.borderRadius);

    },

    resizeHorizontal: function () {
        var s = this.svg();
        this.btnSize = this.buttonSize(s.height);
        var width = this.totalSize();
        var left = (s.width - width) * this.anchor[0];
        var top = (s.height - this.btnSize) * this.anchor[1];
        var change = this.btnSize + this.getSpacing();
        var props = {
            x: 0, y: 0, width: this.btnSize, height: this.btnSize

        };

        var overlayPath = this.overlayPath(props);
        jQuery.each(this.els.buttons, function (name, g) {
            g.setTranslate(left, top);
            this.els.buttonRects[name].setAttributes(props);
            this.els.clipRects[name].setAttributes(props);
            this.els.overlays[name].set('d', overlayPath);
            this.els.buttonPaths[name].set('d', this.getPath(name).join(' '));
            left += change;

        }.bind(this));
    },

    toPath: function (points) {

        var innerWidth = this.btnSize * 0.65;
        var innerHeight = this.btnSize * 0.55;
        var innerX = (this.btnSize - innerWidth) / 2;
        var innerY = (this.btnSize - innerHeight) / 2;

        var x = function (x) {
            return innerX + (innerWidth * x / 10)
        };
        var y = function (y) {
            return innerY + (innerHeight * y / 10);
        };
        var ind = 0;
        jQuery.each(points, function (i, p) {
            if (!isNaN(p)) {
                points[i] = ind % 2 == 0 ? x(p) : y(p);
                ind++;
            } else {
                ind = 0;
            }
        });

        return points;
    },


    getPath: function (btnName) {


        switch (btnName) {
            case 'start':
                return this.toPath(['M',
                    0, 0,
                    'L', 0, 10,
                    2, 10,
                    2, 0, 'Z',
                    'M', 2.5, 5,
                    'L', 6, 1.5,
                    6, 3.5,
                    10, 3.5,
                    10, 6.5,
                    6, 6.5,
                    6, 8.5,
                    2.5, 5,
                    'Z'
                ]);

            case 'pause':
                return this.toPath([
                    'M', 2, 1,
                    'L', 2, 9,
                    4, 9,
                    4, 1, 'Z',
                    'M', 6, 1,
                    'L', 6, 9,
                    8, 9,
                    8, 1, 'Z'
                ]);

            case 'previous':
                return this.toPath(['M', 0, 5,
                    'L', 4, 1,
                    4, 3,
                    9, 3,
                    9, 7,
                    4, 7,
                    4, 9,
                    'Z'
                ]);
            case 'play':
                return this.toPath(['M',
                    3, 1, 'L', 8, 5, 3, 9, 'Z'
                ]);
            case 'next':
                return this.toPath(['M', 1, 3, 'L', 5, 3, 5, 1, 9, 5, 5, 9, 5, 7, 1, 7, 'Z']);

            case 'end':
                return this.toPath(['M', 0, 3.5,
                    'L', 4, 3.5, 4, 1.5,
                    7, 5,
                    4, 8.5,
                    4, 6.5, 0, 6.5, 'Z',

                    'M', 7.8, 0.5, 'L',
                    9.8, 0.5,
                    9.9, 9.5,
                    7.9, 9.5]);

            case 'flip':
                return this.toPath([
                    'M', 2.75, 0,
                    'L',
                    0.5, 3.5, 2, 3.5,
                    2, 9.5,
                    3.5, 9.5,
                    3.5, 3.5,
                    5, 3.5, 'Z',
                    'M',
                    6, 0, 'L',
                    6, 6,
                    4.5, 6,
                    6.75, 9.5,
                    9, 6,
                    7.5, 6,
                    7.5, 0, 'Z'

                ]);

            default:
                return this.toPath(['M', 0, 0, 'L', 10, 0, 10, 10, 0, 10, 'Z'])

        }
    },

    resizeVertical: function () {

    },

    totalSize: function () {
        return (this.btnSize * this.buttons.length) + (this.getSpacing() * (this.buttons.length - 1));
    },

    getSpacing: function () {
        return this.btnSize * this.spacing / 100;
    },


    setController: function (controller) {
        this.parent(controller);

        this.controller.addEvent('startOfGame', this.startOfGame.bind(this));
        this.controller.addEvent('notStartOfGame', this.notStartOfBranch.bind(this));
        this.controller.addEvent('endOfBranch', this.endOfBranch.bind(this));
        this.controller.addEvent('notEndOfBranch', this.notEndOfBranch.bind(this));
        this.controller.addEvent('startAutoplay', this.startAutoPlay.bind(this));
        this.controller.addEvent('stopAutoplay', this.stopAutoPlay.bind(this));
        this.controller.addEvent('newGame', this.newGame.bind(this));
    },


    startOfGame: function () {
        this.disableButton('start');
        this.disableButton('previous');

    },

    notStartOfBranch: function () {
        this.enableButton('start');
        this.enableButton('previous');
        this.enableButton('play');
    },
    endOfBranch: function () {
        this.disableButton('end');
        this.disableButton('next');
        this.disableButton('play');
        this.isAtEndOfBranch = true;
        this.autoPlayMode = false;
    },

    notEndOfBranch: function (model) {
        this.isAtEndOfBranch = false;
        this.enableButton('end');
        this.enableButton('next');
        if (!model.isInAutoPlayMode()) {
            this.stopAutoPlay();
            this.enableButton('play');
        }

    },

    autoPlayMode: false,
    startAutoPlay: function () {
        this.els.buttonPaths['play'].set('d', this.getPath('pause').join(' '));

        this.enableButton('play');
        this.cssButton('play', 'Play');
        this.autoPlayMode = true;

    },

    stopAutoPlay: function () {
        if(!this.hasButton('play'))return;
        this.els.buttonPaths['play'].set('d', this.getPath('play').join(' '));
        if (!this.autoPlayMode)return;
        this.autoPlayMode = false;
        this.cssButton('play', '');

        if (this.isAtEndOfBranch) {
            this.disableButton('play');
        }

    },

    hasButton:function(name){
        return this.buttons.indexOf(name) != -1;
    },

    newGame: function () {

    },

    disableButton: function (name) {
        if(!this.hasButton(name))return;
        if (!this.isDisabled(name)) {
            this.disabledButtons.push(name);
            this.cssButton(name, 'Disabled');
            this.els.overlays[name].hide();
        }
    },

    enableButton: function (name) {
        if(!this.hasButton(name))return;
        if (this.isDisabled(name)) {
            var ind = this.disabledButtons.indexOf(name);
            this.disabledButtons.splice(ind, 1);
            this.cssButton(name, '');
            this.els.overlays[name].show();
        }
    },

    buttonSize: function (availSize) {
        return availSize * 0.9;
    }


});