<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 28/01/2017
 * Time: 14:06
 */

require_once("../../YUICompressor.php");
error_reporting(E_ALL);
ini_set('display_errors', 'on');
date_default_timezone_set("Europe/Berlin");


Minify_YUICompressor::$jarFile = '../../minify/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar';
Minify_YUICompressor::$tempDir = "/tmp";

function parseDirectory($dirs, $filename, $subDir = false)
{

    if(file_exists($filename)){
        unlink($filename);
    }
    if(!is_array($dirs))$dirs = array($dirs);
    $js = "";
    foreach($dirs as $dir){

        if(is_dir($dir)){
            if ($handle = opendir($dir)) {
                /* This is the correct way to loop over the directory. */
                while (false !== ($entry = readdir($handle))) {

                    if(strstr($entry, ".js") && !strstr($entry, ".json")  && !strstr($entry, $filename)){
                        $js .= file_get_contents($dir . $entry) . "\n";
                    }

                    if(preg_match('/[a-z]/', $entry) && is_dir($dir . $entry)){
                        $js .= parseDirectory($dir . $entry. "/", $filename, true);

                    }

                }

                closedir($handle);
            }

        }else{
            $js .= file_get_contents($dir) . "\n";
        }

    }


    
    if($subDir){
        return $js;
    }

    $minifiedJs = Minify_YUICompressor::minifyJs(trim($js));

    if(empty($minifiedJs)){
        throw new Exception("Minified js is empty");
    }

    $copyright= '/*
 * Copyright ©[DATE]. dhtmlchess.com. All Rights Reserved.
 * This is a commercial software. See dhtmlchess.com for licensing options.
 *
 * You are free to use/try this software for 30 days without paying any fees.
 *
 * IN NO EVENT SHALL DHTML CHESS BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL,
 * OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND
 * ITS DOCUMENTATION, EVEN IF DHTML CHESS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * DHTML CHESS SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 * THE SOFTWARE AND ACCOMPANYING DOCUMENTATION, IF ANY, PROVIDED HEREUNDER IS PROVIDED "AS IS".
 * DHTML CHESS HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 *
 */
 ';

    $copyright = str_replace("[DATE]", date("Y"), $copyright);
    
    $minifiedJs = $copyright . $minifiedJs;

    $prefix = "// (C) dhtmlchess.com, Alf Kalleland " . date("Y-m-d H:i:s") . "\n";
    file_put_contents($filename, $prefix . $minifiedJs);

    echo filesize($filename)."<br>";
}


parseDirectory(array('../wordpress/'), "../wordpress/wordpress-editor-minified.js");
parseDirectory(array(
    'wp-template.js',
    'game/game-template.js',
    'game/game1.js',
    'game/game2.js',
    'game/game3.js',
    'game/game4.js',
    'game/game5.js',
    'pgn/viewer1.js',
    'pgn/viewer2.js',
    'game-grid.js',
    'tactics/tactics1.js',
    'fen/wp-fen.js',
    '../computer/computer-play.js',
    '../controller/play-stockfish-controller.js',
    'computer/comp1.js',
    ), "wordpress-templates-minified.js");
