<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 25/01/2017
 * Time: 12:21
 */
class DhtmlChessDatabase
{

    const TABLE_PGN = 'dhtml_chess_pgn';
    const TABLE_GAME = 'dhtml_chess_game';
    const TABLE_GAME_LIST = 'dhtml_chess_game_list';
    const TABLE_CACHE = "dhtml_chess_cache";

    const COL_ID = "id";
    const COL_DHTML_CHESS_ID = "dhtml_chess_id";
    const COL_SORT = "sort";
    const COL_PGN_NAME = "pgn_name";
    const COL_PGN_ID = "pgn_id";
    const COL_GAME = "game";
    const COL_DATA = "data";
    const COL_COUNT_GAMES = "count_games";

    const COL_CACHE_KEY = "cache_key";
    const COL_CACHE_VALUE = "cache_val";

    const CACHE_PGN = "pgn";

    public function __construct(){

    }

    public function install(){
        $installer = new DhtmlChessDatabaseInstaller();
        $installer->install();
    }

    public function upgrade($oldVersion, $newVersion){
        $installer = new DhtmlChessDatabaseInstaller();
        $installer->upgrade($oldVersion, $newVersion);
    }

    public function uninstall(){
        $installer = new DhtmlChessDatabaseInstaller();
        $installer->uninstall();
    }

    public function import($pgnFileName){
        $importer = new DhtmlChessDatabaseImportPgn();
        $importer->import($pgnFileName);

        return DhtmlChessDatabasePgn::instanceByName($pgnFileName);
    }

    public function listOfGames($pgnFileName){
        $pgn = DhtmlChessDatabasePgn::instanceByName($pgnFileName);
        return $pgn->listOfGames();
    }

    public function listOfPgns(){
        $util = new DhtmlChessPgnList();
        return $util->getPgns();
    }

    public function gameByIndex($pgn, $index){
        $pgn = DhtmlChessDatabasePgn::instanceByName($pgn);
        return $pgn->gameByIndex($index);
    }

    public function gameById($pgn, $id){
        $pgn = DhtmlChessDatabasePgn::instanceByName($pgn);
        return $pgn->gameById($id);
    }

    public function updateGame($pgn, $game){
        $pgn = DhtmlChessDatabasePgn::instanceByName($pgn);
        return $pgn->updateGame($game);
    }
    
    public function deleteGame($pgn, $id){
        $pgn = DhtmlChessDatabasePgn::instanceByName($pgn);
        return $pgn->deleteGame($id);
    }

    public function deletePgn($pgn){
        $pgn = DhtmlChessDatabasePgn::instanceByName($pgn);
        return $pgn->deletePgn();
    }

    public function appendGame($pgn, $game){
        $pgn = DhtmlChessDatabasePgn::instanceByName($pgn);
        return $pgn->appendGame($game);
    }

    public function countGames($pgn){
        $pgn = DhtmlChessDatabasePgn::instanceByName($pgn);
        return $pgn->countGames();
    }


    public function appendPgn($pgnPath){
        $importer = new DhtmlChessDatabaseImportPgn();
        return $importer->appendPgn($pgnPath);
    }

    public function countGamesInDatabase(){
        /**
         * @var wpdb $wpdb
         */
        global $wpdb;
        $query = "select count(" . DhtmlChessDatabase::COL_ID . ") as count from " . DhtmlChessDatabase::TABLE_GAME;
        $result = $wpdb->get_col($query, 0);
        return !empty($result) ? $result[0] : 0;
    }
}