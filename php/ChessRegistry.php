<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Alf Magne Kalleland
 * Date: 08.01.13
 * Time: 08:11
 */
class ChessRegistry
{
    private static $storage = array();

    public static function set($key, $value){
        self::$storage[$key] = $value;
    }

    private static function isValid($key){
        return isset(self::$storage[$key]);
    }

    public static function clear($key){
        if(self::isValid($key)){
            unset(self::$storage[$key]);
        }
    }

    public static function get($key){
        if(self::isValid($key)){
            return self::$storage[$key];
        }
        return null;
    }

    public static function setCacheFolder($folder){
        $folder = self::toClean($folder);

        if(!isset($folder)){
            self::clear('CACHE_FOLDER');
        }else if(file_exists($folder)){
            self::set('CACHE_FOLDER', $folder);
        }
    }

    public static function getCacheFolder(){
        return self::get('CACHE_FOLDER');
    }

    public static function setPgnFolder($folder){
        $folder = self::toClean($folder);
        if(!isset($folder)){
            self::clear('PGN_FOLDER');
        }else if(file_exists($folder)){
            self::set('PGN_FOLDER', $folder);
        }
    }

    public static function getPgnFolder(){
        return self::get('PGN_FOLDER');
    }

    private static function toClean($folder){
        if(substr($folder, strlen($folder)-1, 1) !== '/')$folder.="/";
        return $folder;
    }

    public static function getDefaultFen(){
        return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }

    public static function getCookieName(){
        return 'dhtml_chess_session_cookie';
    }
}
