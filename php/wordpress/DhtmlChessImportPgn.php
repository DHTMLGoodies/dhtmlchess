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

    /**
     * @param $pgnFilePath
     * @param $toPgnId
     * @return DhtmlChessPgn
     * @throws DhtmlChessException
     */
    public function appendPgn($pgnFilePath, $toPgnId){
        if(!file_exists($pgnFilePath)){
            throw new DhtmlChessException("Pgn file not found");
        }
        try{
            $pgn = DhtmlChessPgn::instanceById($toPgnId);
            
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

    /**
     * @param $pgnId
     * @param $pgnString
     * @param null $title
     * @return DhtmlChessPgn
     */
    public function importPgnString($pgnId, $pgnString, $title = null){
        $parser = new PgnParser();
        $parser->setPgnContent($pgnString);
        if(empty($title))$title = $pgnId;
        return $this->finishImport($pgnId, $parser, $title);
    }

    public function import($filePath){

        $filePath = esc_sql($filePath);

        if(!file_exists($filePath)){
            throw new DhtmlChessException("Pgn " . $filePath. " does not exists");
        }
        $parser = new PgnParser($filePath);

        return $this->finishImport($filePath, $parser);
    }
    
    /**
     * @param string $name
     * @param PgnParser $parser
     * @param string $title
     * @return DhtmlChessPgn
     */
    private function finishImport($name, $parser){

        $games = $parser->getGames();

        $util = new DhtmlChessPgnUtil();

        $pgn = $util->create($name);

        foreach($games as $game){
            $pgn->appendGame($game);
        }
        
        return $pgn;
    }
}