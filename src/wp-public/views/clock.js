/**
 * Created by alfmagne1 on 08/04/2017.
 */
chess.Clock = new Class({
    Extends: ludo.View,

    startTime: 0,
    endTime:0,

    cv: undefined,

    stopped:true,

    interval: undefined,

    __rendered: function () {
        this.parent();

        this.cv = jQuery('<div class="wpc-clock"></div>');
        this.cv.appendTo(this.$b());
        this.reset();
        this.showTime();
    },

    createInterval:function(){
        if(this.interval){
            clearInterval(this.interval);
        }
        this.interval = setInterval(this.showTime.bind(this), 1000);
    },

    reset:function(){
        this.stopped = true;
        this.startTime = this.endTime = new Date().getTime();

    },

    start:function(){
        this.stopped = false;
        this.createInterval();
        this.showTime();
    },

    stop:function(){
        this.stopped = true;
        this.endTime = new Date().getTime();
    },

    elapsed:function(){
        if(this.stopped){
            return this.endTime - this.startTime;
        }
        return new Date().getTime() - this.startTime;
    },

    timeAsString:function(){
        var elapsed = this.elapsed();
        var sec = Math.floor(elapsed / 1000);
        var min = Math.floor(sec / 60);
        sec = sec % 60;
        var pad = sec < 10 ? "0" : "";
        return min + ":" + pad + sec;
    },

    showTime: function () {
        this.cv.html(this.timeAsString());
    },

    resize: function (size) {
        this.parent(size);
        var h = this.$b().height();
        this.$b().css({
            'line-height': h + 'px',
            'font-size' : h
        });
    }
});