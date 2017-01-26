<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 25/01/2017
 * Time: 20:23
 */
class DhtmlChessCache
{
    /**
     * @var wpdb $wpdb
     */
    private $wpdb;

    public function __construct(){
        global $wpdb;
        $this->wpdb = $wpdb;
    }
    public function clear($key){
        $key = esc_sql($key);
        $this->wpdb->delete(
            DhtmlChessDatabase::TABLE_CACHE,
            array( DhtmlChessDatabase::COL_CACHE_KEY => $key ),
            array( '%s' )
        );

    }

    public function putInCache($key, $val){


        $key = esc_sql($key);

        $this->clear($key);
        $this->wpdb->insert(
            DhtmlChessDatabase::TABLE_CACHE,
            array(
                DhtmlChessDatabase::COL_CACHE_KEY => $key,
                DhtmlChessDatabase::COL_CACHE_VALUE => $val
            ),
            array(
                '%s','%s'
            )
        );

    }

    public function getFromCache($key){
        $key = esc_sql($key);
        
        $query = $this->wpdb->prepare("select ". DhtmlChessDatabase::COL_CACHE_VALUE. " from ". DhtmlChessDatabase::TABLE_CACHE
            . " where ". DhtmlChessDatabase::COL_CACHE_KEY . "=%s ", $key);
        $val = $this->wpdb->get_col($query, 0);

        return !empty($val) ? $val[0] : null;
    }
}