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


    const COL_CACHE_KEY = "cache_key";
    const COL_CACHE_VALUE = "cache_val";

    const CACHE_PGN = "pgn";
    const CACHE_PGN_ARCHIVED = "pgn_archived";


    const KEY_PGN = "pgn";
    const KEY_DRAFT_ID = "draft_id";

    public function __construct()
    {

    }

    public function install()
    {
        $installer = new DhtmlChessInstaller();
        $installer->install();
    }

    public function upgrade($oldVersion, $newVersion)
    {
        $installer = new DhtmlChessInstaller();
        $installer->upgrade($oldVersion, $newVersion);
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
    public function gameById($pgnId, $id)
    {
        $pgnId = DhtmlChessPgn::instanceById($pgnId);
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

    public function restoreArchived($pgnId){
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

    /**
     * @param int $pgnId
     * @return array|mixed|string
     */
    public function getStandings($pgnId)
    {
        $standings = new DhtmlChessStandings();
        return $standings->getStandings($pgnId);
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