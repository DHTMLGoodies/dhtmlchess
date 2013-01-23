<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Alf Magne Kalleland
 * Date: 08.01.13
 * Time: 08:11
 */
class ChessRegistry
{
    private static $registry = array();

    public static function set($key, $value){
        self::$registry[$key] = $value;
    }

    private static function isValid($key){
        return isset(self::$registry[$key]);
    }

    public static function get($key){
        if(self::isValid($key)){
            return self::$registry[$key];
        }
        return null;
    }
}