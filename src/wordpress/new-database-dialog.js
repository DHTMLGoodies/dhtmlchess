chess.wordpress.NewDatabaseDialog = new Class({
    Extends: ludo.dialog.Dialog,
    submodule:'wordpress.newdatabasedialog',
    layout:{
        width:400,
        height:150,
        type:'linear', orientation:'vertical'
    },
    buttonConfig:'OkCancel',
    title:chess.__('New Game Database'),
    css:{
        padding:5
    },
    __children:function(){
        return [
            {
                type:'form.Label',
                labelFor:'dbName',
                label:chess.__('New Game Database')
            },
            {
                name:'dbname',
                type:'form.Text',
                placeholder: chess.__('Name of new database'),
                required:true,
                validateKeyStrokes:true,
                validator:function(val){
                    return val.trim().length >= 5;
                }
            }
        ]
    },

    __rendered:function(){
        this.parent();

        this.okButton = this.getButton('ok');
        this.okButton.disable();

        this.getForm().on('valid', function(){
            this.okButton.enable();
        }.bind(this));

        this.getForm().on('invalid', function(){
            this.okButton.disable();
        }.bind(this));

        this.on('ok', function(){
            this.fireEvent('newdatabase', this.child['dbname'].val());
        });
    },

    show:function(){
        this.parent();
        this.child['dbname'].select();
    }

});