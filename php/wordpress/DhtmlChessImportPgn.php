<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 25/01/2017
 * Time: 12:40
 */
class DhtmlChessImportPgn
{
    public function __construct(){
        
    }

    public function appendPgn($pgnFilePath, $toPgn){
        if(!file_exists($pgnFilePath)){
            throw new DhtmlChessException("Pgn file not found");
        }
        try{
            $pgn = DhtmlChessPgn::instanceByName($toPgn);
            
            $parser = new PgnParser($pgnFilePath);
            $games = $parser->getGames();
            foreach($games as $game){
                $pgn->appendGame($game);
            }

            return $pgn;
            
        }catch(DhtmlChessException $e){
            return $this->import($pgnFilePath);
        }
        
    }

    public function importPgnString($pgnName, $pgnString, $title = null){
        $parser = new PgnParser();
        $parser->setPgnContent($pgnString);
        if(empty($title))$title = $pgnName;
        return $this->finishImport($pgnName, $parser, $title);
    }

    public function import($filePath, $title = ""){

        $filePath = esc_sql($filePath);

        if(!file_exists($filePath)){
            throw new DhtmlChessException("Pgn " . $filePath. " does not exists");
        }
        $parser = new PgnParser($filePath);

        return $this->finishImport($filePath, $parser, $title);
    }



    /**
     * @param string $name
     * @param PgnParser $parser
     * @param string $title
     * @return DhtmlChessPgn
     */
    private function finishImport($name, $parser, $title){

        $games = $parser->getGames();

        $util = new DhtmlChessPgnUtil();

        $pgn = $util->create($name, $title);

        foreach($games as $game){
            $pgn->appendGame($game);
        }
        
        return $pgn;
    }



    
}