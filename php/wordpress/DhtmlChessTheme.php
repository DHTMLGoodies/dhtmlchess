<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 17/04/2017
 * Time: 12:48
 */
class DhtmlChessTheme
{


    const CATEGORY_BOARD = "Board";
    const CATEGORY_LABELS = "Labels";
    const CATEGORY_BORDER = "Border";
    const CATEGORY_NOTATIONS = "Notations";
    const CATEGORY_ARROWS = "Arrows";
    const CATEGORY_BUTTONS = "Buttons";

    /**
     * @var array
     */
    private $fields;


    private static $bgPath = "[DOCROOT]images/board-bg/";
    private static $piecePath = "[DOCROOT]images/";
    private static $squareBg = "[DOCROOT]images/board/";
    private static $imgNone = "[DOCROOT]images/none.png";


    private static $squareBgs;

    public function __construct()
    {
        self::$squareBgs = array(
            self::$imgNone,
            self::$squareBg . "lightest-wood.png",
            self::$squareBg . "lighter-wood.png",
            self::$squareBg . "light-wood.png",
            self::$squareBg . "light-wood2.png",
            self::$squareBg . "light-grey-wood.png",
            self::$squareBg . "wood-1.png",
            self::$squareBg . "wood4.png",
            self::$squareBg . "wood5.png",
            self::$squareBg . "wood6.png",
            self::$squareBg . "wood7.png",
            self::$squareBg . "wood8.png",
            self::$squareBg . "wood-2.png",
            self::$squareBg . "dark-wood.png",
            self::$squareBg . "dark-wood-2.png",
            self::$squareBg . "grey-wood.png",
            self::$squareBg . "wood-bamboo.png",
            self::$squareBg . "wood-cherry.png",
            self::$squareBg . "darker-wood.png",
            self::$squareBg . "red-wood2.png",
            self::$squareBg . "light-blue-wood-2.png",
            self::$squareBg . "dark-blue-wood-2.png",
        );
    }

    public function categoryFields($category)
    {
        $fields = $this->getFields();
        $ret = array();
        foreach ($fields as $field) {
            if ($field["c"] == $category) {
                $ret[] = $field;
            }
        }
        return $ret;
    }

    public function fieldByIndex($index)
    {
        $fields = $this->getFields();
        return $fields[$index];
    }

    public function getFields()
    {
        if (empty($this->fields)) {
            $fields = $this->borderFields();
            $fields = array_merge($fields, $this->boardFields());
            $fields = array_merge($fields, $this->labelFields());
            $fields = array_merge($fields, $this->arrowFields());
            $fields = array_merge($fields, $this->notationFields());
            $fields = array_merge($fields, $this->buttonFields());
            $this->fields = $fields;
            $this->setNames();
        }
        return $this->fields;
    }

    private function setNames()
    {

        foreach ($this->fields as &$field) {
            $field["name"] = $field["p"] . "/" . $field["f"];
            if (isset($field["arr"])) {
                for ($i = 0, $len = count($field["arr"]); $i < $len; $i++) {
                    $field["arr"][$i] = $field["p"] . "/" . $field["arr"][$i];
                }
            }
        }
    }

    private function notationFields()
    {


        $fields = array(
            array(
                "p" => $this->notationPath(),
                "f" => "figurines",
                "t" => "pcssvg",
                "label" => "Figurines"
            )
        );

        return $this->applyCat($fields, self::CATEGORY_NOTATIONS);
    }

