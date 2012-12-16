<?php

class ChessGameMetadata extends ChessDbModel {

    protected $dbTableName = 'chess_game_metadata';

    protected $definition = array(
        'fields' => array(
            'id' => 'int auto_increment not null primary key',
            'gameId' => 'int',
            'metadataId' => 'int',
            'metadataValue' => 'varchar(1024)',

        ),
        'indexes' => array('gameId', 'metadataId'),
        'defaultData' => array(
        )
    );

    public static function createRecord($gameId, $metadataId, $metadataValue){
        $metadataValue = self::getSafeValue($metadataValue);
        $sql = "insert into chess_game_metadata(gameId, metadataId, metadataValue)values('". $gameId. "','". $metadataId."','". $metadataValue ."')";
        mysql_query($sql) or die("ERROR IN SQL ". $sql);;
    }

    public static function getMetadata($gameId){
        $ret = array();
        $res = mysql_query("select m.metadata_key, gm.metadataValue from chess_metadata m, chess_game_metadata gm where gm.metadataId=m.ID and gm.gameId='" . $gameId . "'") or die(mysql_error());
        while($row = mysql_fetch_array($res)){
            $ret[$row['metadata_key']] = $row['metadataValue'];
        }

        return $ret;
    }


}




