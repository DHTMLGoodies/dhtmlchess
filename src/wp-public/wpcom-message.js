/**
 * Created by alfmagne1 on 11/03/2017.
 */
chess.WPComMessage = new Class({
    Extends: ludo.View,
    css:{
        'font-size' : '12px',
        'line-height' : '20px',
        'text-align' : 'right',
        'padding-right' : 4
    },
    layout:{
        height:20
    },
    _html: 'Powered by <a href="https://wordpresschess.com">WordPressChess.com</a>'
});