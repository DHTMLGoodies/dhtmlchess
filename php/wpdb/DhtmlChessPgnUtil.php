<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 25/01/2017
 * Time: 13:07
 */
class DhtmlChessPgnUtil
{

    public function __construct(){

    }

    public function getUniqueName($pgnFilePath){
        $name = $this->pathToPgnName($pgnFilePath);

        $testName = $name;
        $num = 1;
        while($this->exists($testName) && $num < 2000){
            $testName = $name . "_". ($num++);
        }
        return $testName;

    }
    
    public function pathToPgnName($pgnFilePath){
        $tokens = explode("/", $pgnFilePath);
        $last = array_pop($tokens);
        $filetokens = explode(".", $last);
        $filename = array_shift($filetokens);
        return esc_sql($filename);
    }

    /**
     * @param $pgnFilePath
     * @return DhtmlChessPgn
     */
    public function create($pgnFilePath){
        /**
         * @var wpdb $wpdb
         */
        global $wpdb;
        
        $pgnFilePath = $this->getUniqueName($pgnFilePath);

        
        $wpdb->insert(
            DhtmlChessDatabase::TABLE_PGN,
            array(
                DhtmlChessDatabase::COL_PGN_NAME => $pgnFilePath,
                DhtmlChessDatabase::COL_COUNT_GAMES => 0
            ),
            array(
                '%s','%d'
            )
        );

        return DhtmlChessPgn::instanceById($wpdb->insert_id);
    }

    public function getId($pgnPathOrName){
        /**
         * @var wpdb $wpdb
         */
        global $wpdb;

        $name = $this->pathToPgnName($pgnPathOrName);
        $row = $wpdb->get_row( "SELECT " . DhtmlChessDatabase::COL_ID . " FROM " . DhtmlChessDatabase::TABLE_PGN. " WHERE " . DhtmlChessDatabase::COL_PGN_NAME . "= '" . $name . "'");
        return isset($row) && $row->{DhtmlChessDatabase::COL_ID} > 0 ? $row->{DhtmlChessDatabase::COL_ID} : null;
    }

    private function exists($pgnName){
        $id= $this->getId($pgnName);
        return isset($id);
    }
}