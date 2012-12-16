<?php

class ChessDatabase extends ChessDbModel {

    protected $dbTableName = 'chess_database';
    protected $objectType = 'Database';

    protected $definition = array(
        'fields' => array(
            'id' => 'int auto_increment not null primary key',
            'title' => 'varchar(512)',
            'description' => 'text',
            'folderId' => 'int',
            'locked' => 'char(1)',
            'openingBook' => 'char(1)'
        ),
        'indexes' => array('folderId'),
        'defaultData' => array(
            array('id' => 1, 'title' => 'Morphy', 'folderId' => 1),
            array('id' => 2, 'title' => 'Nimzowitch', 'folderId' => 1),
            array('id' => 3, 'title' => 'Opening database', 'folderId' => 3, 'locked' => '1', 'openingBook' => '1'),
            array('id' => 4, 'title' => '1001 Brilliant Checkmates', 'folderId' => 6),
            array('id' => 5, 'title' => 'Winning chess sacrifices and combinations', 'folderId' => 6),

        )
    );

    protected $childrenSql = "select id,event,white,black,result,lastMoves from chess_game where databaseId=<id>";

    public function getRandomGameId(){
        $res = mysql_query("select id from chess_game where databaseId='". $this->getId(). "' order by RAND()") or die(mysql_error());
        if($row = mysql_fetch_assoc($res)){
            return $row['id'];
        }
        return 0;
    }

    public static function createNew($title, $folderId){
        $title = mysql_real_escape_string($title);
        $folderId = preg_replace("/[^0-9]/s", "", $folderId);
        mysql_query("insert into chess_database(title, folderId)values('". $title. "','". $folderId. "')") or die(mysql_error());
        return mysql_insert_id();
    }
}




