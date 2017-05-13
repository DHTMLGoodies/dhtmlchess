/**
 * Created by alfmagne1 on 13/05/2017.
 */

chess.wordpress.ColorEditDialog = new Class({
    Extends: chess.wordpress.PopupView,
    color: undefined,
    cls: 'wpc-color-edit-dialog',

    __construct: function (config) {
        this.parent(config);
        this.color = config.color;
    },

    setColor: function (color) {


    }

});