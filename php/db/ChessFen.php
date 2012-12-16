<?php

class ChessFen extends ChessDbModel {

    protected $dbTableName = 'chess_fen';
    private static $positionCache = array();

    const DEFAULT_FEN = 'rnbqkbnr\/pppppppp\/8\/8\/8\/8\/PPPPPPPP\/RNBQKBNR w KQkq - 0 1';
    protected $definition = array(
        'fields' => array(
            'id' => 'int auto_increment not null primary key',
            'fen' => 'varchar(512)'
        ),
        'indexes' => array('fen'),
        'defaultData' => array(
            array(
                'id' => 1,
                'fen' => 'rnbqkbnr\/pppppppp\/8\/8\/8\/8\/PPPPPPPP\/RNBQKBNR')
        )
    );


    public static function getFenId($fen){
        if(isset(self::$positionCache[$fen])){
            return self::$positionCache[$fen];
        }
        $fen = self::getPositionFromFen($fen);
        $fen = self::getSafeValue($fen);

        $result  =  mysql_query("select ID from chess_fen where fen='". $fen ."'");
        if($row = mysql_fetch_assoc($result)){
            self::$positionCache[$fen] = $row['ID'];
            return $row['ID'];
        }else{
            mysql_query("insert into chess_fen(fen)values('". $fen . "')");
            return mysql_insert_id();
        }
    }

    private static function getPositionFromFen($fen){
        $parts = explode(" ", $fen);
        return trim($parts[0]);
    }

    public static function getLastFenInGame($gameId){
        $res = mysql_query("select f.fen from chess_fen f, chess_move m where m.fen_id = f.id and m.gameId='" . $gameId . "' order by m.id desc") or die(mysql_error());
        if($row = mysql_fetch_assoc($res)){
            return $row['fen'];
        }


        return self::DEFAULT_FEN;
    }
}




