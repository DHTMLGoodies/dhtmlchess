<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 01/02/2017
 * Time: 22:56
 */
class DhtmlChessViews
{

    private static $views = array(
        array(
            "title" => "Select a shortcode"
        ),
	    array(
		    "script" => "WPFen",
		    "title" => "[fen] shortcode",
		    "type" => "fen",
		    "desc" => "Display a FEN position using on of the game templates",
		    "shortcode" => "fen",
		    "help" => "Insert fen string between the tags.",
		    'enclosing' => '&lt;fen string>',
		    'pro' => false
	    ),
	    array(
		    "script" => "WPFen",
		    "title" => "[pgn] short code",
		    "type" => "pgn",
		    "desc" => "PGN text template",
		    "shortcode" => "pgn",
		    "attributes" => array("tpl" => '&lt;game template>'),
		    "help" => "Insert pgn of one game between the tags. The <strong>tpl</strong> attribute can be used to choose a Game Template.<br><em>Tip! It's safest to enter this tag from the Text Mode of the WordPress Text editor</em>e",
		    'enclosing' => '&lt;pgn string>',
		    'pro' => false
	    ),
	    array(
		    "script" => "WPFen",
		    "title" => "[pgn] short code with tactics",
		    "type" => "pgn",
		    "desc" => "One game tactics board from [pgn] shortcode",
		    "shortcode" => "pgn",
		    "attributes" => array("tactics" => '1', "theme" => "&lt;optional theme>"),
		    "help" => "Insert pgn of one game between the tags. <br><em>Tip! It's safest to enter this tag from the Text Mode of the WordPress Text editor</em>e",
		    'enclosing' => '&lt;pgn string>',
		    'pro' => false
	    ),
        array(
            "script" => "WPGame1",
            "title" => "Game Template 1",
            "type" => "g",
            "shortcode" => "chess",
            "attributes" => array("tpl" => 1, "game" => '&lt;gameId>'),
            "help" => 'Replace the value inside the angle brackets with a game id found in the game editor.',
            'pro' => true
        ),
        array(
            "script" => "WPGame2",
            "title" => "Game Template 2",
            "type" => "g",
            "shortcode" => "chess",
            "attributes" => array("tpl" => 2, "game" => '&lt;gameId>'),
            "help" => 'Replace the value inside the angle brackets with a game id found in the game editor.',
            'pro' => true
        ),
        array(
            "script" => "WPGame3",
            "title" => "Game Template 3",
            "type" => "g",
            "shortcode" => "chess",
            "desc" => "No notations, but with current move displayed below the board.",
            "attributes" => array("tpl" => 3, "game" => '&lt;gameId>'),
            "help" => 'Replace the value inside the angle brackets with a game id found in the game editor.',
            'pro' => true
        ),
        array(
            "script" => "WPGame4",
            "title" => "Game Template 4",
            "type" => "g",
            "shortcode" => "chess",
            "desc" => "No notations, but with current move displayed below the board.",
            "attributes" => array("tpl" => 4, "game" => '&lt;gameId>'),
            "help" => 'Replace the value inside the angle brackets with a game id found in the game editor.',
            'pro' => true
        ),
        array(
            "script" => "WPGame5",
            "title" => "Game Template 5",
            "type" => "g",
            "shortcode" => "chess",
            "desc" => "Notations panel to the right, nav buttons below the board",
            "attributes" => array("tpl" => 5, "game" => '&lt;gameId>'),
            "help" => 'Replace the value inside the angle brackets with a game id found in the game editor.',
            'pro' => true
        ),
        array(
            "script" => "WPViewer1",
            "title" => "Database Template 1",
            "type" => "p",
            "shortcode" => "chess",
            "desc" => "PGN/Database View with notations below the board",
            "attributes" => array("tpl" => 1, "db" => '&lt;databaseId>'),
            "help" => 'Set db attribute to the id of a database id found in the editor, example [chess db="1" tpl="1"]',
            'pro' => true
        ),
        array(
            "script" => "WPViewer2",
            "title" => "Database Template 2 (With standings)",
            "type" => "tournament",
            "shortcode" => "chess",
            "desc" => "Tournament template",
            "attributes" => array("tpl" => 2, "db" => '&lt;databaseId>'),
            "help" => 'Set db attribute to the id of a database id found in the editor, example [chess db="1" tpl="2"]',
            'pro' => true
        ),        array(
        "script" => "WPViewer3",
            "title" => "Database Template 3",
            "type" => "tournament",
            "shortcode" => "chess",
            "desc" => "Tournament template",
            "attributes" => array("tpl" => 3, "db" => '&lt;databaseId>'),
            "help" => 'Set db attribute to the id of a database id found in the editor, example [chess db="1" tpl="3"]',
        'pro' => true
        ),
        array(
            "script" => "WPTactics1",
            "title" => "Tactic Template",
            "type" => "t",
            "desc" => "Tactics Trainer board",
            "shortcode" => "chess",
            "attributes" => array("tpl" => 1, "tactics" => true, "db" => '&lt;databaseId>'),
            "help" => 'Example: [chess tactics=true db="2" tpl="1"] to show games from database id 2.',
            'pro' => true
        ),
        array(
            "script" => "WPComp1",
            "title" => "Computer Play",
            "type" => "comp",
            "desc" => "For playing games against StockfishJS",
            "shortcode" => "chess",
            "attributes" => array("tpl" => 1, "comp" => true),
            "help" => 'Example: [chess comp=1 theme="wood7"] for computer play using one of the wooden themes.',
            'pro' => true
        ),

        array(
            "script" => "WPStandings1",
            "title" => "Standings Grid",
            "type" => "standings_grid",
            "desc" => "Displays standings grid for a database",
            "shortcode" => "chess",
            "attributes" => array("leaderboard" => 1, "tpl" => 1),
            "help" => 'Example: [chess leaderboard=1 tpl="1"]',
            'pro' => true
        ),
        array(
            "script" => "WPStandings2",
            "title" => "Standings Table",
            "type" => "standings_table",
            "desc" => "Displays standings for a database as a plain HTML table",
            "shortcode" => "chess",
            "attributes" => array("leaderboard" => 1, "tpl" => 2),
            "help" => 'Example: [chess leaderboard=1 tpl="2"]',
            'pro' => true
        ),


    );



