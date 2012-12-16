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
        this.JSONRequest('validateSession', {
            url:window.chess.URL,
            data:{
                token:token
            },
            onSuccess:function (json) {
                if(json.success){
                    this.fireEvent('validSession', json.data.token);
                    this.fireEvent('userAccess', json.data.user_access);
                }else{
                    this.fireEvent('invalidSession');
                }
            }
        });
    },

    getSessionToken:function () {
        return Cookie.read(chess.COOKIE_NAME)
    },

    createWindows:function(){
        new chess.view.user.RegisterWindow();
        new chess.view.user.LoginWindow();
        new chess.view.user.ProfileWindow();
    },

    login:function(json, rememberMe){
        Cookie.write(chess.COOKIE_NAME, json.token, {
            duration : rememberMe ? 365 : false
        });
        this.fireEvent('validSession', json.token);
        this.fireEvent('userAccess', json.user_access);
    },

    logout:function(){
        Cookie.dispose(chess.COOKIE_NAME);
        this.fireEvent('invalidSession');
    }
});