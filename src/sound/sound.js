chess.sound.Sound = new Class({
    Extends: ludo.Core,
    type: 'chess.sound.Sound',
    singleton: true,
    sounds: {},

    __construct: function (config) {
        this.parent(config);
        this.sounds = {
            'capture': ['capture1.mp3', 'capture2.mp3'],
            'move': ['move1.mp3', 'move2.mp3'],
            'castle': ['castle1.mp3', 'castle2.mp3']
        };
        this.createAudios();
    },

    add: function (controller) {
        controller.on('animationComplete', this.receivedEvent.bind(this));
    },

    receivedEvent: function (model) {
        var m = model.currentMove;
        if(m != undefined && m.m != undefined){
            this.playSound(m.m);
        }
    },

    playSound:function(move){
        this.getSound(move).play();
    },

    getSound:function(move){
        var key;
        if(move.indexOf('x') > 0)key = 'capture';
        else if(move.indexOf('O-0') >= 0) key = 'castle';
        else key = 'move';
        var obj = this.sounds[key];
        var len = obj.length;
        return obj[Math.floor(Math.random() * len)];
    },

    createAudios:function(){

        jQuery.each(this.sounds, function(key, sounds){
            jQuery.each(sounds, function(i, sound){
                var url = ludo.config.getDocumentRoot() + 'sound/' + sound;
                this.sounds[key][i] = new Audio(url);
            }.bind(this));
        }.bind(this));
    }

});
ludo.factory.createAlias('chess.sound.Sound', chess.sound.Sound);