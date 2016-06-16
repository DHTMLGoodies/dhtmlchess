<?php
/**
 * Created by JetBrains PhpStorm.
 * User: xait0020
 * Date: 07.02.13
 * Time: 22:13
 */

date_default_timezone_set("Europe/Berlin");

require_once(__DIR__."/../autoload.php");
ini_set('display_errors','on');

class FS_GameTest extends FS_TestBase
{
    /**
     * @test
     */
    public function shouldGetJSONForAGame(){
        // given
        $chessFS = new ChessFS("pgn/chessfs.pgn");

        // when
        $game = $chessFS->getGame(1, true);

        // then
        $this->assertEquals("1-0", $game['result']);
    }


    /**
     * @test
     */
    public function shouldStoreGameInCache(){
        // given
        $chessFS = new ChessFS("pgn/chessfs.pgn");

        // when
        $chessFS->getGame(1);
        $filePath = "chessfs_pgn_1.chess.cache";
        // then
        $this->assertFileExists(ChessRegistry::getCacheFolder().$filePath);

    }

    /**
     * @test
     */
    public function shouldBeAbleToGetGameList(){
        // given
        $chessFS = new ChessFS("pgn/chessfs.pgn");

        // when
        $games = $chessFS->listOfGames();

        // then
        $this->assertEquals(25, count($games));
    }

    /**
     * @test
     */
    public function shouldBeAbleToSetFolderForPgnFiles(){
        // given
        ChessRegistry::setPgnFolder('pgn');
        $chessFS = new ChessFS("chessfs.pgn");

        // when
        $game = $chessFS->getGame(1, true);

        // then
        $this->assertEquals("1-0", $game['result']);

    }

    /**
     * @test
     */
    public function shouldApplyPgnExtensionWhenNotSet(){
        // given
        ChessRegistry::setPgnFolder('pgn');
        $chessFS = new ChessFS("chessfs");

        // when
        $game = $chessFS->getGame(1, true);

        // then
        $this->assertEquals("1-0", $game['result']);
    }

    /**
     * @test
     */
    public function shouldReturnNameOfPgnFilesInFolder(){
        // given
        ChessRegistry::setPgnFolder('pgn');

        $obj = new ChessFSPgn();
        $games = $obj->read();

        $this->assertEquals(3, count($games));
        $this->assertEquals('chessfs', $games[0]);
        $this->assertEquals('Lasker', $games[1]);
        $this->assertEquals('Morphy', $games[2]);
    }
}
