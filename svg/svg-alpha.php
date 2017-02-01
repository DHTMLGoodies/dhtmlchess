<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="iso-8859-1">
    <title>Title</title>

    <script type="text/javascript" src="../jquery/jquery-3.1.0.min.js"></script>
    <script type="text/javascript" src="../js/dhtml-chess.js?rnd=4"></script>
    <script type="text/javascript" src="../src/controller/controller.js?rnd=3"></script>
    <script type="text/javascript" src="../src/controller/analysis-controller.js?rnd=3"></script>
    <script type="text/javascript" src="../src/controller/garbochess-controller.js?rnd=3"></script>
    <script type="text/javascript" src="../garbochess-engine/garbochess.js"></script>
    <script type="text/javascript" src="../src/view/score/bar.js?rnd=4"></script>
    <script type="text/javascript" src="../src/view/board/gui.js?rnd=4"></script>
    <script type="text/javascript" src="../src/view/board/board.js?rnd=3"></script>
    <script type="text/javascript" src="../src/view/board/piece.js?rnd=3"></script>
    <script type="text/javascript" src="../src/controller/analysis-engine-controller.js?rnd=1"></script>
    <script type="text/javascript" src="../src/remote/reader.js?rnd=1"></script>
    <script type="text/javascript" src="../src/model/game.js?rnd=1"></script>
    <script type="text/javascript" src="../src/remote/game-reader.js?rnd=1"></script>
    <script type="text/javascript" src="../src/parser0x88/fen-parser-0x88.js?rnd=1"></script>
    <script type="text/javascript" src="svg.js"></script>
    <script type="text/javascript" src="opentype.js"></script>
    <link rel="stylesheet" href="../css-source/buttonbar/gray.css" type="text/css">
    <link rel="stylesheet" href="../css/dhtml-chess-all.css?rnd=2" type="text/css">
    <style type="text/css">
        body{
            background-color:#AAA;
        }
        .bg{
            background-color:#DDD;
            float:left;
            border:1px solid #aaa;
            width:200px;
            height:200px;
        }
        img{
            width:200px;
            height:200px;
        }
        .largeBg{

        }
        .ludo-view{
            float:left;
            border:1px solid #000;
        }
    </style>

</head>
<body>
<?php

$font = "Chess-7.ttf";

for($i=0;$i<0;$i++){

    $char = chr($i);

    echo '<div style="float:left;width:100px;height:20px;border-radius:5px;margin:4px;background-color: #ddd"><span>'. $char. ' (' . $i . ')</span> : ';
    ?>
    <span><?php echo $char; ?> </span></div>
    <?php

    if(preg_match('/[a-z]/', $char)){
        echo '<div style="float:left;width:100px;height:20px;border-radius:5px;margin:4px;background-color: #ddd"><span>'. strtoupper($char). '</span> : ';
        ?>
        <span style="font-family:'Chess Alpha'"><?php echo strtoupper($char); ?> </span></div>
        <?php
    }

}

?>

<div class="largeBg" id="wp"></div>
<!--
<div class="bg"><img src="../images/svg_egg45wn.svg"></div>
-->

<script type="text/javascript">

new SVGFont({
    name:'merida',
    'font': 'ChessSansMerida.ttf',
    renderTo:'#wp',
    fill:'#fff'
});





</script>
<div style="clear:both"></div>
</body>
</html>