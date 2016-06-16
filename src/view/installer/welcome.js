chess.view.installer.Welcome = new Class({
    Extends:ludo.View,
    layout:'rows',
    children:[
        {
            height : 40,
            css : {
                padding : 3,
                'font-size' : '14px',
                'font-weight' : 'bold'
            },
            html : 'Welcome to the DHTML Chess Installer. From this page, you can ' +
                'install the database version of DHTML Chess'
        }
    ]
});