<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 18/01/2017
 * Time: 22:46
 */

error_reporting(E_ALL);
ini_set("display_errors", "on");


$to = "zip/wp-dhtml-chess.zip";

class Archiver
{

    private $destination = "zip/dhtml-chess.zip";
    private $pwd;
    private $dir;

    private $files = array(
       /* "../js" => "dhtml_chess/api/",
        "../demo" => "dhtml_chess/api/",
        "../php" => "dhtml_chess/api/",
        "../images" => "dhtml_chess/api/",
        "../css" => "dhtml_chess/api/",
        "../pgn" => "dhtml_chess/api/",
        "../autoload.php" => "dhtml_chess/api/",
        "../router.php" => "dhtml_chess/api/",
        "../garbochess" => "dhtml_chess/api/",
        "../garbochess-engine" => "dhtml_chess/api/", */
        "../../wordpress/wp-content/plugins/dhtml_chess/*" => "dhtml_chess"
    );

    public function __construct()
    {
        $this->build();
    }
    
    private function build()
    {

        echo getcwd()."<br>";
        if(file_exists("dhtml_chess.zip"))unlink("dhtml_chess.zip");
        exec("rm -rf dhtml_chess");
        exec("mkdir dhtml_chess");
       # exec("mkdir dhtml_chess/api");


        foreach($this->files as $source=>$destination){
            $cmd = "cp -r ". $source . " ". $destination;

            echo $cmd."<br>";
            echo exec($cmd);

        }
        exec("tar -rf dhtml_chess.zip dhtml_chess");
        exec("rm -rf dhtml_chess");
    }
}

new Archiver();