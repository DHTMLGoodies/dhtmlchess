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
            "title" => "Select a tag below to get preview and tag"
        ),

        array(
            "script" => "WPGame1",
            "title" => "One Game View - notations to the right",
            "type" => "g",
            "tag" => "G1"
        ),
        array(
            "script" => "WPGame2",
            "title" => "One Game view - notations below",
            "type" => "g",
            "tag" => "G2"
        ),
        array(
            "script" => "WPGame3",
            "title" => "One Game View - notations for current move below board.",
            "type" => "g",
            "desc" => "No notations, but with current move displayed below the board.",
            "tag" => "G3"
        ),
        array(
            "script" => "WPGame4",
            "title" => "Single Game Viewer 4",
            "type" => "g",
            "desc" => "No notations, but with current move displayed below the board.",
            "tag" => "G4"
        ),
        array(
            "script" => "WPGame5",
            "title" => "Single Game Viewer 5",
            "type" => "g",
            "desc" => "Notations panel to the right, nav buttons below the board",
            "tag" => "G5"
        ),
        array(
            "script" => "WPViewer1",
            "title" => "Database Viewer",
            "type" => "p",
            "desc" => "PGN/Database View with notations below the board",
            "tag" => "D1"
        ),
        array(
            "script" => "WPTactics1",
            "title" => "Tactic Trainer",
            "type" => "t",
            "desc" => "Tactics Trainer board",
            "tag" => "T1"
        ),
        array(
            "script" => "WPFen",
            "title" => "FEN View",
            "type" => "f",
            "desc" => "Display a FEN position",
            "tag" => "",
            "fixed_tag" => "[fen:&lt;fen>]",
            "fixed_tag_example" => "Replace &lt;fen> with your fen position.",
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


    public function getJS($docRoot)
    {
        $this->setParam('docRoot', $docRoot);
        $board = '<div id="' . $this->id . '" style=""></div>';
        $params = json_encode($this->params);
        $script = $this->getScript();

        $board .= '<script type="text/javascript"> $(document).ready(function(){new chess.'
            . $script
            . '('
            . $params . ')})</script>';
        return $board;

    }
 


}