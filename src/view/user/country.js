/**
 * Country input field for the user profile form
 * @submodule User
 * @namespace chess.view.user
 * @class Country
 * @extends form.Select
 */
chess.view.user.Country = new Class({
    Extends:ludo.form.Select,
    type : 'chess.view.user.Country',
    filterOnServer:false,
    emptyItem:{
        id:'',
        name:chess.getPhrase('Your country')
    },
    valueKey:'name',
    textKey:'name',
    dataSource:{
        singleton:true,
        resource:'Countries',
        service:'read'
    }
});
