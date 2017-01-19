<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 18/01/2017
 * Time: 22:46
 */

error_reporting(E_ALL);
ini_set("display_errors", "on");


$to = "zip/dhtml-chess2.zip";

class Archiver
{

    private $destination = "zip/dhtml-chess.zip";
    private $pwd;
    private $dir;

    private $files = array(
        "../php",
        "../js",
        "../src",
        "../css",
        "../jquery",
        "../pgn",
        "../images",
        "../router.php",
        "../autoload.php"
    );

    public function __construct()
    {

        if(file_exists("zip/dhtml-chess.zip")){
            unlink("zip/dhtml-chess.zip");
        }
        $this->build();

    }



    private function build()
    {

        foreach ($this->files as $file) {

            $path = $this->relativePath($file);

            $path = str_replace("*", "", $path);
            $dest = " ../../wordpress/wp-content/plugins/dhtml_chess/";
            echo "cp -rf " . $file . $dest."<br>";
            exec("cp -rf " . $file . $dest);

            if(!file_exists($dest)){
                echo "FAILURE<br>";
            }
        }
        foreach ($this->files as $file) {

            $path = $this->relativePath($file);

            $this->setWorkingDirectory($file);


            $cmd = $this->getTarCommand($path);

            exec($cmd);
            echo $cmd . "<br>";

            $this->restoreWorkingDirectory();
        }
    }

    private function relativeZipPath()
    {
        echo $this->dir."<br>";
        if ($this->dir == "../"){
            return "wp-plugins/";
        }
        else return "../";
    }

    private function relativePath($file)
    {
        $tokens = explode("/", $file);
        array_shift($tokens);

        return implode("/", $tokens);
    }

    private function getTarCommand($fileToAdd)
    {
        return "tar -rf " . $this->relativeZipPath() . $this->destination . " dhtml_chess/" . $fileToAdd;
    }

    private function setWorkingDirectory($file)
    {
        if (strstr($file, "../")) {
            $this->dir = "../";
        } else {
            $this->dir = "dhtml-chess";
        }
        $this->pwd = getcwd();
        chdir($this->dir);
    }

    private function restoreWorkingDirectory()
    {
        chdir($this->pwd);
    }




}

new Archiver();