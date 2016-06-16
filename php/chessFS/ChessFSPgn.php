<?php
/**
 * Class returning pgn files in a folder.
 * User: Alf Magne Kalleland
 * Date: 09.02.13
 * Time: 01:41
 */
class ChessFSPgn implements LudoDBService
{
    public function __construct(){

    }
    public function read(){
        $folder = ChessRegistry::getPgnFolder();
        if(!isset($folder)){
            throw new Exception("PGN folder not set using ChessRegistry::setPgnFolder");
        }
        $files = self::getPgnFilesIn($folder);

        $ret = array();
        $id = 1;
        foreach($files as $file){
            $ret[] = array(
                "file" => $this->getNameOfFile($file),
                "id" => $id++
            );
        }
        return $ret;
    }

    public static function getPgnFilesIn($folder){
        $ret = array();
        if ($handle = opendir($folder)) {
            while (false !== ($entry = readdir($handle))) {
                if(self::isPgnFile($entry)){
                    $ret[] = $entry;
                }
            }
            closedir($handle);
        }
        return $ret;
    }

    private static function isPgnFile($file){
        $tokens = explode(".", $file);
        return strtolower($tokens[count($tokens)-1]) === 'pgn';
    }

    private function getNameOfFile($pgnFile){
        $tokens = explode(".", $pgnFile);
        return $tokens[0];
    }

    public function getValidServices(){
        return array('read');
    }
    public function validateArguments($service, $arguments){
        if(count($arguments) > 0){
            throw new LudoDBException("No arguments accepted by ChessFSPgn, given: ". implode(",", $arguments));
        }
        return count($arguments) === 0;
    }

    public function validateServiceData($service, $data){
        return true;
    }


    public function shouldCache($service){
        return false;
    }

    public function getOnSuccessMessageFor($service){
        return "";
    }
}


