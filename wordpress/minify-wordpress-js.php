<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 28/01/2017
 * Time: 14:06
 */

require_once("../YUICompressor.php");
error_reporting(E_ALL);
ini_set('display_errors', 'on');
date_default_timezone_set("Europe/Berlin");


Minify_YUICompressor::$jarFile = '../minify/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar';
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

    $prefix = "// (C) dhtmlchess.com, Alf Kalleland " . date("Y-m-d H:i:s") . "\n";
    file_put_contents($filename, $prefix . $minifiedJs);

    echo filesize($filename)."<br>";
}

parseDirectory(array('../src/wordpress/'), "../src/wordpress/wordpress-editor-minified.js");
parseDirectory(array('wp-template.js', 'game/game-template.js', './'), "wordpress-templates-minified.js");
