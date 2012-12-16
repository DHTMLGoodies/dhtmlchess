<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Alf Magne
 * Date: 30.04.12
 * Time: 13:11
 * To change this template use File | Settings | File Templates.
 */
class ChessSession extends ChessDbModel
{
    protected $dbTableName = 'chess_session';

    protected $definition = array(
        'fields' => array(
            'id' => 'int auto_increment not null primary key',
            'sessionToken' => 'varchar(512)',
            'created' => 'date',
            'lastAction' => 'date',
            'loggedOut' => 'char(1)',
            'playerId' => 'int'
        ),
        'indexes' => array('sessionToken','playerId'),
        'defaultData' => array(
         )
    );

    public static function getPlayerIdByToken($sessionToken){
        $res = mysql_query("select playerId from chess_session where sessionToken='". $sessionToken . "' and loggedOut IS NULL") or die(mysql_error());
        if($row = mysql_fetch_assoc($res)){
            return $row['playerId'];
        }
        return null;
    }

    public static function isValidToken($sessionToken){
        $res = mysql_query("select id from chess_session where sessionToken='". $sessionToken . "' and loggedOut IS NULL") or die(mysql_error());
        if($row = mysql_fetch_assoc($res)){
            return true;
        }
        return false;

    }

    public static function newToken($playerId){
        $token = self::getUniqueSessionToken();
        mysql_query("insert into chess_session(sessionToken, created, playerId)values('". $token . "','". date("Y-m-d H:i:s") . "','". $playerId . "')") or die(mysql_error());
        return $token;
    }

    private static function getUniqueSessionToken(){
        $letters = 'abcdefghijklmnopqrstuvxyz';
        $ret = 'chess-' . date("YmdHis");
        for($i=0;$i<20;$i++){
            $ret .= substr($letters, rand(0, strlen($letters)-1), 1);
        }
        return $ret;
    }

    public static function authenticate($sessionToken){


    }
}
