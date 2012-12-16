<?php

class ChessMetadata extends ChessDbModel {

    protected $dbTableName = 'chess_metadata';
    private static $metadataCache = array();

    protected $definition = array(
        'fields' => array(
            'id' => 'int auto_increment not null primary key',
            'metadataKey' => 'varchar(512)',
         ),
        'indexes' => array('metadataKey'),
        'defaultData' => array(
        )
    );

    public static function getMetadataId($metadataKey){
        $metadataKey = self::getSafeValue($metadataKey);

        if(isset(self::$metadataCache[$metadataKey])){
            return self::$metadataCache[$metadataKey];
        }

        $result  =  mysql_query("select ID from chess_metadata where metadataKey='". $metadataKey ."'") or die('SQL ERROR');
        if($row = mysql_fetch_assoc($result)){
            self::$metadataCache[$metadataKey] = $row['ID'];
            return $row['ID'];
        }else{

            mysql_query("insert into chess_metadata(metadataKey)values('". $metadataKey . "')") or die('SQL ERROR');
            return mysql_insert_id();
        }
    }

    public static function clearGameMetadata($gameId){
       mysql_query("delete from chess_game_metadata where gameId='". $gameId. "'");
    }

    public static function insertGameMetadata($gameId, $metadataKey, $metadataValue){
        $metadataId = self::getMetadataId($metadataKey);
        ChessGameMetadata::createRecord($gameId, $metadataId, $metadataValue);
    }


}




