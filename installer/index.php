<?php
if(file_exists("chess.lock")){
   die('chess.lock file exists. Installer not available');
};
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>DHTML Chess - Installer</title>
    <script type="text/javascript" src="../mootools/mootools-core-1.4.5.js"></script>
    <script type="text/javascript" src="../mootools/mootools-more-1.4.0.1.js"></script>
    <script type="text/javascript" src="../js/chess-app-config.js"></script>
    <script type="text/javascript" src="../js/dhtml-chess.js"></script>
    <script type="text/javascript" src="../src/view/installer/admin-user.js"></script>
    <script type="text/javascript" src="../src/view/installer/db-connection.js"></script>
    <script type="text/javascript" src="../src/view/installer/installer-wizard.js"></script>
    <script type="text/javascript" src="../src/view/installer/installer.js"></script>
    <script type="text/javascript" src="../src/view/installer/license-key.js"></script>
    <script type="text/javascript" src="../src/view/installer/welcome.js"></script>
    <link rel="stylesheet" href="../css/buttonbar/blue.css" type="text/css">
    <link rel="stylesheet" href="../css/chess.css" type="text/css">
    <link rel="stylesheet" href="../css/chess-blue.css" type="text/css">
</head>
<body>
<script type="text/javascript">
new chess.view.installer.Installer();
</script>
</body>
</html>