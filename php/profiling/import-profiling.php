<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Alf Magne
 * Date: 23.01.13
 * Time: 14:52
 * To change this template use File | Settings | File Templates.
 */

ini_set('display_errors','on');
date_default_timezone_set("Europe/Berlin");
require_once(__DIR__."/../autoload.php");

LudoDB::setHost('127.0.0.1');
LudoDB::setUser('root');
LudoDB::setPassword('administrator');
LudoDB::setDb('PHPUnit');

// Construct database tables
$tables = array('Move','Game','Fen','Metadata','MetadataValue');
foreach($tables as $table){
    $inst = new $table;
    $inst->drop()->yesImSure();
    $inst->createTable();
}

$profiling = new XHPProfiling('PGN to parser to DB');

$parser = new PgnParser("../../pgn/profiling.pgn");
$games = $parser->getGames();

foreach($games as $gameData){
    $game = new Game();
    $game->setDatabaseId(100);
    $game->setFen($gameData['metadata']['fen']);
    $game->setMetadata($gameData['metadata']);
    $game->setMoves($gameData['moves']);
    $game->commit();
}

echo $profiling->end();
