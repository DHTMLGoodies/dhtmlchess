chess.wordpress.DiscardDraftButton = new Class({
    Extends: ludo.form.Button,
    submodule:'wordpress.discarddraft',
    value:chess.__('Discard'),

    
    setController:function(controller){
        this.parent(controller);
        
        controller.on('dirty', this.toggle.bind(this));
        controller.on('clean', this.toggle.bind(this));
    },
    
    toggle:function(){
        var m = this.controller.getCurrentModel();
        if(!m)return;
        var draftId = m.getMetadataValue('draft_id');

        if(!draftId){
            this.hide();
        }else{
            this.show();
        }
    }
});