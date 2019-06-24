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
    const TABLE_DUMMY = "dhtml_chess_dummy";
    const TABLE_DATABASE_VERSION = "dhtml_chess_version";
    const TABLE_KEY_VALUE_STORE = "dhtml_chess_key_value";
    const TABLE_ELO = "dhtml_chess_elo";

    const TABLE_MULTI_GAME = "dhtml_chess_mp_game";


    const COL_WHITE_ID = "white_id";
    const COL_BLACK_ID = "black_id";
    const COL_SEEK_CREATED_BY = "seek_user_id";
    const COL_SEEK_CREATED_BY_NAME = "seek_user_name";
    const COL_SEEK_COLOR = "seek_color";
    const COL_DAYS_PER_MOVE = "days_per_move";
    const COL_TS_LAST_MOVE = "ts_last_move";
    const COL_MIN_ELO = "min_elo";
    const COL_MAX_ELO = "max_elo";
    const COL_WHITE_NAME = "white";
    const COL_BLACK_NAME = "black";
    const COL_RESULT = "result";
    const COL_FINISHED = "finished";
    const COL_STARTED = "started";
    const COL_SEEK_OPPONENT_ID = "seek_against";
    const COL_CURRENT_FEN = "fen";
    const COL_USER_ID_TO_MOVE = "user_id_to_move";

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
    const COL_ARCHIVED = "archived";
    const COL_TMP = "tmp";
    const COL_HIDDEN = "hidden";
    const COL_DB_VERSION = "db_version";

    const COL_KEY = "store_key";
    const COL_VALUE = "store_value";
    const COL_VALUE_TYPE = "store_type";


    const COL_CACHE_KEY = "cache_key";
    const COL_CACHE_VALUE = "cache_val";
    const COL_USER_ID = "user_id";
    const COL_ELO = "elo";

    const CACHE_PGN = "pgn";
    const CACHE_PGN_ARCHIVED = "pgn_archived";


    const KEY_PGN = "pgn";
    const KEY_DRAFT_ID = "draft_id";

    const KEY_WHITE_WIN = 1;
    const KEY_BLACK_WIN = 2;
    const KEY_DRAW = 3;

    const YES = 1;
    const NO = 0;

    const COLOR_WHITE = "w";
    const COLOR_BLACK = "b";
    const COLOR_RANDOM = "r";

    public function __construct()
    {

    }

    public function install()
    {
        $installer = new DhtmlChessInstaller();
        $installer->install();
    }

    public function upgrade()
    {
        $installer = new DhtmlChessInstaller();
        $installer->upgrade();
    }

    public function uninstall()
    {
        $installer = new DhtmlChessInstaller();
        $installer->uninstall();
    }

    public function import($pgnFileName, $title = null)
    {
        $importer = new DhtmlChessImportPgn();
        $pgn = $importer->import($pgnFileName, $title);

        return $pgn;
    }

    /**
     * Returns array(0 = count imported, 1 = count games in pgn)
     * @param $pgnId
     * @param $pgn
     * @return array
     */
    public function appendPgnString($pgnId, $pgn)
    {
        $importer = new DhtmlChessImportPgn();
        return $importer->importPgnStringToDatabase($pgnId, $pgn);
    }

    /**
     * @param $pgnId
     * @return string
     * @throws DhtmlChessException
     * @throws DhtmlChessPgnNotFoundException
     */
    public function listOfGames($pgnId)
    {
        $pgn = DhtmlChessPgn::instanceById($pgnId);
        return $pgn->listOfGames();
    }

    public function listOfPgns()
    {
        $util = new DhtmlChessPgnList();
        return $util->getPgns();
    }

    public function listOfArchivedPgns()
    {
        $util = new DhtmlChessPgnList();
        return $util->getArchived();
    }

    /**
     * @param $pgnId
     * @return null
     * @throws DhtmlChessException
     * @throws DhtmlChessPgnNotFoundException
     */
    public function randomGame($pgnId)
    {
        $pgnId = DhtmlChessPgn::instanceById($pgnId);
        return $pgnId->randomGame();
    }

    /**
     * @param {String} $gameId
     * @param $toPgnId
     * @throws DhtmlChessException
     */
    public function moveGame($gameId, $toPgnId)
    {
        $pgn = DhtmlChessPgn::instanceById($toPgnId);
        $game = $pgn->gameById($gameId);

        if (isset($game)) {
            $gameObject = json_decode($game, true);
            if (empty($gameObject["pgn"])) {
                throw new DhtmlChessException("Unable to move game - parent pgn not found");
            }

            $fromPgn = DhtmlChessPgn::instanceById($gameObject["pgn_id"]);

            $fromPgn->deleteGame($gameId);
            $pgn->appendGame($game);
        }
    }

    public function getNextGameFromDatabases($pgnIds, $userId){

        mt_srand();

        $count = array();
        $next = array();

        $possibleDatabases = array();
        $nextIndexInPossible = array();

        $sumGames = 0;
        
        foreach($pgnIds as $id){
            $countInGame = $this->countGames($id);
            $nextPuzzleIndex = $this->getNextPuzzleIndexForUser($id, $userId);

            $count[] = $countInGame;
            $next[] = $nextPuzzleIndex;
            $sumGames += $countInGame;

            if($nextPuzzleIndex < $countInGame){
                $possibleDatabases[] = $id;
                $nextIndexInPossible[] = $nextPuzzleIndex;
            }
        }
        
        if($sumGames === 0){
            return;
        }
        

        if(count($possibleDatabases) === 0){
            foreach($pgnIds as $id){
                $this->clearNextPuzzleIndex($id, $userId);
            }
            return $this->getNextGameFromDatabases($pgnIds, $userId);
        }

        $index = mt_rand(0, count($possibleDatabases) -  1);

        $pgnId = $possibleDatabases[$index];

        $gameIndex = $nextIndexInPossible[$index];

        // echo "possible databases: ".implode($possibleDatabases, ",");
        // echo "next possible indices: " .implode($nextIndexInPossible, ",");

        return array(
            "game" => $this->puzzleGameByIndexStrict($pgnId, $gameIndex),
            "index" => $gameIndex,
            "pgnId" => $pgnId,
            "debug" => implode($nextIndexInPossible, "_")
        );
    }
    
    private function getNextPuzzleKey($pgnId, $userId){
        //echo "pgn id: ".$pgnId. " and userId ". $userId."\n";
        return "un".$pgnId."_".$userId;
    }

    public function clearNextPuzzleIndex($pgnId, $userId){
        $setter = new DhtmlChessKeyValue();
        $setter->remove($this->getNextPuzzleKey($pgnId, $userId));
    }

    public function getNextPuzzleIndexForUser($pgnId, $userId){

        $key = $this->getNextPuzzleKey($pgnId, $userId);

        $setter = new DhtmlChessKeyValue();

        return $setter->get($key, 0);
    }

    public function gameByIndexStrict($pgnId, $index)
    {
        $pgnId = DhtmlChessPgn::instanceById($pgnId);
        return $pgnId->gameByIndexStrict($index);
    }

    public function puzzleGameByIndexStrict($pgnId, $index){
        $pgnId = DhtmlChessPgn::instanceById($pgnId);
        return $pgnId->gameByIndexStrict($index, true);        
    }

    /**
     * @param $pgnId
     * @param $index
     * @return null|string
     * @throws DhtmlChessException
     * @throws DhtmlChessPgnNotFoundException
     */
    public function gameByIndex($pgnId, $index)
    {
        $pgnId = DhtmlChessPgn::instanceById($pgnId);
        return $pgnId->gameByIndex($index);
    }

    /**
     * @param $pgnId
     * @param $id
     * @return null
     * @throws DhtmlChessException
     * @throws DhtmlChessPgnNotFoundException
     */
    public function gameById($id)
    {
        $pgnId = DhtmlChessPgn::emptyInstance();
        return $pgnId->gameById($id);
    }

    /**
     * @param $pgnId
     * @param $game
     * @return bool
     * @throws DhtmlChessException
     * @throws DhtmlChessPgnNotFoundException
     */
    public function updateGame($pgnId, $game)
    {
        $pgn = DhtmlChessPgn::instanceById($pgnId);
        return $pgn->updateGame($game);
    }

    /**
     * @param $pgnId
     * @param $id
     * @return bool
     * @throws DhtmlChessException
     * @throws DhtmlChessPgnNotFoundException
     */
    public function deleteGame($pgnId, $id)
    {
        $pgn = DhtmlChessPgn::instanceById($pgnId);
        return $pgn->deleteGame($id);
    }

    /**
     * @param $pgnId
     * @return bool
     * @throws DhtmlChessException
     * @throws DhtmlChessPgnNotFoundException
     */
    public function deletePgn($pgnId)
    {
        $pgn = DhtmlChessPgn::instanceById($pgnId);
        return $pgn->deletePgn();
    }

    /**
     * @param $pgnId
     * @param $game
     * @return int
     * @throws DhtmlChessException
     * @throws DhtmlChessPgnNotFoundException
     */
    public function appendGame($pgnId, $game)
    {
        $pgn = DhtmlChessPgn::instanceById($pgnId);
        return $pgn->appendGame($game);
    }

    /**
     * @param int $pgnId
     * @return int
     * @throws DhtmlChessException
     * @throws DhtmlChessPgnNotFoundException
     */
    public function countGames($pgnId)
    {
        $pgnId = DhtmlChessPgn::instanceById($pgnId);
        return $pgnId->countGames();
    }

    public function createDatabase($name)
    {
        $pgn = DhtmlChessPgn::newPgn($name);
        return $pgn;
    }


    /**
     * @param int $pgnId
     * @return false|int
     * @throws DhtmlChessException
     * @throws DhtmlChessPgnNotFoundException
     * @throws Exception
     */
    public function archivePgn($pgnId)
    {
        $pgnId = DhtmlChessPgn::instanceById($pgnId);
        return $pgnId->setArchived('1');
    }

    public function restoreArchived($pgnId)
    {
        $pgnId = DhtmlChessPgn::instanceById($pgnId);
        return $pgnId->setArchived('0');
    }

    /**
     * @param $pgnPath
     * @param int $toPgnId
     * @return DhtmlChessPgn
     * @throws DhtmlChessException
     */
    public function appendPgn($pgnPath, $toPgnId)
    {
        $importer = new DhtmlChessImportPgn();
        return $importer->appendPgn($pgnPath, $toPgnId);
    }

    public function rename($id, $newName)
    {
        $pgn = DhtmlChessPgn::instanceById($id);
        return $pgn->rename($newName);

    }

    /**
     * @param int $pgnId
     * @return array|mixed|string
     */
    public function getStandings($pgnId)
    {
        $standings = new DhtmlChessStandings();
        return $standings->getStandings($pgnId);
    }

    public function getStandingsSortedAsArray($pgnId, $sofiaRules = false)
    {

        $standings = $this->getStandings($pgnId);
        $table = json_decode($standings, true);

        if ($sofiaRules) {
            $w = 3;
            $d = 1;
        } else {
            $w = 1;
            $d = .5;
        }
        foreach ($table as &$player) {
            $player["s"] = $player["w"] * $w + $player["d"] * $d;
        }

        usort($table, array($this, "standingsSortFunction"));

        return $table;

    }

    private function standingsSortFunction($a, $b)
    {

        return $a["s"] < $b["s"] ? 1 : -1;

    }

    public function countGamesInDatabase()
    {
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
    public function saveDraft($game)
    {

        $draft = new DhtmlChessDraft();
        if (is_string($game)) {
            $game = json_decode($game, true);
        }
        if (!empty($game[self::KEY_DRAFT_ID])) {
            $id = $game[self::KEY_DRAFT_ID];
            return $draft->update($id, $game);
        }

        return $draft->save($game);

    }

    public function countDrafts()
    {
        $draft = new DhtmlChessDraft();
        return $draft->countDrafts();
    }

    public function getDraft($draftId)
    {
        $draft = new DhtmlChessDraft();
        return $draft->getDraft($draftId);
    }

    public function deleteDraft($draftId)
    {
        $draft = new DhtmlChessDraft();
        return $draft->deleteDraft($draftId);

    }

    public function allDrafts()
    {
        $draft = new DhtmlChessDraft();
        return $draft->allDrafts();
    }

    /**
     * @param string $draft
     * @param int $pgnId
     * @return int
     * @throws DhtmlChessException
     */
    public function publishDraft($draft, $pgnId)
    {

        if (empty($pgnId)) {
            throw new DhtmlChessException("Unable to publish draft - pgn is empty");
        }


        $draft = json_decode($draft, true);
        $draftId = isset($draft[self::KEY_DRAFT_ID]) ? $draft[self::KEY_DRAFT_ID] : null;
        unset($draft[self::KEY_DRAFT_ID]);

        $pgnId = DhtmlChessPgn::instanceById($pgnId);
        $id = $pgnId->appendGame($draft);
        if (empty($id)) {
            throw new DhtmlChessException("Could not publish game");
        }
        if (!empty($draftId)) $this->deleteDraft($draftId);

        return $id;

    }

    public function publishDraftInNewDatabase($draft, $pgnName)
    {
        $draft = json_decode($draft, true);
        $draftId = isset($draft[self::KEY_DRAFT_ID]) ? $draft[self::KEY_DRAFT_ID] : null;
        unset($draft[self::KEY_DRAFT_ID]);

        $util = new DhtmlChessPgnUtil();
        $pgnId = $util->create($pgnName);
        $pgnId->appendGame($draft);
        $this->deleteDraft($draftId);
    }


}