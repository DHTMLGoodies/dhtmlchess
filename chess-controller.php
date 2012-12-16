<?php
ini_set('display_errors', 'on');
date_default_timezone_set('Europe/Berlin');
header('Content-Type: text/html; charset=UTF-8');

require_once("php/jsonwrapper/jsonwrapper.php");
require_once("db-connection.php");
require_once("php/chess-config.php");
require_once("autoloader.php");
require_once("request-handler.php");

if(isset($_POST['progressBarId'])){
    $bar = ChessProgressBar::getInstance($_POST['progressBarId']);
}

if(isset($_POST['request'])){
    $handler = new RequestHandler();
    $data = $handler->handle($_POST['request']);
    Chess_JSON::getJSON($data, $handler->wasSuccess());
}

if(isset($_POST['ludo-file-upload-name'])){
    if(!ChessPlayer::hasLoggedOnUserAccessTo(ChessUserRoles::GAME_IMPORT)){
        Chess_JSON::getJSON(array(), false, 'Access denied');
        die();
    }
    header('Content-Type: text/html; charset=utf-8');
    $uploadInfo = FileUpload::uploadFile($_FILES[$_POST['ludo-file-upload-name']]);

    $data = array('success' => true, 'message' => '', 'data' => $uploadInfo);

    echo utf8_encode(json_encode($data));
    die();
}
