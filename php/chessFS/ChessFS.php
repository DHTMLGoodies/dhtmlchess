<?php
/**
 * File for returning game data without use of a database
 * User: Alf Magne
 * Date: 07.02.13
 */
class ChessFS implements LudoDBService
{
    private $cacheFolder;
    private $pgnFile;
    private $_parser;

    private $countGames = -1;

    private $cacheTime = 0;

    public function __construct($pgnFile = null)
    {
        if (isset($pgnFile)) {
            $this->pgnFile = $this->getPgnPath($pgnFile);

            if (!$this->isValid($this->pgnFile)) {
                throw new Exception("Invalid file");
            }

            if (!$this->pgnFile || !file_exists($this->pgnFile)) {
                throw new Exception("Pgn file " . $this->pgnFile . " not found");
            }
            $this->cacheTime = filemtime($this->pgnFile);

            $this->cacheFolder = ChessRegistry::getCacheFolder();
        }
    }

    private function getPgnPath($pgnFile)
    {
        $folder = ChessRegistry::getPgnFolder();
        if (isset($folder)) {
            $tokens = explode("/", $pgnFile);
            $pgnFile = $folder . array_pop($tokens);
        }
        if ($this->getExtension($pgnFile) !== 'pgn') $pgnFile .= ".pgn";
        return $pgnFile;
    }

    private function isValid($pgnFile)
    {
        return $this->getExtension($pgnFile) === 'pgn';
    }

    private function getExtension($pgnFile)
    {
        $tokens = explode(".", $pgnFile);
        return array_pop($tokens);
    }

    public function getRandomGame($noCache = false){
        $countGames = $this->getNumberOfGames();
        return $this->getGame(rand(0, $countGames-1), $noCache);
    }

    public function getGame($index, $noCache = false)
    {
        if (is_array($index)) {
            $index = $index['index'];
        }
        if($index >= $this->getNumberOfGames())$index = 0;

        if ($this->isGameInCache($index) && !$noCache){
            return $this->injectGameIndexAndCount($this->getGameFromCache($index), $index);
        }

        $game = $this->parser($this->pgnFile)->getGameByIndex($index);
        $this->saveGameInCache($game, $index);
        return $this->injectGameIndexAndCount($game, $index);
    }

    private function injectGameIndexAndCount($game,$index){
        $game['games'] = array(
            'i' => $index,
            'c' => $this->getNumberOfGames()
        );
        return $game;
    }

    private function isGameInCache($index)
    {
        $file = $this->getGameCacheFileName($index);
        return isset($this->cacheFolder) && file_exists($file) && filemtime($file) >= $this->cacheTime;
    }

    private function isGameListInCache()
    {
        $file = $this->getGameListFileName();
        return isset($this->cacheFolder) && file_exists($file) && filemtime($file) >= $this->cacheTime;
    }

    private function saveGameInCache($game, $index)
    {
        if (isset($this->cacheFolder)) {
            file_put_contents($this->getGameCacheFileName($index), serialize($game));
        }
    }

    private function saveGameListInCache($games)
    {

        if (isset($this->cacheFolder)) {
            file_put_contents($this->getGameListFileName(), serialize($games));

            $this->saveNumberOfGames($games);
        }

    }

    private function saveNumberOfGames($games){

        if(isset($this->cacheFolder)){
            file_put_contents($this->getNumberOfGamesFileName(), count($games));
        }
    }

    private function getGameFromCache($index)
    {
        return unserialize(file_get_contents($this->getGameCacheFileName($index)));
    }

    private function getNumberOfGames(){
        if($this->countGames == -1){
            if(file_exists($this->getNumberOfGamesFileName())){
                $this->countGames = intval(file_get_contents($this->getNumberOfGamesFileName()), 0);
            }else{
                $games = $this->listOfGames();
                $this->saveNumberOfGames($games);
                $this->countGames = count($games);
            }
        }
        return $this->countGames;
    }

    private function getGameCacheFileName($gameIndex)
    {
        return $this->cacheFolder . $this->getCacheKey() . "_" . $gameIndex . ".chess.cache";
    }

    public function listOfGames($noCache = false)
    {
        if ($this->isGameListInCache() && !$noCache) {
            return $this->getGameListFromCache();
        }
        $parser = new PgnParser($this->pgnFile, false);
        $games = $parser->getGames();
        $ret = array();
        $count = 0;
        $tokens = preg_split("/[\/\.]/s", $this->pgnFile);
        array_pop($tokens);
        $idPrefix = array_pop($tokens);
        foreach ($games as $game) {
            $game['last_moves'] = $this->getLastMoves($game['moves']);
            unset($game['moves']);
            unset($game['metadata']);
            $game["gameIndex"] = $count;
            $game["id"] = $idPrefix . '-' . $count;
            $ret[] = $game;
            $count++;
        }
        $this->saveGameListInCache($ret);

        return $ret;
    }

    private function getLastMoves($moves = array())
    {
        $count = count($moves);
        $start = $count - 3;
        $start = max(0, $start);

        $ret = array();

        if ($start % 2 === 1) $ret[] = ".. " . (floor($start / 2) + 1) . ".";
        for ($i = $start; $i < $count; $i++) {
            if (isset($moves[$i])) {
                if ($i % 2 === 0) {
                    $ret[] = (($i / 2) + 1) . ".";
                }
                $ret[] = $moves[$i]['m'];
            }

        }
        return implode(" ", $ret);
    }

    private function getGameListFromCache()
    {
        return unserialize(file_get_contents($this->getGameListFileName()));
    }

    private function getGameListFileName()
    {
        return $this->cacheFolder . $this->getCacheKey() . "_list.chess.cache";
    }

    private function getPgnCacheTimeFileName(){
        return $this->cacheFolder . $this->getCacheKey() . "_time.chess.cache";
    }

    private function getNumberOfGamesFileName(){
        return $this->cacheFolder . $this->getCacheKey() . "_count.chess.cache";
    }

    private function getCacheKey()
    {
        $tokens = explode("/", $this->pgnFile);
        return preg_replace("/[^a-z0-9_]/si", "_", $tokens[count($tokens) - 1]);
    }

    private function parser($pgn)
    {
        if (!isset($this->_parser)) {
            $this->_parser = new PgnParser($pgn);
        }
        return $this->_parser;
    }

    public function getValidServices()
    {
        return array("listOfGames", "getGame", "getRandomGame");
    }

    public function validateArguments($service, $arguments)
    {
        return true;
    }

    public function validateServiceData($service, $data)
    {
        return true;
    }

    public function shouldCache($service)
    {
        return false;
    }

    public function getOnSuccessMessageFor($service){
        switch($service){
            case "listOfGames":
                return "Games loaded";
            case "getGame":
                return "Game loaded";
            case "getRandomGame":
                return "Game loaded";
            default:
                return "";
        }
    }
}
