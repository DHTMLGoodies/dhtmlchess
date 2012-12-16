/**
 * Model for a user session
 * @namespace chess.view.user
 * @class UserModel
 * @extends model.Model
 */
chess.view.user.UserModel = new Class({
    Extends:ludo.model.Model,
    type : 'chess.view.user.UserModel',
    name : 'userprofile',
    url : window.chess.URL,
    columns : ['token', 'username', 'full_name', 'email','country'],
    autoload:false,
    singleton:true
});