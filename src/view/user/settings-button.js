/**
 * User settings button. This button looks like a gear and will fire a "click" event
 * which is picked up by chess.view.user.Controller. The controller will handle the event
 * and fire a "showProfile" event which is picked up by chess.view.user.ProfileWindow.
 * chess.view.user.ProfileWindow will show it's self when this event is fired.
 * @namespace chess.view.user
 * @class SettingsButton
 * @extends form.Button
 */
chess.view.user.SettingsButton = new Class({
    Extends:ludo.form.Button,
    type:'chess.view.user.SettingsButton',
    module:'user',
    submodule:'settingsButton',
    icon : ludo.config.getDocumentRoot() + '/images/gear.png',
    value:'',
    hidden:true,
    width:30,
	layout:{
		height:26
	},
    setController:function (controller) {
        this.parent(controller);
        controller.addEvent('invalidSession', this.hide.bind(this));
        controller.addEvent('validSession', this.show.bind(this));
    }
});