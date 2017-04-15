<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 15/04/2017
 * Time: 13:34
 */
class DhtmlChessMultiplayerGame
{

    /**
     * @var wpdb $wpdb
     */
    private $wpdb;



    public function __construct(){
        /**
         * var wpdb $wpdb
         */
        global $wpdb;
        $this->wpdb = $wpdb;
    }

    public function acceptSeek($gameId, $userId = null, $username = null){
        if(empty($userId)){
            $userId = get_current_user_id();
        }
        if(empty($username)){
            $username = self::getUserName();
        }

        
    }

    /**
     * @param DhtmlChessMultiplayerSeek $seek
     * @return int
     */
    public function createSeek($seek){
        $this->wpdb->insert(
            DhtmlChessDatabase::TABLE_MULTI_GAME,
            $seek->getSeekObject()
        );

        return $this->wpdb->insert_id;
    }

    public function getSeeks($userId){
        $query = $this->wpdb->prepare("select "
            . DhtmlChessDatabase::COL_ID . ","
            . DhtmlChessDatabase::COL_MIN_ELO .","
            . DhtmlChessDatabase::COL_MAX_ELO .","
            . DhtmlChessDatabase::COL_SEEK_OPPONENT_ID
            . " from " . DhtmlChessDatabase::TABLE_MULTI_GAME
            . " where " . DhtmlChessDatabase::COL_SEEK_CREATED_BY . " = %s order by " . DhtmlChessDatabase::COL_CREATED . " desc", $userId);

        $results = $this->wpdb->get_results($query);
        return $results;
    }

    public static function getUserName(){
        $id       = get_current_user_id();
        $userMeta = get_user_meta( $id );
        return $userMeta["nickname"];
    }


}

class DhtmlChessMultiplayerSeek{

    private $seekObj;

    public function __construct($createdBy = null, $createdByName = null){

        if(empty($createdBy)){
            $createdBy = get_current_user_id();
        }
        if(empty($createdByName)){
            $createdByName = DhtmlChessMultiplayerGame::getUserName();
        }

        $this->seekObj = array(
            DhtmlChessDatabase::COL_SEEK_CREATED_BY => $createdBy,
            DhtmlChessDatabase::COL_SEEK_CREATED_BY_NAME => $createdByName
        );
    }


    public function fromElo($fromElo = null){
        return $this->addProperty(DhtmlChessDatabase::COL_MIN_ELO, $fromElo, 0);
    }


    public function toElo($toElo = null){
        return $this->addProperty(DhtmlChessDatabase::COL_MAX_ELO, $toElo, 9999);
    }

    public function againstOpponent($opponentId = null){
        return $this->addProperty(DhtmlChessDatabase::COL_SEEK_OPPONENT_ID, $opponentId);
    }

    private function addProperty($key, $value = null, $defaultValue = null){
        if(!empty($value)){
            $this->seekObj[$key] = $value;
        }else if(isset($defaultValue)){
            $this->seekObj[$key] = $defaultValue;
        }
        return $this;
    }

    public function getSeekObject(){
        return $this->seekObj;
    }

    public function __toString()
    {
        return json_encode($this->seekObj);
    }
}