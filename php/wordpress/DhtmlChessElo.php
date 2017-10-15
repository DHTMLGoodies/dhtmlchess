<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 04/04/2017
 * Time: 18:51
 */
class DhtmlChessElo
{


    const WHITE_ADJUSTMENT = 0.05;

    const K = 30;

    const GAME_KEY_PUZZLE_COUNT = "puzzle_count";
    const GAME_KEY_PUZZLE_ELO = "puzzle_elo";
    const GAME_KEY_PUZZLE_LAST_ID = "puzzle_lastid";

    const GAME_KEY_MULTIPLAY_COUNT = "multi_count";
    const GAME_KEY_MULTIPLAY_ELO = "multi_elo";

    const COUNT_PROVISIONAL = 8;

    /**
     * @var DhtmlChessKeyValue $store
     */
    private $store;


    /**
     * @var DhtmlChessEloDb $eloDb
     */
    private $eloDb;

    public function __construct()
    {
        $this->store = new DhtmlChessKeyValue();
        $this->eloDb = new DhtmlChessEloDb();
    }

    public function onGameEnd($playerWhite, $playerBlack, $result)
    {

        $eloWhite = $this->getMultiPlayElo($playerWhite);
        $eloBlack = $this->getMultiPlayElo($playerBlack);

        $eloChange = $this->eloChange($eloWhite, $eloBlack, $result);

        $provWhite = $this->countMultiGames($playerWhite) < self::COUNT_PROVISIONAL;
        $provBlack = $this->countMultiGames($playerBlack) < self::COUNT_PROVISIONAL;

        $eloChangeWhite = $provWhite ? $eloChange * 2 : $eloChange;
        $eloChangeBlack = $provBlack ? $eloChange * -2 : -$eloChange;


        $whiteAdvantage = self::eloAdjustment($eloChangeWhite);
        $eloChangeWhite -= $whiteAdvantage;
        $eloChangeBlack += $whiteAdvantage;

        if ($provWhite && $provBlack) {
            $this->saveMultiplayElo($playerWhite, $eloWhite + $eloChangeWhite);
            $this->saveMultiplayElo($playerBlack, $eloBlack + $eloChangeBlack);
        } else {
            if (!$provBlack) {
                $this->saveMultiplayElo($playerWhite, $eloWhite + $eloChangeWhite);
            }
            if (!$provWhite) {
                $this->saveMultiplayElo($playerBlack, $eloBlack + $eloChangeBlack);
            }
        }

        $this->incrementMultiPlayer($playerWhite);
        $this->incrementMultiPlayer($playerBlack);

    }

    public static function eloAdjustment($change)
    {
        return abs($change * self::WHITE_ADJUSTMENT);
    }


    public function eloChange($whiteElo, $blackElo, $result)
    {

        switch ($result) {
            case DhtmlChessDatabase::KEY_BLACK_WIN:
                $eloResult = 0;
                break;
            case DhtmlChessDatabase::KEY_WHITE_WIN:
                $eloResult = 1;
                break;
            case DhtmlChessDatabase::KEY_DRAW:
                $eloResult = .5;
                break;
            default:
                throw new DhtmlChessException("Invalid result");

        }
        $expected = $this->getExpectedScore($whiteElo, $blackElo);

        $val = self::K * ($eloResult - $expected);

        if ($val > -1 && $val < 1) $val = self::to1($val);
        return $val;
    }

    private static function to1($val)
    {
        if ($val < 0) $val = -1;
        if ($val > 0) $val = 1;
        return $val;
    }

    private function getExpectedScore($ratingA, $ratingB)
    {

        $qa = pow(10, $ratingA / 400);
        $qb = pow(10, $ratingB / 400);

        return $qa / ($qa + $qb);
    }

    private function getLastPuzzleId($userId)
    {
        $key = $this->getKey(self::GAME_KEY_PUZZLE_LAST_ID, $userId);

        return $this->store->get($key);
    }

    private function setLastPuzzleId($userId, $puzzleId)
    {
        $key = $this->getKey(self::GAME_KEY_PUZZLE_LAST_ID, $userId);
        $this->store->upsert($key, $puzzleId, DhtmlChessKeyValue::NUMERIC);
    }


