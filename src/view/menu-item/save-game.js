/**
 * Menu item "Save Game". This menu item is automatically disabled when no user session exists and when
 * a user does not have access to edit games.
 * @module View
 * @submodule Menu
 * @namespace chess.view.SaveGame
 * @class NewGame
 */
chess.view.menuItems.SaveGame = new Class({
    Extends: ludo.menu.Item,
    type : 'chess.view.menuItems.saveGame',
    label : chess.getPhrase('Save game'),
    module : 'user',
    submodule : 'menuItemSaveGame',
    disabled:true,
	/**
	 * Fired on click
	 * @event saveGame
	 */
    copyEvents:{
        click : 'saveGame'
    },

    addControllerEvents:function(){
        this.controller.addEvent('userAccess', this.toggleOnUserAccess.bind(this));
        this.controller.addEvent('invalidSession', this.disable.bind(this));
    },

    toggleOnUserAccess:function(access){
        if((access & window.chess.UserRoles.EDIT_GAMES)){
            this.enable();
        }else{
            this.disable();
        }
    },

    ludoEvents:function(){
        this.parent();
    }
});