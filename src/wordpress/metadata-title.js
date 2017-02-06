chess.wordpress.MetadataTitle = new Class({
    Extends: chess.view.metadata.Game,
    submodule: 'wordpress.metadatatitle',

    metadata:undefined,
    dirty:false,
    css:{
        'line-height' : '120%'
    },
    tpl: function(metadata){

        metadata = metadata || this.metadata;

        if(!metadata)return;


        if(metadata && (metadata.white || metadata.black)){
            var w = metadata.white ? metadata.white : '?';
            var b = metadata.black ? metadata.black : '?';
            var ret = '';

            if(metadata.id){
                ret += '<div class="game_id">Game ID: ' + metadata.id + '</div>';
            }

            ret +=w + ' vs ' + b + ' ' + metadata.result;
            if(this.dirty){
                ret += '<sup>*</sup>';
            }
            if(metadata.pgn){
                ret += '<br><span style="font-size:0.7em">PGN: ' + metadata.pgn + '</span>'
            }

            return ret;
        }

        this.metadata = metadata;
    },

    setController:function(controller){
        this.parent(controller);
        this.controller.on('clean', this.setClean.bind(this));
        this.controller.on('dirty', this.setDirty.bind(this));
        this.controller.on('updateMetadata', this.updateMetadata.bind(this));

    },

    setClean:function(){
        this.dirty = false;
        this.updateMetadata(this.controller.currentModel);
    },

    setDirty:function(){
        this.dirty = true;
        this.updateMetadata(this.controller.currentModel);
    }
});