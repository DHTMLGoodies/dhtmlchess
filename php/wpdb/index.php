<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 25/01/2017
 * Time: 02:18
 */

error_reporting(E_ALL);
ini_set("display_errors", "on");

ob_start();

define( 'ABSPATH', dirname( __FILE__ ) . '/wordpress/' );


require_once( ABSPATH . '/wp-config.php' );
require_once("wordpress/wp-includes/load.php");
require_once("wordpress/wp-includes/plugin.php");
require_once("wordpress/wp-includes/wp-db.php");
require_once( ABSPATH . WPINC . '/version.php' );
#phpinfo();


require_once("../../autoload.php");

#$profiling = new XHPProfiling('PGNparserDB');
$gameParser = new PgnParser("../../pgn/Alekhine.pgn");
$games = $gameParser->getGames();
#echo $profiling->end();
#exit;

ob_end_clean();
$wpdb = new wpdb("root", "", "wordpress", "localhost");

$query = $wpdb->prepare("delete from `" . DhtmlChessDatabase::TABLE_GAME. "` where `id`>%d", 0);
$wpdb->query($query);

$database = new DhtmlChessDatabase();

$database->import('../../pgn/greatgames.pgn');
$database->import('../../pgn/FANT100.pgn');


// TODO test query here.


# 

#$wpdb->query('create table person(ID int auto_increment not null primary key, firstname varchar(255))');
