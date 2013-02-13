<?php

require_once(dirname(__FILE__)."/autoload.php");
require_once("php/jsonwrapper/jsonwrapper.php");
date_default_timezone_set("Europe/Berlin");
header("Content-type: application/json");

/**
 * TODO move this code
 */
LudoDB::setUser('root');
LudoDB::setPassword('administrator');
LudoDB::setHost('127.0.0.1');
LudoDB::setDb('PHPUnit');

LudoDBRegistry::set('FILE_UPLOAD_PATH', '/tmp/');

LudoDB::enableLogging();
LudoDB::enableSqlLogging();

// For static(No db) installations
ChessRegistry::setPgnFolder("pgn");
ChessRegistry::setCacheFolder("cache"); // Path to cache

$request = array('request' => isset($_GET['request']) ? $_GET['request'] : $_POST['request']);

if(isset($_POST['data'])){
    $request['data'] = isset($_POST['data']) ? $_POST['data'] : null;
}

if(isset($_POST['arguments'])){
    $request['arguments'] = $_POST['arguments'];
}

$handler = new LudoDBRequestHandler();
$handler->setResponseKey("data");

echo $handler->handle($request);


