/**
 * Menu item "New Game". This menu item is automatically disabled when no user session exists and when
 * a user does not have access to edit games.
 * @module View
 * @submodule Menu
 * @namespace chess.view.menuItems
 * @class NewGame
 */
chess.view.menuItems.NewGame = new Class({
    Extends: ludo.menu.Item,
    type : 'chess.view.menuItems.newGame',
    label : chess.getPhrase('Game'),
    module : 'user',
    submodule : 'menuItemNewGame',
    disabled:true,
	orientation:'vertical',
	/**
	 * Fired on click
	 * @event newGame
	 */
    copyEvents:{
        click : 'newGame'
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
    }
});