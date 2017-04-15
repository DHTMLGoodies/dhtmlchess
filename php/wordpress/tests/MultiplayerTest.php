<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 15/04/2017
 * Time: 13:35
 */

define('ABSPATH', dirname(__FILE__) . '/../wordpress/');
require_once(ABSPATH . '/wp-config.php');
require_once("../wordpress/wp-includes/load.php");
require_once("../wordpress/wp-includes/plugin.php");
require_once("../wordpress/wp-includes/wp-db.php");
require_once(ABSPATH . WPINC . '/version.php');

require_once(__DIR__ . "/../../../autoload.php");


class MultiplayerTest  extends PHPUnit_Framework_TestCase{


    private $startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    /**
     * @var wpdb $wpdb
     */
    private $wpdb;
    /**
     * @var DhtmlChessDatabase
     */
    private $database;

    /**
     * @var DhtmlChessMultiplayerGameHandler $multiplayerGameHandler
     */
    private $multiplayerGameHandler;

    protected function setUp()
    {
        parent::setUp();
        DhtmlChessInstaller::enableTestMode();

        $this->wpdb = new wpdb("root", "", "wordpress3", "localhost");
        global $wpdb;
        $wpdb = $this->wpdb;
        $this->database = new DhtmlChessDatabase();
        $this->database->uninstall();
        $this->database->install();

        $this->multiplayerGameHandler = new DhtmlChessMultiplayerGameHandler();
    }



    public static function tearDownAfterClass()
    {
        parent::tearDownAfterClass();

        global $wpdb;
        $wpdb = new wpdb("root", "", "wordpress3", "localhost");
        $database = new DhtmlChessDatabase();
        $database->uninstall();

        DhtmlChessInstaller::disableTestMode();
        $database->install();
    }

    /**
     * @test
     */
    public function shouldBeAbleToCreateSeekObject(){
        // given
        $seek = new DhtmlChessMultiGameParams(1);

        // when
        $seek->fromElo(1000)->toElo(1600)->againstOpponent(2);

        $seekObj = $seek->getParams();

        // then
        $this->assertEquals(1000, $seekObj[DhtmlChessDatabase::COL_MIN_ELO]);
        $this->assertEquals(1600, $seekObj[DhtmlChessDatabase::COL_MAX_ELO]);
        $this->assertEquals(2, $seekObj[DhtmlChessDatabase::COL_SEEK_OPPONENT_ID]);
    }

    /**
     * @test
     */
    public function shouldBeAbleToCreateNewSeekInDatabase(){
        // given
        $seek = new DhtmlChessMultiGameParams(1, "alfmagne");
        $seek->fromElo(1000)->toElo(1600)->againstOpponent(2);

        // when
        $this->multiplayerGameHandler->createSeek($seek);
        $seeks = $this->multiplayerGameHandler->getSeeks(1);

        // then
        $this->assertCount(1, $seeks);
    }

    /**
     * @test
     */
    public function shouldReturnParamObjectFromGame(){
        // given
        $seek = new DhtmlChessMultiGameParams(1, "alfmagne");
        $seek->fromElo(1000)->toElo(1600)->againstOpponent(2);
        $id = $this->multiplayerGameHandler->createSeek($seek);

        // when
        $params = $this->multiplayerGameHandler->params($id);

        // then
        $this->assertInstanceOf(DhtmlChessMultiGameParams::class, $params);

        $this->assertEquals(1000, $params->val(DhtmlChessDatabase::COL_MIN_ELO));
        $this->assertEquals(1600, $params->val(DhtmlChessDatabase::COL_MAX_ELO));
        $this->assertEquals(2, $params->val(DhtmlChessDatabase::COL_SEEK_OPPONENT_ID));
        $this->assertEquals("r", $params->val(DhtmlChessDatabase::COL_SEEK_COLOR));
        $this->assertEquals(3, $params->val(DhtmlChessDatabase::COL_DAYS_PER_MOVE));
    }


