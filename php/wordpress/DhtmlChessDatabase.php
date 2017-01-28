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
    const TABLE_DRAFT = "dhtml_chess_game_draft";

    const COL_ID = "id";
    const COL_DHTML_CHESS_ID = "dhtml_chess_id";
    const COL_SORT = "sort";
    const COL_PGN_NAME = "pgn_name";
    const COL_PGN_ID = "pgn_id";
    const COL_GAME = "game";
    const COL_DATA = "data";
    const COL_COUNT_GAMES = "count_games";
    const COL_CREATED = "created";
    const COL_UPDATED = "updated";
    const COL_TITLE = "title";

    const COL_CACHE_KEY = "cache_key";
    const COL_CACHE_VALUE = "cache_val";

    const CACHE_PGN = "pgn";

    const KEY_PGN = "pgn";
    const KEY_DRAFT_ID = "draft_id";

    public function __construct(){

    }

    public function install(){
        $installer = new DhtmlChessInstaller();
        $installer->install();
    }

    public function upgrade($oldVersion, $newVersion){
        $installer = new DhtmlChessInstaller();
        $installer->upgrade($oldVersion, $newVersion);
    }

    public function uninstall(){
        $installer = new DhtmlChessInstaller();
        $installer->uninstall();
    } 

    public function import($pgnFileName, $title = null){
        $importer = new DhtmlChessImportPgn();
        $importer->import($pgnFileName, $title);

        return DhtmlChessPgn::instanceByName($pgnFileName);
    }
    
    

    public function listOfGames($pgnFileName){
        $pgn = DhtmlChessPgn::instanceByName($pgnFileName);
        return $pgn->listOfGames();
    }

    public function listOfPgns(){
        $util = new DhtmlChessPgnList();
        return $util->getPgns();
    }

    public function randomGame($pgn){
        $pgn = DhtmlChessPgn::instanceByName($pgn);
        return $pgn->randomGame();
    }

    /**
     * @param {String} $gameId
     * @param $toPgn
     * @throws DhtmlChessException
     */
    public function moveGame($gameId, $toPgn){
        $pgn = DhtmlChessPgn::instanceByName($toPgn);
        $game = $pgn->gameById($gameId);

        if(isset($game)){
            $gameObject = json_decode($game, true);
            if(empty($gameObject["pgn"])){
                throw new DhtmlChessException("Unable to move game - parent pgn not found");
            }

            $fromPgn = DhtmlChessPgn::instanceByName($gameObject["pgn"]);

            $fromPgn->deleteGame($gameId);
            $pgn->appendGame($game);
        }
        
    }

    public function gameByIndex($pgn, $index){
        $pgn = DhtmlChessPgn::instanceByName($pgn);
        return $pgn->gameByIndex($index);
    }

    public function gameById($pgn, $id){
        $pgn = DhtmlChessPgn::instanceByName($pgn);
        return $pgn->gameById($id);
    }

    public function updateGame($pgn, $game){
        $pgn = DhtmlChessPgn::instanceByName($pgn);
        return $pgn->updateGame($game);
    }
    
    public function deleteGame($pgn, $id){
        $pgn = DhtmlChessPgn::instanceByName($pgn);
        return $pgn->deleteGame($id);
    }

    public function deletePgn($pgn){
        $pgn = DhtmlChessPgn::instanceByName($pgn);
        return $pgn->deletePgn();
    }

    public function appendGame($pgn, $game){
        $pgn = DhtmlChessPgn::instanceByName($pgn);
        return $pgn->appendGame($game);
    }

    public function countGames($pgn){
        $pgn = DhtmlChessPgn::instanceByName($pgn);
        return $pgn->countGames();
    }


    public function appendPgn($pgnPath, $toPgn){
        $importer = new DhtmlChessImportPgn();
        return $importer->appendPgn($pgnPath, $toPgn);
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


    /**
     * @param $game
     * @return int draftid
     */
    public function saveDraft($game){
        
        $draft = new DhtmlChessDraft();
        if(is_string($game)){
            $game = json_decode($game, true);
        }
        if(!empty($game[self::KEY_DRAFT_ID])){
            $id = $game[self::KEY_DRAFT_ID];
            return $draft->update($id, $game);
        }
        
        return $draft->save($game);

    }
    
    public function countDrafts(){
        $draft = new DhtmlChessDraft();
        return $draft->countDrafts();
    }

    public function getDraft($draftId){
        $draft = new DhtmlChessDraft();
        return $draft->getDraft($draftId);
    }
    
    public function deleteDraft($draftId){
        $draft = new DhtmlChessDraft();
        return $draft->deleteDraft($draftId);
        
    }

    public function allDrafts(){
        $draft = new DhtmlChessDraft();
        return $draft->allDrafts();
    }

    public function publishDraft($draft, $pgn){

        if(empty($pgn)){
            throw new DhtmlChessException("Unable to publish draft - pgn is empty");
        }


        $draft = json_decode($draft, true);
        $draftId = isset($draft[self::KEY_DRAFT_ID])? $draft[self::KEY_DRAFT_ID] : null;
        unset($draft[self::KEY_DRAFT_ID]);

        try{
            $pgn = DhtmlChessPgn::instanceByName($pgn);
            $id = $pgn->appendGame($draft);
            if(empty($id)){
                throw new DhtmlChessException("Could not publish game");
            }
            if(!empty($draftId))$this->deleteDraft($draftId);
            
            return $id;
            

        }catch(DhtmlChessPgnNotFoundException $e){
            $util = new DhtmlChessPgnUtil();
            $pgn = $util->create($pgn);
            $pgn->appendGame($draft);
            $this->deleteDraft($draftId);
        }
    }
}