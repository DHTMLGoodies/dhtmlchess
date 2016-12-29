/**
 * Created by alfmagne1 on 29/12/2016.
 */

chess.view.score.Bar = new Class({
   Extends: ludo.View,

    __construct:function(config){
        this.parent(config);
        this.layout.type = 'Canvas';
    },

    __children:function(){
        return [
            {
                name:'scoreBar',
                type:'chess.view.score.BarBackground',
                layout:{
                    height:'matchParent',
                    width:'matchParent'
                }
            }

        ]
    },
    
    setScore:function(score){
        this.child['scoreBar'].setScore(score);
    }

});

chess.view.score.BarBackground = new Class({
    Extends: ludo.svg.Group,

    backgroundB:undefined,
    backgroundW:undefined,

    markerGroup:undefined,
    marker:undefined,

    textNode:undefined,

    score:0,

    rendered:function(){


        this.backgroundW = this.$('path');
        this.backgroundW.css('fill', '#AAA');


        this.append(this.backgroundW);


        this.backgroundB = this.$('path');
        this.backgroundB.css('fill', '#777');


        this.append(this.backgroundB);

        this.markerGroup = this.$('g');
        this.append(this.markerGroup);

        this.marker = this.$('path');
        this.markerGroup.append(this.marker);
        this.marker.css('fill', '#B71C1C');








        this.textNode = this.$('text');
        this.textNode.set('text-anchor', 'middle');
        this.textNode.text("0,0");
        this.textNode.css('font-size', this.height / 5);
        this.textNode.css('line-height', this.height / 5);
        this.textNode.css('fill', '#fff');
        this.markerGroup.append(this.textNode);
        this.textNode.setTranslate(0, this.height / 2);
        this.textNode.attr('alignment-baseline', 'central');

        this.resizeItems();

        this.updateScore();

    },

    resize:function(size){
        this.parent(size);
        if(this.backgroundB){
            this.resizeItems();
        }
    },

    xPos:function(){
        var size = this.width - this.height;

        var x = (this.width / 2) + (-this.score * size / 6);
        return Math.max(this.height, Math.min(size, x));
    },

    lastScore:undefined,

    updateScore:function(){

        if(this.score !== this.lastScore){
            this.textNode.text(this.score.toFixed(1));


            this.markerGroup.animate({
                translate: [this.xPos(), this.height/4]
            });

            this.lastScore = this.score;
        }
        this.updateScore.delay(1000, this);
    },

    resizeItems:function(){
        var r = this.height / 4;
        var c = this.width / 2;
        var h = this.height / 2;
        var p = ['M', c,0,
            'L', r, 0,
            'A', r, r, 0, 1,0, r, h,
            'L', c, h, c, 0 ];

        this.backgroundW.set('d', p.join(' '));

        p = ['M', c,0,
            'L', this.width - r, 0,
            'A', r, r, 0, 0,1, this.width - r, h,
            'L', c, h, c, 0 ];

        this.backgroundB.set('d', p.join(' '));

        p = [
            'M', 0, 0, 'L', -r/2, r, 'A', r, r, 0, 1, 0, r/2, r, 'L', 0, 0
        ];

        this.marker.set('d', p.join(' '));

        this.markerGroup.setTranslate(this.xPos(), r);


    },
    
    setScore:function(score){
        this.score = Math.round(score * 10) / 10;
    }
});


