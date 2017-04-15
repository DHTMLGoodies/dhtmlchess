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

    public function __construct(){
        $this->parser = new FenParser0x88();
        $this->setFen($this->parser->getFen());
    }

    public function setFen($fen){
        $this->parser->setFen($fen);
        $this->setMetadata("fen", $fen);
    }

    public function setMetadata($key, $value){
        $this->metadata[$key] = $value;
    }

    public function getMetadata($key){
        return !empty($this->metadata[$key])? $this->metadata[$key] : null;
    }


}