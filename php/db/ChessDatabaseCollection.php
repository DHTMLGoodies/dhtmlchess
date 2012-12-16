<?php

class ChessDatabaseCollection
{


    public static function getFiltered($filter){
        $filter = mysql_real_escape_string($filter);
        $ret = array();
        $res = mysql_query("select id,title from chess_database where title like '%". $filter . "%' order by title") or die(mysql_error());
        while($row = mysql_fetch_assoc($res)){
            $ret[] = array('id' => $row['id'], 'title' => $row['title']);
        }
        return $ret;
    }

}