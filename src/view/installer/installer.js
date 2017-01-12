/**
 * The DHTML Chess installer dialog
 * @module Installer
 * @namespace chess.view.installer
 * @class Installer
 * @extends dialog.Dialog
 */
chess.view.installer.Installer = new Class({
    Extends:ludo.FramedView,

    type:'chess.view.installer.Installer',
    layout:{
        type:'linear',
        orientation:'vertical',
        
        width:'matchParent',
        height:'matchParent'
    },
    title:'DHTML Chess Installer',
    children:[
        {
            height:50,
            html:'<img src="../demo/images/logo.png">'
        },
        {
            name:'views',
            type:'chess.view.installer.InstallationViews',
            layout:{
                weight:1
            }
        }
    ],
    buttonBar:{
        align:'left',
        children:[
            {
                type:'form.Button', name:'install', value:'Install'
            }
        ]
    },

    __rendered:function(){
        this.parent();
        this.getButton('install').on('click', function(){
            this.child['views'].install();
        }.bind(this));

    }
});