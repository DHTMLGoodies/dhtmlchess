<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>Demo - Play against GarboChess</title>

    <script type="text/javascript">
        var hostname = location.hostname.toLowerCase();
        if (hostname.indexOf('dhtml-chess.com') >= 0) {
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-34147162-1']);
            _gaq.push(['_trackPageview']);

            (function () {
                var ga = document.createElement('script');
                ga.type = 'text/javascript';
                ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            })();
        }
    </script>

    <script type="text/javascript" src="../mootools/mootools-core-1.4.5.js"></script>
    <script type="text/javascript" src="../mootools/mootools-more-1.4.0.1.js"></script>
    <script type="text/javascript" src="../js/dhtml-chess-minified.js"></script>
    <script type="text/javascript" src="../src/controller/garbochess-controller.js"></script>
    <script type="text/javascript" src="../garbochess-engine/garbochess.js"></script>
    <link rel="stylesheet" href="../css-source/buttonbar/gray.css" type="text/css">
    <link rel="stylesheet" href="../css/dhtml-chess-light-gray.css" type="text/css">
    <style type="text/css">
        body, html {
            width: 100%;
            height: 100%;
            font-family: arial !important;
        }
    </style>
</head>
<body>
<script type="text/javascript">

    var app = new ludo.Application({
        title:'Analysis board, DHTML Chess 3.0',
        layout:{
            type:'linear',
            orientation:'vertical'
        },
        children:[
            {
                type:'chess.view.board.Board',
                pieceLayout:'alphapale',
                boardLayout:'wood',
                labels:true,
                layout:{
                    weight:1
                },
                addOns:[
                    {
                        type:'chess.view.highlight.Arrow'
                    }
                ]

            },
            {
                id:'engineoutput',
                layout:{
                    height:50
                },
                css:{
                    'text-align' : 'center'
                }
            },
            {
                type:'chess.view.notation.Panel',
                layout:{
                    height:200
                },
                framed:true,
                resizable:false

            }
        ]
    });

    var controller = new chess.controller.GarboChessController({
        garboChess:'../garbochess/js/garbochess.js',
        listeners:{
            'engineupdate' :updateMove
        }
    });


    function updateMove(move){
        ludo.get('engineoutput').setHtml(move);
    }


</script>
</body>
</html>