chess.wordpress.DraftButton = new Class({
    Extends: ludo.form.Button,
    submodule: 'wordpress.savedraft',

    __construct: function (config) {
        config.value = chess.__('Save Draft');
        this.parent(config);
    },

    setController: function (controller) {
        this.parent(controller);
    }
});