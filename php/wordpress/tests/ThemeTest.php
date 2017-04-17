<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 17/04/2017
 * Time: 12:51
 */

require_once(__DIR__ . "/../../../autoload.php");


function __($word, $lan){
    return $word;
}

class ThemeTest extends PHPUnit_Framework_TestCase
{


    /**
     * @test
     */
    public function shouldBuildFieldArray(){
        // given
        $theme = new DhtmlChessTheme();

        $fields = $theme->getFields();

        // then
        $this->assertCount(13, $fields);

    }

    /**
     * @test
     */
    public function shouldGetFieldByName(){

        // given
        $theme = new DhtmlChessTheme();

        // when
        $field = $theme->fieldByName("chess.view.board.Board/background/borderRadius");

        // then
        $this->assertNotNull($field);
    }


    /**
     * @test
     */
    public function shouldBeAbleToBuildTheme(){
        // given
        $builder = new DhtmlChessThemeBuilder("wordpresschess");
        $builder->set("chess.view.board.Board/bgWhite", "#ff0000");

        // when
        $val = $builder->get("chess.view.board.Board/bgWhite");

        // then
        $this->assertEquals("#ff0000", $val);
    }

    /**
     * @test
     */
    public function shouldHandleNumeric(){
        $builder = new DhtmlChessThemeBuilder("wordpresschess");
        $builder->set("chess.view.board.Board/plugins/0/styles/fill", "#ff0000");

        $json = $builder->json();

        $this->assertEquals("#ff0000", $json["chess.view.board.Board"]["plugins"][0]["styles"]["fill"]);

    }

    /**
     * @test
     */
    public function shouldGetCss(){
        $builder = new DhtmlChessThemeBuilder("wordpresschess");

        // when
        $css = $builder->css();

        // then
        $this->assertNotEmpty($css);
        $this->assertContains(".dhtml-chess-square-black", $css);
        $this->assertContains("background-image", $css);
        $this->assertContains("background-color", $css);

    }

}