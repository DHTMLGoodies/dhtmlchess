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
    private $title;
    private $updated;

    private function __construct($id)
    {
        $this->id = $id;
        global $wpdb;
        $this->wpdb = $wpdb;
    }

    public static function instanceByName($name)
    {
        if(empty($name)){
            throw new DhtmlChessException("PGN name missing");
        }
        $util = new DhtmlChessPgnUtil();
        $id = $util->getId($name);
        if(empty($id)){
            throw new DhtmlChessPgnNotFoundException("Unable to locate pgn");
        }
        return isset($id) ? new DhtmlChessPgn($id) : null;
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
    
    public function getId(){
        return $this->id;
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
        $this->putGameListInCache($ret);
        return $ret;
    }


    public function cachedListOfGames()
    {
        $query = $this->wpdb->prepare("select " . DhtmlChessDatabase::COL_DATA . " from " . DhtmlChessDatabase::TABLE_GAME_LIST . " where " . DhtmlChessDatabase::COL_PGN_ID . "=%s", $this->id);
        $row = $this->wpdb->get_row($query);

        return isset($row) && isset($row->{DhtmlChessDatabase::COL_DATA}) ? $row->{DhtmlChessDatabase::COL_DATA} : null;
    }


    public function randomGame(){

        $query = $this->wpdb->prepare("select " . DhtmlChessDatabase::COL_GAME . " from " . DhtmlChessDatabase::TABLE_GAME
            . " where " . DhtmlChessDatabase::COL_PGN_ID . "= %d", $this->id. " order by rand()");

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
        . " where ". DhtmlChessDatabase::COL_PGN_ID . "=%d", $this->id);
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
            throw new DhtmlChessException("Unable to add game");
        }
        $id = $this->wpdb->insert_id;

        $game["id"] = $id;
        $game["pgn"] = $this->getName();

        if(isset($game['round'])){
            $r = preg_replace('/[^0-9\.]/si', "", $game['round']);
            if(!empty($r)){
                $t = explode(".", $r);
                $i = 1;
                foreach($t as $val){
                    if(!empty($val)){
                        $game['__round_'. ($i++)] = $val;
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
        $cache->clear(DhtmlChessDatabase::CACHE_PGN);
        
        return $this->wpdb->insert_id;

    }


    public function getTitle(){
        $this->loadPgnData();
        return $this->title;
    }

    public function getName()
    {

        $this->loadPgnData();
        return $this->name;
    }

    private function loadPgnData(){
        if (empty($this->name)) {
            $query = $this->wpdb->prepare("SELECT "
                . DhtmlChessDatabase::COL_ID . ", "
                . DhtmlChessDatabase::COL_PGN_NAME . ","
                . DhtmlChessDatabase::COL_UPDATED . ","
                . DhtmlChessDatabase::COL_TITLE
                . " FROM " . DhtmlChessDatabase::TABLE_PGN . " WHERE " . DhtmlChessDatabase::COL_ID . " = '%d'", $this->id);
            $row = $this->wpdb->get_row($query);
            if (!empty($row)) {
                $this->name = $row->{DhtmlChessDatabase::COL_PGN_NAME};
                $this->title = $row->{DhtmlChessDatabase::COL_TITLE};
                $this->updated = $row->{DhtmlChessDatabase::COL_UPDATED};
            }

        }

    }

    /**
     * @return bool
     * @throws Exception
     */
    public function deletePgn(){
        $name = $this->getName();
        if(empty($name)){
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
        echo "COUNT DELETED ". $res . " from ". $this->getName() . "\n";

        if($res){
            $cache = new DhtmlChessCache();
            $cache->clear(DhtmlChessDatabase::CACHE_PGN);
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
        return new DhtmlChessPgn($id);
    }

    public function countGames()
    {

        $query = $this->wpdb->prepare("SELECT COUNT(" . DhtmlChessDatabase::COL_ID . ") as count FROM " . DhtmlChessDatabase::TABLE_GAME . " WHERE " . DhtmlChessDatabase::COL_PGN_ID . " = '%d'", $this->id);
        $row = $this->wpdb->get_row($query);
        return isset($row) && $row->count > 0 ? $row->count : 0;
    }


    public function updatedDate(){
        $this->loadPgnData();
        return $this->updated;

    }


}