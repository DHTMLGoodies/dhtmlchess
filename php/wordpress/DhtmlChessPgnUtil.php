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
        $name = preg_replace('/\s/', '_', $name);
        $testName = $name;
        $num = 1;
        while($this->exists($testName) && $num < 2000){
            $testName = $name . "(". ($num++) . ')';
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
                DhtmlChessDatabase::COL_PGN_NAME => $pgnFilePath
            ),
            array(
                '%s','%s'
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

    public static function lastMoves($moves = array())
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
}