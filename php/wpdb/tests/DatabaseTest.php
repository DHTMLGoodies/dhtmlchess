<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 25/01/2017
 * Time: 12:17
 */

define( 'ABSPATH', dirname( __FILE__ ) . '/../wordpress/' );
require_once( ABSPATH . '/wp-config.php' );
require_once("../wordpress/wp-includes/load.php");
require_once("../wordpress/wp-includes/plugin.php");
require_once("../wordpress/wp-includes/wp-db.php");
require_once( ABSPATH . WPINC . '/version.php' );

require_once(__DIR__."/../../autoload.php");


class DatabaseTest extends PHPUnit_Framework_TestCase
{

    private $wpdb;
    /**
     * @var DhtmlChessDatabase
     */
    private $database;

    protected function setUp(){
        parent::setUp();
        DhtmlChessDatabaseInstaller::enableTestMode();
        
        $this->wpdb = new wpdb("root", "", "wordpress", "localhost");
        global $wpdb;
        $wpdb = $this->wpdb;
        $this->database = new DhtmlChessDatabase();
        $this->database->uninstall();
        $this->database->install();
    }


    /**
     * @test
     */
    public function shouldAddSuffixIfAlreadyExists(){
        // given
        $this->wpdb->insert(
            DhtmlChessDatabase::TABLE_PGN,
            array(
                DhtmlChessDatabase::COL_PGN_NAME => 'greatgames'
            ),
            array(
                '%s'
            )
        );
        $this->wpdb->insert(
            DhtmlChessDatabase::TABLE_PGN,
            array(
                DhtmlChessDatabase::COL_PGN_NAME => 'greatgames_1'
            ),
            array(
                '%s'
            )
        );
        $dbPgn = new DhtmlChessDatabasePgnUtil($this->wpdb);

        // when
        $uniqueName = $dbPgn->getUniqueName('../../pgn/greatgames.pgn');

        // then
        $this->assertEquals('greatgames_2', $uniqueName);
    }

    /**
     * @test
     */
    public function shouldGetId(){
        // given
        $this->wpdb->insert(
            DhtmlChessDatabase::TABLE_PGN,
            array(
                DhtmlChessDatabase::COL_PGN_NAME => 'test1'
            ),
            array(
                '%s'
            )
        );
        $this->wpdb->insert(
            DhtmlChessDatabase::TABLE_PGN,
            array(
                DhtmlChessDatabase::COL_PGN_NAME => 'test2'
            ),
            array(
                '%s'
            )
        );
        $dbPgn = new DhtmlChessDatabasePgnUtil($this->wpdb);

        // when
        $id = $dbPgn->getId('test2');

        // then
        $this->assertEquals(2, $id);
    }

    /**
     * @test
     */
    public function shouldConvertFileNameToPgnName(){
        // given
        $dbPgn = new DhtmlChessDatabasePgnUtil($this->wpdb);

        $this->assertEquals("greatgames", $dbPgn->pathToPgnName('../../pgn/greatgames.pgn'));
        $this->assertEquals("greatgames", $dbPgn->pathToPgnName('greatgames'));
    }

    /**
     * @test
     */
    public function shouldBeAbleToImportQuickly(){

        $start = microtime(true);
        $this->database->import('../../../pgn/Morphy.pgn');

        $end = microtime(true);


        $this->assertTrue($end-$start < 2, "Elapsed ". ($end-$start));

    }



    /**
     * @test
     */
    public function shouldBeAbleToImport(){
        // given
        $this->database->import('../../../pgn/greatgames.pgn');

        // when
        $db = DhtmlChessDatabasePgn::instanceByName('../../pgn/greatgames.pgn');

        // then
        $this->assertEquals(64, $db->countGames());
        
        
    }

    /**
     * @test
     */

    public function shouldBeAbleToGetAGame(){
        // given
        $this->database->import('fivegames.pgn');

        // when
        $game = $this->database->gameByIndex("fivegames", 1);
        $game = json_decode($game, true);

        // then
        $this->assertNotNull($game);
        $this->assertEquals("Immortal game", $game["event"], json_encode($game));
    }

    /**
     * @test
     */
    public function shouldGetListOfGames(){
        // given
        $this->database->import('fivegames.pgn');
        $db = DhtmlChessDatabasePgn::instanceByName('fivegames.pgn');

        
        // when
        $this->assertNull($db->cachedListOfGames());

        $games = $db->listOfGames();
        $games = json_decode($games, true);
        
        $this->assertEquals(5, count($games));

        $cached = $db->cachedListOfGames();

        $cached = json_decode($cached, true);

        $this->assertEquals(5, count($cached));
    }


    /**
     * @test
     */
    public function shouldBeAbleToClearGameListCache(){
        $this->database->import('fivegames.pgn');
        $db = DhtmlChessDatabasePgn::instanceByName('fivegames.pgn');
        $db->listOfGames();

        $this->assertNotNull($db->cachedListOfGames());

        $db->clearPgnList();

        $this->assertNull($db->cachedListOfGames());
    }

