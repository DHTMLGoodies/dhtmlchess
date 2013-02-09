<?php
/**
 * Class returning pgn files in a folder.
 * User: Alf Magne Kalleland
 * Date: 09.02.13
 * Time: 01:41
 */
class ChessFSPgn implements LudoDBService
{
    public function read(){
        $folder = ChessRegistry::getPgnFolder();
        if(!isset($folder)){
            throw new Exception("PGN folder not set using ChessRegistry::setPgnFolder");
        }
        $ret = array();
        if ($handle = opendir(ChessRegistry::getPgnFolder())) {
            while (false !== ($entry = readdir($handle))) {
                if($this->isPgnFile($entry)){
                    $ret[] = $this->getNameOfFile($entry);
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

    public static function getValidServices(){
        return array('read');
    }
    public function validateService($service, $arguments){
        return count($arguments) === 0;
    }

    public function cacheEnabled(){
        return false;
    }
}
