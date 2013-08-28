chess.view.installer.DbConnection = new Class({
    Extends:ludo.View,
    layout:'rows',
    formConfig:{
        labelWidth:100
    },
    children:[
        { html:'Database connection', css:{ 'font-size':'14px', padding:5 }, height:35},
        { name:'host', label:'Host', type:'form.Text', required:1, value:'localhost'},
        { name:'username', label:'Username', type:'form.Text', required:1, value:'your_db_username'},
        { name:'password', id:'fieldPassword', label:'Password', type:'form.Text', required:1, value:'your_db_password'},
        { name:'db', label:'Database', type:'form.Text', value:'dhtml_chess', required:1},
        { type:'form.Button', value:'Test connection', name:'connectionTest'},
        { name:'connectionTestResult', layout:{ weight:1}, css:{ padding:3, color: '#f00'}, type:'remote.Message', 'listenTo' : "ChessDBInstaller" }
    ],

    ludoRendered:function () {
        this.parent();
        this.child['connectionTest'].addEvent('click', this.checkConnection.bind(this));
    },

    isBusyTestingConnection:false,

    checkConnection:function () {
		console.log('testing connection');
        if (this.isBusyTestingConnection)return;
        this.isBusyTestingConnection = true;
        this.child['connectionTestResult'].setHtml('');

        var req = new ludo.remote.JSON({
            resource:'ChessDBInstaller',
            listeners:{
                "complete": function(){
                    this.isBusyTestingConnection = false;
                }.bind(this)
            }
        });
        req.send('validateConnection', undefined, this.getForm().getValues() );

    }

});