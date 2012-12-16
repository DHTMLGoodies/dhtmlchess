<?php

if (!isset($_GET['install'])) {
    die();
}

if (!strstr($_SERVER['PHP_SELF'], "connect.php")) {
    $conn = mysql_connect("localhost", "root", "administrator");
    mysql_select_db("dhtmlgds", $conn);
}

ini_set('display_errors', 'on');
error_reporting(E_ALL);
require_once("../bootstrapper.php");

$classes = array(
    'ChessDataBase', 'ChessFolder', 'ChessSeek', 'ChessGame', 'ChessPlayer', 'ChessEco',
    'ChessMove', 'ChessFen', 'ChessMetadata', 'ChessGameMetadata', 'ChessJSONCache',
    'ChessProgressBar', 'ChessProgressBarTemplate', 'ChessProgressBarCompletedStep', 'ChessProgressBarTplStep',
    'FileUpload','ChessSession','ChessCountry'
);

foreach ($classes as $class) {
    $obj = new $class();
    $obj->dropTable();
    $obj->createTable();
}
echo "END";

$res = mysql_query("show tables");
while ($row = mysql_fetch_array($res)) {
    if (strstr($row[0], 'chess_')) {
        echo "<div style='width:300px;border:1px solid #000'>";
        echo "<h3 style='margin:0px;padding:0px'>" . $row[0] . "</h3>";
        echo "<table cellpadding=2 cellspacing=0>";
        $res2 = mysql_query("desc " . $row[0]);
        while ($row2 = mysql_fetch_assoc($res2)) {
            echo "<tr><td>" . $row2['Field'] . "</td><td>" . $row2['Type'] . "</td></tr>";


        }
        echo "</table>";
        echo "</div>";
        echo "<br>";

        $res2 = mysql_query("select * from " . $row[0]);
        while ($row2 = mysql_fetch_assoc($res2)) {
            foreach ($row2 as $key => $value) {
                echo $key . ": " . $value . ", ";
            }
            echo "<br>";

        }
    }
}

echo "<br><br>";
#$seek = new ChessGame(1);
#echo $seek->getJson();
