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

        $ret .= '</ul></nav><div class="wp-clearfix"></div>';

        return $ret;

    }

    private function categoryLink($link)
    {

        return '<li><a href="#" onclick="toggleCategory(\'' . $link . '\');return false">' . $link . '</a></li>';

    }

    public function categoryHtml($category)
    {

        $fields = $this->theme->categoryFields($category);
        $fields = $this->populatedFields($fields);

        $html = "<div class='wpc-category-content' id='category-" . $category . "' style='display:none'><table>";

        foreach ($fields as $field) {
            $html .= $this->fieldHtml($field);
        }

        $html .= "</table></div>";
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
                $html .= $this->piecesHtml($field);
                break;
            default:
                return "";

        }
        $html .= "</td></tr>";

        return $html;
    }

    private function colorHtml($field)
    {
        $n = $field["name"];
        $html = '<input class="wpc-color-picker" type="text" value="' . $field["val"] . '" id="' . $n . '" name="' . $n . '">';

        if (!$this->colorScriptAdded) {
            $this->colorScriptAdded = true;
            $html .= "<script type='text/javascript'>jQuery(document).ready(function($){
            $('.wpc-color-picker').wpColorPicker();
        });</script>";
        }

        return $html;
    }

    private function textHtml($field)
    {
        return '<input type="text" size="' . $field["size"] . '"  maxlength="' . $field["maxlen"] . '" value="' . $field["val"] . '" id="' . $field["name"] . '" name="' . $field["name"] . '">';

    }

    private function numericHtml($field)
    {
        return '<input type="text" size="' . $field["size"] . '"  maxlength="' . $field["maxlen"] . '" value="' . $field["val"] . '" id="' . $field["name"] . '" name="' . $field["name"] . '">';

    }

    private function imageHtml($field)
    {

        $options = $field["opt"];

        $html = "<table>";

        $html .= "<tr>";

        $root = plugins_url($this->plugin_name . "/api/", $this->plugin_name);

        foreach ($options as $option) {
            $img = $this->replaceDOCROOT($option);
            $html .= '<td><div style="border-radius:5px;border:3px solid;border-color:transparent;width:50px;height:50px;overflow:hidden;background:url(' . $img . ') no-repeat center center;"></div></td>';
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


    private function piecesHtml($field)
    {
        $html = "<table>";

        $html .= "<tr>";

        $root = plugins_url($this->plugin_name . "/api/", $this->plugin_name);

        $pieces = DhtmlChessViews::pieces();

        foreach ($pieces as $piece) {
            $extension = substr($piece, 0, 3) == "svg" ? "svg" : "png";
            $img = $root . "images/" . $piece . "45wk." . $extension;
            $html .= '<td><div style="border-radius:5px;border:3px solid;border-color:transparent;width:50px;height:50px;overflow:hidden;background: url(' . $img . ') no-repeat center center"></div></td>';
        }
        $html .= "</tr>";
        $html .= "</table>";
        return $html;
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

    public function initJSThemeBuilder()
    {

        echo '<script type="text/javascript">
            var visibleCat;
            function toggleCategory(name){
                if(visibleCat){
                    visibleCat.hide();
                }
                var el = jQuery("#category-" + name);
                el.show();
                visibleCat = el;
            }
            var themeBuilder;
            jQuery(document).ready(function(){
                themeBuilder = new chess.ThemeBuilder('. json_encode($this->json()) . ');
                toggleCategory("' . DhtmlChessTheme::CATEGORY_BOARD . '");
        
            });
            </script>';
    }
}