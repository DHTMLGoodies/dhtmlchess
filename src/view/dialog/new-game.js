/**
 * New game dialog. This dialog listens to the newGameDialog event from the controller.
 * @submodule Dialog
 * @namespace chess.view.dialog
 * @class NewGame
 */
chess.view.dialog.NewGame = new Class({
    Extends:ludo.Window,
    type:'chess.view.dialog.NewGame',
    name:'game-import',
    module:'chess',
    submodule:'dialogNewGame',
    width:400,
    height:240,
    autoHideOnBtnClick:false,
    title:'New game',
    layout:'rows',
    hidden:true,
    singleton:true,
    formConfig:{
        labelWidth:100
    },
    children:[
        { type:'form.Text', label:chess.getPhrase('White'), name:'white', required:true },
        { type:'form.Text', label:chess.getPhrase('Black'), name:'black', required:true },
        { type:'form.Text', label:chess.getPhrase('Event'), name:'event' },
        { type:'form.Text', label:chess.getPhrase('Site'), name:'site' },
        { type:'form.Text', label:chess.getPhrase('Round'), name:'round' },
        { type:'form.Text', label:chess.getPhrase('Result'), name:'result' },
        {
            type:'form.ComboTree', emptyText:'Select database', treeConfig:{ type:'chess.view.folder.Tree', width:500, height:350 }, label:chess.getPhrase('Database'), name:'databaseId'
        }
    ],
    buttonBar:{
        children:[
            {
                type:'form.Button', value:chess.getPhrase('OK'), disableOnInvalid:true
            },
            {
                type:'form.CancelButton', value:chess.getPhrase('Cancel')
            }
        ]
    },

    addControllerEvents:function () {
        this.controller.addEvent('newGameDialog', this.show.bind(this));
    },
    ludoEvents:function () {
        this.parent();
        this.getButton('ok').addEvent('click', function () {
			/**
			 * New game event. When fired it will send all values from the form as only argument.
			 * @event newGame
			 * @param {Array} metadata values
			 */
            this.fireEvent('newGame', this.getValues());
        }.bind(this))
    }
});