    public function onPuzzleFailed($userId, $againstElo, $puzzleId = null, $ratioSolved = 0)
    {
        return $this->onPuzzleComplete($userId, $againstElo, DhtmlChessDatabase::KEY_BLACK_WIN, $puzzleId, $ratioSolved);
    }

    public function onPuzzleCompleteAuto($userId, $puzzleId, $moves, $ms, $solved, $movesSolved)
    {
        if ($solved) {
            return $this->onPuzzleSolvedAuto($userId, $puzzleId, $moves, $ms);
        } else {
            return $this->onPuzzleFailedAuto($userId, $puzzleId, $moves, $ms, $movesSolved);
        }
    }

    public function onPuzzleFailedAuto($userId, $puzzleId = null, $moves, $ms, $movesSolved)
    {
        $moves = max($moves, 1);
        $elo = $this->puzzleOppenentElo($moves, $ms);
        return $this->onPuzzleFailed($userId, $elo, $puzzleId, min($movesSolved, $moves - 1) / $moves);
    }

    public function onPuzzleSolvedAuto($userId, $puzzleId = null, $moves, $ms)
    {
        $elo = $this->puzzleOppenentElo($moves, $ms);
        return $this->onPuzzleSolved($userId, $elo, $puzzleId);
    }


    public function onPuzzleSolved($userId, $againstElo, $puzzleId = null)
    {
        return $this->onPuzzleComplete($userId, $againstElo, DhtmlChessDatabase::KEY_WHITE_WIN, $puzzleId);
    }

    private function onPuzzleComplete($userId, $againstElo, $result, $puzzleId = null, $ratioSolved = 0)
    {
        $elo = $this->getPuzzleElo($userId);

        if (!empty($puzzleId)) {
            $last = $this->getLastPuzzleId($userId);
            if ($last == $puzzleId) {
                return $elo;
            }
        }

        $change = $this->eloChange($elo, $againstElo, $result);
        if ($change < 0 && $ratioSolved) {
            $change -= $change * $ratioSolved;
            if ($change > -1) $change = -1;
        }

        $countPlayed = $this->countPuzzleGames($userId);

        if ($countPlayed < self::COUNT_PROVISIONAL) {
            $change *= 2;
        }

        $elo += $change;

        $this->savePuzzleElo($userId, $elo);
        $this->incrementPuzzles($userId);

        if (!empty($puzzleId)) {
            $this->setLastPuzzleId($userId, $puzzleId);
        }

        return $elo;
    }

    private function saveMultiplayElo($userId, $elo)
    {
        $this->eloDb->upsertMultiplayer($userId, $elo);

    }

    private function savePuzzleElo($userId, $elo)
    {
        $this->eloDb->upsertPuzzle($userId, $elo);
    }


    public function getMultiPlayElo($userId)
    {
        return $this->eloDb->getMultiplayerElo($userId);
    }

    public function getPuzzleElo($userId)
    {
        return $this->eloDb->getPuzzleElo($userId);
    }


    private function incrementPuzzles($userId)
    {
        $this->store->increment($this->getKey(self::GAME_KEY_PUZZLE_COUNT, $userId));
    }

    private function incrementMultiPlayer($userId)
    {

        $this->store->increment($this->getKey(self::GAME_KEY_MULTIPLAY_COUNT, $userId));
    }

    public function countMultiGames($userId)
    {

        return $this->countGames($userId, self::GAME_KEY_MULTIPLAY_COUNT);
    }

    public function countPuzzleGames($userId)
    {
        return $this->countGames($userId, self::GAME_KEY_PUZZLE_COUNT);
    }


    public function testSetCountPuzzleGames($userId, $count)
    {
        $key = self::GAME_KEY_PUZZLE_COUNT;
        $this->store->upsert($this->getKey($key, $userId), $count);
    }

    public function countGames($userId, $key)
    {

        return $this->store->get($this->getKey($key, $userId), 0);
    }

    private function getKey($prefix, $userId)
    {
        return $prefix . "_" . $userId;
    }

    public function puzzleOppenentElo($moves, $msToSolve = 0)
    {

        $elo = 1000 + ($moves * 250);

        if ($msToSolve) {
            $sec = round($msToSolve / 1000);
            $elo -= ($sec * 4);
        }

        return max(800, $elo);

    }


}