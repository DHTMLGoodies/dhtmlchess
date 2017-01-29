<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 25/01/2017
 * Time: 20:17
 */
class DhtmlChessPgnList
{

    public function getPgns()
    {

        $cache = new DhtmlChessCache();
        $cacheVal = $cache->getFromCache(DhtmlChessDatabase::CACHE_PGN);

         if (!empty($cacheVal)) return $cacheVal->{DhtmlChessDatabase::COL_CACHE_VALUE};

        /**
         * @var wpdb $wpdb
         */
        global $wpdb;

        //  select p.pgn_name, count(g.ID) from dhtml_chess_game g left join dhtml_chess_pgn p on g.pgn_id = p.ID group by p.ID order by p.pgn_name

        $query = "select "
            . " p." . DhtmlChessDatabase::COL_PGN_NAME . ","
            . " p." . DhtmlChessDatabase::COL_UPDATED . ","
            . " count(g.ID) as count from " . DhtmlChessDatabase::TABLE_PGN . " p left join " .
            DhtmlChessDatabase::TABLE_GAME . " g on g." . DhtmlChessDatabase::COL_PGN_ID . "=p."
            . DhtmlChessDatabase::COL_ID . " group by p." . DhtmlChessDatabase::COL_ID
            . " order by p." . DhtmlChessDatabase::COL_PGN_NAME;

        #echo $query;
        $results = $wpdb->get_results($query);
        $ret = array();
        foreach ($results as $pgn) {
            $ret[] = array(
                DhtmlChessDatabase::COL_PGN_NAME => $pgn->{DhtmlChessDatabase::COL_PGN_NAME},
                DhtmlChessDatabase::COL_UPDATED => $pgn->{DhtmlChessDatabase::COL_UPDATED},
                "count" => $pgn->count
            );
        }
        $ret = json_encode($ret);

        $cache->putInCache(DhtmlChessDatabase::CACHE_PGN, $ret);

        return $ret;

    }
}