    private function borderFields()
    {

        $fields = array(
            array(
                "p" => $this->bp() . "/background",
                "f" => "borderRadius",
                "t" => "n",
                "regex" => '/^[0-9]{1,2}$/',
                "size" => 4,
                "maxlen" => 3,
                "def" => 1,
                "defm" => 0,
                "suffix" => "",
                "label" => __('Border radius', "wordpresschess")
            ),
            array(
                "p" => $this->bp(),
                "f" => "padding",
                "t" => "n",
                "regex" => '/^[0-9\.]{1,3}%?$/',
                "size" => 5,
                "maxlen" => 4,
                "def" => 1,
                "defm" => 0,
                "suffix" => " of board size",
                "label" => __('Border size', "wordpresschess")
            ),
            array(
                "p" => $this->bp() . "/background",
                "f" => "horizontal",
                "t" => "img",
                "regex" => null,
                "opt" => array(
                    self::$imgNone,
                    self::$bgPath . "wood-strip-horizontal.png",
                    self::$bgPath . "wood-strip2-horizontal.png",
                    self::$bgPath . "wood-strip3-horizontal.png",
                    self::$bgPath . "wood-strip5-horizontal.png",
                    self::$bgPath . "wood-strip6-horizontal.png",
                    self::$bgPath . "wood-strip-dark-horizontal.png",
                    self::$bgPath . "grey-wood-strip-horizontal.png",
                    self::$bgPath . "red-wood-strip-horizontal.png",
                ),
                "alternative" => array("from" => "horizontal", "to" => "vertical"),
                "size" => 3,
                "maxlen" => 2,
                "def" => 0,
                "defm" => 0,
                "suffix" => "",
                "label" => __('Border pattern', "wordpresschess")
            ),
            array(
                "p" => $this->bp() . "/background/paint",
                "f" => "fill",
                "t" => "clr",
                "regex" => null,
                "size" => 10,
                "maxlen" => 7,
                "def" => .8,
                "suffix" => "#RRGGBB",
                "label" => __('Background color', "wordpresschess")
            ),
            array(
                "p" => $this->bp(),
                "f" => "innerBorderWidth",
                "t" => "n",
                "regex" => "''",
                "size" => 3,
                "maxlen" => 2,
                "def" => 1,
                "css" => ".dhtml-chess-board",
                "cssType" => "px",
                "cssKey" => "border-width",
                "suffix" => "px",
                "label" => __('Thin border width around board', "wordpresschess")
            ),
            array(
                "p" => $this->bp(),
                "f" => "innerBorderColor",
                "t" => "clr",
                "regex" => null,
                "size" => 10,
                "maxlen" => 7,
                "css" => ".dhtml-chess-board",
                "cssType" => "clr",
                "cssKey" => "border-color",
                "def" => "#FFFFFF",
                "suffix" => "#RRGGBB",
                "label" => __('Thin border color', "wordpresschess")
            ),

        );

        return $this->applyCat($fields, self::CATEGORY_BORDER);
    }

    public function fieldByName($name)
    {
        $fields = $this->getFields();
        foreach ($fields as $field) {
            if ($field["name"] == $name) return $field;
        }
        return null;
    }


    private function labelFields()
    {
        $fields = array(
            array(
                "p" => $this->bp(),
                "f" => "labelPos",
                "t" => "radio",
                "opt" => array(
                    array("val" => "inside", "txt" => __('Inside', "wordpresschess")),
                    array("val" => "outside", "txt" => __('Border', "wordpresschess"))
                ),
                "regex" => null,
                "size" => 4,
                "maxlen" => 3,
                "def" => .8,
                "suffix" => "",
                "label" => __('Label pos', "wordpresschess")
            ),
            array(
                "p" => $this->bp() . "/labelStyles",
                "f" => "color",
                "t" => "clr",
                "regex" => null,
                "size" => 10,
                "maxlen" => 7,
                "def" => .8,
                "suffix" => "",
                "label" => __('Label color(B,D,F,H)', "wordpresschess")
            )


        );

        return $this->applyCat($fields, self::CATEGORY_LABELS);
    }

    private function arrowFields()
    {
        $fields = array(
            array(
                "p" => $this->bp() . "/plugins/0/styles",
                "f" => "fill",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 7,
                "def" => 1,
                "suffix" => "",
                "label" => __('Arrow fill color', "wordpresschess")
            ),
            array(
                "p" => $this->bp() . "/plugins/0/styles",
                "f" => "fill-opacity",
                "t" => "t",
                "regex" => '/^#[0-9]?\.[0-9]$/',
                "size" => 4,
                "maxlen" => 3,
                "def" => .5,
                "suffix" => "0 = transparent, 1 = opaque",
                "label" => __('Arrow fill opacity(0-1)', "wordpresschess")
            ),
            array(
                "p" => $this->bp() . "/plugins/0/styles",
                "f" => "stroke",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 7,
                "def" => 1,
                "suffix" => "",
                "label" => __('Arrow stroke color', "wordpresschess")
            ),
            array(
                "p" => $this->bp() . "/plugins/0/styles",
                "f" => "stroke-width",
                "t" => "n",
                "regex" => '/^[0-9]{1,2}$/',
                "size" => 3,
                "maxlen" => 2,
                "def" => 1,
                "suffix" => "px",
                "label" => __('Arrow stroke width', "wordpresschess")
            ),
            array(
                "p" => $this->bp() . "/plugins/0/styles",
                "f" => "stroke-opacity",
                "t" => "t",
                "regex" => '/^#[0-9]?\.[0-9]$/',
                "size" => 4,
                "maxlen" => 3,
                "def" => .8,
                "suffix" => "0 = transparent, 1 = opaque",
                "label" => __('Arrow stroke opacity(0-1)', "wordpresschess")
            ),

        );

        return $this->applyCat($fields, self::CATEGORY_ARROWS);

    }

