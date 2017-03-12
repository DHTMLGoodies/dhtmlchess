chess.wordpress.DiscardDraftDialog = new Class({
    Extends: ludo.dialog.Confirm,
    submodule:'wordpress.discarddraftdialog',
    title: chess.__('Discard draft'),
    _html: chess.__('Are you sure you want to discard this draft?'),
    buttonConfig:'YesNo',
    autoRemove:false,
    layout:{
        width:300,height:150
    },
    resizable:false,
    modal:true
});