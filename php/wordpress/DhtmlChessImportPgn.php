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
            $count = $parser->countGames();

            for($i=0;$i<$count;$i++){
                $game = $parser->getGameByIndex($i);
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
    public function importPgnStringToDatabase($pgnId, $pgnString){
        $parser = new PgnParser();
        $parser->setPgnContent($pgnString);
        return $this->finishImport($pgnId, $parser);
    }
 
    public function createFromPgnString($databaseName, $pgnString){
        $util = new DhtmlChessPgnUtil();

        $pgn = $util->create($databaseName);
        $parser = new PgnParser();
        $parser->setPgnContent($pgnString);

        try{
            $count = $parser->countGames();
            for($i=0;$i<$count;$i++){
                $game = $parser->getGameByIndex($i);
                $pgn->appendGame($game);

            }
        }catch(Exception $e){
            throw new DhtmlChessException("Failed importing " . $e->getMessage());
        }

        return $pgn;
    }
    
    
    public function import($filePath, $name = null){

        $filePath = esc_sql($filePath);

        if(!file_exists($filePath)){
            throw new DhtmlChessException("Pgn " . $filePath. " does not exists");
        }
        $parser = new PgnParser($filePath);

        if(!isset($name))$name = $filePath;
        return $this->finishImport($name, $parser);
    }
    
    /**
     * @param string $name
     * @param PgnParser $parser
     * @return DhtmlChessPgn
     */
    private function finishImport($name, $parser){

        $util = new DhtmlChessPgnUtil();

        $pgn = $util->create($name);

        $count = $parser->countGames();

        for($i=0;$i<$count;$i++){
            try{
                $game = $parser->getGameByIndex($i);
                $pgn->appendGame($game);
            }catch(Exception $e){

            }
        }
        
        return $pgn;
    }
}