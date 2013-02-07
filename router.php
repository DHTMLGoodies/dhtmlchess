<?php

require_once(__DIR__."/autoload.php");
date_default_timezone_set("Europe/Berlin");
header("Content-type: application/json");
error_reporting(E_ALL);
ini_set('display_errors','on');
/**
 * TODO move this code
 */
LudoDB::setUser('root');
LudoDB::setPassword('administrator');
LudoDBRegistry::set('FILE_UPLOAD_PATH', '/tmp/');

/**
 * TODO Use ip address instead of localhost on Windows
 */
LudoDB::setHost('127.0.0.1');
LudoDB::setDb('PHPUnit');
LudoDB::enableLogging();

$request = array('request' => $_GET['request']);

if(isset($_POST['request'])){
    $requestItem = is_array($_POST['request']) && isset($_POST['request']['data']) ? $_POST['request']['data'] : "Nothing";
    $request['data'] = isset($requestItem['data']) ? $requestItem['data'] : null;
    $request['arguments'] = isset($requestItem['arguments']) ? $requestItem['arguments'] : null;

}

$handler = new LudoDBRequestHandler();
echo $handler->handle($request);

