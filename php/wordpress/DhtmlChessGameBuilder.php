<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 15/04/2017
 * Time: 19:42
 */
class DhtmlChessGameBuilder
{

    /**
     * @var FenParser0x88 $parser;
     */
    private $parser;
    private $metadata = array();
    private $moves = array();

    /**
     * DhtmlChessGameBuilder constructor.
     * @param string|null $gameString
     */
    public function __construct($gameString = null){
        $this->parser = new FenParser0x88();

        if(!empty($gameString)){
            $data = json_decode($gameString, true);
            $this->metadata = $data["metadata"];
            $this->moves = $data["moves"];
            $this->setFen($this->lastFenInGame());
        }else{
            $this->parser->newGame();
            $this->setFen($this->parser->getFen());
        }

    }

    public function setFen($fen){
        $this->parser->setFen($fen);
        $this->setMetadata("fen", $fen);
    }

    public function addMove($from, $to){
        $fen = $this->lastFenInGame();
        $this->parser->setFen($fen);

        try{
            $this->parser->move($from.$to);

            $move = array(
                "from" => $from,
                "to" => $to,
                "m" => $this->parser->getNotation(),
                "fen" => $this->parser->getFen()
            );
            $this->moves[] = $move;

        }catch(FenParser0x88Exception $e){


        }



    }

    public function countMoves(){
        return count($this->moves);
    }
    public function getMoves(){
        return $this->moves;
    }

    private function lastFenInGame(){
        return !empty($this->moves) ? $this->moves[count($this->moves)-1]["fen"] : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }

    public function setMetadata($key, $value){
        $this->metadata[$key] = $value;
    }

    public function getMetadata($key){
        return !empty($this->metadata[$key])? $this->metadata[$key] : null;
    }

    public function toArray(){
        return array(
            "metadata" => $this->metadata,
            "moves" => $this->moves
        );
    }

    public function getResult(){
        $result = $this->parser->getResult();

        switch($result){
            case 1: return DhtmlChessDatabase::KEY_WHITE_WIN;
            case -1 : return DhtmlChessDatabase::KEY_BLACK_WIN;
            case 0.5: return DhtmlChessDatabase::KEY_DRAW;
            default: return null;
        }
    }

    public function __toString()
    {
        $ret = $this->toArray();
        return json_encode($ret);
    }

}