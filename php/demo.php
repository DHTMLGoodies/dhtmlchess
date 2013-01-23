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
require_once("autoload.php");

$parser = new PgnParser('chessDB/Tests/pgn/test.pgn');
$games = $parser->getGames();
$gameData = $games[1];

LudoDB::setHost('localhost');
LudoDB::setUser('root');
LudoDB::setPassword('administrator');
LudoDB::setDb('PHPUnit');

header("Content-type: application/json");

// Construct database tables
$tables = array('Move','Game','Fen','Metadata','MetadataValue');
foreach($tables as $table){
    $inst = new $table;
    $inst->drop();
    $inst->createTable();
}

$profiling = new Profiling('smart-folder-tree');



$game = new Game();
$game->setDatabaseId(100);
$game->setFen($gameData['metadata']['fen']);
$game->setMetadata($gameData['metadata']);
$game->setMoves($gameData['moves']);
$game->commit();

LudoDB::enableLogging();
$game = new Game($game->getId());

echo $game;

#echo $profiling->end();
