<?php
date_default_timezone_set('Europe/Berlin');

if(!strstr($_SERVER['PHP_SELF'],"connect.php")){
    $conn = mysql_connect("localhost","root","administrator");
   	mysql_select_db("dhtmlgds",$conn);
}

require_once("debugger.php");
require_once("jsonwrapper/jsonwrapper.php");

require_once("ChessTree.php");
require_once("parser/GameParser.php");
require_once("parser/PgnParser.php");
require_once("parser/PgnGameParser.php");
require_once("parser/Board0x88Config.php");
require_once("parser/FenParser0x88.php");

require_once("engine/ChessEngine.php");

require_once("CHESS_JSON.php");


require_once("db/ChessDbAdapter.php");
require_once("db/ChessDbModel.php");
require_once("db/ChessDatabase.php");
require_once("db/ChessFolder.php");
require_once("db/ChessSeek.php");
require_once("db/ChessGame.php");
require_once("db/ChessMove.php");
require_once("db/ChessPlayer.php");
require_once("db/ChessFen.php");
require_once("db/ChessMetadata.php");
require_once("db/ChessGameMetadata.php");
require_once("db/ChessJSONCache.php");
require_once("db/ChessProgressBar.php");
require_once("db/ChessProgressBarTemplate.php");
require_once("db/ChessProgressBarTplStep.php");
require_once("db/ChessProgressBarCompletedStep.php");
require_once("db/ChessFolderCollection.php");
require_once("db/ChessEco.php");
