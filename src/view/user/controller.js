/**
 * Controller for the user login/registration module
 * @submodule User
 * @namespace chess.view.user
 * @class Controller
 * @extends controller.Controller
 */
chess.view.user.Controller = new Class({
    Extends:ludo.controller.Controller,
    singleton:true,
    type:'chess.view.user.Controller',
    components:{},
    applyTo: ['user'],

	ludoConfig:function (config) {
        this.parent(config);
        this.createWindows();
        this.validateSession();
    },

    addView:function (component) {
        this.components[component.submodule] = component;
        switch (component.submodule) {
            case 'settingsButton':
                component.addEvent('click', function(){
                    this.fireEvent('showProfile');
                }.bind(this));
                break;
            case 'registerWindow':
                component.addEvent('registerSuccess', this.login.bind(this));
                break;
            case 'loginWindow':
                component.addEvent('loginSuccess', this.login.bind(this));
                break;
            case 'loginButton':
                component.addEvent('click', function(){
                    this.fireEvent('showLogin');
                }.bind(this));
                break;
            case 'logoutButton':
                component.addEvent('click', this.logout.bind(this));
                break;
            case 'registerButton':
                component.addEvent('click', function(){
                    this.fireEvent('showRegister');
                }.bind(this));
                break;
        }
    },

    validateSession:function () {
        var token = this.getSessionToken();
        if (!token) {
            this.fireEvent('invalidSession');
            return;
        }

		var req = new ludo.remote.JSON({
            resource:'Session',
			listeners:{
				"success": function(request){
					var userDetails = request.getResponseData();
					this.fireEvent('validSession', userDetails.id);
     				this.fireEvent('userAccess', userDetails.user_access);
				}.bind(this),
				"failure": function(){
					this.fireEvent("invalidSession");
				}.bind(this)
			}
		});
        req.send('authenticate', undefined, token);
    },

    getSessionToken:function () {
        return Cookie.read(chess.COOKIE_NAME)
    },

    createWindows:function(){
        new chess.view.user.RegisterWindow();
        new chess.view.user.LoginWindow();
        new chess.view.user.ProfileWindow();
    },

    login:function(token, access){
        this.fireEvent('validSession', token);
        this.fireEvent('userAccess', access);
    },

    logout:function(){
        var req = new ludo.remote.JSON({
            "resource": "Session"
        });
        req.send("signOut");
        this.fireEvent('invalidSession');
    }
});