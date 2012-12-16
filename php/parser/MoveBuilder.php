<?php

class MoveBuilder {
    private $moves = array();
    private $moveReferences = array();
    private $pointer = 0;
    private $currentIndex = 0;


    public function __construct(){
        $this->moveReferences[0] =& $this->moves;

    }

    public function addMoves($moveString){
        $moves = explode(" ", $moveString);
        foreach($moves as $move){
            $this->addMove($move);
        }
    }

    private function addMove($move){
        if(!$move || $move == '..' || $move == '*' || strstr($move, '1-') || strstr($move, '-1') || strstr($move, '1/2')){
            return;
        }
        $this->moveReferences[$this->pointer][] = array(CHESS_JSON::MOVE_NOTATION => $move);
        $this->currentIndex ++;
    }

    public function addCommentBeforeFirstMove($comment){
        $comment = trim($comment);
        if(!strlen($comment)){
            return;
        }
        $this->moveReferences[$this->pointer][] = array();
        $this->addComment($comment);
    }

    public function addComment($comment){
        $comment = trim($comment);
        if(!strlen($comment)){
            return;
        }
        $index = count($this->moveReferences[$this->pointer])-1;
        $this->moveReferences[$this->pointer][$index][CHESS_JSON::MOVE_COMMENT] = $comment;
    }

    public function startVariation(){
        $index = count($this->moveReferences[$this->pointer])-1;
        if(!isset($this->moveReferences[$this->pointer][$index][CHESS_JSON::MOVE_VARIATIONS])){
            $this->moveReferences[$this->pointer][$index][CHESS_JSON::MOVE_VARIATIONS] = array();
        }
        $countVariations = count($this->moveReferences[$this->pointer][$index][CHESS_JSON::MOVE_VARIATIONS]);
        $this->moveReferences[$this->pointer][$index][CHESS_JSON::MOVE_VARIATIONS][$countVariations] = array();
        $this->moveReferences[] =& $this->moveReferences[$this->pointer][$index][CHESS_JSON::MOVE_VARIATIONS][$countVariations];
        $this->pointer++;
    }

    public function endVariation(){
        array_pop($this->moveReferences);
        $this->pointer--;
    }

    public function getMoves(){
        return $this->moves;
    }
}
