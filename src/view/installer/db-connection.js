chess.view.installer.DbConnection = new Class({
    Extends: ludo.View,
    layout : 'rows',
    formConfig : {
        labelWidth : 100
    },
    children : [
        { html : 'Database connection', css : { 'font-size' : '14px', padding : 5 }, height : 35},
        { name : 'host', label : 'Host', type : 'form.Text', required : 1, value : 'localhost'},
        { name : 'username', label : 'Username', type : 'form.Text', required : 1, value : 'your_db_username'},
        { name : 'password', id:'fieldPassword', label : 'Password', type : 'form.Text', required : 1, value : 'your_db_password'},
        { name : 'db', label : 'Database', type : 'form.Text', value : 'dhtml_chess', required : 1},

		{ type:'form.Button', value:'Test connection', name:'connectionTest'},
		{ name : 'connectionTestResult',layout:{ weight: 1},css:{ padding:3} },
        { name : 'manual', html : '<h1>Cannot write to /db-connection.php</h1>'+
                '<p>You need to open that file in an editor and fill in your db-connections, example:</p>'+
                '<pre>$conn = mysql_connect("localhost","root","administrator");\n'+
                'mysql_select_db("dhtmlgds",$conn);',hidden:true

        }
    ],

    ludoRendered:function(){
        this.parent();
        this.JSONRequest('getConnectionDetails', {
            url : this.getUrl(),
            onSuccess:function(json){
                var data = json.data;
                this.setWriteAccess(data.writeAccess);
            }
        });

		this.child['connectionTest'].addEvent('click', this.checkConnection.bind(this));
    },

	isBusyTestingConnection : false,

	checkConnection:function(){
		if(this.isBusyTestingConnection)return;
		this.isBusyTestingConnection = true;
		this.child['connectionTestResult'].setHtml('');
		this.JSONRequest('testConnection', {
			url : this.getUrl(),
			data : this.getValues(),
			onSuccess:function(json){
				if(json.data.connection){
					this.child['connectionTestResult'].setHtml('<strong style="color:#060">Connection successful!</strong>');
				}else{
					this.child['connectionTestResult'].setHtml('<strong style="color:red">Connection failed with this message: '+ json.message + "</strong>");
				}
				this.isBusyTestingConnection = false;
			}.bind(this),
			onError:function(){
				this.child['connectionTestResult'].setHtml('<strong style="color:red">Error while connection to Web server</strong>');
				this.isBusyTestingConnection = false;
			}
		});
	},

    setWriteAccess:function(access){
        if(access){
            this.child['manual'].hide();
        }else{
            /*
            this.child['host'].hide();
            this.child['username'].hide();
            this.child['password'].hide();
            this.child['db'].hide();
            */
            this.child['manual'].show();
        }
    }
});