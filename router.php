<?php

require_once(__DIR__."/autoload.php");

/**
 * TODO move this code
 */
LudoDB::setUser('root');
LudoDB::setPassword('administrator');
LudoDB::setHost('localhost');
LudoDB::setDb('PHPUnit');
LudoDB::enableLogging();

$request = $_GET['request'];

if(isset($_POST['request'])){
    $request['data'] = $_POST['data'];
}

$handler = new LudoDBRequestHandler();
echo $handler->handle($request);

