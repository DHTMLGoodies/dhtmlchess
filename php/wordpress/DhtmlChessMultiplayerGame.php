<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 15/04/2017
 * Time: 18:43
 */
class DhtmlChessMultiplayerGame
{
    /**
     * @var wpdb $wpdb
     */
    private $wpdb;


    public function __construct()
    {
        /**
         * var wpdb $wpdb
         */
        global $wpdb;
        $this->wpdb = $wpdb;
    }

    /**
     * @param DhtmlChessMultiGameParams $seek
     * @return int
     */
    public function createGame($seek)
    {
        $color = $seek->val(DhtmlChessDatabase::COL_SEEK_COLOR);
        if (empty($color)) {
            $seek->setSeekColor(DhtmlChessDatabase::COLOR_RANDOM);
        }
        $days = $seek->val(DhtmlChessDatabase::COL_DAYS_PER_MOVE);
        if(empty($days)){
            $days = 3;
        }
        $seek->setTimestamp(DhtmlChessDatabase::COL_CREATED);
        $seek->setDaysPerMove($days);

        $this->wpdb->insert(
            DhtmlChessDatabase::TABLE_MULTI_GAME,
            $seek->getParams()
        );

        return $this->wpdb->insert_id;
    }

    /**
     * @var DhtmlChessMultiGameParams $params ;
     */
    public function save($params)
    {

        $this->wpdb->update(DhtmlChessDatabase::TABLE_MULTI_GAME,
            $params->getParams(),
            array(DhtmlChessDatabase::COL_ID => $params->id())
        );
    }


}

