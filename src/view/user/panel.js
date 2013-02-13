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
	 * @default '<b>' + chess.language.signedInAs + ' {username}</b>'
	 */
    tpl : '<b>' + chess.language.signedInAs + ' {username}</b>',

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
    model:{
        type : 'chess.view.user.UserModel'
    },

    addControllerEvents:function () {
        this.controller.addEvent('invalidSession', this.hide.bind(this));
        this.controller.addEvent('validSession', this.getUserDetails.bind(this));
    },

    getUserDetails:function(userId){
        this.getModel().load(userId);
        this.show();
    },

    insertJSON:function(json){
        this.parent(json);
    }
});