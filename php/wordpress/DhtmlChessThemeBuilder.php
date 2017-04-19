<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 17/04/2017
 * Time: 14:22
 */
class DhtmlChessThemeBuilder
{

    private static $tpl = '{
    "name": "custom",
    "borderColor":"#aaa",
    "css": {

    },
    "chess.view.board.Board": {
        "pieceLayout":"svg_bw",
        "labelPos":"outside",
        "bgColorWhite": "#ffffff",
        "bgColorBlack": "#aaaaaa",
        "padding" : "3.5%",
        "labelEvenStyles" : {
            "color": "#fff",
            "font-weight": "normal"
        },
        "labelOddStyles": {
            "color": "#fff",
            "font-weight": "normal"
        },
        "background":{
            "borderRadius":"1%",
            "horizontal":"[DOCROOT]images/board-bg/wood-strip-horizontal.png",
            "vertical":"[DOCROOT]images/board-bg/wood-strip-vertical.png",
            "iePaint":{
                "fill": "#6b2d1a"
            },
            "paint": {
                "fill" : ""
            }
        },
        "bgWhite": "[DOCROOT]images/board/lighter-wood.png",
        "bgBlack": "[DOCROOT]images/board/darker-wood.png",
        "plugins": [
            {
                "type": "chess.view.highlight.Arrow",
                "styles":{
                    "fill": "#039BE5",
                    "stroke":"#0D47A1",
                    "stroke-width" : 1,
                    "stroke-opacity" : 0.8,
                    "fill-opacity" : 0.5
                }
            },
            {
                "type": "chess.view.highlight.ArrowTactic",
                "styles":{
                    "fill": "#039BE5",
                    "stroke":"#0D47A1"
                }
            },
            {
                "type": "chess.view.highlight.SquareTacticHint"
            }
        ]
    },
    "chess.view.dialog.PuzzleSolved": {
    },
    "chess.view.notation.TacticPanel": {
        "css": {
            "text-align": "center",
            "color": "#444"
        }
    },
    "chess.view.notation.Panel": {
        "figurines":"svg_egg"
    },
    "chess.view.notation.Table": {
        "figurines":"svg_egg"
    },
    "chess.view.notation.LastMove": {
        "figurines":"svg_egg"
    },
    "chess.view.buttonbar.Bar":{
        "borderRadius":"10%",
        "styles":{
            "button":{
                "fill":"#6e3f31",
                "stroke":"#6e3f31"
            },
            "image":{
                "fill":"#e8bfa0"
            },
            "buttonOver":{
                "fill":"#6e483c",
                "stroke":"#6e3f31"
            },
            "imageOver":{
                "fill":"#e8bfa0"
            },
            "buttonDown":{
                "fill":"#8c6445",
                "stroke":"#6e3f31"
            },
            "imageDown":{
                "fill":"#e8bfa0"
            },
            "buttonDisabled":{
                "fill":"#d5c8c5",
                "stroke" : "#b38578",
                "stroke-opacity" : 0.3
            },
            "imageDisabled":{
                "fill":"#6e483c",
                "fill-opacity" : 0.3
            }
        }
    }
}';


    /**
     * @var array
     */
    private $json;

    private $theme;

    private $colorScriptAdded = false;

    private $plugin_name;

    private $themeName = "custom";


    public function __construct($plugin_name)
    {
        $this->plugin_name = $plugin_name;
        $this->theme = new DhtmlChessTheme();
        $this->json = json_decode(self::$tpl, true);
    }


    public function set($path, $val)
    {
        $item = &$this->arrayPath($path);
        $key = $this->getKey($path);
        if (isset($item) && isset($item[$key])) {
            $item[$key] = $val;
        }
    }

    private function getKey($path)
    {
        $tokens = explode("/", $path);
        return array_pop($tokens);
    }

    private function &arrayPath($path)
    {

        $tokens = explode("/", $path);
        array_pop($tokens);

        $path = &$this->json;

        foreach ($tokens as $item) {
            if (!isset($path[$item])) {
                return null;
            }
            $path = &$path[$item];
        }

        return $path;
    }

    public function get($path)
    {
        $tokens = explode("/", $path);
        $key = array_pop($tokens);
        $path = $this->arrayPath($path);
        return isset($path[$key]) ? $path[$key] : null;
    }

    public function json()
    {
        return $this->json;
    }

    public function cssArray()
    {
        $fields = $this->allFields();
        $ret = array();
        foreach ($fields as $field) {
            if (isset($field["css"])) {
                $key = $field["css"];
                if (!isset($ret[$key])) {
                    $ret[$key] = array();
                }
                $ret[$key][$field["cssKey"]] = $field["val"];
            }
        }
        return $ret;
    }

    private function populatedFields($fields)
    {
        for ($i = 0, $len = count($fields); $i < $len; $i++) {
            $val = $this->get($fields[$i]["name"]);
            $fields[$i]["val"] = "";
            if (!empty($val)) {
                $fields[$i]["val"] = $val;
            }
        }
        return $fields;
    }

    public function allFields()
    {
        $fields = $this->theme->getFields();
        return $this->populatedFields($fields);
    }


    public function categoryHeader()
    {
        $ret = '<nav class="wpc-theme-nav"><ul>';

        $ret .= $this->categoryLink(DhtmlChessTheme::CATEGORY_BOARD);
        $ret .= $this->categoryLink(DhtmlChessTheme::CATEGORY_BORDER);
        $ret .= $this->categoryLink(DhtmlChessTheme::CATEGORY_LABELS);
        $ret .= $this->categoryLink(DhtmlChessTheme::CATEGORY_ARROWS);
        $ret .= $this->categoryLink(DhtmlChessTheme::CATEGORY_NOTATIONS);

        $ret .= '</ul></nav><div class="wp-clearfix"></div>';

        return $ret;

    }

    private function categoryLink($link)
    {

        return '<li><a href="#" id="category-header-' . $link . '" onclick="toggleCategory(\'' . $link . '\');return false">' . $link . '</a></li>';

    }

    public function categoryHtml($category)
    {


        if (!defined("WORDPRESSCHESS_LANG_DOMAIN")) define("WORDPRESSCHESS_LANG_DOMAIN", "wordpresschess");

        $fields = $this->theme->categoryFields($category);
        $fields = $this->populatedFields($fields);

        $html = "<div class='wpc-category-content' id='category-" . $category . "' style='display:none'>";

        $html .= '<fieldset class="dhtml-chess-admin-fieldset"><legend>' . __($category, WORDPRESSCHESS_LANG_DOMAIN) . '</legend>';

        $html .= "<table>";

        foreach ($fields as $field) {
            $html .= $this->fieldHtml($field);
        }

        $html .= "</table></fieldset></div>";
        return $html;


    }

    public function fieldHtml($field)
    {

        $html = "<tr><td><label for='" . $field["name"] . "'>" . $field["label"] . ":</label></td><td>";
        switch ($field["t"]) {

            case "n":
                $html .= $this->numericHtml($field);
                break;
            case "clr":
                $html .= $this->colorHtml($field);
                break;
            case "t":
                $html .= $this->textHtml($field);
                break;
            case "img":
                $html .= $this->imageHtml($field);
                break;
            case "pcs":
                $html .= $this->piecesHtml($field, false);
                break;
            case "pcssvg":
                $html .= $this->piecesHtml($field, true);
                break;
            case "radio":
                $html .= $this->radioHtml($field);
                break;
            default:
                return "";

        }
        $html .= "</td></tr>";

        return $html;
    }

    private function dataOptions($field)
    {
        $ret = "";
        if (isset($field["css"])) {
            $ret = ' data-cls="' . $field["css"] . '" data-css-key="' . $field["cssKey"] . '"';
        }
        if (isset($field["alternative"])) {
            $ret .= ' data-alternative=\'' . json_encode($field["alternative"]) . '\'';
        }
        return $ret;
    }

    private function radioHtml($field)
    {

        $n = $field["name"];
        $options = $field["opt"];
        $val = $field["val"];

        $html = "<table><tr>";

        $ind = 0;
        foreach ($options as $option) {
            $id = $n . (++$ind);

            $checked = $option["val"] == $val ? " checked" : "";

            $html .= '<td><input ' . $this->dataOptions($field) . ' type="radio" onchange="if(this.checked)themeBuilder.set(this.name, this.value)" value="'
                . $option["val"] . '" id="'
                . $id . '" name="' . $n . '"' . $checked . '>';

            $html .= '</td><td><label for="' . $id . '">' . $option["txt"] . "</label></td>";
        }


        $html .= "</tr></table>";

        return $html;
    }

    private function colorHtml($field)
    {

        $n = $field["name"];
        $html = '<input' . $this->dataOptions($field) . ' class="wpc-color-picker wpc-theme-input" data-name="' . $field["name"] . '" data-value="' . $field["val"] . '" type="text" value="' . $field["val"] . '" id="' . $n . '" name="' . $n . '">';
        if (isset($field["suffix"])) {
            $html .= $field["suffix"];
        }
        return $html;
    }

    private function textHtml($field)
    {
        $ret = '<input class="wpc-theme-input" type="text"' . $this->dataOptions($field) . ' data-name="' . $field["name"] . '" data-value="' . $field["val"] . '" onchange="themeBuilder.set(this.name, this.value)" size="' . $field["size"] . '"  maxlength="' . $field["maxlen"] . '" value="' . $field["val"] . '" id="' . $field["name"] . '" name="' . $field["name"] . '">';

        if (isset($field["suffix"])) {
            $ret .= $field["suffix"];
        }
        return $ret;
    }

    private function numericHtml($field)
    {
        $ret = '<input' . $this->dataOptions($field) . ' class="wpc-theme-input" data-name="' . $field["name"] . '" data-value="' . $field["val"] . '" type="text" size="' . $field["size"] . '"  maxlength="' . $field["maxlen"] . '" value="' . $field["val"] . '" id="' . $field["name"] . '" name="' . $field["name"] . '">';
        if (isset($field["suffix"])) {
            $ret .= $field["suffix"];
        }
        return $ret;
    }

    private function imageHtml($field)
    {

        $options = $field["opt"];

        $html = "<table>";

        $html .= "<tr>";

        foreach ($options as $option) {
            $img = $this->replaceDOCROOT($option);
            $html .= '<td>' . $this->imageRadioDiv($img, $option, $field) . '</td>';
        }

        $html .= "</tr>";


        $html .= "</table>";

        return $html;
    }

    private function replaceDOCROOT($img)
    {
        if (!function_exists("plugins_url")) {
            return $img;
        }
        $root = plugins_url($this->plugin_name . "/api/", $this->plugin_name);
        return str_replace("[DOCROOT]", $root, $img);;
    }


    private function piecesHtml($field, $onlySvg = false)
    {
        $html = "<table>";

        $html .= "<tr>";

        $root = plugins_url($this->plugin_name . "/api/", $this->plugin_name);

        $pieces = DhtmlChessViews::pieces();

        foreach ($pieces as $piece) {
            $extension = substr($piece, 0, 3) == "svg" ? "svg" : "png";
            if ($onlySvg && $extension != "svg") {

            } else {
                $img = $root . "images/" . $piece . "45wk." . $extension;
                $html .= '<td>' . $this->imageRadioDiv($img, $piece, $field) . '</td>';

            }
        }
        $html .= "</tr>";
        $html .= "</table>";
        return $html;
    }

    private function imageRadioDiv($img, $val, $field)
    {
        $id = $field["name"] . "_" . $val;
        $cls = $val == $field["val"] ? " wpc-image-radio-selected" : "";

        return '<div' . $this->dataOptions($field) . ' data-name="' . $field["name"] . '" data-value="' . $val . '" class="wpc-image-radio' . $cls . '" id="' . $id . '" style="border-radius:5px;border:3px solid;border-color:transparent;width:50px;height:50px;overflow:hidden;background: url(' . $img . ') no-repeat center center"></div>';

    }

    public function css()
    {
        $fields = $this->allFields();

        $css = array();
        foreach ($fields as $field) {
            if (isset($field["css"])) {
                $css[] = $this->fieldCss($field);
            }
        }

        return implode("\n", $css);
    }

    private function fieldCss($field)
    {

        $key = $field["css"];

        $ret = array();
        $val = $field["val"];

        $sel = $field["cssKey"];
        switch ($field["cssType"]) {
            case "image":

                $val = $this->replaceDOCROOT($val);
                $ret[$sel] = "url(" . $val . ")";
                break;
            case "color":
                $val = empty($val) ? "transparent" : $val;
                $ret[$sel] = $val;
                break;
            default:
                echo $field["val"];
                $ret[$sel] = $field["val"];
        }

        $css = "$key{";

        foreach ($ret as $key => $val) {

            $css .= $key . ":" . $val . ";";
        }
        $css .= "}\n";
        return $css;

    }
}