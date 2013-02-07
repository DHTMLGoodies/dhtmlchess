<?php
/**
 * File for returning game data without use of a databaes
 * User: Alf Magne
 * Date: 07.02.13
 */
class ChessFS
{
    private $cacheFolder;
    private $pgnFile;
    private $_parser;

    public function __construct($pgnFile)
    {
        $this->pgnFile = $pgnFile;
        if (!$this->pgnFile || !file_exists($pgnFile)) {
            throw new Exception("Pgn file " . $pgnFile . " not found");
        }
        $this->cacheFolder = ChessRegistry::getCacheFolder();
    }

    public function getGame($index, $noCache = false)
    {
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
        foreach ($games as $game) {
            unset($game['moves']);
            unset($game['metadata']);
            $ret[] = $game;
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
}
