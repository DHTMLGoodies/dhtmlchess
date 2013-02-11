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

    public function __construct($pgnFile)
    {

        $this->pgnFile = $this->getPgnPath($pgnFile);

        if (!$this->isValid($this->pgnFile)) {
            throw new Exception("Invalid file");
        }
        if (!$this->pgnFile || !file_exists($this->pgnFile)) {
            throw new Exception("Pgn file " . $this->pgnFile . " not found");
        }
        $this->cacheFolder = ChessRegistry::getCacheFolder();
    }

    private function getPgnPath($pgnFile)
    {
        $folder = ChessRegistry::getPgnFolder();
        if (isset($folder)) {
            $tokens = explode("/", $pgnFile);
            $pgnFile = $folder . array_pop($tokens);
        }
        if($this->getExtension($pgnFile) !== 'pgn')$pgnFile.=".pgn";
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

    public function getGame($index, $noCache = false)
    {
        if(is_array($index)){
            $index = $index['index'];
        }
        if ($this->isGameInCache($index) && !$noCache) return $this->getGameFromCache($index);

        $game = $this->parser($this->pgnFile)->getGameByIndex($index);
        $this->saveGameInCache($game, $index);
        return $game;
    }

    private function isGameInCache($index)
    {
        return isset($this->cacheFolder) && file_exists($this->getGameCacheFileName($index));
    }

    private function isGameListInCache()
    {
        return isset($this->cacheFolder) && file_exists($this->getGameListFileName());
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
        }

    }

    private function getGameFromCache($index)
    {
        return unserialize(file_get_contents($this->getGameCacheFileName($index)));
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
            unset($game['moves']);
            unset($game['metadata']);
            $game["gameIndex"] = $count;
            $game["id"] = $idPrefix . '-'. $count;
            $ret[] = $game;
            $count++;
        }
        $this->saveGameListInCache($ret);

        return $ret;
    }

    private function getGameListFromCache()
    {
        return unserialize(file_get_contents($this->getGameListFileName()));
    }

    private function getGameListFileName()
    {
        return $this->cacheFolder . $this->getCacheKey() . "_list.chess.cache";
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
        return array("listOfGames", "getGame");
    }

    public function validateService($service, $arguments)
    {
        return true;
    }

    public function cacheEnabled(){
        return false;
    }
}
