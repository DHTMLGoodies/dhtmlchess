<?php

require_once(dirname(__FILE__)."/autoload.php");
require_once("php/jsonwrapper/jsonwrapper.php");
date_default_timezone_set("Europe/Berlin");

if(file_exists("connection.php")){
    require("connection.php");
}

LudoDBRegistry::set('FILE_UPLOAD_PATH', '/tmp/');
LudoDBRegistry::set('DEVELOP_MODE', true);
LudoDB::enableLogging();

// For static(No db) installations
ChessRegistry::setPgnFolder("pgn");
ChessRegistry::setCacheFolder("cache"); // Path to cache

$request = isset($_GET['request']) ? $_GET['request'] : $_POST['request'];
$requestData = isset($_POST['data']) ? $_POST['data'] : null;


$handler = new LudoDBRequestHandler();
echo $handler->handle($request, $requestData);



