var SVGFont = new Class({

    font: undefined,
    renderTo: undefined,

    pieces: ['p', 'b', 'n', 'r', 'q', 'k'],
    colors: ['w', 'b'],

    svgs: undefined,

    received: 0,

    y: undefined,

    initialize: function (config) {
        this.renderTo = config.renderTo;
        this.font = config.font;
        this.name = config.name;

        this.fill = config.fill;
        this.stroke = config.stroke;

        this.createViews();
    },

    createViews: function () {

        this.svgs = [];

        jQuery.each(this.colors, function (c, color) {

            jQuery.each(this.pieces, function (p, piece) {
                var svg = new SVG({
                    renderTo: this.renderTo,
                    color: color,
                    type: piece,
                    font: this.font,
                    fill: this.fill,
                    stroke: this.stroke,
                    css: {
                        padding: 0,
                        'background-color': '#999'
                    },
                    layout: {
                        width: 47, height: 47
                    },
                    listeners: {
                        'fontRendered': this.receive.bind(this)
                    }
                });
                this.svgs.push(svg);
            }.bind(this));
        }.bind(this));
    },

    receive: function (x, y, svg) {
        this.received++;

        if (this.y == undefined)this.y = y; else {
            this.y = Math.min(this.y, y);
        }


        if (this.received == 12) {
            jQuery.each(this.svgs, function (i, svg) {
                svg.offsetY(this.y);

                var content = svg.getBody()[0].innerHTML;
                var url = 'output/svg_' + this.name + 45 + svg.color + svg.type + '.svg';
                $.ajax({
                    url: 'controller.php',

                    data: {
                        save: url,
                        data: content
                    },
                    method: 'post',
                    complete: function () {
                        $(document.body).append($('<img src="' + url + '" style="width:45px">'));
                    }
                });
            }.bind(this));
        }
    }
});

var SVGMapping = {
    'ChessAlpha2.ttf': {
        'p': 'i',
        'b': 'j',
        'n': 'k',
        'r': 'l',
        'q': 'm',
        'k': 'n',
        'P': 'I',
        'B': 'J',
        'N': 'K',
        'R': 'L',
        'Q': 'M',
        'K': 'N'
    },
    'Alpha.ttf': {
        'p': 'p',
        'b': 'b',
        'n': 'h',
        'r': 'r',
        'q': 'q',
        'k': 'k',
        'P': 'o',
        'B': 'n',
        'N': 'j',
        'R': 't',
        'Q': 'w',
        'K': 'l'

    },
    'Chess Merida.ttf': {
        'p': 'p',
        'b': 'b',
        'n': 'h',
        'r': 'r',
        'q': 'q',
        'k': 'k',
        'P': 'o',
        'B': 'v',
        'N': 'm',
        'R': 't',
        'Q': 'w',
        'K': 'l'

    },
    'default': {
        'p': 'p',
        'b': 'b',
        'n': 'n',
        'r': 'r',
        'q': 'q',
        'k': 'k',
        'P': 'o',
        'B': 'v',
        'N': 'm',
        'R': 't',
        'Q': 'w',
        'K': 'l'
    }

};

var SVG = new Class({

    Extends: ludo.View,

    alpha: {
        'p': 'i',
        'b': 'j',
        'n': 'k',
        'r': 'l',
        'q': 'm',
        'k': 'n'
    },

    xOffset: 0,
    yOffset: 0,

    points: undefined,
    /*
     ilkjmn
     IJKLMN
     */

    __canvas: undefined,

    path: undefined,

    layout: {
        width: 45,
        height: 45
    },

    __construct: function (config) {

        this.parent(config);

        this.renderTo = config.renderTo;
        this.type = config.type;
        this.color = config.color;
        this.font = config.font;
        this.fill = config.fill || '#FFF';
        this.stroke = config.stroke || '#000';

        this.__canvas = $('<canvas style="width:500px;height:500px"></canvas>');
        this.__canvas.css('display', 'none');
        $(document.body).append(this.__canvas);
    },

    getPaths: function () {
        opentype.load(this.font, function (err, font) {
            if (err) {
                console.error(err);
            } else {
                this.__canvas[0].getContext('2d');
                // Construct a Path object containing the letter shapes of the given text.
                // The other parameters are x, y and fontSize.
                // Note that y is the position of the baseline.

                var char = this.getChar();

               

                var path = font.getPath(char, 0, this.svg().height, this.svg().height);

                this.draw(path);


            }
        }.bind(this));
    },

    getChar: function () {
        var t = this.type;
        var f = SVGMapping[this.font] != undefined ? SVGMapping[this.font] : SVGMapping['default'];
        if (this.color == 'b')t = t.toUpperCase();
        var char = f[t];
        return char;
    },

    __rendered: function () {
        this.parent();

        var s = this.svg();

        this.g = s.$('g');
        s.append(this.g);

        this.path = s.$('path');
        this.path.css('fill', this.stroke);
        this.path.css('stroke-width', 0);
        this.g.append(this.path);
    },

    __created: false,

    resize: function (size) {
        this.parent(size);
        if (!this.__created) {
            this.__created = true;
            this.getPaths();

        }

    },

    draw: function (path) {

        var p = [];
        jQuery.each(path.commands, function (i, c) {
            jQuery.each(c, function (k, v) {
                p.push(v);
            });
        });
        this.path.set('d', p.join(' '));

        this.path.set('fill-rule', 'even-odd');

        var rect = this.path.el.getBoundingClientRect();
        var x = (this.svg().width / 2) - (rect.width / 2);
        var y = -((this.svg().height / 2) - (rect.height / 2));

        this.xOffset = x;
        this.yOffset = y;

        this.points = p;

        this.offsetX(x);


        this.fireEvent('fontRendered', [x, y]);
    },

    offX: 0,
    offY: 0,

    offsetX: function (x) {
        this.offX = x;
    },

    offsetY: function (y) {
        this.offY = y;

        this.finalize();
    },

    finalize: function () {
        this.offset(this.offX, this.offY);
    },


    offset: function (x, y) {

        console.log(x,y);
        x = 0;y=0;
        var s = this.svg();


        var final = [];
        var index = 0;


        jQuery.each(this.points, function (i, val) {
            if (isNaN(val)) {
                final.push(val);
                index = 0;
            } else {
                final.push(val + (index % 2 == 1 ? y : x));
                index++;
            }
        });


        var p = s.$('path');
        this.g.append(p);
        var points = [];
        jQuery.each(this.points, function (i, val) {
            if (isNaN(val)) {
                if (val == 'M' && index > 0) {
                    points.push('Z');
                    p.set('d', points.join(' '));
                    p.set('fill', this.fill);
                    p = s.$('path');
                    this.g.append(p);
                    points = [];
                }
                points.push(val);
                index = 0;
            } else {
                points.push(val + (index % 2 == 1 ? y : x));
                index++;
            }

        }.bind(this));
        final.push('Z');
        p.set('d', final.join(' '));


        this.points = final;
        this.path.set('d', final.join(' '));
        this.path.toFront();


    }

});