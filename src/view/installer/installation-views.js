/**
 * Created by alfmagne1 on 07/01/2017.
 */
chess.view.installer.InstallationViews = new Class({
    Extends: ludo.View,
    layout: {
        type: 'linear',
        orientation: 'vertical'
    },

    __children: function () {

        return [
            {
                html: '<h4>Your new DHTML Chess user details:</h4>'
            },
            {
                type: 'form.Text',
                autoComplete: false,
                placeholder: 'Username',
                name: 'adminUserName',
                value: 'administrator',
                required: true,
                minLength: 3
            },
            {
                type: 'form.Password',
                autoComplete: false,
                placeholder: 'Password',
                id: 'adminPassword',
                name: 'adminPassword',
                minLength: 1,
                md5: true
            },
            {
                type: 'form.Password',
                autoComplete: false,
                placeholder: 'Repeat password',
                name: 'adminPasswordRepeated',
                minLength: 1,
                required: true,
                twin: 'adminPassword',
                md5: true
            },
            {html: '<h4>Database connection</h4>', height: 'wrap'},
            {name: 'host', placeholder: 'Host', type: 'form.Text', required: 1, value: 'localhost'},
            {name: 'username', placeholder: 'MySQL username', type: 'form.Text', required: 1},
            {
                name: 'password',
                id: 'fieldPassword',
                placeholder: 'MySQL Password',
                type: 'form.Text'
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

        ]

    },

    __rendered: function () {
        this.parent();
        this.child['connectionTest'].on('click', this.checkConnection.bind(this));

    },

    install: function () {
        this.child['connectionTestResult'].html('');

        $.ajax({
            dataType: 'json',
            url: ludo.config.getUrl(),
            data: {
                request: 'ChessDBInstaller/save',
                data: this.getForm().values()
            },
            complete: function (response, status) {
                if(status == 'success'){
                    this.child['connectionTestResult'].html(response.responseJSON.message);
                }else{
                    this.child['connectionTestResult'].html('Error: ' + response.responseText);
                }
            }.bind(this),
            method: 'post'
        });
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
            complete: function (response, status) {
                if(status == 'success'){
                    this.child['connectionTestResult'].html(response.responseJSON.message);
                }else{
                    this.child['connectionTestResult'].html('Error: ' + response.responseText);
                }
                this.isBusyTestingConnection = false;

            }.bind(this),
            method: 'post'
        });
    }

});