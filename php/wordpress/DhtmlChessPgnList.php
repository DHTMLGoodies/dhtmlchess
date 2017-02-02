<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 25/01/2017
 * Time: 20:17
 */
class DhtmlChessPgnList
{
    public function getArchived(){
        return $this->read('1');
    }

    public function getPgns()
    {
        return $this->read('0');
    }

    private function read($archiveVal){

        $cacheKey = $archiveVal == '0' ? DhtmlChessDatabase::CACHE_PGN : DhtmlChessDatabase::CACHE_PGN_ARCHIVED;

        $cache = new DhtmlChessCache();
        $cacheVal = $cache->getFromCache($cacheKey);

        if (!empty($cacheVal)) return $cacheVal->{DhtmlChessDatabase::COL_CACHE_VALUE};

        /**
         * @var wpdb $wpdb
         */
        global $wpdb;

        $query = $wpdb->prepare("select "
            . " p." . DhtmlChessDatabase::COL_ID . ","
            . " p." . DhtmlChessDatabase::COL_PGN_NAME . ","
            . " p." . DhtmlChessDatabase::COL_UPDATED . ","
            . " count(g.ID) as count from " . DhtmlChessDatabase::TABLE_PGN . " p left join " .
            DhtmlChessDatabase::TABLE_GAME . " g on g." . DhtmlChessDatabase::COL_PGN_ID . "=p."
            . DhtmlChessDatabase::COL_ID
            . " where p." . DhtmlChessDatabase::COL_ARCHIVED . "=%s"
            . " and p." . DhtmlChessDatabase::COL_HIDDEN . "=%s"
            . " group by p." . DhtmlChessDatabase::COL_ID
            . " order by p." . DhtmlChessDatabase::COL_PGN_NAME, $archiveVal , '0');

        #echo $query;
        $results = $wpdb->get_results($query);
        $ret = array();
        foreach ($results as $pgn) {
            $ret[] = array(
                DhtmlChessDatabase::COL_ID => $pgn->{DhtmlChessDatabase::COL_ID},
                DhtmlChessDatabase::COL_PGN_NAME => $pgn->{DhtmlChessDatabase::COL_PGN_NAME},
                DhtmlChessDatabase::COL_UPDATED => $pgn->{DhtmlChessDatabase::COL_UPDATED},
                "count" => $pgn->count
            );
        }
        $ret = json_encode($ret);

        $cache->putInCache($cacheKey, $ret);

        return $ret;

    }
}