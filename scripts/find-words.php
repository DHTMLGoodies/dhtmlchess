<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 05/02/2017
 * Time: 14:15
 */

ini_set( "display_errors", "on" );

date_default_timezone_set( "Europe/Berlin" );

class Words {

	private $words;

	public function __construct() {
		$this->words = array();
	}

	public function addWord( $word ) {
		if ( ! isset( $this->words[ $word ] ) ) {
			$this->words[ $word ] = 1;
		}
	}

	public function getWords() {
		$words = array_keys( $this->words );
		sort( $words );

		return $words;
	}
}

/**
 * @param $file
 * @param Words $words
 */
function parseFile( $file, $words ) {
	$data = file_get_contents( $file );

	$matches = array();
	preg_match_all( '/chess.__\([\'"]([^\'"]+?)[\'"]/si', $data, $matches, PREG_SET_ORDER );

	foreach ( $matches as $match ) {
		$words->addWord( $match[1] );
	}


}

/**
 * @param $file
 * @param Words $words
 */
function parsePHPFile( $file, $words ) {
	$data = file_get_contents( $file );

	$matches = array();
	preg_match_all( '/__\([\'"]([^\'"]+?)[\'"],\s?\$this->plugin/si', $data, $matches, PREG_SET_ORDER );

	foreach ( $matches as $match ) {
		$words->addWord( $match[1] );
	}

}

function handleFile( $filePath, $words ) {
	if ( is_file( $filePath ) && strstr( $filePath, ".php" ) ) {
		parsePHPFile( $filePath, $words );
	} else if ( is_file( $filePath ) && strstr( $filePath, ".js" ) ) {
		parseFile( $filePath, $words );
	}

}

function findWords( $folder, $words ) {
	if ( is_file( $folder ) ) {
		handleFile( $folder, $words );

		return;
	}

	$handle = opendir( $folder );
	while ( false !== $f = readdir( $handle ) ) {

		if ( $f != '.' && $f != '..' ) {
			$filePath = "$folder/$f";

			if ( is_file( $filePath ) ) {
				handleFile( $filePath, $words );
			} elseif ( is_dir( $filePath ) ) {
				findWords( $filePath . "/", $words );
			}
		}
	}
	closedir( $handle );

}

$words = new Words();

findWords( "../js/dhtml-chess.js", $words );
findWords( "../js/dhtml-chess-wordpress.js", $words );
findWords( "../src/wordpress", $words );
findWords( "../php/wordpress/DhtmlChessViews.php", $words );
findWords( "../wordpress", $words );
findWords( "../../wordpress/wp-content/plugins/wordpresschess", $words );

$data = $words->getWords();


/**
 * msgid "white"
 * msgstr ""
 *
 */
$txt = 'msgid ""
msgstr ""
"Project-Id-Version: wordpresschess 1.0.60\n"
"Report-Msgid-Bugs-To: \n"
"POT-Creation-Date: ' . date( "Y-m-d H:i" ) . '+0100\n"
"PO-Revision-Date: ' . date( "Y-m-d H:i" ) . '+0100\n"
"Last-Translator: Alf Magne Kalleland <post@dhtml-chess.com>\n"
"Language-Team: Alf Magne Kalleland <post@dhtml-chess.com>\n"
"Language: English\n"
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"X-Poedit-KeywordsList: __;_e\n"
"X-Poedit-Basepath: .\n"
"X-Poedit-SearchPath-0: ..\n"';

$txt .= "\n";

foreach ( $data as $word ) {
	$txt .= 'msgid "' . $word . '"' . "\n";
	$txt .= 'msgstr ""' . "\n";
}

file_put_contents( "../wordpress/dhtml_chess-words.txt", $txt );
file_put_contents( "../../wordpress/wp-content/plugins/wordpresschess/languages/wordpresschess.pot", $txt );


require( 'php-mo.php' );
#phpmo_convert( "../wordpress/dhtml_chess-words.txt",  "../wordpress/dhtml_chess-words.mo"  );
#phpmo_convert( "../wordpress/dhtml_chess-words.txt",  "wordpresschess.po"  );


$languages = array( "nb_NO" );

foreach ( $languages as $language ) {

	$path = "../../wordpress/wp-content/plugins/wordpresschess/languages/wordpresschess-";

	$from = $path . $language . ".po";
	$to   = $path . $language . ".mo";

	if ( file_exists( $from ) ) {
		echo $from . "<br>";
		#phpmo_convert($from, $to);
	}


}


echo "<pre>" . $txt . "</pre>";

$txt = "<?php

\$words = array(
";

foreach ( $data as $word ) {
	$txt .= '__("' . $word . '", "wordpresschess"),' . "\n";

}
$txt .= ");";

file_put_contents( "../wordpress/dhtml_chess-words.php", $txt );
file_put_contents( "../wordpress/dhtml_chess-words.json", json_encode( $data ) );




