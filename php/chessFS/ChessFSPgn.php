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
        $ret = array();
        $id = 1;
        if ($handle = opendir(ChessRegistry::getPgnFolder())) {
            while (false !== ($entry = readdir($handle))) {
                if($this->isPgnFile($entry)){
                    $ret[] = array(
                        "file" => $this->getNameOfFile($entry),
                        "id" => $id++
                    );
                }
            }
            closedir($handle);
        }
        return $ret;
    }

    private function isPgnFile($file){
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


    public function cacheEnabledFor($service){
        return false;
    }
}
