/**
 * Rename a database
 * Created by alfmagne1 on 05/02/2017.
 */

chess.wordpress.RenameDatabaseDialog = new Class({
    Extends: ludo.dialog.Dialog,
    submodule: 'wordpress.publishdialog',
    modal: true,
    autoRemove:false,
    title:chess.__('Rename Database'),
    buttonConfig:'RenameCancel',

    layout:{
        width:300,
        height:150,
        type:'linear', orientation:'vertical'
    },
    css:{
        padding:5
    },
    pgn:undefined,

    __rendered:function(){
        this.parent();
        this.on('rename', this.sendRenameEvent.bind(this));
    },

    __children:function(){
        return [
            {
                type:'form.Label', label:chess.__('New name'), labelFor:'pgn_name'
            },
            {
                name:'pgn_name', type:'form.Text', required:true, placeholder: chess.__('New name')
            }
        ]
    },

    show:function(pgn){
        this.pgn = pgn;
        this.parent();

        this.child['pgn_name'].val(pgn.pgn_name);
        this.child['pgn_name'].select();
    },

    sendRenameEvent:function(){
        this.fireEvent('renameDatabase', [this.pgn, this.child['pgn_name'].val()]);
    }

});
