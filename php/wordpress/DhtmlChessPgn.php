<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 25/01/2017
 * Time: 14:14
 */
class DhtmlChessPgn
{

    private $id;
    /**
     * @var wpdb $wpdb
     */
    private $wpdb;

    private $name;
    private $updated;

    private function __construct($id)
    {
        $this->id = $id;
        global $wpdb;
        $this->wpdb = $wpdb;
    }

    private function cacheKey()
    {
        return "list_of_games_" . $this->id;
    }

    public static function newPgn($name)
    {
        $name = trim($name);
        $name = esc_sql($name);

        $util = new DhtmlChessPgnUtil();
        $id = $util->getId($name);

        if (!empty($id)) {
            throw new DhtmlChessException("A Database with this name already exists");
        }



        $cache = new DhtmlChessCache();
        $cache->clearPgnListCache();
        
        return $util->create($name);
    }

    public static function emptyInstance(){
        return new DhtmlChessPgn(null);

    }

    public static function instanceById($id)
    {

        global $wpdb;
        $query = $wpdb->prepare(
            "SELECT "
            . DhtmlChessDatabase::COL_ID . " FROM "
            . DhtmlChessDatabase::TABLE_PGN . " WHERE "
            . DhtmlChessDatabase::COL_ID . "= %d"
            , $id);

        $row = $wpdb->get_row($query);
        $id = isset($row) && $row->{DhtmlChessDatabase::COL_ID} > 0 ? $row->{DhtmlChessDatabase::COL_ID} : null;
        if (empty($id)) {
            throw new DhtmlChessPgnNotFoundException("Unable to locate pgn");
        }
        return new DhtmlChessPgn($id);
    }

    public static function instanceByName($name)
    {
        if (empty($name)) {
            throw new DhtmlChessException("PGN name missing");
        }
        $util = new DhtmlChessPgnUtil();
        $id = $util->getId($name);
        if (empty($id)) {
            throw new DhtmlChessPgnNotFoundException("Unable to locate pgn");
        }
        return new DhtmlChessPgn($id);
    }


    public function getId()
    {
        return $this->id;
    }

    public function cachedListOfGames()
    {
        $cacheKey = $this->cacheKey();
        $cache = new DhtmlChessCache();
        $cached = $cache->getFromCache($cacheKey);
        if (empty($cached)) return null;
        return $cached->{DhtmlChessDatabase::COL_CACHE_VALUE};
    }


    /**
     * @return string JSON
     */
    public function listOfGames()
    {
        $this->loadPgnData();
        $cacheKey = $this->cacheKey();;

        $cache = new DhtmlChessCache();

        $cached = $cache->getFromCache($cacheKey);
        if (!empty($cached) && $cached->{DhtmlChessDatabase::COL_UPDATED} > $this->updated) {
            return $cached->{DhtmlChessDatabase::COL_CACHE_VALUE};
        }

        $games = $this->getGames();
        $cache->putInCache($cacheKey, $games);

        return $games;

    }

    private function getGames()
    {
        $query = $this->wpdb->prepare("select " . DhtmlChessDatabase::COL_ID . "," . DhtmlChessDatabase::COL_GAME . " from " . DhtmlChessDatabase::TABLE_GAME
            . " where " . DhtmlChessDatabase::COL_PGN_ID . " = %s order by " . DhtmlChessDatabase::COL_SORT, $this->id);
        $results = $this->wpdb->get_results($query);
        $ret = array();
        foreach ($results as $game) {
            $gameObject = json_decode($game->{DhtmlChessDatabase::COL_GAME}, true);
            $gameObject['last_moves'] = DhtmlChessPgnUtil::lastMoves($gameObject['moves']);


            unset($gameObject["moves"]);
            unset($gameObject["metadata"]);
            $ret[] = $gameObject;
        }
        $ret = json_encode($ret);

        return $ret;
    }


    public function randomGame()
    {

        $query = $this->wpdb->prepare("select " . DhtmlChessDatabase::COL_GAME . " from " . DhtmlChessDatabase::TABLE_GAME
            . " where " . DhtmlChessDatabase::COL_PGN_ID . "= %d", $this->id . " order by rand()");

        $game = $this->wpdb->get_col($query, 0);
        return !empty($game) ? $game[0] : null;
    }

