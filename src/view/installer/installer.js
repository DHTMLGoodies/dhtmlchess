/**
 * The DHTML Chess installer dialog
 * @module Installer
 * @namespace chess.view.installer
 * @class Installer
 * @extends dialog.Dialog
 */
chess.view.installer.Installer = new Class({
    Extends:ludo.dialog.Dialog,
    type:'chess.view.installer.Installer',
    layout:{
        type:'linear',
        orientation:'vertical',
        width:500,
        height:350
    },
    resizable:false,
    title:'DHTML Chess Installer',
    autoHideOnBtnClick:false,
    children:[
        {
            height:50,
            html:'<img src="../demo/images/logo.png">'
        },
        {
            type:'chess.view.installer.Wizard'
        }
    ],
    buttonBar:{
        align:'left',
        children:[
            {
                id:'message', weight:1, css:{ padding:4}
            },
            {
                type:'card.PreviousButton', id:'previousButton'
            },
            {
                type:'card.NextButton', autoHide:true
            },
            {
                type:'card.FinishButton', id:'finishButton'
            },
            {
                type:'form.CancelButton', hidden:true, value:'OK', id:'completeButton'
            }
        ]
    }
});