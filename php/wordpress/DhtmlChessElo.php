<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 04/04/2017
 * Time: 18:51
 */
class DhtmlChessElo {

	const WHITE_WIN = 1;
	const DRAW = 0.5;
	const BLACK_WIN = 0;

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

	public function __construct() {
		$this->store = new DhtmlChessKeyValue();
	}

	public function onGameEnd( $playerWhite, $playerBlack, $result ) {

		$eloWhite = $this->getMultiPlayElo( $playerWhite );
		$eloBlack = $this->getMultiPlayElo( $playerBlack );

		$eloChange = $this->eloChange( $eloWhite, $eloBlack, $result );

		$provWhite = $this->countMultiGames( $playerWhite ) < self::COUNT_PROVISIONAL;
		$provBlack = $this->countMultiGames( $playerBlack ) < self::COUNT_PROVISIONAL;

		$eloChangeWhite = $provWhite ? $eloChange * 2 : $eloChange;
		$eloChangBlack = $provBlack ? $eloChange * -2 : -$eloChange;

		if ( $provWhite && $provBlack ) {
			$this->saveMultiplayElo( $playerWhite, $eloWhite + $eloChangeWhite );
			$this->saveMultiplayElo( $playerBlack, $eloBlack + $eloChangBlack );
		}else {
			if(!$provBlack){
				$this->saveMultiplayElo( $playerWhite, $eloWhite + $eloChangeWhite );
			}
			if(!$provWhite){
				$this->saveMultiplayElo( $playerBlack, $eloBlack + $eloChangBlack );
			}
		}

		$this->incrementMultiPlayer($playerWhite);
		$this->incrementMultiPlayer($playerBlack);

	}

	public function eloChange( $whiteElo, $blackElo, $result ) {
		$expected = $this->getExpectedScore( $whiteElo, $blackElo );

		return self::K * ( $result - $expected );
	}

	private function getExpectedScore( $ratingA, $ratingB ) {

		$qa = pow( 10, $ratingA / 400 );
		$qb = pow( 10, $ratingB / 400 );

		return $qa / ( $qa + $qb );
	}

	private function getLastPuzzleId( $userId ) {
		$key = $this->getKey( self::GAME_KEY_PUZZLE_LAST_ID, $userId );

		return $this->store->get( $key );
	}

	private function setLastPuzzleId( $userId, $puzzleId ) {
		$key = $this->getKey( self::GAME_KEY_PUZZLE_LAST_ID, $userId );
		$this->store->upsert( $key, $puzzleId, DhtmlChessKeyValue::NUMERIC );
	}



	public function onPuzzleFailed( $userId, $againstElo, $puzzleId = null ) {
		return $this->onPuzzleComplete( $userId, $againstElo, self::BLACK_WIN, $puzzleId );
	}

	public function onPuzzleCompleteAuto($userId, $puzzleId, $moves, $ms, $solved){
		if($solved){
			return $this->onPuzzleSolvedAuto($userId, $puzzleId, $moves, $ms);
		}else{
			return $this->onPuzzleFailedAuto($userId, $puzzleId, $moves, $ms);
		}
	}

	public function onPuzzleFailedAuto($userId, $puzzleId = null, $moves, $ms){
		$elo = $this->puzzleOppenentElo($moves, $ms);
		return $this->onPuzzleFailed($userId, $elo, $puzzleId);
	}

	public function onPuzzleSolvedAuto($userId, $puzzleId = null, $moves, $ms){
		$elo = $this->puzzleOppenentElo($moves, $ms);
		return $this->onPuzzleSolved($userId, $elo, $puzzleId);
	}


	public function onPuzzleSolved( $userId, $againstElo, $puzzleId = null ) {
		return $this->onPuzzleComplete( $userId, $againstElo, self::WHITE_WIN, $puzzleId );
	}

	private function onPuzzleComplete( $userId, $againstElo, $result, $puzzleId = null ) {
		$elo = $this->getPuzzleElo( $userId );

		if ( ! empty( $puzzleId ) ) {
			$last = $this->getLastPuzzleId( $userId );
			if ( $last == $puzzleId ) {
				return $elo;
			}
		}

		$change = $this->eloChange( $elo, $againstElo, $result );

		$countPlayed = $this->countPuzzleGames( $userId );

		if ( $countPlayed < self::COUNT_PROVISIONAL ) {
			$change *= 2;
		}

		$elo += $change;

		$this->savePuzzleElo( $userId, $elo );
		$this->incrementPuzzles( $userId );

		if ( ! empty( $puzzleId ) ) {
			$this->setLastPuzzleId( $userId, $puzzleId );
		}

		return $elo;
	}

	private function saveMultiplayElo( $userId, $elo ) {
		$this->saveElo( DhtmlChessElo::GAME_KEY_MULTIPLAY_ELO, $userId, $elo );

	}

	private function savePuzzleElo( $userId, $elo ) {
		$this->saveElo( DhtmlChessElo::GAME_KEY_PUZZLE_ELO, $userId, $elo );
	}

	private function saveElo( $key, $userId, $elo ) {

		$key = $this->getKey( $key, $userId );
		$this->store->upsert( $key, $elo, DhtmlChessKeyValue::NUMERIC );
	}

	public function getMultiPlayElo( $userId ) {

		$key = $this->getKey( self::GAME_KEY_MULTIPLAY_ELO, $userId );

		return $this->store->get( $key, 1400 );
	}

	public function getPuzzleElo( $userId ) {
		$key = $this->getKey( self::GAME_KEY_PUZZLE_ELO, $userId );

		return $this->store->get( $key, 1400 );
	}


	private function incrementPuzzles( $userId ) {
		$this->store->increment( $this->getKey( self::GAME_KEY_PUZZLE_COUNT, $userId ) );
	}

	private function incrementMultiPlayer($userId){

		$this->store->increment( $this->getKey( self::GAME_KEY_MULTIPLAY_COUNT, $userId ) );
	}

	public function countMultiGames( $userId ) {

		return $this->countGames( $userId, self::GAME_KEY_MULTIPLAY_COUNT );
	}

	public function countPuzzleGames( $userId ) {
		return $this->countGames( $userId, self::GAME_KEY_PUZZLE_COUNT );
	}

	public function countGames( $userId, $key ) {

		return $this->store->get( $this->getKey( $key, $userId ), 0 );
	}

	private function getKey( $prefix, $userId ) {
		return $prefix . "_" . $userId;
	}

	public function puzzleOppenentElo($moves, $msToSolve = 0){

		$elo = 1000 + ($moves * 250);

		if($msToSolve){
			$sec = round($msToSolve / 1000);
			$elo -= ($sec * 4);
		}

		return max(800, $elo);

	}

}