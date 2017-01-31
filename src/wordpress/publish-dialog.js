chess.wordpress.PublishDialog = new Class({
    Extends: ludo.dialog.Dialog,
    submodule: 'wordpress.publishdialog',
    modal: true,

    buttonConfig: 'OkCancel',
    title: chess.getPhrase('Publish Game'),

    layout: {
        width: 300, height: 400,
        type: 'linear', orientation: 'vertical'
    },

    pgn:undefined,

    __rendered: function () {
        this.parent();
        this.child['searchField'].on('key', function (value) {
            this.child['list'].getDataSource().search(value);
        }.bind(this));

        this.on('ok', this.onSelected.bind(this));
        this.getButton('ok').setEnabled(false);
    },

    onSelected: function () {
        this.fireEvent('selectpgn', this.pgn);
    },

    selectPgn:function(rec){
        this.pgn = rec;
        this.child['selected'].html(chess.getPhrase('Selected') +': '+ rec.pgn_name);
        this.getButton('ok').setEnabled(true);
    },

    __children: function () {
        return [
            {
                name: 'heading',
                html: chess.getPhrase('Select PGN'),
                layout: {
                    height: 25
                },
                css:{
                    'line-height' : '25px',
                    'padding-left': '2px'
                }
            },
            {
                name: 'searchField',
                type: 'form.Text',
                placeholder: 'Search',
                layout: {
                    height: 30
                },
                elCss:{
                    'border-top' : '1px solid ' + ludo.$C('border'),
                    'border-bottom' : '1px solid ' + ludo.$C('border')
                }

            },
            {
                name: 'list',
                type: 'grid.Grid',
                columns: {
                    pgn_name: {
                        heading: 'PGN'
                    }
                },
                headerMenu:false,
                dataSource: {
                    type: 'chess.wordpress.PgnList',
                    autoload: true,
                    listeners: {
                        'select': this.selectPgn.bind(this)
                    }
                },
                layout: {
                    weight: 1
                },
                elCss:{
                    'border-bottom' : '1px solid ' + ludo.$C('border')
                }
            },
            {
                name:'selected',
                layout:{
                    height:25
                },
                css:{
                    'font-weight' : 'bold',
                    'line-height' : '25px',
                    'padding-left': '2px'
                }
            }

        ]
    },

    show: function (metadata, controllerPgn) {
        this.parent();


        
        if (metadata && metadata.pgn_id) {
            this.child['list'].getDataSource().selectRecord({ id : metadata.pgn_id } );
        }else if(controllerPgn){
            this.child['list'].getDataSource().selectRecord({ id :controllerPgn.id } );
        }
    }

});