    /**
     *         borderRadius:'10%',
     * styles:{
     * button:{
     * fill:'#6e3f31',
     * stroke:'#6e3f31'
     * },
     * image:{
     * fill:'#e8bfa0'
     * },
     * buttonOver:{
     * fill:'#6e483c',
     * stroke:'#6e3f31'
     * },
     * imageOver:{
     * fill:'#e8bfa0'
     * },
     * buttonDown:{
     * fill:'#8c6445',
     * stroke:'#6e3f31'
     * },
     * imageDown:{
     * fill:'#e8bfa0'
     * },
     * buttonDisabled:{
     * fill:'#d5c8c5',
     * stroke : '#b38578',
     * 'stroke-opacity' : 0.3
     * // , 'fill-opacity': 0.3
     * },
     * imageDisabled:{
     * fill:'#6e483c',
     * 'fill-opacity' : 0.3
     * }
     * }
     *
     */

    private function buttonFields()
    {
        // chess.view.buttonbar.Bar
        $fields = array(
            array(
                "p" => $this->buttonPath(),
                "f" => "borderRadius",
                "t" => "t",
                "size" => 5,
                "def" => "10%",
                "maxlen" => 5,
                "label" => __('Border Radius', "wordpresschess")
            ),
            array(
                "p" => $this->buttonPath() . "/styles",
                "f" => "button/fill-opacity",
                "arr" => array("button/fill-opacity", "button/stroke-opacity", "buttonOver/fill-opacity", "buttonOver/stroke-opacity", "buttonDown/fill-opacity", "buttonDown/stroke-opacity", "buttonDisabled/fill-opacity", "buttonDisabled/stroke-opacity"),
                "t" => "n",
                "def" => 1,
                "regex" => '/^#[0-9]?\.?[0-9]$/',
                "size" => 10,
                "maxlen" => 9,
                "label" => __('Button Background Opacity 0-1', "wordpresschess")
            ),
            array(
                "p" => $this->buttonPath() . "/styles/image",
                "f" => "fill",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 9,
                "label" => __('Button Color', "wordpresschess")
            ),
            array(
                "p" => $this->buttonPath() . "/styles/button",
                "f" => "fill",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "2ndcol" => true,
                "maxlen" => 9,
                "label" => __('BG fill', "wordpresschess")
            ),
            array(
                "p" => $this->buttonPath() . "/styles/button",
                "f" => "stroke",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 9,
                "2ndcol" => true,
                "label" => __('BG Stroke', "wordpresschess")
            ),
            array(
                "p" => $this->buttonPath() . "/styles/imageOver",
                "f" => "fill",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 9,
                "label" => __('Button (mouseover)', "wordpresschess")
            ),
            array(
                "p" => $this->buttonPath() . "/styles/buttonOver",
                "f" => "fill",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 9,
                "2ndcol" => true,
                "label" => __('BG fill', "wordpresschess")
            ),
            array(
                "p" => $this->buttonPath() . "/styles/buttonOver",
                "f" => "stroke",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 9,
                "2ndcol" => true,
                "label" => __('BG stroke', "wordpresschess")
            ),
            /// MOUSE DOWN
            ///
            array(
                "p" => $this->buttonPath() . "/styles/imageDown",
                "f" => "fill",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 9,

                "label" => __('Button (mouse down)', "wordpresschess")
            ),
            array(
                "p" => $this->buttonPath() . "/styles/buttonDown",
                "f" => "fill",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 9,
                "2ndcol" => true,
                "label" => __('BG Fill', "wordpresschess")
            ),
            array(
                "p" => $this->buttonPath() . "/styles/buttonDown",
                "f" => "stroke",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 9,
                "2ndcol" => true,
                "label" => __('BG Stroke', "wordpresschess")
            ),

            // DISABLED

            array(
                "p" => $this->buttonPath() . "/styles/imageDisabled",
                "f" => "fill",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 9,

                "label" => __('Button (Disabled)', "wordpresschess")
            ),
            array(
                "p" => $this->buttonPath() . "/styles/buttonDisabled",
                "f" => "fill",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "2ndcol" => true,
                "maxlen" => 9,
                "label" => __('BG Fill', "wordpresschess")
            ),
            array(
                "p" => $this->buttonPath() . "/styles/buttonDisabled",
                "f" => "stroke",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 9,
                "2ndcol" => true,
                "label" => __('BG Stroke', "wordpresschess")
            ),
            // PLAY BUTTON

            array(
                "p" => $this->buttonPath() . "/styles/imagePlay",
                "f" => "fill",
                "t" => "clr",
                "regex" => '/^#[0-9]{1}$/',
                "def" => 1,
                "size" => 10,
                "maxlen" => 7,

                "label" => __('Play Button Color(Active)', "wordpresschess")
            ),
            array(
                "p" => $this->buttonPath() . "/styles/buttonPlay",
                "f" => "fill",
                "t" => "clr",
                "def" => "#388E3C",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 9,
                "2ndcol" => true,
                "label" => __('BG Fill', "wordpresschess")
            ),
            array(
                "p" => $this->buttonPath() . "/styles/buttonPlay",
                "f" => "stroke",
                "def" => "#C8E6C9",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 9,
                "2ndcol" => true,
                "label" => __('BG stroke', "wordpresschess")
            ),
            array(
                "p" => $this->buttonPath() . "/styles/imageComp",
                "f" => "fill",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 9,
                "def" => "#669900",
                "label" => __('Comp Button Color (Active)', "wordpresschess")
            ),
            /*
             *           overlay: {
                'fill-opacity': 0,
                'fill': '#000'
            }
             */
            array(
                "p" => $this->buttonPath() . "/styles/overlay",
                "f" => "fill-opacity",
                "def" => 0,
                "t" => "n",
                "regex" => '/^#[0-9]?\.?[0-9]$/',
                "size" => 10,
                "maxlen" => 9,
                "label" => __('Bevel - opacity 0-1', "wordpresschess")
            ),
            array(
                "p" => $this->buttonPath() . "/styles/overlay",
                "f" => "fill",
                "t" => "clr",
                "def" => "#cccccc",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 9,
                "2ndcol" => true,
                "label" => __('Bevel color', "wordpresschess")
            ),


        );

        return $this->applyCat($fields, self::CATEGORY_BUTTONS);

    }

