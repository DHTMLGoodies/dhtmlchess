<?php
/**
 * Pgn Parser profiling
 * User: Alf Magne
 * Date: 23.01.13
 * Time: 14:52
 */

ini_set('display_errors','on');
date_default_timezone_set("Europe/Berlin");
require_once("../autoload.php");

$profiling = new Profiling('PGN to parser to DB');

LudoDB::enableLogging();

$parser = new PgnParser("../../pgn/profiling.pgn");
$games = $parser->getGames();

echo $profiling->end();