    /**
     * @param $index
     * @return string|null
     */
    public function gameByIndex($index)
    {

        $index = preg_replace("/[^0-9]/si", "", $index);

        $index = $index % max(1, $this->countGames(), $this->id);

        $query = $this->wpdb->prepare("select " . DhtmlChessDatabase::COL_GAME . " from " . DhtmlChessDatabase::TABLE_GAME
            . " where " . DhtmlChessDatabase::COL_PGN_ID . "=%d", $this->id);
        $game = $this->wpdb->get_row($query, 'OBJECT', $index);

        return !empty($game) ? $game->{DhtmlChessDatabase::COL_GAME} : null;

    }

    public function gameById($id)
    {
        $id = preg_replace("/[^0-9]/si", "", $id);

        $query = $this->wpdb->prepare("select " . DhtmlChessDatabase::COL_GAME . " from " . DhtmlChessDatabase::TABLE_GAME
            . " where " . DhtmlChessDatabase::COL_ID . "= %d", $id);
        $game = $this->wpdb->get_col($query, 0);

        return !empty($game) ? $game[0] : null;
    }

    /**
     * @param array|string $game
     * @param int $sort
     * @return int
     * @throws Exception
     */
    public function appendGame($game, $sort = null)
    {
        if (is_string($game)) {
            $game = json_decode($game, true);
        }

        $sort = (isset($sort) ? $sort : $this->countGames());

        $count = $this->wpdb->insert(
            DhtmlChessDatabase::TABLE_GAME,
            array(
                DhtmlChessDatabase::COL_SORT => $sort,
                DhtmlChessDatabase::COL_PGN_ID => $this->id
            ),
            array(
                '%d', '%d', '%d', '%s'
            )
        );

        if ($count == 0) {
            throw new DhtmlChessException("Unable to add game");
        }
        $id = $this->wpdb->insert_id;

        $game["id"] = $id;
        $game["pgn"] = $this->getName();
        $game["pgn_id"] = $this->getId();

        if (isset($game['round'])) {
            $r = preg_replace('/[^0-9\.]/si', "", $game['round']);
            if (!empty($r)) {
                $t = explode(".", $r);
                $i = 1;
                foreach ($t as $val) {
                    if (!empty($val)) {
                        $game['__round_' . ($i++)] = $val;
                    }
                }
            }
        }

        $this->wpdb->update(
            DhtmlChessDatabase::TABLE_GAME,
            array(
                DhtmlChessDatabase::COL_GAME => json_encode($game)
            ),
            array(DhtmlChessDatabase::COL_ID => $id),
            array(
                '%s'
            ),
            array()
        );

        $cache = new DhtmlChessCache();
        $cache->clearPgnListCache();

        $this->updateTimestamp();
        return $this->wpdb->insert_id;

    }


    public function getName()
    {
        $this->loadPgnData();
        return $this->name;
    }

    private function loadPgnData()
    {
        if (empty($this->name)) {
            $query = $this->wpdb->prepare("SELECT "
                . DhtmlChessDatabase::COL_ID . ", "
                . DhtmlChessDatabase::COL_PGN_NAME . ","
                . DhtmlChessDatabase::COL_UPDATED
                . " FROM " . DhtmlChessDatabase::TABLE_PGN . " WHERE " . DhtmlChessDatabase::COL_ID . " = '%d'", $this->id);
            $row = $this->wpdb->get_row($query);
            if (!empty($row)) {
                $this->name = $row->{DhtmlChessDatabase::COL_PGN_NAME};
                $this->updated = $row->{DhtmlChessDatabase::COL_UPDATED};
            }

        }
    }

    public function setHidden(){
        $countUpdated = $this->wpdb->update(
            DhtmlChessDatabase::TABLE_PGN,
            array(
                DhtmlChessDatabase::COL_HIDDEN => '1'
            ),
            array(DhtmlChessDatabase::COL_ID => $this->id),
            array(
                '%s'
            ),
            array()
        );

        if(!empty($countUpdated)){
            $this->clearCache();
        }
        return $countUpdated;
    }

