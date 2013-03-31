/**
 * The game import menu item. This menu item will automatically be disabled when there are no
 * valid user sessions or if the user does not have access to the game import user role.
 * On click it will create a new chess.view.dialog.GameImport
 * @module View
 * @submodule Menu
 * @namespace chess.view.menuItems
 * @class GameImport
 */
chess.view.menuItems.GameImport = new Class({
    Extends: ludo.menu.Item,
    type : 'chess.view.menuItems.GameImport',
    label : chess.getPhrase('Import games(PGN)'),
    module : 'user',
    submodule : 'menuItemGameImport',
    disabled:true,

    addControllerEvents:function(){
        this.controller.addEvent('userAccess', this.toggleOnUserAccess.bind(this));
        this.controller.addEvent('invalidSession', this.disable.bind(this));
    },

    toggleOnUserAccess:function(access){
        if((access & window.chess.UserRoles.GAME_IMPORT)){
            this.enable();
        }else{
            this.disable();
        }
    },

    ludoEvents:function(){
        this.parent();
        this.addEvent('click', this.showImportDialog.bind(this));
    },
    showImportDialog:function(){
        new chess.view.dialog.GameImport();
    }
});