<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 15/04/2017
 * Time: 19:43
 */

require_once(__DIR__ . "/../../../autoload.php");


class GameBuilderTest extends PHPUnit_Framework_TestCase
{

    /**
     * @var DhtmlChessGameBuilder builder
     */
    private $builder;



    private $existingGame = array(
        "metadata" => array(
            "white" => "alfmagne",
            "black" => "katrine",
            "fen" => 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            "result" => "*"
        ),
        "moves" => array(
            array(
                "m" => "e4",
                "from" => "e2",
                "to" => "e4",
                "fen" => 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1'
            ),           array(

            "m" => "d5",
                "from" => "e2",
                "to" => "e4",
                "fen" => 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2'
            ),

        )

    );

    protected function setUp()
    {
        $this->builder = new DhtmlChessGameBuilder();
    }

    /**
     * @test
     */
    public function shouldBeAbleToCreateNewGame(){
        $this->assertEquals('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', $this->builder->getMetadata("fen"));
    }

    /**
     * @test
     */
    public function shouldBeAbleToSetMetadata(){
        // given
        $this->builder->setMetadata("white", "alfmagne");
        $this->builder->setMetadata("black", "katrine");

        // then
        $this->assertEquals("alfmagne", $this->builder->getMetadata("white"));
        $this->assertEquals("katrine", $this->builder->getMetadata("black"));
    }

    /**
     * @test
     */
    public function shouldBeAbleToAddMove(){
        // given
        $this->builder->setMetadata("white", "alfmagne");
        $this->builder->setMetadata("black", "katrine");

        // when
        $this->builder->addMove("e2","e4");
        $this->builder->addMove("d7","d5");

        // then
        $moves = $this->builder->getMoves();
        $this->assertCount(2, $moves);

        $firstMove = $moves[0];
        $this->assertEquals("e2", $firstMove["from"]);
        $this->assertEquals("e4", $firstMove["to"]);
        $this->assertEquals("e4", $firstMove["m"]);
        $this->assertEquals('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', $firstMove["fen"]);

        $secondMove = $moves[1];
        $this->assertEquals("d7", $secondMove["from"]);
        $this->assertEquals("d5", $secondMove["to"]);
        $this->assertEquals("d5", $secondMove["m"]);
        $this->assertEquals('rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2', $secondMove["fen"]);


    }

    /**
     * @test
     */
    public function shouldBeAbleToPopulateFromString(){
        // given
        $this->builder->setMetadata("white", "alfmagne");
        $this->builder->setMetadata("black", "katrine");

        // when
        $this->builder->addMove("e2","e4");
        $this->builder->addMove("d7","d5");

        $gameString = $this->builder->__toString();

        $builder = new DhtmlChessGameBuilder($gameString);

        $moves = $builder->getMoves();
        $this->assertCount(2, $moves);

        $firstMove = $moves[0];
        $this->assertEquals("e2", $firstMove["from"]);
        $this->assertEquals("e4", $firstMove["to"]);
        $this->assertEquals("e4", $firstMove["m"]);
        $this->assertEquals('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', $firstMove["fen"]);

        $secondMove = $moves[1];
        $this->assertEquals("d7", $secondMove["from"]);
        $this->assertEquals("d5", $secondMove["to"]);
        $this->assertEquals("d5", $secondMove["m"]);
        $this->assertEquals('rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2', $secondMove["fen"]);
    }

    /**
     * @test
     */
    public function shouldFindCheckmateResult(){

        $this->builder->addMove("f2", "f3");
        $this->builder->addMove("e7","e5");
        $this->builder->addMove("g2","g4");
        $this->builder->addMove("d8","h4");

        // then
        $this->assertEquals(DhtmlChessDatabase::KEY_BLACK_WIN, $this->builder->getResult());
    }

    /**
     * @test
     */
    public function shouldGracefullyHandleInvalidMoves(){
        // given
        $this->builder->addMove("e2","e8");
        // when
        $moves = $this->builder->getMoves();
        // then
        $this->assertCount(0, $moves);

        // when
        $this->builder->addMove("e2","e4");

        $moves = $this->builder->getMoves();
        // then
        $this->assertCount(1, $moves);
    }


}