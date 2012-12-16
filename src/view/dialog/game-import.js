/**
 * Game import dialog. Game import is only available to users with game edit privileges.
 * @namespace chess.view.dialog
 * @submodule Dialog
 * @class GameImport
 *
 */
chess.view.dialog.GameImport = new Class({
    Extends:ludo.Window,
    name:'game-import',
    form:{
        url:window.chess.URL,
        name:'game-import'
    },
    width:400,
    height:240,
    autoHideOnBtnClick:false,
    title:'Import PGN',
    layout:'rows',
    children:[
        {
            type:'form.File', label:'Pgn File', accept:'pgn', name:'pgnfile', required:true, labelButton:'Find Pgn file', buttonWidth:100
        },
        {
            type:'form.Checkbox', label:'As new database', checked:true, name:'importAsNew', value:'yes'
        },
        {
            type:'form.Text', label:'Database name', name:'newDatabase'
        },
        {
            type:'form.ComboTree', emptyText:'Select folder', treeConfig:{ type:'chess.view.tree.SelectFolder', width:500, height:350 }, label:'Into folder', name:'folder'
        },
        {
            hidden:true, type:'form.ComboTree', emptyText:'Select database', treeConfig:{ type:'chess.view.folder.Tree', width:500, height:350 }, label:'Into database', name:'database'
        },
        {
            type:'progress.Bar', name : 'progressbar'
        },
        {
            type:'progress.Text', css : { 'text-align' : 'center' }
        }
    ],
    buttonBar:{
        children:[
            {
                type:'form.SubmitButton', value:'Import'},
            {
                type:'form.CancelButton', value:'Cancel'
            }
        ]
    },

    ludoEvents:function(){
        this.parent();
        this.getFormManager().addEvent('success', this.importFinished.bind(this));
    },

    importFinished:function(data){

        this.hideAfterDelay(2);
        this.clearForm();
        this.fireEvent('pgnImportComplete');
        this.child['progressbar'].finish();
    },

    ludoRendered:function () {
        this.parent();
        this.child['importAsNew'].addEvent('change', this.toggleImport.bind(this));
    },

    toggleImport:function (value,obj) {
        if (value) {
            this.child['newDatabase'].show();
            this.child['folder'].show();
            this.child['database'].hide();
        } else {
            this.child['database'].show();
            this.child['newDatabase'].hide();
            this.child['folder'].hide();
        }
    }
});