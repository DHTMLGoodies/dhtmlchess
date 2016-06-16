chess.view.tree.SelectFolder = new Class({
    Extends:ludo.tree.Tree,
    module:'chess',
    submodule:'folder.tree',
    dataSource:{
        type : 'chess.dataSource.FolderTree'
    },
    nodeTpl:'<img src="' + ludo.config.getDocumentRoot() + 'images/{icon}"><span>{title}</span>',
    expandDepth:3,
    recordConfig:{
        'folder':{
            selectable:true,
            defaults:{
                icon:'folder.png'
            }
        },
        'database':{
            selectable:false,
            defaults:{
                icon:'database.png'
            }
        }
    },

    treeConfig:{
        defaultValues:{
            icon:'folder.png'
        }
    },

    ludoEvents:function () {
        this.parent();
        this.addEvent('selectrecord', this.selectDatabase.bind(this));
    },

    selectDatabase:function (record) {
        this.fireEvent('selectDatabase', record);
    }
});