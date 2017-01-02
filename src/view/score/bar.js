/**
 * Created by alfmagne1 on 29/12/2016.
 */

chess.view.score.Bar = new Class({
    Extends: ludo.View,

    borderRadius: undefined,

    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['borderRadius','whiteColor','blackColor','markerColor','markerTextColor','stroke','range']);
        this.layout.type = 'Canvas';
    },

    __children: function () {
        return [
            {
                name: 'scoreBar',
                type: 'chess.view.score.BarBackground',
                layout: {
                    height: 'matchParent',
                    width: 'matchParent',
                },
                borderRadius: this.borderRadius,
                whiteColor:this.whiteColor,
                blackColor:this.blackColor,
                markerColor:this.markerColor,
                markerTextColor:this.markerTextColor,
                stroke:this.stroke,
                range:this.range
            }

        ]
    },

    setScore: function (score) {
        this.child['scoreBar'].setScore(score);
    }

});

chess.view.score.BarBackground = new Class({
    Extends: ludo.svg.Group,
    range: 3,
    backgroundB: undefined,
    backgroundW: undefined,

    markerGroup: undefined,
    marker: undefined,

    textNode: undefined,
    borderRadius: undefined,

    score: 0,

    scoreRectGroups: undefined,
    scoreRects: undefined,
    scoreRectTexts: undefined,

    strokeRect: undefined,

    debugCircle: undefined,

    whiteColor:'#d2d2d2',
    blackColor:'#333333',

    markerColor:'#B71C1C',
    markerTextColor:'#FFFFFF',
    stroke:'#ddd',

    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['borderRadius','whiteColor','blackColor','markerColor','markerTextColor','stroke','range']);
    },

    rendered: function () {
        this.backgroundW = this.$('path');
        this.backgroundW.css('fill', this.whiteColor);
        this.append(this.backgroundW);

        this.backgroundB = this.$('path');
        this.backgroundB.css('fill', this.blackColor);
        this.append(this.backgroundB);

        this.createScoreRects();

        this.markerGroup = this.$('g');
        this.append(this.markerGroup);

        this.marker = this.$('path');
        this.markerGroup.append(this.marker);
        this.marker.css('fill', this.markerColor);

        this.textNode = this.$('text');
        this.textNode.set('text-anchor', 'middle');
        this.textNode.text("0,0");
        this.textNode.css('fill', this.markerTextColor);
        this.markerGroup.append(this.textNode);



        this.textNode.attr('alignment-baseline', 'central');


        this.strokeRect = this.$('path');
        this.strokeRect.css('fill-opacity', 0);
        this.strokeRect.css('stroke', this.stroke);
        this.append(this.strokeRect);


        this.markerGroup.toFront();


        this.resizeItems();

        this.updateScore();

    },

    createScoreRects: function () {
        var colorUtil = new ludo.color.Color();

        this.scoreRects = [];
        this.scoreRectGroups = [];
        this.scoreRectTexts = [];

        var s = this.scoreArea();

        var fill = colorUtil.offsetBrightness(this.whiteColor, -(this.range * 10));
        var score = this.range;
        var x = this.scoreAreaStart();


        var textFill = this.blackColor;
        for (var i = 0; i < this.range * 2; i++) {

            if (i == this.range) {
                fill = colorUtil.offsetBrightness(this.blackColor, (this.range * 10) + 10);
                textFill = this.whiteColor;
            }

            var index = i % this.range;
            var fillOpacity = i >= this.range ? this.range - 1 - index : index;

            var g = this.$('g');
            this.append(g);

            var h = (this.height / 2) - (this.height * i / 24);

            var r = this.$('rect', {x: 0, y: 0, height: h, width: s / (this.range * 2)});
            r.css('fill-opacity', (fillOpacity / this.range) * 1);
            r.css('fill', fill);

            g.append(r);

            var t = this.$('text');
            t.set('text-anchor', i < this.range ? 'start' : 'end');
            t.set('font-size', this.height / 4);
            t.set('x', s / 6);
            t.css('fill', textFill);
            t.attr('alignment-baseline', 'after-edge');

            t.text(score);
            g.append(t);

            this.scoreRectGroups.push(g);
            this.scoreRects.push(r);
            this.scoreRectTexts.push(t);

            g.setTranslate(x, 0);

            x += s / 6;

            score--;
            if (score == 0)score = -1;
        }

        this.scoreRectGroups[2].toFront();
        this.scoreRectGroups[3].toFront();
        this.scoreRectGroups[5].toFront();
        this.scoreRectGroups[4].toFront();
    },

    resizeRects: function () {

        var s = this.scoreArea();
        var x = this.scoreAreaStart();
        var ah = this.scoreRectWidth();

        var w = s / 2;
        var t = (this.range * 2);

        for (var i = 0; i < this.range * 2; i++) {
            var index = i % this.range;
            if (i == this.range)w = s / t;
            if (i >= this.range)index = this.range - 1 - index;

            var h = (ah) - (this.height * index / t);


            this.scoreRectGroups[i].setTranslate(x, ah - h);
            this.scoreRects[i].set('width', w);
            this.scoreRects[i].set('height', h);
            this.scoreRectTexts[i].set('x', i >= this.range ? w - 2 : 2);
            this.scoreRectTexts[i].set('y', h - 1);

            if (i < this.range) {
                w -= s / t;
                x += s / t;
            } else {
                w += s / t;
            }
        }
    },

    scoreAreaStart: function () {
        return this.height / 2;
    },
    scoreArea: function () {
        return this.width - this.height;
    },

    scoreRectWidth: function () {
        return this.height * 0.7;
    },

    resize: function (size) {
        this.parent(size);
        if (this.backgroundB) {
            this.resizeItems();
        }
    },

    xPos: function () {
        var size = this.scoreArea();
        var s = ludo.util.clamp(this.score, -this.range, this.range);
        return (this.width / 2) + (-s * size / (this.range * 2));
    },

    lastScore: undefined,

    updateScore: function () {

        if (this.score !== this.lastScore) {
            this.textNode.text(Math.abs(this.score).toFixed(1));
            this.markerGroup.animate({
                translate: [this.xPos(), 0]
            });
            this.lastScore = this.score;
        }
        this.updateScore.delay(500, this);
    },

    resizeItems: function () {
        var c = this.width / 2;
        var h = this.scoreRectWidth();
        var r = this.borderRadius ? this.borderRadius : h / 2;

        var right = this.width - r;
        var left = r;

        var p = ['M', left, 0,
            'L', c, 0, c, h, left, h,
            'A', r, r, 0, 0, 1, 0, h - r,
            'L', 0, r,
            'A', r, r, 0, 0, 1, left, 0];

        this.backgroundW.set('d', p.join(' '));

        p = ['M', c, 0,
            'L', right, 0,
            'A', r, r, 0, 0, 1, this.width, r,
            'L', this.width, h - r,
            'A', r, r, 0, 0, 1, right, h,
            'L', c, h, c, 0];

        this.backgroundB.set('d', p.join(' '));


        p = ['M', left, 0,
            'L', right, 0,
            'A', r, r, 0, 0, 1, this.width, r,
            'L', this.width, h - r,
            'A', r, r, 0, 0, 1, right, h,
            'L', left, h,
            'A', r, r, 0, 0, 1, 0, h - r,
            'L', 0, r,
            'A', r, r, 0, 0, 1, left, 0

        ];


        this.strokeRect.set('d', p.join(' '));


        r = h / 2;
        p = [
            'M', 0, 0, 'L', -r / 2, r, 'A', r, r, 0, 1, 0, r / 2, r, 'L', 0, 0
        ];

        this.marker.set('d', p.join(' '));

        this.markerGroup.setTranslate(this.xPos(), 0);
        this.textNode.setTranslate(0, (r / 2) + this.height / 2);
        this.textNode.css('font-size', r / 1.5);
        this.textNode.css('line-height', r / 1.5);

        //  this.debugCircle.setTranslate(0, (r/2) + this.height / 2);

        this.resizeRects();

    },

    setScore: function (score) {
        score = ludo.util.clamp(score, -100, 100);
        this.score = Math.round(score * 10) / 10;
    }
});


