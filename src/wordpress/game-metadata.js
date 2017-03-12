chess.wordpress.GameMetadata = new Class({
    Extends: ludo.View,
    submodule: 'wordpress.gameMetadata',
    layout: {
        type: 'table',
        simple: true,
        rowHeight: 25,
        columns: [{width: 100}, {weight: 1}]
    },
    css: {
        padding: 4
    },

    __rendered: function () {
        this.parent();
        this.getForm().on('change', this.update.bind(this));
        this.on('show', this.populateForm.bind(this));
    },

    setController: function (controller) {
        this.parent(controller);
        controller.on('newGame', this.populateForm.bind(this));
        controller.on('loadGame', this.populateForm.bind(this));
    },
    
    populateForm: function () {
        this.getForm().clear();
        this.getForm().populate(this.controller.currentModel.getMetadata());
    },

    update: function (key, val) {
        this.fireEvent('metadata', [key, val]);
    },

    __children: function () {
        return [
            {
                type: 'form.Label', label: chess.__('White') + "* :", labelFor: 'white'
            },
            {
                type: 'form.Text', name: 'white', placeholder: "White Player"
            },
            {
                type: 'form.Label', label: chess.__('Black') + "* :", labelFor: 'black'
            },
            {
                type: 'form.Text', name: 'black', placeholder: "Black Player"
            },
            {
                type: 'form.Label', label: chess.__('Result') + ":", labelFor: 'result'
            },
            {
                type: 'form.Select', dataSource: {url: undefined, data: ['*', '1-0', '1/2-1/2', '0-1']}, name: 'result'
            },
            {
                type: 'form.Label', label: chess.__('Event') + " :", labelFor: 'event'
            },
            {
                type: 'form.Text', name: 'event', placeholder: "Event"
            },
            {
                type: 'form.Label', label: chess.__('Date') + ":", labelFor: 'date'
            },
            {
                type: 'form.Text', name: 'date', placeholder: "Date"
            },
            {
                type: 'form.Label', label: chess.__('Round') + ":", labelFor: 'round'
            },
            {
                type: 'form.Text', name: 'round', placeholder: "Round"
            }

        ]
    }
});