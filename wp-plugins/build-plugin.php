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


class HZip
{
    /**
     * Add files and sub-directories in a folder to zip file.
     * @param string $folder
     * @param ZipArchive $zipFile
     * @param int $exclusiveLength Number of text to be exclusived from the file path.
     */
    private static function folderToZip($folder, &$zipFile, $exclusiveLength) {
        $handle = opendir($folder);
        while (false !== $f = readdir($handle)) {
            if ($f != '.' && $f != '..') {
                $filePath = "$folder/$f";
                // Remove prefix from file path before add to zip.
                $localPath = substr($filePath, $exclusiveLength);
                if (is_file($filePath)) {
                    $zipFile->addFile($filePath, $localPath);
                } elseif (is_dir($filePath)) {
                    // Add sub-directory.
                    $zipFile->addEmptyDir($localPath);
                    self::folderToZip($filePath, $zipFile, $exclusiveLength);
                }
            }
        }
        closedir($handle);
    }

    /**
     * Zip a folder (include itself).
     * Usage:
     *   HZip::zipDir('/path/to/sourceDir', '/path/to/out.zip');
     *
     * @param string $sourcePath Path of directory to be zip.
     * @param string $outZipPath Path of output zip file.
     */
    public static function zipDir($sourcePath, $outZipPath)
    {
        $pathInfo = pathInfo($sourcePath);
        $parentPath = $pathInfo['dirname'];
        $dirName = $pathInfo['basename'];

        $z = new ZipArchive();
        $z->open($outZipPath, ZIPARCHIVE::CREATE);
        $z->addEmptyDir($dirName);
        self::folderToZip($sourcePath, $z, strlen("$parentPath/"));
        $z->close();
    }
}


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


        chdir("dhtml_chess");
        HZip::zipDir(".", "../dhtml_chess.zip");
        exec("cp -f ../dhtml_chess.zip ../../../wp-testing/dhtml_chess.zip");


        chdir("../");
        exec("rm -rf dhtml_chess");
    }
}

new Archiver();