    private function boardFields()
    {
        $fields = array(
            array(
                "p" => $this->bp(),
                "f" => "pieceLayout",
                "t" => "pcs",
                "label" => "Pieces"
            ),
            array(
                "p" => $this->bp(),
                "f" => "bgColorWhite",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 7,
                "def" => 1,
                "suffix" => __("Will not be shown if background image is set", "wordpresschess"),
                "css" => ".dhtml-chess-square-white",
                "cssKey" => "background-color",
                "cssType" => "color",
                "label" => __('BG Color white', "wordpresschess")
            ),
            array(
                "p" => $this->bp(),
                "f" => "bgColorBlack",
                "t" => "clr",
                "regex" => '/^#[0-9A-Z]{6}$/',
                "size" => 10,
                "maxlen" => 7,
                "def" => 1,
                "suffix" => "#RRGGBB",
                "css" => ".dhtml-chess-square-black",
                "cssType" => "color",
                "cssKey" => "background-color",
                "label" => __('BG Color black', "wordpresschess")
            ),
            array(
                "p" => $this->bp(),
                "f" => "bgWhite",
                "t" => "img",
                "regex" => null,
                "opt" => self::$squareBgs,
                "size" => 3,
                "maxlen" => 2,
                "def" => 0,
                "defm" => 0,
                "suffix" => "%",
                "cssType" => "image",
                "css" => ".dhtml-chess-square-white",
                "cssKey" => "background-image",
                "label" => __('White Squares bg Image', "wordpresschess")
            ),
            array(
                "p" => $this->bp(),
                "f" => "bgBlack",
                "t" => "img",
                "regex" => null,
                "opt" => self::$squareBgs,
                "size" => 3,
                "maxlen" => 2,
                "def" => 0,
                "defm" => 0,
                "css" => ".dhtml-chess-square-black",
                "cssType" => "image",
                "cssKey" => "background-image",
                "suffix" => "%",
                "label" => __('Black Squares Image', "wordpresschess")
            ),


        );

        return $this->applyCat($fields, self::CATEGORY_BOARD);
    }

    private function applyCat($array, $cat)
    {
        foreach ($array as &$entry) {
            $entry["c"] = $cat;
            if ($entry["t"] === "clr") {
                $entry["regex"] = '/^#([0-9A-Z]{6}|[0-9A-Z]{3})$/';
            }
        }
        for ($i = 0, $len = count($array) - 1; $i < $len; $i++) {
            if (!empty($array[$i + 1]["2ndcol"])) {
                $array[$i]["noEndTr"] = true;
            }
        }
        return $array;
    }

    private function buttonPath()
    {
        return "chess.view.buttonbar.Bar";
    }

    private function bp()
    {
        return "chess.view.board.Board";
    }

    private function notationPath()
    {
        return "chess.view.notation.Panel";
    }


}

