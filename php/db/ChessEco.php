<?php

class ChessEco extends ChessDbModel {

    protected $dbTableName = 'chess_eco';
    protected $objectType = 'Eco';

    protected $definition = array(
        'fields' => array(
            'id' => 'int auto_increment not null primary key',
            'eco_code' => 'varchar(32)',
            'openingName' => 'varchar(512)',
            'variation' => 'text',
            'fen_id' => 'int',
            'fromSquare' => 'varchar(2)',
            'toSquare' => 'varchar(2)',
            'notation' => 'varchar(16)',
            'previousFenId' => 'int'
        ),
        'indexes' => array('fen_id'),
        'defaultData' => array(
        )
    );

    public static function addOpening($game){
        $eco = self::getSafeValue($game['metadata']['site']);
        $openingName = self::getSafeValue($game['metadata']['white']);
        $variation = isset($game['metadata']['black']) ? self::getSafeValue($game['metadata']['black']) : '';

        $moves = $game['moves'];
        if(count($moves) === 0){
            return;
        }

        $index = count($moves)-1;
        $lastMove = $moves[$index];
        $fenId = ChessFen::getFenId($lastMove['fen']);
        if($index === 0){
            $previousFen = $game['metadata']['fen'];
        }else{
            $previousFen = $moves[$index-1]['fen'];
        }
        $previousFenId = ChessFen::getFenId($previousFen);
        $fromSquare = $lastMove['from'];
        $toSquare = $lastMove['to'];
        $notation = $lastMove['m'];

        mysql_query("insert into chess_eco(eco_code, openingName,variation, fen_id, previousFenId,fromSquare,toSquare,notation)values('$eco','$openingName','$variation','$fenId','$previousFenId','$fromSquare','$toSquare','$notation')") or die(mysql_error());
    }


    public static function getEco($fen, $previousFen = null){

        $fenId = ChessFen::getFenId($fen);
        $sqlAdd = '';
        if(isset($previousFen)){
            $previousFenId = ChessFen::getFenId($previousFen);
            $sqlAdd = " and previousFenId='". $previousFenId . "'";
        }

        $res = mysql_query("select * from chess_eco where fen_id='$fenId'$sqlAdd order by id");
        if($row = mysql_fetch_assoc($res)){
            return array(
                'id' => $row['id'],
                'eco' => $row['eco_code'],
                'name' => $row['openingName'] . ($row['variation'] ? '(' . $row['variation'] . ')' : ''),
                'notation' => $row['notation'],
                'from' => $row['fromSquare'],
                'to' => $row['toSquare']
            );
        }
    }

    public static function getVariations($fen){
        $ret= array();
        $fenId = ChessFen::getFenId($fen);
        $res = mysql_query("select * from chess_eco where previousFenId='$fenId' order by id");
        while($row = mysql_fetch_assoc($res)){
            $ret[] = array(
                'id' => $row['id'],
                'eco' => $row['eco_code'],
                'name' => $row['openingName'] . ($row['variation'] ? '(' . $row['variation'] . ')' : ''),
                'notation' => $row['notation'],
                'from' => $row['fromSquare'],
                'to' => $row['toSquare']
            );
        }
        return $ret;
    }
}
