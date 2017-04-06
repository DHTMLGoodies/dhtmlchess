<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 25/01/2017
 * Time: 12:17
 */

define( 'ABSPATH', dirname( __FILE__ ) . '/../wordpress/' );
require_once( ABSPATH . '/wp-config.php' );
require_once( "../wordpress/wp-includes/load.php" );
require_once( "../wordpress/wp-includes/plugin.php" );
require_once( "../wordpress/wp-includes/wp-db.php" );
require_once( ABSPATH . WPINC . '/version.php' );

require_once( __DIR__ . "/../../../autoload.php" );

class EloTest extends PHPUnit_Framework_TestCase {


	private $wpdb;

	/**
	 * @var DhtmlChessKeyValue $store
	 */
	private $store;

	const PLAYER_ID_WHITE = 1;
	const PLAYER_ID_BLACK = 2;

	public function setUp() {

		$this->wpdb = new wpdb( "root", "", "wordpress3", "localhost" );
		global $wpdb;
		$wpdb = $this->wpdb;

		$store = $this->store = new DhtmlChessKeyValue();
		$store->remove( DhtmlChessElo::GAME_KEY_PUZZLE_COUNT . "_1" );
		$store->remove( DhtmlChessElo::GAME_KEY_PUZZLE_ELO . "_1" );
		$store->remove( DhtmlChessElo::GAME_KEY_PUZZLE_LAST_ID . "_1" );

		for ( $i = 1; $i < 20; $i ++ ) {
			$store->remove( DhtmlChessElo::GAME_KEY_MULTIPLAY_ELO . "_" . $i );
			$store->remove( DhtmlChessElo::GAME_KEY_MULTIPLAY_COUNT . "_" . $i );
		}
	}


	/**
	 * @test
	 */
	public function shouldGetEloChange() {
		// given
		$elo = new DhtmlChessElo();

		$change = $elo->eloChange( 1400, 1400, DhtmlChessElo::WHITE_WIN );

		// then
		$this->assertEquals( 15, $change );

	}

	/**
	 * @test
	 */
	public function shouldIncrementPuzzlesPlayed() {

		// given
		$elo = new DhtmlChessElo();

		// when
		$elo->onPuzzlesolved( 1, 1400 );
		$elo->onPuzzlesolved( 1, 1400 );

		// then
		$this->assertEquals( 2, $elo->countPuzzleGames( 1 ) );
	}

	/**
	 * @test
	 */
	public function shouldGiveDoubleEloOnFirstPuzzlesSolved() {
		// given
		$elo = new DhtmlChessElo();

		// when
		$newElo = $elo->onPuzzlesolved( 1, 1400 );

		// then
		$this->assertEquals( 1430, $newElo );

	}

	/**
	 * @test
	 */
	public function shouldGiveDoublePointsOnFirstPuzzlesNotSolved() {
		// given
		$elo = new DhtmlChessElo();

		// when
		$newElo = $elo->onPuzzleFailed( 1, 1400 );

		// then
		$this->assertEquals( 1370, $newElo );

	}

	/**
	 * @test
	 */
	public function shouldGiveNormalEloAfterProvisional() {

		// given
		$elo = new DhtmlChessElo();

		for ( $i = 0; $i < 20; $i ++ ) {
			$elo->onPuzzleSolved( 1, 1400 );
		}

		$opponentElo = $elo->getPuzzleElo( 1 );

		// when
		$newElo = $elo->onPuzzleSolved( 1, $opponentElo );

		// then
		$this->assertEquals( $opponentElo + 15, $newElo );
	}

	/**
	 * @test
	 */
	public function shouldNotSaveSamePuzzleIdOverAgain() {
		// given
		$elo = new DhtmlChessElo();

		for ( $i = 0; $i < 20; $i ++ ) {
			$elo->onPuzzleSolved( 1, 1400, 1 );
		}

		// then
		$this->assertEquals( 1430, $elo->getPuzzleElo( 1 ) );

	}


	/**
	 * @test
	 */
	public function shouldUpdateBothPlayersRatingInMultiplayer() {

		// given
		$elo = new DhtmlChessElo();

		// when
		$elo->onGameEnd(
			1,
			2, DhtmlChessElo::WHITE_WIN );

		$eloWhite = $elo->getMultiPlayElo( 1 );
		$eloBlack = $elo->getMultiPlayElo( 2 );

		// then
		$this->assertEquals( 1430, $eloWhite );
		$this->assertEquals( 1370, $eloBlack );
	}


	/**
	 * @test
	 */
	public function shouldBeAbleToGetCountMultiplayGames() {
		// given
		$elo = new DhtmlChessElo();

		// when
		// when
		$elo->onGameEnd(
			1,
			2, DhtmlChessElo::BLACK_WIN );
		$elo->onGameEnd(
			1,
			3, DhtmlChessElo::BLACK_WIN );


		// then
		$this->assertEquals( 2, $elo->countMultiGames( 1) );
		$this->assertEquals( 1, $elo->countMultiGames( 2 ) );
		$this->assertEquals( 1, $elo->countMultiGames( 3 ) );
	}

	/**
	 * @test
	 */
	public function shouldNotUpdateWhiteIfBlackIsProvisionalAndWhiteIsNot() {
		// given
		$elo = new DhtmlChessElo();
		$this->setMultiCount( self::PLAYER_ID_WHITE, 20 );
		$this->setMultiCount( self::PLAYER_ID_BLACK, 1 );

		$this->assertEquals( 20, $elo->countMultiGames( self::PLAYER_ID_WHITE ) );
		$this->assertEquals( 1, $elo->countMultiGames( self::PLAYER_ID_BLACK ) );

		// when
		$elo->onGameEnd(
			1,
			2, DhtmlChessElo::BLACK_WIN );

		// then
		$this->assertEquals( 1430, $elo->getMultiPlayElo( self::PLAYER_ID_BLACK ) );
		$this->assertEquals( 1400, $elo->getMultiPlayElo( self::PLAYER_ID_WHITE ) );

	}


	private function setMultiCount( $playerId, $count ) {
		$this->store->upsert( DhtmlChessElo::GAME_KEY_MULTIPLAY_COUNT . "_" . $playerId, $count );
	}

	private function setMultiPlayerElo( $playerId, $elo ) {
		$this->store->upsert( DhtmlChessElo::GAME_KEY_MULTIPLAY_ELO . "_" . $playerId, $elo );
	}
}

