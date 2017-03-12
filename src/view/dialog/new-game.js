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
    autoHideOnBtnClick:false,
    title:'New game',
    layout:{
        type:'linear',
        orientation:'vertical',
        width:400,height:270,top:20,left:20
    },
    hidden:true,
    singleton:true,
    formConfig:{
        labelWidth:100
    },
    children:[
        { type:'form.Text', label:chess.__('White'), name:'white', required:true },
        { type:'form.Text', label:chess.__('Black'), name:'black', required:true },
        { type:'form.Text', label:chess.__('Event'), name:'event' },
        { type:'form.Text', label:chess.__('Site'), name:'site' },
        { type:'form.Text', label:chess.__('Round'), name:'round' },
        { type:'form.Text', label:chess.__('Result'), name:'result' },
        {
            type:'form.ComboTree', emptyText:'Select database', treeConfig:{ type:'chess.view.folder.Tree', width:500, height:350 }, label:chess.__('Database'), name:'databaseId'
        }
    ],
    buttonBar:{
        children:[
            {
                type:'form.Button', name:'okButton', id:'newGameOkButton', value:chess.__('OK'), disableOnInvalid:true
            },
            {
                type:'form.CancelButton', value:chess.__('Cancel')
            }
        ]
    },

    addControllerEvents:function () {
        this.controller.addEvent('newGameDialog', this.show.bind(this));
    },
    __rendered:function () {
        this.parent();
        this.addButtonEvents();
    },

    addButtonEvents:function(){
        this.getButton('okButton').addEvent('click', function () {
            /**
             * New game event. When fired it will send all values from the form as only argument.
             * @event newGame
             * @param {Array} metadata values
             */
            this.fireEvent('newGame', this.getValues());
            this.hide();
        }.bind(this))
    }
});