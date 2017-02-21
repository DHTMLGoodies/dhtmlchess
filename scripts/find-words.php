<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 05/02/2017
 * Time: 14:15
 */

class Words{
    
    private $words;
    
    public function __construct(){
        $this->words = array();
    }
    
    public function addWord($word){
        if(!isset($this->words[$word])){
            $this->words[$word] = 1;
        }
    }

    public function getWords(){
        $words = array_keys($this->words);
        sort($words);
        return $words;
    }
}

/**
 * @param $file
 * @param Words $words
 */
function parseFile($file, $words){
    $data = file_get_contents($file);

    $matches = array();
    preg_match_all('/chess.getPhrase\([\'"]([^\'"]+?)[\'"]/si', $data, $matches, PREG_SET_ORDER);

    foreach($matches as $match){
        $words->addWord($match[1]);
    }


}

function findWords($folder, $words){
    if(is_file($folder)){

        parseFile($folder, $words);
        return;
    }

    $handle = opendir($folder);
    while (false !== $f = readdir($handle)) {
        
        if ($f != '.' && $f != '..') {
            $filePath = "$folder/$f";
            
            if (is_file($filePath) && strstr($filePath, ".js")) {
                parseFile($filePath, $words);
            } elseif (is_dir($filePath)) {
                findWords($filePath."/", $words);
            }
        }
    }
    closedir($handle);

}

$words = new Words();

findWords("../js/dhtml-chess.js", $words);
findWords("../src/wordpress", $words);
findWords("../wordpress", $words);

$data = $words->getWords();

/**
 * msgid "white"
msgstr ""

 *
 */
$txt = "";

foreach($data as $word){
    $txt .= 'msgid "'. $word . '"' . "\n";
    $txt .= 'msgstr ""' . "\n";
}

file_put_contents("../wordpress/dhtml_chess-words.txt", $txt);


echo json_encode($words->getWords());
