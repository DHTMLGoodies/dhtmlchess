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
            "script" => "WPGame1",
            "title" => "Game Template 1",
            "type" => "g",
            "shortcode" => "chess",
            "attributes" => array("tpl" => 1, "game" => '&lt;gameId>'),
            "help" => 'Replace the value inside the angle brackets with a game id found in the game editor.'
        ),
        array(
            "script" => "WPGame2",
            "title" => "Game Template 2",
            "type" => "g",
            "shortcode" => "chess",
            "attributes" => array("tpl" => 2, "game" => '&lt;gameId>'),
            "help" => 'Replace the value inside the angle brackets with a game id found in the game editor.'
        ),
        array(
            "script" => "WPGame3",
            "title" => "Game Template 3",
            "type" => "g",
            "shortcode" => "chess",
            "desc" => "No notations, but with current move displayed below the board.",
            "attributes" => array("tpl" => 3, "game" => '&lt;gameId>'),
            "help" => 'Replace the value inside the angle brackets with a game id found in the game editor.'
        ),
        array(
            "script" => "WPGame4",
            "title" => "Game Template 4",
            "type" => "g",
            "shortcode" => "chess",
            "desc" => "No notations, but with current move displayed below the board.",
            "attributes" => array("tpl" => 4, "game" => '&lt;gameId>'),
            "help" => 'Replace the value inside the angle brackets with a game id found in the game editor.'
        ),
        array(
            "script" => "WPGame5",
            "title" => "Game Template 5",
            "type" => "g",
            "shortcode" => "chess",
            "desc" => "Notations panel to the right, nav buttons below the board",
            "attributes" => array("tpl" => 5, "game" => '&lt;gameId>'),
            "help" => 'Replace the value inside the angle brackets with a game id found in the game editor.'
        ),
        array(
            "script" => "WPViewer1",
            "title" => "Database Template 1",
            "type" => "p",
            "shortcode" => "chess",
            "desc" => "PGN/Database View with notations below the board",
            "attributes" => array("tpl" => 1, "db" => '&lt;databaseId>'),
            "help" => 'Set db attribute to the id of a database id found in the editor, example [chess db="1" tpl="1"]'
        ),
        array(
            "script" => "WPViewer2",
            "title" => "Database Template 2",
            "type" => "tournament",
            "shortcode" => "chess",
            "desc" => "Tournament template",
            "attributes" => array("tpl" => 1, "db" => '&lt;databaseId>'),
            "help" => 'Set db attribute to the id of a database id found in the editor, example [chess db="1" tpl="1"]'
        ),
        array(
            "script" => "WPTactics1",
            "title" => "Tactic Template",
            "type" => "t",
            "desc" => "Tactics Trainer board",
            "shortcode" => "chess",
            "attributes" => array("tpl" => 1, "tactics" => true , "db" => '&lt;databaseId>'),
            "help" => 'Example: [chess tactics=true db="2" tpl="1"] to show games from database id 2.'
        ),
        array(
            "script" => "WPComp1",
            "title" => "Computer Play",
            "type" => "comp",
            "desc" => "For playing games against StockfishJS",
            "shortcode" => "chess",
            "attributes" => array("tpl" => 1, "comp" => true),
            "help" => 'Example: [chess comp=1 theme="wood7"] for computer play using one of the wooden themes.'
        ),
        array(
            "script" => "WPFen",
            "title" => "FEN position",
            "type" => "fen",
            "desc" => "Display a FEN position using on of the game templates",
            "shortcode" => "fen",
            "help" => "Insert fen string between the tags.",
            'enclosing' => '&lt;fen string>'
        ),
        array(
            "script" => "WPFen",
            "title" => "PGN View",
            "type" => "pgn",
            "desc" => "PGN text template",
            "shortcode" => "pgn",
            "attributes" => array("tpl" => '&lt;game template>'),
            "help" => "Insert pgn of one game between the tags. The <strong>tpl</strong> attribute can be used to choose a Game Template.<br><em>Tip! It's safest to enter this tag from the Text Mode of the WordPress Text editor</em>e",
            'enclosing' => '&lt;pgn string>'
        )
    );

    public static function getAvailableTags()
    {
        return self::$views;
    }
    
    public function hasTags($content){

        if(strstr($content, '[DC'))return true;


        $patterns = array('/\[fen:([0-9prnbqkw\/\s\-]+?)\]/si');

        foreach($patterns as $pattern){
            if(preg_match($pattern,$content ))return true;
        }

        return false;
        
    }

    public function getTags($content)
    {
        $ret = array();

        if(strstr($content, "[fen")){
            $tokens = preg_split('/(\[fen:[^\]]+?\])/si', $content, -1
                , PREG_SPLIT_DELIM_CAPTURE);

            foreach($tokens as $token){
                if(strstr($token, "[fen")){
                    $ret[] = $this->getFenTag($token);
                }
            }
        }

        $tokens = preg_split('/(\[DC.+?\])/si', $content, -1, PREG_SPLIT_DELIM_CAPTURE);
        foreach ($tokens as $token) {

            if (strstr($token, "[DC")) {
                try {
                    $tag = $this->getParsedTag($token);
                    $ret[] = $tag;
                } catch (DhtmlChessException $e) {
                    $obj = new DHTMLChessView();
                    $obj->setTag($token);
                    $obj->setInvalid();
                }
            }

        }

        return $ret;

    }

    public function getFenTag($tag){
        $start = strpos($tag, ":")+1;
        $len = strrpos($tag, "]") - $start;

        $fen = substr($tag, $start, $len);
        $ret = new DHTMLChessView();
        $ret->setTag($tag);
        $ret->setScript("WPFen");
        $ret->setParam("fen", $fen);
        return $ret;

    }

    private function sanitizePgn($pgn){
        $pgn = html_entity_decode($pgn);
        $pgn = str_replace("<br />", "", $pgn);
        $pgn = preg_replace('/<\/?p>/si', "\n", $pgn);
        $pgn = strip_tags($pgn);
        $pgn = str_replace('”', '"', $pgn);
        $pgn = str_replace('“', '"', $pgn);
        return $pgn;
    }

    public function getParsedTagFromAttributes($tag, $attributes = array(), $content = null){
        $view = new DHTMLChessView();

        $tpl = isset($attributes["tpl"]) ? $attributes["tpl"] : 1;

        if($tag == "pgn"){
            $content = $this->sanitizePgn($content);

            $gameParser = new PgnParser();
            $gameParser->setPgnContent(html_entity_decode($content));
            $json = $gameParser->getGameByIndex(0);
            $view->setParam("model", $json);
            $view->setScript("WPGame" . $tpl);
        }
        else if($tag == "fen"){
            $view->setScript("WPFen");
            $view->setParam("fen", $content);
        }else{
            if(isset($attributes["comp"])){
                $view->setScript("WPComp1");
            }
            else if(isset($attributes["game"])){
                $view->setScript("WPGame" . $tpl);
            }
            else if(isset($attributes["tactics"])){
                $view->setScript("WPTactics" . $tpl);
            }
            else if(isset($attributes["pgn"]) || isset($attributes["db"])){
                $view->setScript("WPViewer" . $tpl);
            }
        }

        foreach($attributes as $key=>$val){
            $attr = $this->getValidParam($key, $val);

            if(!empty($attr)){
                $view->setParam($attr["key"], $attr["val"]);
            }
        }

        return $view;
    }

    private function getValidParam($key, $val){

        switch($key){

            case "tpl": return null;
            case "comp": return null;
            case "game": return array("key" => "gameId", "val" => $val);
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
                return array("key" => $key, "val" =>$val);
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

    public static function getThemes(){

        return array(
            array('brown', 'Brown'),
            array('grey', 'Grey'),
            array('blue', 'Blue'),
            array('wood1', 'Brown Wood 1'),
            array('wood2', 'Dark Red Wood'),
            array('wood3', 'Wood 3'),
            array('wood4', 'Light Brown Wood'),
            array('wood5', 'Wood 5'),
            array('wood6', 'Grey Wood'),
            array('wood7', 'Wood 7'),

        );
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
    
    public function getParam($key){
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
        if(!$this->isValid())return "";

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