<?php

/*

class GameImport {

    public function importFromFile($path, $databaseId){
        $fh = fopen($path, 'r');
        $data = fread($fh, filesize($path));
        fclose($fh);
        $this->import($data, $databaseId);
    }

    public function import($pgn, $databaseId){
        $dbObject = new ChessDatabase($databaseId);
        ChessJSONCache::clearFromCache($dbObject, ChessJSONCache::TYPE_CHILDREN);

        $pgnParser = new PgnParser();
        $pgnParser->setPgnContent($pgn);
        $pgnGames = $pgnParser->getUnparsedGames();
        unset($pgn);
        unset($pgnParser);
        $index = 0;
        
        
        ChessProgressBar::setTotalSteps(count($pgnGames));
        
        
        for($i=0, $count = count($pgnGames);$i<$count;$i++){
            $parser = new PgnParser();
            $parser->setPgnContent($pgnGames[$i]);
            $parsedGame = $parser->getFirstGame();
            ChessProgressBar::increment('Importing game '. ($i+1). ' of ' . $count, 1);
            $gameObj = new ChessGame();
            $parsedGame['metadata']['databaseId'] = $databaseId;
            $gameObj->save($parsedGame);

            $index++;

        }

    }
}

*/