    public static function countGameTemplates()
    {
        return 5;
    }

    public static function countDbTemplates()
    {
        return 2;
    }

    public static function getAllAttributes()
    {
        $themes = self::getThemeNames();
        $attributes = array(
            "theme" => array(
                "example" => 'theme="brown"',
                "desc" => "Override default theme. Possible values: " . implode(", ", $themes)
            ),
            "width" => array(
                "example" => 'width="60%"',
                "desc" => "Width of view. This attribute is NOT applied on mobile devices. Specify width in css to apply custom width on all devices."
            ),
            "float" => array(
                "example" => 'float="right"',
                "desc" => "Float left or right. This attribute is useful if you want text to float around the chess board. This attribute is NOT set for mobile devices. Use css if you want to apply float to all devices."
            ),
            "css" => array(
                "example" => 'css="border:1px solid #900;border-radius:5px"',
                "desc" => "Custom CSS string"
            ),
            "arrows" => array(
                "desc" => "Attribute for the FEN short code. A comma separated list of from and to squares. Custom colored arrows can be set after a semicolon, example: e2e4;#ff0000",
                "example" => 'arrows="e2e4;d2d4;#ff0000"'
            ),
            "highlight" => array(
                "desc" => "Attribute for the FEN short code. A comma separated list of highlighted squares. Default color is set with the css class dhtml-chess-highlight-square. You
                 can override this value in your theme's css",
                "example" =>'arrows="e2,e4;#ff0000;e5"'
            ),
            "sound" => array(
                "desc" => "Set to 1 to enable sound effects (default = 0)",
                "example" => '[chess game="100" sound=1]'
            ),
            "standings" => array(
                "desc" => "Used to render a standings grid or table for a database",
                "example" => '[chess standings="1" tpl="1"]'
            )

        );
        return $attributes;
    }

    public static function getAvailableTags()
    {
        return self::$views;
    }

