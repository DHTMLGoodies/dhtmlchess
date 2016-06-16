<?php
/**
 * Class for storage of values for DHTML Chess
 * User: Alf Magne Kalleland
 * Date: 08.01.13
 * Time: 08:11
 */
class ChessRegistry
{
    private static $storage = array(
        "domain" => "www.dhtml-chess.com",
        "password_reset_subject" => "Password reset",
        "password_reset_body" => "You have asked for a Password reset on www.dhtml-chess.com.\nClick the following link to reset the password:\n\n"
    );

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
        return 'chess_cookie';
    }

    public static function getImportQueueFolder(){
        $ret = self::get("IMPORT_QUEUE_FOLDER");
        if(!isset($ret)){
            $ret = "import-queue";
        }
        return $ret;
    }

    public static function setImportQueueFolder($folder){
        self::set('IMPORT_QUEUE_FOLDER', $folder);
    }

    public static function setDomain($domain){
        self::set('domain', $domain);
    }

    public static function getDomain(){
        return self::get('domain');
    }

    public static function setPasswordResetSubject($subject){
        self::set('password_reset_subject', $subject);
    }

    public static function getPasswordResetSubject(){
        return self::get('password_reset_subject');
    }

    public static function setPasswordResetBody($body){
        self::set('password_reset_body', $body);
    }

    public static function getPasswordResetBody(){
        return self::get('password_reset_body');
    }

}
