/**
 * Created by alfmagne1 on 17/01/2017.
 */
chess.view.board.Background = new Class({

    view: undefined,

    paths: {
        t: undefined, l: undefined, r: undefined, b: undefined
    },

    els: undefined,

    verticalSize: undefined,
    horizontalSize: undefined,

    size: undefined,

    borderRadius: 0,

    initialize: function (config) {
        this.view = config.view;
        this.svg = this.view.svg();

        this.svg.css('position', 'absolute');

        if (config.borderRadius != undefined)this.borderRadius = config.borderRadius;


        this.view.on('boardResized', this.resize.bind(this));

        this.horizontal = config.horizontal;
        this.vertical = config.vertical;
        this.els = {};


        this.render();
    },

    render: function () {
        this.createClipPath();
        this.createPattern();

        this.createPath('t');
        this.createPath('l');
        this.createPath('b');
        this.createPath('r');

        this.applyPattern();
    },

    createClipPath: function () {
        this.els.clipPath = this.svg.$('clipPath');
        this.els.clip = this.svg.$('rect');
        this.els.clip.set('rx', this.borderRadius);
        this.els.clip.set('ry', this.borderRadius);
        this.els.clipPath.append(this.els.clip);
        this.svg.appendDef(this.els.clipPath);
    },

    createPath: function (key) {
        this.paths[key] = this.svg.$('path');
        this.paths[key].clip(this.els.clipPath);
        this.svg.append(this.paths[key]);

    },


    getPattern: function (image, sizeKey, imageKey) {
        var s = this.svg;
        var p = s.$('pattern');
        p.set('width', 1);
        p.set('height', 1);
        p.set('x', 0);
        p.set('y', 0);
        var img = this.els[imageKey] = s.$('image');
        var that = this;
        img.set('opacity', 0);
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
        img.set('xlink:href', image);
        p.append(img);
        s.appendDef(p);
        return p;
    },

    createPattern: function () {

        this.els.horizontalPattern = this.getPattern(this.horizontal, 'horizontalSize', 'horizontal');
        this.els.verticalPattern = this.getPattern(this.vertical, 'verticalSize', 'vertical');

    },

    updatePatternSize: function () {
        if (this.size == undefined)this.size = 1;
        if (this.horizontalSize != undefined) {
            this.els.horizontalPattern.set('width', Math.min(5, this.horizontalSize.x / this.size));
            this.els.horizontalPattern.set('height', Math.min(5, this.horizontalSize.y / this.size));
        }

        if (this.verticalSize != undefined) {
            this.els.verticalPattern.set('width', Math.min(5, this.verticalSize.x / this.size));
            this.els.verticalPattern.set('height', Math.min(5, this.verticalSize.y / this.size));
        }
    },

    applyPattern: function () {
        if (this.els.horizontal) {
            this.paths.t.setPattern(this.els.horizontalPattern);
            this.paths.b.setPattern(this.els.horizontalPattern);
        }

        if (this.els.vertical) {
            this.paths.l.setPattern(this.els.verticalPattern);
            this.paths.r.setPattern(this.els.verticalPattern);
        }
    },


    resize: function (size) {

        this.size = Math.min(size.width, size.height);

        this.els.clip.set('x', size.left);
        this.els.clip.set('y', size.top);
        this.els.clip.set('width', this.size);
        this.els.clip.set('height', this.size);

        var cx = size.width / 2 + size.left;
        var cy = size.height / 2 + size.top;
        var radius = this.size / 2;

        this.paths.t.set('d', [
            'M', cx, cy, 'L', cx - radius, cy - radius, cx + radius, cy - radius, 'Z'
        ].join(' '));
        this.paths.b.set('d', [
            'M', cx, cy, 'L', cx - radius, this.size, cx + radius, this.size, 'Z'
        ].join(' '));

        this.paths.l.set('d', [
            'M', cx, cy, cx - radius, cy - radius, cx - radius, cy + radius, 'Z'
        ].join(' '));

        this.paths.r.set('d', [
            'M', cx, cy, 'L', cx + radius, cy - radius, cx + radius, cy + radius, 'Z'
        ].join(' '));


        this.updatePatternSize();

    }

});