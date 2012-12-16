<?php
class EcoImport
{
    private function clearDatabase() {
        mysql_query("delete from chess_eco") or die(mysql_error());
    }
    public function importFromFile($path){
        $fh = fopen($path, 'r');
        $data = fread($fh, filesize($path));
        fclose($fh);
        $this->import($data);
    }

    public function import($pgn){
        $this->clearDatabase();

        $pgnParser = new PgnParser();
        $pgnParser->setPgnContent($pgn);
        $pgnGames = $pgnParser->getUnparsedGames();

        for($i=0, $count = count($pgnGames);$i<$count;$i++){
            $parser = new PgnParser();
            $parser->setPgnContent($pgnGames[$i]);
            $parsedGame = $parser->getFirstGame();
            ChessEco::addOpening($parsedGame);
        }
    }
}
