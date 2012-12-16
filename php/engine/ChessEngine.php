<?php

class ChessEngine{

    private $engineExecutable = 'houdini.exe';
    private $engineAbsolutePath = '/';
    private $fen;
    private $moveTime = 10; // Seconds
    private $depth = 15;

    public function __construct(){

    }

    public function setFen($fen){
        $this->fen = $fen;
    }

    public function setDepth($depth){
        $this->depth = intval($depth);
    }

    private function getPromotion($move){
        if(strlen($move) === 4){
            return null;
        }
        $pieces = array('q' => 'queen', 'r' => 'rook', 'b' => 'bishop', 'n' => 'knight');
        $promotion = substr($move, 4,1);
        if(preg_match("/[qrbn]/i", $promotion)){
            $promotion = strtolower($promotion);
            return $pieces[$promotion];
        }
        return null;
    }

    public function getMove($fen){
        $this->fen = $fen;
        $descriptorspec = array(
           0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
           1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
           2 => array("file", "error-output.txt", "a") // stderr is a file to write to
        );

        $houdini = proc_open($this->engineExecutable, $descriptorspec, $pipes, $this->engineAbsolutePath);
        if (is_resource($houdini)) {
            fwrite($pipes[0], "uci\n");
            fwrite($pipes[0], "position fen ". $this->fen."\n");
            $depthString = "";
            if($this->depth){
                $depthString = " depth ". $this->depth;
            }

            fwrite($pipes[0], "go movetime " . ($this->moveTime * 1000) . $depthString . "\n");
            usleep($this->moveTime * 1000000);
            fwrite($pipes[0], "stop\n");
            fwrite($pipes[0], "quit\r\n");
            fclose($pipes[0]);
            $output = stream_get_contents($pipes[1]);

            $move = preg_replace("/.*?bestmove ([^\s]+)\s.*/s", "$1", $output);

            fclose($pipes[1]);

            proc_close($houdini);
            $ret =  array(
                'from' => substr($move,0,2),
                'to' => substr($move, 2,2)
            );
            $promotion = $this->getPromotion($move);
            if(isset($promotion)){
                $ret['promoteTo'] = $promotion;
            }
            return $ret;
        }else
            return null;
    }
}