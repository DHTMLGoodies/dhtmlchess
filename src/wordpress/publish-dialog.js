chess.wordpress.PublishDialog = new Class({
    Extends: ludo.dialog.Dialog,
    submodule: 'wordpress.publishdialog',
    modal: true,

    buttonConfig: 'OkCancel',
    title: chess.getPhrase('Publish Game'),

    layout: {
        width: 300, height: 300,
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
        this.pgn = rec.pgn_name;
        this.getButton('ok').setEnabled(true);
    },

    __children: function () {
        return [
            {
                name: 'heading',
                html: chess.getPhrase('Select PGN'),
                layout: {
                    height: 25
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
                dataSource: {
                    type: 'chess.wordpress.PgnList',
                    autoload: true,
                    listeners: {
                        'select': this.selectPgn.bind(this)
                    }
                },
                layout: {
                    weight: 1
                }
            }

        ]
    },

    show: function (metadata) {
        this.parent();

        if (metadata && metadata.pgn) {
            this.child['list'].getDataSource().select({ pgn_name : metadata.pgn } );
        }
    }

});