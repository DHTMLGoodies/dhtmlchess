<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 25/01/2017
 * Time: 14:14
 */
class DhtmlChessDatabasePgn
{

    private $id;
    /**
     * @var wpdb $wpdb
     */
    private $wpdb;

    private $name;


    private function __construct($id)
    {
        $this->id = $id;

        global $wpdb;
        $this->wpdb = $wpdb;


    }

    public static function instanceByName($name)
    {
        $util = new DhtmlChessDatabasePgnUtil();
        $id = $util->getId($name);
        if(empty($id)){
            throw new Exception("Unable to locate pgn");
        }
        return isset($id) ? new DhtmlChessDatabasePgn($id) : null;
    }

    public function clearPgnList()
    {
        $this->wpdb->delete(DhtmlChessDatabase::TABLE_GAME_LIST, array(DhtmlChessDatabase::COL_PGN_ID => $this->id));
    }

    /**
     * @param string $gameList
     */
    private function putGameListInCache($gameList)
    {
        $this->wpdb->insert(
            DhtmlChessDatabase::TABLE_GAME_LIST,
            array(
                DhtmlChessDatabase::COL_PGN_ID => $this->id,
                DhtmlChessDatabase::COL_DATA => $gameList
            ),
            array(
                '%s'
            )
        );
    }

    /**
     * @return string JSON
     */
    public function listOfGames()
    {
        $cached = $this->cachedListOfGames();
        if (isset($cached)) {
            return $cached;
        }

        return $this->getGames();
    }

    private function getGames()
    {
        $query = $this->wpdb->prepare("select " . DhtmlChessDatabase::COL_ID . "," . DhtmlChessDatabase::COL_GAME . " from " . DhtmlChessDatabase::TABLE_GAME . " where " . DhtmlChessDatabase::COL_PGN_ID . " = %s order by " . DhtmlChessDatabase::COL_SORT, $this->id);
        $results = $this->wpdb->get_results($query);
        $ret = array();
        foreach ($results as $game) {
            $gameObject = json_decode($game->{DhtmlChessDatabase::COL_GAME}, true);
            $gameObject['last_moves'] = $this->getLastMoves($gameObject['moves']);

            unset($gameObject["moves"]);
            unset($gameObject["metadata"]);
            $ret[] = $gameObject;
        }
        $ret = json_encode($ret);
        $this->putGameListInCache($ret);
        return $ret;
    }

    private function getLastMoves($moves = array())
    {
        $count = count($moves);
        $start = $count - 3;
        $start = max(0, $start);

        $ret = array();

        if ($start % 2 === 1) $ret[] = ".. " . (floor($start / 2) + 1) . ".";
        for ($i = $start; $i < $count; $i++) {
            if (isset($moves[$i])) {
                if ($i % 2 === 0) {
                    $ret[] = (($i / 2) + 1) . ".";
                }
                $ret[] = $moves[$i]['m'];
            }
        }
        return implode(" ", $ret);
    }

    public function cachedListOfGames()
    {
        $query = $this->wpdb->prepare("select " . DhtmlChessDatabase::COL_DATA . " from " . DhtmlChessDatabase::TABLE_GAME_LIST . " where " . DhtmlChessDatabase::COL_PGN_ID . "=%s", $this->id);
        $row = $this->wpdb->get_row($query);

        return isset($row) && isset($row->{DhtmlChessDatabase::COL_DATA}) ? $row->{DhtmlChessDatabase::COL_DATA} : null;
    }


    /**
     * @param $index
     * @return string|null
     */
    public function gameByIndex($index)
    {

        $index = preg_replace("/[^0-9]/si", "", $index);

        $index = $index % $this->countGames();

        $query = $this->wpdb->prepare("select " . DhtmlChessDatabase::COL_GAME . " from " . DhtmlChessDatabase::TABLE_GAME . " where " . DhtmlChessDatabase::COL_PGN_ID . "=%s", $this->id);
        $game = $this->wpdb->get_row($query, 'OBJECT', $index);

        return !empty($game) ? $game->{DhtmlChessDatabase::COL_GAME} : null;

    }

    public function gameById($id)
    {
        $id = preg_replace("/[^0-9]/si", "", $id);


        $query = $this->wpdb->prepare("select " . DhtmlChessDatabase::COL_GAME . " from " . DhtmlChessDatabase::TABLE_GAME
            . " where " . DhtmlChessDatabase::COL_PGN_ID . "=%s "
            . " and " . DhtmlChessDatabase::COL_ID . "= %d", $this->id, $id);
        $game = $this->wpdb->get_col($query, 0);

        return !empty($game) ? $game : null;
    }

    /**
     * @param array|string $game
     * @param int $sort
     * @return int
     * @throws Exception
     */
    public function appendGame($game, $sort = null)
    {
        if(is_string($game)){
            $game = json_decode($game, true);
        }
        $this->clearPgnList();

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

        if($count== 0){
            throw new Exception("Unable to add game");
        }
        $id = $this->wpdb->insert_id;

        $game["id"] = $id;

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

        return $this->wpdb->insert_id;

    }

    public function getName()
    {
        if (empty($this->name)) {
            $query = $this->wpdb->prepare("SELECT " . DhtmlChessDatabase::COL_ID . ", "
                . DhtmlChessDatabase::COL_PGN_NAME . " FROM " . DhtmlChessDatabase::TABLE_PGN . " WHERE " . DhtmlChessDatabase::COL_ID . " = '%d'", $this->id);
            $row = $this->wpdb->get_row($query);
            if (!empty($row)) {
                $this->name = $row->{DhtmlChessDatabase::COL_PGN_NAME};
            }

        }

        return $this->name;
    }

    /**
     * @return bool
     * @throws Exception
     */
    public function deletePgn(){
        $name = $this->getName();
        if(empty($name)){
            throw new Exception("Unable to delete pgn - name not found");
        }
        $name = esc_sql($name);

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

        if($res > 0){
            $cache = new DhtmlChessCache();
            $cache->clear(DhtmlChessDatabase::CACHE_PGN);
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

        if($res){
            $this->clearPgnList();
            return true;
        }else{
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
            throw new Exception("Unable to update game because id field is missing");
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

        if ($res != false) {
            $this->clearPgnList();
        }

        return $res == 1;

    }

    /**
     * @param $id
     * @return DhtmlChessDatabase
     */
    public static function instanceById($id)
    {
        return new DhtmlChessDatabasePgn($id);
    }

    public function countGames()
    {

        $query = $this->wpdb->prepare("SELECT COUNT(" . DhtmlChessDatabase::COL_ID . ") as count FROM " . DhtmlChessDatabase::TABLE_GAME . " WHERE " . DhtmlChessDatabase::COL_PGN_ID . " = '%d'", $this->id);
        $row = $this->wpdb->get_row($query);
        return isset($row) && $row->count > 0 ? $row->count : 0;
    }


}