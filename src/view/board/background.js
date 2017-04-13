/**
 * Created by alfmagne1 on 17/01/2017.
 */
chess.view.board.Background = new Class({

    type: 'chess.view.board.Background',
    view: undefined,

    paths: {
        t: undefined, l: undefined, r: undefined, b: undefined
    },

    els: undefined,

    verticalSize: undefined,
    horizontalSize: undefined,
    patternSize: undefined,

    size: undefined,

    borderRadius: 0,

    paint: undefined,

    square: true,

    pattern: undefined,

    initialize: function (config) {
        this.view = config.view;
        var svg = this.svg = this.view.svg();

        if (Browser.name == 'ie' || Browser.name == 'edge' || Browser.name == 'safari') {
            config.horizontal = undefined;
            config.vertical = undefined;
            config.paint = config.iePaint ? config.iePaint : {
                    fill: '#444'
                }

        }
        svg.css('position', 'absolute');
        svg.css('left', '0');
        svg.css('top', '0');
        if (config.square != undefined) this.square = config.square;
        if (config.borderRadius != undefined) this.borderRadius = config.borderRadius;

        this.view.on('boardResized', this.resize.bind(this));

        this.horizontal = config.horizontal;
        this.vertical = config.vertical;
        this.pattern = config.pattern;

        if (!this.horizontal && !this.pattern) {
            this.horizontal = ludo.config.getDocumentRoot() + 'images/transparent-dot.png';
            this.vertical = this.horizontal;
        }

        this.els = {};

        this.paint = config.paint;

        this.render();
    },

    render: function () {
        this.createClipPath();
        this.createPattern();


        this.createPath('t');
        this.createPath('l');
        this.createPath('b');
        this.createPath('r');

        if (!this.horizontal) {
            if (!this.pattern) this.paths.t.css('display', 'none');
            this.paths.l.css('display', 'none');
            this.paths.r.css('display', 'none');
            this.paths.b.css('display', 'none');
        }


        if (this.paint && !this.paint.fill) {
            this.els.paintRect.toFront();
        }

        this.applyPattern();
    },


    createClipPath: function () {
        var cp = this.els.clipPath = this.svg.$('clipPath');
        this.els.clip = this.svg.$('rect');

        cp.append(this.els.clip);
        this.svg.appendDef(cp);

        this.setBorderRadius(this.borderRadius);
    },

    createPath: function (key) {
        this.paths[key] = this.svg.$('path');
        this.paths[key].clip(this.els.clipPath);
        this.svg.append(this.paths[key]);

    },

    setPattern: function (horizontal, vertical) {
        this.setPatternItem(horizontal, this.els.horizontal);
        this.setPatternItem(vertical, this.els.vertical);
    },

    setPatternItem: function (path, image) {
        image.removeAttr('width');
        image.removeAttr('height');
        image.set('xlink:href', path);
    },

    /**
     * Set border radius in pixels or percent
     * @param radius
     */
    setBorderRadius: function (radius) {
        this.borderRadius = radius;
        if (isNaN(radius)) {
            radius = parseFloat(radius);
            radius = Math.min(this.svg.width, this.svg.height) * (radius / 100);
        }

        this.onNewBorderRadius(this.els.clip, radius);
        if (this.els.paintRect) {
            this.onNewBorderRadius(this.els.paintRect, radius);
        }

    },

    onNewBorderRadius: function (el, radius) {

        el.set('rx', radius);
        el.set('ry', radius);

    },

    getPattern: function (image, sizeKey, imageKey) {
        var s = this.svg;
        var p = s.$('pattern');
        p.set('width', 1);
        p.set('height', 1);
        p.set('x', 0);
        p.set('y', 0);
        var img = this.els[imageKey] = s.$('image');
        this.loadImage(img, sizeKey, image);

        p.append(img);
        s.appendDef(p);
        return p;
    },

    loadImage: function (img, sizeKey, href) {
        var that = this;
        img.set('opacity', 0);

        img.removeAttr('width');
        img.removeAttr('height');

        img.on('load', function () {
            var bbox = this.getBBox();
            that[sizeKey] = {
                x: bbox.width, y: bbox.height
            };

            img.set('width', bbox.width);
            img.set('height', bbox.height);
            img.set('opacity', 1);

            that.updatePatternSize();

        }.bind(img));

        img.set('xlink:href', href);
        return img;
    },

    createPattern: function () {

        if (this.paint != undefined) {
            var r = this.els.paintRect = this.svg.$('rect');
            r.css(this.paint);
            this.svg.append(r);
            if (!this.paint.fill) {
                r.css('fill-opacity', 0);
            }
            r.toFront();
        }

        if (this.pattern) {
            this.els.pattern = this.getPattern(this.pattern, 'patternSize', 'pattern');
        } else if (this.horizontal) {
            this.els.horizontalPattern = this.getPattern(this.horizontal, 'horizontalSize', 'horizontal');
            this.els.verticalPattern = this.getPattern(this.vertical, 'verticalSize', 'vertical');
        }

    },

    updatePatternSize: function () {
        if (this.size == undefined) this.size = {x: 1, y: 1};

        var min = 5;

        if (this.pattern && this.patternSize != undefined) {

            this.els.pattern.set('width', Math.min(min, this.patternSize.x / this.size.x));
            this.els.pattern.set('height', Math.min(min, this.patternSize.y / this.size.y));
        }

        if (this.horizontal && this.horizontalSize != undefined) {

            this.els.horizontalPattern.set('width', Math.min(min, this.horizontalSize.x / this.size.x));
            this.els.horizontalPattern.set('height', Math.min(min, this.horizontalSize.y / this.size.y));
        }

        if (this.vertical && this.verticalSize != undefined) {
            this.els.verticalPattern.set('width', Math.min(min, this.verticalSize.x / this.size.x));
            this.els.verticalPattern.set('height', Math.min(min, this.verticalSize.y / this.size.y));
        }
    },

    applyPattern: function () {
        var paths = this.paths;
        if (this.els.pattern) {
            paths.t.setPattern(this.els.pattern);
        }
        if (this.els.horizontal) {
            paths.t.setPattern(this.els.horizontalPattern);
            paths.b.setPattern(this.els.horizontalPattern);
        }

        if (this.els.vertical) {
            paths.l.setPattern(this.els.verticalPattern);
            paths.r.setPattern(this.els.verticalPattern);
        }
    },

    updateRect: function (rect, left, top, width, height, rx, ry) {

        rect.set('x', left);
        rect.set('y', top);
        rect.set('width', width);
        rect.set('height', height);


    },

    resize: function (size) {

        var sw = 0;
        if (this.paint != undefined && this.paint['stroke-width']) {
            sw = parseFloat(this.paint['stroke-width']);
        }


        if (this.square) {
            var min = Math.min(size.width, size.height);
            this.size = {x: min, y: min};
        } else {

            this.size = {x: size.width, y: size.height};
        }

        if (this.els.paintRect) {
            this.updateRect(this.els.paintRect, size.left + sw / 2, size.top + sw / 2, this.size.x - sw, this.size.y - sw, this.borderRadius, this.borderRadius);
        }

        this.updateRect(this.els.clip, size.left, size.top, this.size.x, this.size.y,
            this.borderRadius, this.borderRadius);


        var cx = size.width / 2 + size.left;
        var cy = size.height / 2 + size.top;
        var radius = this.size.x / 2;
        var radiusY = this.size.y / 2;

        radius -= sw;

        if (this.pattern) {

            this.paths.t.set('d', [
                'M', cx - radius, cy - radiusY,
                'L', cx - radius, cy + radiusY,
                cx + radius, cy + radiusY, cx + radius, cy - radiusY, 'Z'
            ].join(' '));


        } else {
            this.paths.t.set('d', [
                'M', cx, cy, 'L', cx - radius, cy - radiusY, cx + radius, cy - radiusY, 'Z'
            ].join(' '));
            this.paths.b.set('d', [
                'M', cx, cy, 'L', cx - radius, cy + radiusY, cx + radius, cy + radiusY, 'Z'
            ].join(' '));

            this.paths.l.set('d', [
                'M', cx, cy, cx - radius, cy - radiusY, cx - radius, cy + radiusY, 'Z'
            ].join(' '));

            this.paths.r.set('d', [
                'M', cx, cy, 'L', cx + radius, cy - radiusY, cx + radius, cy + radiusY, 'Z'
            ].join(' '));
        }


        this.setBorderRadius(this.borderRadius);

        this.updatePatternSize();
    }
});