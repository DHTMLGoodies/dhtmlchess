/**
 * Country input field for the user profile form
 * @submodule User
 * @namespace chess.view.user
 * @class Country
 * @extends form.FilterText
 */
chess.view.user.Country = new Class({
    Extends:ludo.form.FilterText,
    type : 'chess.view.user.Country',
    filterOnServer:false,
    dataSource:{
        singleton:true,
        request : 'getAllCountries'
    }
});