    public function hasTags($content)
    {

        if (strstr($content, '[DC')) return true;


        $patterns = array('/\[fen:([0-9prnbqkw\/\s\-]+?)\]/si');

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $content)) return true;
        }

        return false;

    }

    public function getFenTag($tag)
    {
        $start = strpos($tag, ":") + 1;
        $len = strrpos($tag, "]") - $start;

        $fen = substr($tag, $start, $len);
        $ret = new DHTMLChessView();
        $ret->setTag($tag);
        $ret->setScript("WPFen");
        $ret->setParam("fen", $fen);
        return $ret;
    }

    public function standingsAsHTML($pgnId, $sofiaRules){
        $db = new DhtmlChessDatabase();
        $standings = $db->getStandingsSortedAsArray($pgnId, $sofiaRules);


        $ret = array('<table class="dhtml-chess-standings-table"');

        $ret[] = '>';
        $ret[] = "<tr><th>"._("Player"). "</th>";
        $ret[] = "<th>"._("w")."</th>";
        $ret[] = "<th>"._("d")."</th>";
        $ret[] = "<th>"._("l")."</th>";
        $ret[] = "<th>"._("score")."</th>";
        $ret[] = "</th>";

        foreach($standings as $entry){

            $ret[] = "<tr>";
            $ret[] = "<td>". $entry["player"]."</td>";
            $ret[] = "<td>". $entry["w"]."</td>";
            $ret[] = "<td>". $entry["d"]."</td>";
            $ret[] = "<td>". $entry["l"]."</td>";
            $ret[] = "<td>". $entry["s"]."</td>";


            $ret[] = "</tr>";
        }
        $ret[] = "</table>";
        return implode("", $ret);

    }

    private function sanitizePgn($pgn)
    {
        $pgn = html_entity_decode($pgn);
        $pgn = str_replace("<br />", "", $pgn);
        $pgn = preg_replace('/<\/?p>/si', "\n", $pgn);
        $pgn = strip_tags($pgn);
        $pgn = str_replace('”', '"', $pgn);
        $pgn = str_replace('“', '"', $pgn);
        return $pgn;
    }

    public function getParsedTagFromAttributes($tag, $attributes = array(), $content = null)
    {
        $view = new DHTMLChessView();


        $tpl = isset($attributes["tpl"]) ? $attributes["tpl"] : 1;


        if($tag == "chess" && isset($attributes["leaderboard"]) && !empty($attributes["db"])){

            if($attributes["tpl"] == 1){
                $view->setScript("WPStandings1");
            }

        }
        elseif ($tag == "pgn") {
            $content = $this->sanitizePgn($content);
            $gameParser = new PgnParser();
            $gameParser->setPgnContent(html_entity_decode($content));
            $json = $gameParser->getGameByIndex(0);
            $view->setParam("model", $json);
            if (isset($attributes["tactics"])) {
                $view->setScript("WPTacticsGame1");
            } else {
                $tpl = min($tpl, 5);
                $view->setScript("WPGame" . $tpl);

            }
        } else if ($tag == "fen") {
            $view->setScript("WPFen");
            $view->setParam("fen", $content);
        } else {
            if (isset($attributes['pinned'])) {
                $view->setScript("WPPinned");
            } elseif (isset($attributes["comp"])) {
                $view->setScript("WPComp1");
            } elseif (isset($attributes["game"])) {
                $tpl = min($tpl, 5);
                $view->setScript("WPGame" . $tpl);
            } elseif (isset($attributes["tactics"])) {
                $view->setScript("WPTactics1");
            } elseif (isset($attributes["pgn"]) || isset($attributes["db"])) {
                $tpl = min($tpl, 3);
                $view->setScript("WPViewer" . $tpl);
            }
        }

        foreach ($attributes as $key => $val) {
            $attr = $this->getValidParam($key, $val);

            if (!empty($attr)) {
                $view->setParam($attr["key"], $attr["val"]);
            }
        }

        return $view;
    }

    private function getValidParam($key, $val)
    {

        switch ($key) {

            case "tpl":
                return null;
            case "comp":
                return null;
            case "game":
                return array("key" => "gameId", "val" => $val);
            case "db":
            case "pgn":

                $pgn = DhtmlChessPgn::instanceById($val);

                $val = array(
                    "id" => $pgn->getId(),
                    "name" => $pgn->getName()
                );
                return array("key" => "pgn", "val" => $val);

                break;
            default:
                return array("key" => $key, "val" => $val);
        }

    }

    /*
    public function getParsedTag($tag)
    {

        $ret = new DHTMLChessView();
        $ret->setTag($tag);
        $tag = preg_replace('/[\]\[]/s', '', $tag);
        $tokens = explode(";", $tag);

        if (count($tokens) < 2) {
            throw new DhtmlChessException("Invalid Tag");
        }

        $id = $tokens[2];

        $id = preg_replace("/[^0-9]/s", "", $id);

        if (empty($id)) {
            throw new DhtmlChessException("Missing id");
        }

        $type = substr($tokens[1], 0, 1);
        $templateId = substr($tokens[1], 1, 1);

        switch (strtoupper($type)) {
            case 'G':
                $ret->setScript('WPGame' . $templateId);
                $ret->setParam("gameId", $id);
                break;
            case 'T':
                $ret->setScript('WPTactics' . $templateId);
                $ret->setDatabaseId($id);
                break;
            case 'D':
                $ret->setScript('WPViewer' . $templateId);
                $ret->setDatabaseId($id);
                break;
        }

        for ($i = 3, $len = count($tokens); $i < $len; $i++) {
            $t = $tokens[$i];
            if (strstr($t, "=")) {
                $parts = explode("=", $t);
                $ret->setParam($parts[0], $parts[1]);
            }
        }

        return $ret;
    }

    */

    public static function getThemes()
    {

        return array(
            array('brown', 'Brown'),
            array('grey', 'Grey'),
            array('blue', 'Blue'),
            array('light-grey', 'Light Grey'),
            array('green', 'Green'),
            array('wood1', 'Wood 1'),
            array('wood2', 'Wood 2'),
            array('wood3', 'Wood 3'),
            array('wood4', 'Wood 4'),
            array('wood5', 'Wood 5'),
            array('wood6', 'Wood 6'),
            array('wood7', 'Wood 7'),
            array('wood8', 'Wood 8'),
        );
    }

    public static function getThemeNames()
    {
        $themes = self::getThemes();
        $ret = array();
        foreach ($themes as $i => $theme) {
            $ret[] = $theme[0];
        }
        return $ret;
    }

}


