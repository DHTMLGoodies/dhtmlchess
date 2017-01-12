<?php
if(file_exists("chess.lock")){
  # die('chess.lock file exists in the installer folder. Installer not available until this file has been deleted.');
};
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>DHTML Chess - Installer</title>
    <script type="text/javascript" src="../jquery/jquery-3.1.0.min.js"></script>
    <script type="text/javascript" src="../js/dhtml-chess.js"></script>
    <script type="text/javascript" src="../src/view/installer/admin-user.js"></script>
    <script type="text/javascript" src="../src/view/installer/db-connection.js"></script>
    <script type="text/javascript" src="../src/view/installer/installer-wizard.js"></script>
    <script type="text/javascript" src="../src/view/installer/installer.js"></script>
    <script type="text/javascript" src="../src/view/installer/license-key.js"></script>
    <script type="text/javascript" src="../src/view/installer/welcome.js"></script>
    <script type="text/javascript" src="../src/view/installer/installation-views.js"></script>
    <link rel="stylesheet" href="../css-source/buttonbar/blue.css" type="text/css">
    <link rel="stylesheet" href="../css/dhtml-chess-all.css" type="text/css">
    <style type="text/css">
        body,html{ width:100%;height:100%;padding:0;margin:0}
        .invalid-cell{
            width:3px;
        }
        .invalid-cell-div{

            height:14px;
            width:2px;
            margin-left:1px;
            margin-right:2px;
        }
        div.ludo-form-element .invalid-cell-div{
            background-color:transparent;
        }
        div.ludo-form-el-invalid .invalid-cell-div{
            background-color:#f00;
        }

    </style>
</head>
<body class="ludo-twilight">
<script type="text/javascript">

    $( document ).ready(function() {
        new chess.view.installer.Installer({
            renderTo:document.body
        });
    });


</script>
</body>
</html>