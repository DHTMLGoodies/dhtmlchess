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
        resource:'GameImport'
    },
    layout:{
        width:400,
        height:240,
        left:50,top:50,
        type:'linear',
        orientation:'vertical'
    },

    autoHideOnBtnClick:false,
    title:'Import PGN',
    children:[
        {
            type:'form.File', resource:'ChessFileUpload', label:chess.getPhrase('Pgn File'), accept:'pgn', name:'pgnFile', required:true, labelButton:'Find Pgn file', buttonWidth:100
        },
        {
            type:'form.Checkbox', label:chess.getPhrase('As new database'), checked:true, name:'importAsNew', value:'yes'
        },
        {
            type:'form.Text', label:chess.getPhrase('Database name'), name:'newDatabase'
        },
        {
            type:'form.ComboTree', emptyText:'Select folder', treeConfig:{ type:'chess.view.tree.SelectFolder', width:500, height:350 }, label:chess.getPhrase('Into folder'), name:'folder'
        },
        {
            hidden:true, type:'form.ComboTree', emptyText:'Select database', treeConfig:{ type:'chess.view.folder.Tree', width:500, height:350 }, label:chess.getPhrase('Into database'), name:'database'
        },
        {
            type:'progress.Bar', name : 'progressbar', listenTo:'GameImport/save'
        },
        {
            type:'progress.Text', css : { 'text-align' : 'center', listenTo:'GameImport/save' }
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
        this.getForm().addEvent('success', this.importFinished.bind(this));
    },

    importFinished:function(){
        this.hideAfterDelay(2);
        this.getForm().clear();
        this.fireEvent('pgnImportComplete');
        this.child['progressbar'].finish();
    },

    ludoRendered:function () {
        this.parent();
        this.child['importAsNew'].addEvent('change', this.toggleImport.bind(this));
    },

    toggleImport:function (value) {
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