class DHTMLChessView
{

    private $script;
    private $params;
    private $tag;
    private $valid = true;
    private $id;

    public function __construct()
    {
        $this->id = uniqid("dhtml_chess");

        $this->setParam("renderTo", '#' . $this->id);
    }

    public function setTag($tag)
    {
        $this->tag = $tag;
    }

    public function getTag()
    {
        return $this->tag;

    }

    public function isValid()
    {
        return $this->valid;
    }

    public function setInvalid()
    {
        $this->valid = false;
    }

    public function setParam($key, $val)
    {
        if (empty($this->params)) $this->params = array();
        $this->params[$key] = $val;
    }

    public function getParams()
    {
        return empty($this->params) ? array() : $this->params;
    }

    public function getParam($key)
    {
        return $this->params[$key];
    }

    public function setDatabaseId($id)
    {

        $pgn = DhtmlChessPgn::instanceById($id);

        $this->setParam("pgn", array(
            "id" => $pgn->getId(),
            "name" => $pgn->getName()
        ));
    }

    public function setScript($script)
    {
        $this->script = $script;
    }

    public function getScript()
    {
        return $this->script;
    }


    public function getJS($docRoot, $url = "null")
    {
        if (!$this->isValid()) return "";

        $this->setParam('docRoot', $docRoot);
        $board = '<div id="' . $this->id . '" style=""></div>';
        $params = json_encode($this->params);
        $script = $this->getScript();

        $board .= '<script type="text/javascript"> jQuery(document).ready(function(){new chess.'
            . $script
            . '('
            . $params . ')})</script>';
        return $board;

    }


}