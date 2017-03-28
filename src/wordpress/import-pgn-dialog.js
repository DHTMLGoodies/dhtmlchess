chess.wordpress.ImportPgnDialog = new Class({
    Extends: ludo.dialog.Dialog,
    autoRemove:false,

    pgn:undefined,

    layout:{
        type:'linear', orientation:'vertical'
    },

    __children:function(){

        return [
            {
                type:'form.Textarea',
                layout:{
                    weight:1
                },
                name:'pgn_string',
                placeholder: chess.__('Paste your PGN here')
            },
            {
                name:'message',
                layout:{
                    height:30
                },
                css:{
                    'text-align' : 'right',
                    'padding-right' : 4
                }
            },
            {
                name:'buttonPanel',
                layout:{
                    type:'linear', orientation:'horizontal',
                    height:30
                },
                children:[
                    {
                        weight:1
                    },
                    {
                        name:'importButton',
                        type:'form.Button',
                        value:chess.__('Import'),
                        listeners:{
                            'click': this.importPgn.bind(this)
                        }
                    },
                    {
                        type:'form.Button',
                        value:chess.__('Cancel'),
                        listeners:{
                            'click': this.hide.bind(this)
                        }
                    }

                ]
            }
        ]
    },

    show:function(pgn){
        this.parent();
        this.child['message'].html('');
        this.child['pgn_string'].val('');
        this.pgn = pgn;
        this.setTitle(chess.__('Import into ' + this.pgn.pgn_name)) ;
        this.child['buttonPanel'].child['importButton'].setEnabled(true);
        this.shim().hide();
    },

    importPgn:function(){
        this.showMessage('');
        var val = this.child['pgn_string'].val().trim();
        if(val.length > 0){
            this.child['buttonPanel'].child['importButton'].setEnabled(false);
            this.shim().show('Importing');

            jQuery.ajax({
               url:ludo.config.getUrl(),
                method:'post',
                dataType:'json',
                cache:false,
                data:{
                    action:'import_pgn_string',
                    pgn_id : this.pgn.id,
                    pgn : val
                },
                complete:function(response, status){
                    this.child['buttonPanel'].child['importButton'].setEnabled(true);
                    this.shim().hide();
                    if(status == 'success'){

                        var json = response.responseJSON;
                        if(json.success){

                            var data = json.response;
                            // {"imported":2,"total":2}

                            this.fireEvent('imported');
                            this.child['pgn_string'].val('');
                            var phrase = chess.__('{0} of {1} games imported');
                            phrase = phrase.replace('{0}', data.imported);
                            phrase = phrase.replace('{1}', data.total);
                            this.showMessage(chess.__(phrase));
                        }else{
                            this.showError(chess.__('Could not import pgn string'));
                        }

                    }else{
                        this.showError(chess.__('Could not import pgn string'));
                    }
                }.bind(this)
            });

        }else{
            this.showError(chess.__('A PGN String is required'));
        }
    },

    showError:function(message){
        this._message(message,'#EF9A9A' );
    },
    showMessage:function(message){
        this._message(message,'#AED581' );

    },

    _message:function(message, color){
        this.child['message'].$b().css('color', color);
        this.child['message'].html(message);
    }
});