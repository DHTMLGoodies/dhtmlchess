<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 15/04/2017
 * Time: 13:34
 */
class DhtmlChessMultiplayerGameHandler
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

    public function getGame($gameId){
        $query = $this->wpdb->prepare("SELECT * "
            . " FROM " . DhtmlChessDatabase::TABLE_MULTI_GAME . " WHERE " . DhtmlChessDatabase::COL_ID . " = '%d'", $gameId);
        $row = $this->wpdb->get_row($query, ARRAY_A);
        return DhtmlChessMultiPlayerGame::getInstance($row);
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


