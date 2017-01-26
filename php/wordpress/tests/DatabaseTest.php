<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 25/01/2017
 * Time: 12:17
 */

define('ABSPATH', dirname(__FILE__) . '/../wordpress/');
require_once(ABSPATH . '/wp-config.php');
require_once("../wordpress/wp-includes/load.php");
require_once("../wordpress/wp-includes/plugin.php");
require_once("../wordpress/wp-includes/wp-db.php");
require_once(ABSPATH . WPINC . '/version.php');

require_once(__DIR__ . "/../../../autoload.php");


class DatabaseTest extends PHPUnit_Framework_TestCase
{

    /**
     * @var wpdb $wpdb
     */
    private $wpdb;
    /**
     * @var DhtmlChessDatabase
     */
    private $database;

    protected function setUp()
    {
        parent::setUp();
        DhtmlChessInstaller::enableTestMode();

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
    public function shouldAddSuffixIfAlreadyExists()
    {
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
        $dbPgn = new DhtmlChessPgnUtil($this->wpdb);

        // when
        $uniqueName = $dbPgn->getUniqueName('../../pgn/greatgames.pgn');

        // then
        $this->assertEquals('greatgames_2', $uniqueName);


    }

    /**
     * @test
     */
    public function shouldGetId()
    {
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
        $dbPgn = new DhtmlChessPgnUtil($this->wpdb);

        // when
        $id = $dbPgn->getId('test2');

        // then
        $this->assertEquals(2, $id);
    }

    /**
     * @test
     */
    public function shouldConvertFileNameToPgnName()
    {
        // given
        $dbPgn = new DhtmlChessPgnUtil($this->wpdb);

        $this->assertEquals("greatgames", $dbPgn->pathToPgnName('../../pgn/greatgames.pgn'));
        $this->assertEquals("greatgames", $dbPgn->pathToPgnName('greatgames'));
    }

    /**
     * @test
     */
    public function shouldBeAbleToImportQuickly()
    {

        $start = microtime(true);
        $this->database->import('../../../pgn/Morphy.pgn');

        $end = microtime(true);


        $this->assertTrue($end - $start < 2, "Elapsed " . ($end - $start));

    }

    /**
     * @test
     */
    public function shouldBeAbleToMoveGame()
    {
        $this->database->import('fivegames.pgn');
        $this->database->import('onegame.pgn');

        $this->database->listOfGames("fivegames");
        $this->database->listOfGames("onegame");

        $secondGame = $this->database->gameByIndex('fivegames', 1);
        $secondGame = json_decode($secondGame, true);
        $this->database->moveGame($secondGame['id'], 'onegame');

        $this->assertArrayLength($this->database->listOfGames('fivegames'), 4);
        $this->assertArrayLength($this->database->listOfGames('onegame'), 2);

        $this->assertEquals(4, $this->countCached('fivegames'));
        $this->assertEquals(2, $this->countCached('onegame'));
    }

    private function assertArrayLength($json, $length)
    {
        $json = json_decode($json, true);
        $this->assertEquals($length, count($json));
    }


    /**
     * @test
     */
    public function shouldBeAbleToImport()
    {
        // given
        $this->database->import('../../../pgn/greatgames.pgn');

        // when
        $db = DhtmlChessPgn::instanceByName('../../pgn/greatgames.pgn');

        // then
        $this->assertEquals(64, $db->countGames());


    }

    /**
     * @test
     */

    public function shouldBeAbleToGetAGame()
    {
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
    public function shouldBeAbleToGetRandomGame()
    {
        // given
        $this->database->import('fivegames.pgn');

        // when
        $game = $this->database->randomGame("fivegames");

        // then
        $this->assertNotEmpty($game);

    }

    /**
     * @test
     */
    public function shouldGetListOfGames()
    {
        // given
        $this->database->import('fivegames.pgn');
        $db = DhtmlChessPgn::instanceByName('fivegames.pgn');


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
    public function shouldBeAbleToClearGameListCache()
    {
        $this->database->import('fivegames.pgn');
        $db = DhtmlChessPgn::instanceByName('fivegames.pgn');
        $db->listOfGames();

        $this->assertNotNull($db->cachedListOfGames());

        $db->clearPgnList();

        $this->assertNull($db->cachedListOfGames());
    }

    /**
     * @test
     */
    public function testShouldBeAbleToDeleteAGame()
    {
        // given
        $this->database->import('fivegames.pgn');
        $db = DhtmlChessPgn::instanceByName('fivegames.pgn');

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
    public function shouldBeAbleToUseCache()
    {
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
    public function shouldGetName()
    {
        $this->database->import('fivegames.pgn');
        $db = DhtmlChessPgn::instanceByName('fivegames.pgn');
        $this->assertEquals("fivegames", $db->getName());
    }

    /**
     * @test
     */
    public function shouldReturnPgnInstanceFromImport()
    {
        $db = $this->database->import('fivegames.pgn');

        // then
        $this->assertNotNull($db);
        $this->assertEquals("fivegames", $db->getName());

    }

    /**
     * @test
     */
    public function testShouldBeAbleToUpdateGame()
    {

        $this->database->import('fivegames.pgn');
        $db = DhtmlChessPgn::instanceByName('fivegames.pgn');

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
    public function shouldBeAbleToGetListOfPgns()
    {
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
    public function shouldBeAbleToAddGame()
    {
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
    public function shouldSetPgnPropertyOfGameObject()
    {
        $this->database->import('onegame.pgn');

        $game = $this->database->gameByIndex("onegame", 0);
        $game = json_decode($game, true);

        $this->assertEquals('onegame', $game['pgn']);

    }

    /**
     * @test
     */
    public function shouldBeAbleToAppendPgnToPgn()
    {
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

    /**
     * @test
     */
    public function shouldCacheListOfPgns()
    {

    }

    private function countPgns()
    {
        $list = new DhtmlChessPgnList();
        $games = $list->getPgns();
        $games = json_decode($games, true);
        return count($games);
    }

    private function countCached($pgn)
    {
        $db = DhtmlChessPgn::instanceByName($pgn);
        $cached = $db->cachedListOfGames();
        $cached = json_decode($cached, true);
        return count($cached);
    }

    /**
     * @test
     */
    public function shouldBeAbleToDeletePgn()
    {
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
    public function nameShouldBeUniqueOnCreate()
    {
        $this->database->import('fivegames.pgn');
        $this->database->import('fivegames.pgn');
        $this->database->import('fivegames.pgn');

        $this->assertEquals(1, $this->countDuplicatePgns("fivegames"));
        $this->assertEquals(3, $this->countPgnsDb());

        $count = $this->database->countGames("fivegames_1");
        $this->assertEquals(5, $count);

    }

    /**
     * @test
     */
    public function shouldGetCountGames()
    {
        $this->database->import('fivegames.pgn');
        $this->database->import('onegame.pgn');


        // then
        $this->assertEquals(6, $this->database->countGamesInDatabase());
    }


    /* GAME DRAFT TESTS */

    /**
     * @test
     */
    public function shouldBeAbleToSaveDraft()
    {
        $game = $this->gameData;

        $this->database->saveDraft($game);

        $this->assertEquals(1, $this->database->countDrafts());




    }

    /**
     * @test
     */
    public function shouldBeAbleToUpdateDraft()
    {
        $game = $this->gameData;

        $draftId = $this->database->saveDraft($game);
        $this->assertNotEmpty($draftId);


        $game = json_decode($game, true);
        $game["event"] = "My event";
        $game[DhtmlChessDatabase::KEY_DRAFT_ID] = $draftId;

        $this->database->saveDraft(json_encode($game));

        $this->assertEquals(1, $this->database->countDrafts());
    }


    /**
     * @test
     */
    public function shouldBeAbleToGetDraft(){

        $game = $this->gameData;
        $game = json_decode($game, true);
        $game['event'] = 'testing 123';

        $draftId = $this->database->saveDraft($game);
        
        $draftGame = $this->database->getDraft($draftId);

        $this->assertNotEmpty($draftGame);
        $draftGame = json_decode($draftGame, true);


        $this->assertEquals('testing 123', $draftGame['event'], json_encode($draftGame));
        $this->assertEquals($draftId, $draftGame[DhtmlChessDatabase::KEY_DRAFT_ID]);

        $this->assertEquals(1, $this->database->countDrafts());
    }

    /**
     * @test
     */
    public function shouldBeAbleToDeleteDraft(){
        $game = $this->gameData;
        $game = json_decode($game, true);
        $game['event'] = 'testing 123';
        $draftId = $this->database->saveDraft($game);

        $this->assertEquals(1, $this->database->countDrafts());

        $this->database->deleteDraft($draftId);


        $this->assertEquals(0, $this->database->countDrafts());
    }

    /**
     * @test
     */
    public function shouldBeAbleToGetAllDrafts(){
        $game = $this->gameData;
        $game = json_decode($game, true);
        $game['white'] = "game1";
        $this->database->saveDraft($game);
        $game["white"] = "game2";
        $this->database->saveDraft($game);
        
        // when
        $drafts = $this->database->allDrafts();
        $drafts = json_decode($drafts, true);

        // then
        $this->assertEquals(2, count($drafts) );

    }

    /**
     * @test
     */
    public function shouldBeAbleToPublishDraft(){
        $this->database->import('fivegames.pgn');


        $game = $this->gameData;
        $game = json_decode($game, true);
        $game['white'] = "game1";
        $this->database->saveDraft($game);
        $game["white"] = "game2";
        $draftId = $this->database->saveDraft($game);

        // when
        $this->database->publishDraft($draftId, "fivegames");

        $this->assertEquals(1, $this->database->countDrafts());
        $this->assertEquals(6, $this->database->countGames("fivegames"));

    }

    /**
     * @test
     * @throws DhtmlChessException
     */
    public function shouldBeAbleToPublishDraftByCreatingNewPgn(){
        $this->database->import('fivegames.pgn');


        $game = $this->gameData;
        $game = json_decode($game, true);
        $game['white'] = "game1";
        $this->database->saveDraft($game);
        $game["white"] = "game2";
        $draftId = $this->database->saveDraft($game);

        // when
        $this->database->publishDraft($draftId, "newpgn");

        $this->assertEquals(1, $this->database->countDrafts());
        $this->assertEquals(1, $this->database->countGames("newpgn"));

    }



    public function shouldBeAbleToRenamePgn()
    {
        $this->fail("TO IMPLEMENT");
    }

    private function countPgnsDb()
    {
        $query = "select " . DhtmlChessDatabase::COL_ID . " from " . DhtmlChessDatabase::TABLE_PGN;
        $results = $this->wpdb->get_results($query);
        return count($results);
    }

    private function countDuplicatePgns($pgn)
    {
        /**
         * @var wpdb $wpdb
         */

        $query = $this->wpdb->prepare("select " . DhtmlChessDatabase::COL_ID . " from " . DhtmlChessDatabase::TABLE_PGN . " where "
            . DhtmlChessDatabase::COL_PGN_NAME . ' = %s', $pgn);
        $results = $this->wpdb->get_results($query);
        return count($results);
    }

    private function countGamesInDb()
    {
        /**
         * @var wpdb $wpdb
         */

        $query = "select " . DhtmlChessDatabase::COL_ID . " from " . DhtmlChessDatabase::TABLE_GAME;
        $results = $this->wpdb->get_results($query);
        return count($results);
    }


    private $gameData = '{"metadata":{"castle":1},"event":"?","site":"Amsterdam","date":"1889.??.??","round":"?","white":"Lasker,Em","black":"Bauer,I","result":"1-0","fen":"rnbqkbnr\/pppppppp\/8\/8\/8\/8\/PPPPPPPP\/RNBQKBNR w KQkq - 0 1","moves":[{"m":"f4","from":"f2","to":"f4","fen":"rnbqkbnr\/pppppppp\/8\/8\/5P2\/8\/PPPPP1PP\/RNBQKBNR b KQkq f3 0 1"},{"m":"d5","from":"d7","to":"d5","fen":"rnbqkbnr\/ppp1pppp\/8\/3p4\/5P2\/8\/PPPPP1PP\/RNBQKBNR w KQkq d6 0 2"},{"m":"e3","from":"e2","to":"e3","fen":"rnbqkbnr\/ppp1pppp\/8\/3p4\/5P2\/4P3\/PPPP2PP\/RNBQKBNR b KQkq - 0 2"},{"m":"Nf6","from":"g8","to":"f6","fen":"rnbqkb1r\/ppp1pppp\/5n2\/3p4\/5P2\/4P3\/PPPP2PP\/RNBQKBNR w KQkq - 1 3"},{"m":"b3","from":"b2","to":"b3","fen":"rnbqkb1r\/ppp1pppp\/5n2\/3p4\/5P2\/1P2P3\/P1PP2PP\/RNBQKBNR b KQkq - 0 3"},{"m":"e6","from":"e7","to":"e6","fen":"rnbqkb1r\/ppp2ppp\/4pn2\/3p4\/5P2\/1P2P3\/P1PP2PP\/RNBQKBNR w KQkq - 0 4"},{"m":"Bb2","from":"c1","to":"b2","fen":"rnbqkb1r\/ppp2ppp\/4pn2\/3p4\/5P2\/1P2P3\/PBPP2PP\/RN1QKBNR b KQkq - 1 4"},{"m":"Be7","from":"f8","to":"e7","fen":"rnbqk2r\/ppp1bppp\/4pn2\/3p4\/5P2\/1P2P3\/PBPP2PP\/RN1QKBNR w KQkq - 2 5"},{"m":"Bd3","from":"f1","to":"d3","fen":"rnbqk2r\/ppp1bppp\/4pn2\/3p4\/5P2\/1P1BP3\/PBPP2PP\/RN1QK1NR b KQkq - 3 5"},{"m":"b6","from":"b7","to":"b6","fen":"rnbqk2r\/p1p1bppp\/1p2pn2\/3p4\/5P2\/1P1BP3\/PBPP2PP\/RN1QK1NR w KQkq - 0 6"},{"m":"Nf3","from":"g1","to":"f3","fen":"rnbqk2r\/p1p1bppp\/1p2pn2\/3p4\/5P2\/1P1BPN2\/PBPP2PP\/RN1QK2R b KQkq - 1 6"},{"m":"Bb7","from":"c8","to":"b7","fen":"rn1qk2r\/pbp1bppp\/1p2pn2\/3p4\/5P2\/1P1BPN2\/PBPP2PP\/RN1QK2R w KQkq - 2 7"},{"m":"Nc3","from":"b1","to":"c3","fen":"rn1qk2r\/pbp1bppp\/1p2pn2\/3p4\/5P2\/1PNBPN2\/PBPP2PP\/R2QK2R b KQkq - 3 7"},{"m":"Nbd7","from":"b8","to":"d7","fen":"r2qk2r\/pbpnbppp\/1p2pn2\/3p4\/5P2\/1PNBPN2\/PBPP2PP\/R2QK2R w KQkq - 4 8"},{"m":"O-O","from":"e1","to":"g1","fen":"r2qk2r\/pbpnbppp\/1p2pn2\/3p4\/5P2\/1PNBPN2\/PBPP2PP\/R2Q1RK1 b kq - 5 8"},{"m":"O-O","from":"e8","to":"g8","fen":"r2q1rk1\/pbpnbppp\/1p2pn2\/3p4\/5P2\/1PNBPN2\/PBPP2PP\/R2Q1RK1 w - - 6 9"},{"m":"Ne2","from":"c3","to":"e2","fen":"r2q1rk1\/pbpnbppp\/1p2pn2\/3p4\/5P2\/1P1BPN2\/PBPPN1PP\/R2Q1RK1 b - - 7 9"},{"m":"c5","from":"c7","to":"c5","fen":"r2q1rk1\/pb1nbppp\/1p2pn2\/2pp4\/5P2\/1P1BPN2\/PBPPN1PP\/R2Q1RK1 w - c6 0 10"},{"m":"Ng3","from":"e2","to":"g3","fen":"r2q1rk1\/pb1nbppp\/1p2pn2\/2pp4\/5P2\/1P1BPNN1\/PBPP2PP\/R2Q1RK1 b - - 1 10"},{"m":"Qc7","from":"d8","to":"c7","fen":"r4rk1\/pbqnbppp\/1p2pn2\/2pp4\/5P2\/1P1BPNN1\/PBPP2PP\/R2Q1RK1 w - - 2 11"},{"m":"Ne5","from":"f3","to":"e5","fen":"r4rk1\/pbqnbppp\/1p2pn2\/2ppN3\/5P2\/1P1BP1N1\/PBPP2PP\/R2Q1RK1 b - - 3 11"},{"m":"Nxe5","from":"d7","to":"e5","fen":"r4rk1\/pbq1bppp\/1p2pn2\/2ppn3\/5P2\/1P1BP1N1\/PBPP2PP\/R2Q1RK1 w - - 0 12"},{"m":"Bxe5","from":"b2","to":"e5","fen":"r4rk1\/pbq1bppp\/1p2pn2\/2ppB3\/5P2\/1P1BP1N1\/P1PP2PP\/R2Q1RK1 b - - 0 12"},{"m":"Qc6","from":"c7","to":"c6","fen":"r4rk1\/pb2bppp\/1pq1pn2\/2ppB3\/5P2\/1P1BP1N1\/P1PP2PP\/R2Q1RK1 w - - 1 13"},{"m":"Qe2","from":"d1","to":"e2","fen":"r4rk1\/pb2bppp\/1pq1pn2\/2ppB3\/5P2\/1P1BP1N1\/P1PPQ1PP\/R4RK1 b - - 2 13"},{"m":"a6","from":"a7","to":"a6","fen":"r4rk1\/1b2bppp\/ppq1pn2\/2ppB3\/5P2\/1P1BP1N1\/P1PPQ1PP\/R4RK1 w - - 0 14"},{"m":"Nh5","from":"g3","to":"h5","fen":"r4rk1\/1b2bppp\/ppq1pn2\/2ppB2N\/5P2\/1P1BP3\/P1PPQ1PP\/R4RK1 b - - 1 14"},{"m":"Nxh5","from":"f6","to":"h5","fen":"r4rk1\/1b2bppp\/ppq1p3\/2ppB2n\/5P2\/1P1BP3\/P1PPQ1PP\/R4RK1 w - - 0 15"},{"m":"Bxh7+","from":"d3","to":"h7","fen":"r4rk1\/1b2bppB\/ppq1p3\/2ppB2n\/5P2\/1P2P3\/P1PPQ1PP\/R4RK1 b - - 0 15"},{"m":"Kxh7","from":"g8","to":"h7","fen":"r4r2\/1b2bppk\/ppq1p3\/2ppB2n\/5P2\/1P2P3\/P1PPQ1PP\/R4RK1 w - - 0 16"},{"m":"Qxh5+","from":"e2","to":"h5","fen":"r4r2\/1b2bppk\/ppq1p3\/2ppB2Q\/5P2\/1P2P3\/P1PP2PP\/R4RK1 b - - 0 16"},{"m":"Kg8","from":"h7","to":"g8","fen":"r4rk1\/1b2bpp1\/ppq1p3\/2ppB2Q\/5P2\/1P2P3\/P1PP2PP\/R4RK1 w - - 1 17"},{"m":"Bxg7","from":"e5","to":"g7","fen":"r4rk1\/1b2bpB1\/ppq1p3\/2pp3Q\/5P2\/1P2P3\/P1PP2PP\/R4RK1 b - - 0 17"},{"m":"Kxg7","from":"g8","to":"g7","fen":"r4r2\/1b2bpk1\/ppq1p3\/2pp3Q\/5P2\/1P2P3\/P1PP2PP\/R4RK1 w - - 0 18"},{"m":"Qg4+","from":"h5","to":"g4","fen":"r4r2\/1b2bpk1\/ppq1p3\/2pp4\/5PQ1\/1P2P3\/P1PP2PP\/R4RK1 b - - 1 18"},{"m":"Kh7","from":"g7","to":"h7","fen":"r4r2\/1b2bp1k\/ppq1p3\/2pp4\/5PQ1\/1P2P3\/P1PP2PP\/R4RK1 w - - 2 19"},{"m":"Rf3","from":"f1","to":"f3","fen":"r4r2\/1b2bp1k\/ppq1p3\/2pp4\/5PQ1\/1P2PR2\/P1PP2PP\/R5K1 b - - 3 19"},{"m":"e5","from":"e6","to":"e5","fen":"r4r2\/1b2bp1k\/ppq5\/2ppp3\/5PQ1\/1P2PR2\/P1PP2PP\/R5K1 w - - 0 20"},{"m":"Rh3+","from":"f3","to":"h3","fen":"r4r2\/1b2bp1k\/ppq5\/2ppp3\/5PQ1\/1P2P2R\/P1PP2PP\/R5K1 b - - 1 20"},{"m":"Qh6","from":"c6","to":"h6","fen":"r4r2\/1b2bp1k\/pp5q\/2ppp3\/5PQ1\/1P2P2R\/P1PP2PP\/R5K1 w - - 2 21"},{"m":"Rxh6+","from":"h3","to":"h6","fen":"r4r2\/1b2bp1k\/pp5R\/2ppp3\/5PQ1\/1P2P3\/P1PP2PP\/R5K1 b - - 0 21"},{"m":"Kxh6","from":"h7","to":"h6","fen":"r4r2\/1b2bp2\/pp5k\/2ppp3\/5PQ1\/1P2P3\/P1PP2PP\/R5K1 w - - 0 22"},{"m":"Qd7","from":"g4","to":"d7","fen":"r4r2\/1b1Qbp2\/pp5k\/2ppp3\/5P2\/1P2P3\/P1PP2PP\/R5K1 b - - 1 22"},{"m":"Bf6","from":"e7","to":"f6","fen":"r4r2\/1b1Q1p2\/pp3b1k\/2ppp3\/5P2\/1P2P3\/P1PP2PP\/R5K1 w - - 2 23"},{"m":"Qxb7","from":"d7","to":"b7","fen":"r4r2\/1Q3p2\/pp3b1k\/2ppp3\/5P2\/1P2P3\/P1PP2PP\/R5K1 b - - 0 23"},{"m":"Kg7","from":"h6","to":"g7","fen":"r4r2\/1Q3pk1\/pp3b2\/2ppp3\/5P2\/1P2P3\/P1PP2PP\/R5K1 w - - 1 24"},{"m":"Rf1","from":"a1","to":"f1","fen":"r4r2\/1Q3pk1\/pp3b2\/2ppp3\/5P2\/1P2P3\/P1PP2PP\/5RK1 b - - 2 24"},{"m":"Rab8","from":"a8","to":"b8","fen":"1r3r2\/1Q3pk1\/pp3b2\/2ppp3\/5P2\/1P2P3\/P1PP2PP\/5RK1 w - - 3 25"},{"m":"Qd7","from":"b7","to":"d7","fen":"1r3r2\/3Q1pk1\/pp3b2\/2ppp3\/5P2\/1P2P3\/P1PP2PP\/5RK1 b - - 4 25"},{"m":"Rfd8","from":"f8","to":"d8","fen":"1r1r4\/3Q1pk1\/pp3b2\/2ppp3\/5P2\/1P2P3\/P1PP2PP\/5RK1 w - - 5 26"},{"m":"Qg4+","from":"d7","to":"g4","fen":"1r1r4\/5pk1\/pp3b2\/2ppp3\/5PQ1\/1P2P3\/P1PP2PP\/5RK1 b - - 6 26"},{"m":"Kf8","from":"g7","to":"f8","fen":"1r1r1k2\/5p2\/pp3b2\/2ppp3\/5PQ1\/1P2P3\/P1PP2PP\/5RK1 w - - 7 27"},{"m":"fxe5","from":"f4","to":"e5","fen":"1r1r1k2\/5p2\/pp3b2\/2ppP3\/6Q1\/1P2P3\/P1PP2PP\/5RK1 b - - 0 27"},{"m":"Bg7","from":"f6","to":"g7","fen":"1r1r1k2\/5pb1\/pp6\/2ppP3\/6Q1\/1P2P3\/P1PP2PP\/5RK1 w - - 1 28"},{"m":"e6","from":"e5","to":"e6","fen":"1r1r1k2\/5pb1\/pp2P3\/2pp4\/6Q1\/1P2P3\/P1PP2PP\/5RK1 b - - 0 28"},{"m":"Rb7","from":"b8","to":"b7","fen":"3r1k2\/1r3pb1\/pp2P3\/2pp4\/6Q1\/1P2P3\/P1PP2PP\/5RK1 w - - 1 29"},{"m":"Qg6","from":"g4","to":"g6","fen":"3r1k2\/1r3pb1\/pp2P1Q1\/2pp4\/8\/1P2P3\/P1PP2PP\/5RK1 b - - 2 29"},{"m":"f6","from":"f7","to":"f6","fen":"3r1k2\/1r4b1\/pp2PpQ1\/2pp4\/8\/1P2P3\/P1PP2PP\/5RK1 w - - 0 30"},{"m":"Rxf6+","from":"f1","to":"f6","fen":"3r1k2\/1r4b1\/pp2PRQ1\/2pp4\/8\/1P2P3\/P1PP2PP\/6K1 b - - 0 30"},{"m":"Bxf6","from":"g7","to":"f6","fen":"3r1k2\/1r6\/pp2PbQ1\/2pp4\/8\/1P2P3\/P1PP2PP\/6K1 w - - 0 31"},{"m":"Qxf6+","from":"g6","to":"f6","fen":"3r1k2\/1r6\/pp2PQ2\/2pp4\/8\/1P2P3\/P1PP2PP\/6K1 b - - 0 31"},{"m":"Ke8","from":"f8","to":"e8","fen":"3rk3\/1r6\/pp2PQ2\/2pp4\/8\/1P2P3\/P1PP2PP\/6K1 w - - 1 32"},{"m":"Qh8+","from":"f6","to":"h8","fen":"3rk2Q\/1r6\/pp2P3\/2pp4\/8\/1P2P3\/P1PP2PP\/6K1 b - - 2 32"},{"m":"Ke7","from":"e8","to":"e7","fen":"3r3Q\/1r2k3\/pp2P3\/2pp4\/8\/1P2P3\/P1PP2PP\/6K1 w - - 3 33"},{"m":"Qg7+","from":"h8","to":"g7","fen":"3r4\/1r2k1Q1\/pp2P3\/2pp4\/8\/1P2P3\/P1PP2PP\/6K1 b - - 4 33"}]}';

}