    public function setArchived($archived)
    {
        if (!isset($archived) || ($archived != '1' && $archived != '0')) {
            throw new DhtmlChessException("Invalid archive property");
        }
        $countUpdated = $this->wpdb->update(
            DhtmlChessDatabase::TABLE_PGN,
            array(
                DhtmlChessDatabase::COL_ARCHIVED => $archived
            ),
            array(DhtmlChessDatabase::COL_ID => $this->id),
            array(
                '%s'
            ),
            array()
        );

        if (empty($countUpdated)) {
            throw new Exception("Not able to archive. Already archived?");
        }

        $this->clearCache();

        return $countUpdated;
    }

    private function clearCache(){
        $cache = new DhtmlChessCache();
        $cache->clearPgnListCache();
        $cache->clear($this->cacheKey());
    }

    /**
     * @return bool
     * @throws Exception
     */
    public function deletePgn()
    {
        $name = $this->getName();
        if (empty($name)) {
            throw new DhtmlChessException("Unable to delete pgn - name not found");
        }
        $name = esc_sql($name);

        $standings = new DhtmlChessStandings();
        $standings->deleteStandings($name);

        $res = $this->wpdb->delete(
            DhtmlChessDatabase::TABLE_PGN,
            array(DhtmlChessDatabase::COL_PGN_NAME => $name),
            array('%s')
        );

        $this->wpdb->delete(
            DhtmlChessDatabase::TABLE_GAME,
            array(DhtmlChessDatabase::COL_PGN_ID => $this->id),
            array('%d')
        );

        if ($res > 0) {
            $cache = new DhtmlChessCache();
            $cache->clearPgnListCache();
            $cache->clear($this->cacheKey());
        }

        return $res != false && $res > 0;
    }

    public function deleteGame($id)
    {
        $id = preg_replace('/[^0-9]/si', '', $id);

        $res = $this->wpdb->delete(
            DhtmlChessDatabase::TABLE_GAME,
            array(DhtmlChessDatabase::COL_ID => $id),
            array('%d')
        );

        if ($res) {
            $this->updateTimestamp();
            $cache = new DhtmlChessCache();
            $cache->clearPgnListCache();
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param string $game
     * @return bool
     * @throws Exception
     */
    public function updateGame($game)
    {
        $gameObject = json_decode($game, true);
        if (empty($gameObject[DhtmlChessDatabase::COL_ID])) {
            throw new DhtmlChessException("Unable to update game because id field is missing");
        }

        $id = $gameObject[DhtmlChessDatabase::COL_ID];

        $res = $this->wpdb->update(
            DhtmlChessDatabase::TABLE_GAME,
            array(
                DhtmlChessDatabase::COL_GAME => $game
            ),
            array(DhtmlChessDatabase::COL_ID => $id),
            array(
                '%s'
            ),
            array()
        );

        if (!empty($res)) {
            $this->updateTimestamp();
        }

        return $res == 1;

    }

    public function countGames()
    {

        $query = $this->wpdb->prepare("SELECT COUNT(" . DhtmlChessDatabase::COL_ID . ") as count FROM " . DhtmlChessDatabase::TABLE_GAME . " WHERE " . DhtmlChessDatabase::COL_PGN_ID . " = '%d'", $this->id);
        $row = $this->wpdb->get_row($query);
        return isset($row) && $row->count > 0 ? $row->count : 0;
    }


    public function updatedDate()
    {
        $this->loadPgnData();
        return $this->updated;

    }

    public function rename($newName){
        $countUpdated = $this->wpdb->update(
            DhtmlChessDatabase::TABLE_PGN,
            array(
                DhtmlChessDatabase::COL_PGN_NAME => $newName
            ),
            array(DhtmlChessDatabase::COL_ID => $this->id),
            array(
                '%s'
            ),
            array()
        );

        if(empty($countUpdated)){
            throw new DhtmlChessException("No database rows updated (". $this->id . " - ". $newName . ")");
        }

        $this->clearCache();
        $this->updateTimestamp();

        return $this;
    }

    public function updateTimestamp()
    {

        $id = uniqid();

        $this->wpdb->update(
            DhtmlChessDatabase::TABLE_PGN,
            array(
                DhtmlChessDatabase::COL_TMP => $id
            ),
            array(DhtmlChessDatabase::COL_ID => $this->id),
            array(
                '%s'
            ),
            array()
        );

    }

    public function asJSON()
    {
        $array = array(
            'id' => $this->getId(),
            'name' => $this->getName()
        );

        return json_encode($array);
    }


}