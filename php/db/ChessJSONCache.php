<?php

class ChessJSONCache extends ChessDbModel{
    protected $dbTableName = 'chess_json_cache';
    protected $definition = array(
        'fields' => array(
            'id' => 'int auto_increment not null primary key',
            'object_type' => 'varchar(64)',
            'object_id' => 'int',
            'cache_type' => 'varchar(64)',
            'json' => 'mediumtext'
         ),
        'indexes' => array('object_id', 'cache_type', 'object_type'),
        'defaultData' => array(
        )
    );

    const TYPE_OBJECT = 'object';
    const TYPE_CHILDREN  = 'children';

    public static function getFromCache($object, $cacheType = null){
        if(!$cacheType){
            $cacheType = self::TYPE_OBJECT;
        }

        $objectId = $object->getId();
        $objectType = $object->getType();

        $sql = "select json from chess_json_cache where object_type='". $objectType. "' and object_id='". $objectId. "' and cache_type='". $cacheType. "'";
        $json = self::getOne($sql);
        return $json ? $json['json'] : null;
   }

    public static function isInCache($object, $cacheType){
        $objectId = $object->getId();
        $objectType = $object->getType();
        $sql = "select id from chess_json_cache where object_type='". $objectType. "' and object_id='". $objectId. "' and cache_type='". $cacheType. "'";
        $object = self::getOne($sql);
        if($object){
            return true;
        }
        return false;
    }

    public static function saveCache($object, $cacheType, $json){

        $json = array(
            'success' => true,
            'data' => $json
        );
        $json = json_encode($json);
        $json = ChessDbAdapter::getSafeValue($json);
        self::clearFromCache($object, $cacheType);

        $objectId = $object->getId();
        $objectType = $object->getType();
        mysql_query("insert into chess_json_cache(object_id,object_type,cache_type,json)values('". $objectId ."','". $objectType . "','". $cacheType . "','". $json . "')") or die(mysql_error());

        unset($json);

    }

    public static function clearFromCache($object, $cacheType = null){

        $objectId = $object->getId();
        $objectType = $object->getType();
        if(isset($cacheType)){
            mysql_query("delete from chess_json_cache where object_type='". $objectType. "' and object_id='". $objectId. "' and cache_type='". $cacheType. "'") or die(mysql_error());
        }else{
            mysql_query("delete from chess_json_cache where object_type='". $objectType. "' and object_id='". $objectId. "'") or die(mysql_error());
        }
    }


}