    /**
     * @test
     */
    public function testShouldBeAbleToDeleteAGame(){
        // given
        $this->database->import('fivegames.pgn');
        $db = DhtmlChessDatabasePgn::instanceByName('fivegames.pgn');

        $game = $this->database->gameByIndex("fivegames", 1);

        $game = json_decode($game, true);

        // then
        $this->assertNotNull($game[DhtmlChessDatabase::COL_ID]);
        $id = $game[DhtmlChessDatabase::COL_ID];

        $this->assertNotNull($this->database->gameById("fivegames", $id));

        $this->database->deleteGame("fivegames", $id);


        $games = $this->database->listOfGames("fivegames");
        $games = json_decode($games, true);

        $this->assertEquals(4, count($games));

        $cached = $db->cachedListOfGames();
        $cached = json_decode($cached, true);
        $this->assertEquals(4, count($cached));;
        
        $this->assertNull($db->gameById($id));

    }

    /**
     * @test
     */
    public function shouldBeAbleToUseCache(){
        $cache = new DhtmlChessCache();

        // when
        $cache->putInCache("alf", "magne");

        // then
        $this->assertEquals("magne", $cache->getFromCache("alf"));

        // when
        $cache->putInCache("alf", "kalleland");


        // then
        $this->assertEquals("kalleland", $cache->getFromCache("alf"));

        // when
        $cache->clear("alf");

        // then
        $this->assertNull($cache->getFromCache("alf"));
    }

    /**
     * @test
     */
    public function shouldGetName(){
        $this->database->import('fivegames.pgn');
        $db = DhtmlChessDatabasePgn::instanceByName('fivegames.pgn');
        $this->assertEquals("fivegames", $db->getName());
    }

    /**
     * @test
     */
    public function shouldReturnPgnInstanceFromImport(){
        $db = $this->database->import('fivegames.pgn');

        // then
        $this->assertNotNull($db);
        $this->assertEquals("fivegames", $db->getName());

    }
    
    /**
     * @test
     */
    public function testShouldBeAbleToUpdateGame(){

        $this->database->import('fivegames.pgn');
        $db = DhtmlChessDatabasePgn::instanceByName('fivegames.pgn');

        $db->listOfGames();
        $game = $this->database->gameByIndex("fivegames", 1);
        $game = json_decode($game, true);

        $game["event"] = "alfmagne";

        $this->assertTrue($db->updateGame(json_encode($game)));

        $game = $db->gameByIndex(1);
        $game = json_decode($game, true);

        $this->assertEquals("alfmagne", $game["event"]);

        $gamelist = $db->listOfGames();
        $gamelist = json_decode($gamelist, true);

        $this->assertEquals("alfmagne", $gamelist[1]["event"]);
    }

    /**
     * @test
     */
    public function shouldBeAbleToGetListOfPgns(){
        $this->database->import('fivegames.pgn');
        $this->database->import('onegame.pgn');


        // when
        $pgns = $this->database->listOfPgns();
        $pgns = json_decode($pgns, true);

        // then
        $this->assertEquals(2, count($pgns));

        $this->assertEquals("fivegames", $pgns[0][DhtmlChessDatabase::COL_PGN_NAME]);
        $this->assertEquals(5, $pgns[0]["count"]);
        $this->assertEquals(1, $pgns[1]["count"]);
        $this->assertEquals("onegame", $pgns[1][DhtmlChessDatabase::COL_PGN_NAME]);
    }

    /**
     * @test
     */
    public function shouldBeAbleToAddGame(){
        $this->database->import('fivegames.pgn');
        $this->database->import('onegame.pgn');
        
        $game = $this->database->gameByIndex("onegame", 0);

        $this->assertNotNull($game);
        $this->database->appendGame("fivegames", $game);
        
        // then
        $this->assertEquals(6, $this->database->countGames("fivegames"));
    }

    /**
     * @test
     */
    public function shouldBeAbleToAppendPgnToPgn(){
        $this->database->import('fivegames.pgn');
        $this->database->listOfGames("fivegames");

        $this->assertEquals(5, $this->countCached("fivegames"));

        $this->database->appendPgn('fivegames.pgn');

        // then
        $this->assertEquals(10, $this->database->countGames("fivegames"));
        $games = $this->database->listOfGames("fivegames");
        $games = json_decode($games, true);
        $this->assertEquals(10, count($games));
        $this->assertEquals(10, $this->countCached("fivegames"));

    }

    private function countCached($pgn){
        $db = DhtmlChessDatabasePgn::instanceByName($pgn);
        $cached = $db->cachedListOfGames();
        $cached = json_decode($cached,true );
        return count($cached);
    }

    /**
     * @test
     */
    public function shouldBeAbleToDeletePgn(){
        $this->database->import('fivegames.pgn');
        $this->database->import('onegame.pgn');

        $this->database->listOfPgns();


        $countDeleted = $this->database->deletePgn("onegame.pgn");

        $this->assertEquals(1, $countDeleted);

        $pgns = $this->database->listOfPgns();
        $pgns = json_decode($pgns, true);

        $this->assertEquals(5, $this->countGamesInDb());

        // then
        $this->assertEquals(1, count($pgns), json_encode($pgns));

        $this->assertEquals(5, $this->countGamesInDb());

    }

    /**
     * @test
     */
    public function shouldGetCountGames(){
        $this->database->import('fivegames.pgn');
        $this->database->import('onegame.pgn');


        // then
        $this->assertEquals(6, $this->database->countGamesInDatabase());
    }

    private function countGamesInDb(){
        /**
         * @var wpdb $wpdb
         */

        $query = "select " . DhtmlChessDatabase::COL_ID . " from " . DhtmlChessDatabase::TABLE_GAME;
        $results = $this->wpdb->get_results($query);
        return count($results);
    }

}