    /**
     * @return DhtmlChessMultiGameParams
     */
    private function createGame(){

        $seek = new DhtmlChessMultiGameParams(1, "alfmagne");
        $seek->fromElo(1000)->toElo(1600)->againstOpponent(2)->setSeekColor(DhtmlChessDatabase::COLOR_WHITE);
        $id = $this->multiplayerGameHandler->createSeek($seek);
        $params = $this->multiplayerGameHandler->params($id);
        $params->acceptSeek(2, "katrine");
        $this->multiplayerGameHandler->save($params);
        return $params;
    }
    /**
     * @test
     */
    public function shouldCreateGameWhenSeekIsAccepted(){
        // given
        $seek = new DhtmlChessMultiGameParams(1, "alfmagne");
        $seek->fromElo(1000)->toElo(1600)->againstOpponent(2)->setSeekColor(DhtmlChessDatabase::COLOR_WHITE);
        $id = $this->multiplayerGameHandler->createSeek($seek);

        // when
        $params = $this->multiplayerGameHandler->params($id);
        $params->acceptSeek(2, "katrine");

        $this->multiplayerGameHandler->save($params);

        $params = $this->multiplayerGameHandler->params($id);

        // then
        $this->assertEquals(1, $params->val(DhtmlChessDatabase::COL_WHITE_ID));
        $this->assertEquals(2, $params->val(DhtmlChessDatabase::COL_BLACK_ID));
        $this->assertEquals("alfmagne", $params->val(DhtmlChessDatabase::COL_WHITE_NAME));
        $this->assertEquals("katrine", $params->val(DhtmlChessDatabase::COL_BLACK_NAME));
        $this->assertEquals($this->startFen, $params->val(DhtmlChessDatabase::COL_CURRENT_FEN));
        $this->assertEquals(1, $params->val(DhtmlChessDatabase::COL_USER_ID_TO_MOVE));
        $this->assertNotEmpty($params->val(DhtmlChessDatabase::COL_CREATED));
    }

    /**
     * @test
     */
    public function shouldBeAbleToAddMove(){
        // given
        $gameParams = $this->createGame();

        // when
        $gameParams->addMove(1, "e2","e4");
        $gameModel = json_decode($gameParams->getGame(), true);
        $firstMove = $gameModel["moves"][0];

        // then
        $this->assertCount(1, $gameModel["moves"]);
        $this->assertEquals("e4", $firstMove["m"]);
    }


    /**
     * @test
     */
    public function shouldUpdateTimestampOnMove(){
        // given
        $gameParams = $this->createGame();

        $tsStart = $gameParams->val(DhtmlChessDatabase::COL_CREATED);

        time_nanosleep(1, 0);
        // when
        $gameParams->addMove(1, "e2","e4");


        $this->multiplayerGameHandler->save($gameParams);

        $params = $this->multiplayerGameHandler->params(1);

        // then
        $lastMoveTs = $params->val(DhtmlChessDatabase::COL_TS_LAST_MOVE);
        $createdTs = $params->val(DhtmlChessDatabase::COL_CREATED);


        $this->assertEquals($tsStart, $createdTs);
        $this->assertNotEmpty($lastMoveTs);

        $this->assertGreaterThan($createdTs, $lastMoveTs);
    }

    /**
     * @test
     */
    public function shouldUpdateUserIdToMoveOnMove(){
        $gameParams = $this->createGame();

        // when
        $gameParams->addMove(1, "e2","e4");

        // then
        $this->assertEquals(2, $gameParams->getUserIdToMove());

    }

    /**
     * @test
     */
    public function shouldCreateGameJSONWHenGameIsCreated(){
        // given
        $gameParams = $this->createGame();

        // when
        $array = $gameParams->getParams();

        // then
        $this->assertNotEmpty($array[DhtmlChessDatabase::COL_GAME]);
    }



    /**
     * @test
     */
    public function SeekShouldExpire(){

    }

    /**
     * @test
     */
    public function GameWillEndOnTimeOut(){

    }

    /**
     * @test
     */
    public function shouldEndGameOnCheckmate(){
        // given
        $gameParams = $this->createGame();

        // when
        $gameParams->addMove(1, "f2","f3");
        $gameParams->addMove(2, "e7","e5");
        $gameParams->addMove(1, "g2","g4");
        $gameParams->addMove(2, "d8","h4");

        $gameModel = json_decode($gameParams->getGame(), true);
        $this->assertCount(4, $gameModel["moves"]);

        // then
        $this->assertEquals(DhtmlChessDatabase::KEY_BLACK_WIN, $gameParams->getResult());
        $this->assertTrue($gameParams->isFinished());
    }


    public function shouldUpdateEloWhenGameEnds(){


    }

    /**
     * @test
     */
    public function shouldBeAbleToAppendMove(){

    }

    /**
     * @test
     */
    public function shouldBeAbleToClaimDraw(){


    }

    /**
     * @test
     */
    public function shouldBeAbleToDeleteSeek(){

    }

    /**
     * @test
     */
    public function shouldBeAbleToResign(){

    }


    /**
     * @test
     */
    public function shouldBeAbleToGetGameHistoryForAPlayer(){

    }

    /**
     * @test
     */
    public function shouldBeAbleToGetStatsForAPlayer(){


    }




}