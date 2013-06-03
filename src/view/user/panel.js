/**
 * Small user info panel.
 * @submodule User
 * @namespace chess.view.user
 * @class Panel
 * @extends View
 */
chess.view.user.Panel = new Class({
    Extends:ludo.View,
    width:200,
    type:'chess.view.user.Panel',
    module:'user',
    submodule:'userPanel',
    hidden:true,
	/**
	 * Text template for the panel
	 * @config tpl
	 * @type String
	 * @default '<b>' + chess.getPhrase('signedInAs') + ' {username}</b>'
	 */
    tpl : '<b>' + chess.getPhrase('Signed in as') + ' {username}</b>',

	/**
	 * @config css
	 * @type {Object}
	 * @default css : {
	         'text-align' : 'right'
	     }
	 */
    css : {
        'text-align' : 'right'
    },

	dataSource:{
		resource : 'CurrentPlayer',
		service:'read'
	},

    addControllerEvents:function () {
        this.controller.addEvent('invalidSession', this.hide.bind(this));
        this.controller.addEvent('validSession', this.getUserDetails.bind(this));
    },

    getUserDetails:function(){
        this.show();
        this.getForm().read();
    }
});