chess.view.installer.DbConnection = new Class({
    Extends: ludo.View,
    layout: 'rows',
    formConfig: {
        placeholderWidth: 100
    },
    children: [
        {html: 'Database connection', css: {'font-size': '14px', padding: 5}, height: 35},
        {name: 'host', placeholder: 'Host', type: 'form.Text', required: 1, value: 'localhost'},
        {name: 'username', placeholder: 'Username', type: 'form.Text', required: 1, value: 'your_db_username'},
        {
            name: 'password',
            id: 'fieldPassword',
            placeholder: 'Password',
            type: 'form.Text',
            value: 'your_db_password'
        },
        {name: 'db', placeholder: 'Database', type: 'form.Text', value: 'dhtml_chess', required: 1},
        {type: 'form.Button', value: 'Test connection', name: 'connectionTest'},
        {
            name: 'connectionTestResult',
            layout: {weight: 1},
            css: {padding: 3, color: '#fff'},
            type: 'remote.Message',
            'listenTo': "ChessDBInstaller"
        }
    ],

    __rendered: function () {
        this.parent();
        this.child['connectionTest'].on('click', this.checkConnection.bind(this));
    },

    isBusyTestingConnection: false,

    checkConnection: function () {

        if (this.isBusyTestingConnection)return;
        this.isBusyTestingConnection = true;
        this.child['connectionTestResult'].html('');

        $.ajax({
            dataType: 'json',
            url: ludo.config.getUrl(),
            data: {
                request: 'ChessDBInstaller/validateConnection',
                data: this.getForm().values()
            },
            "success": function (json) {
                this.child['connectionTestResult'].html(json.message);

                this.isBusyTestingConnection = false;
            }.bind(this),
            method: 'post'
        });
    }

});