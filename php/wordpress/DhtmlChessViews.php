<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 01/02/2017
 * Time: 22:56
 */
class DhtmlChessViews {


	public static function countGameTemplates() {
		return 6;
	}

	public static function countDbTemplates() {
		return 3;
	}

	public static function getAllAttributes() {
		$themes     = self::getThemeNames();
		$attributes = array(
			"theme"       => array(
				"example" => 'theme="brown"',
				"desc"    => str_replace( "{themes}", implode( ", ", $themes ), __( "Override default theme. Possible values: <em>{themes}</em>", "wordpresschess" ) )
			),
			"width"       => array(
				"example" => 'width="60%"',
				"desc"    => __( "Width of view. This attribute is NOT applied on mobile devices. Specify width in css to apply custom width on all devices.", "wordpresschess" )
			),
			"float"       => array(
				"example" => 'float="right"',
				"desc"    => __( "Float left or right. This attribute is useful if you want text to float around the chess board. This attribute is NOT set for mobile devices. Use css if you want to apply float to all devices.", "wordpresschess" )
			),
			"css"         => array(
				"example" => 'css="border:1px solid #900;border-radius:5px"',
				"desc"    => __( "Custom CSS styling", "wordpresschess" )
			),
			"arrows"      => array(
				"desc"    => __( "Attribute for the FEN short code. A comma separated list of from and to squares. Custom colored arrows can be set after a semicolon, example: e2e4;#ff0000", "wordpresschess" ),
				"example" => 'arrows="e2e4;d2d4;#ff0000"'
			),
			"highlight"   => array(
				"desc"    => __( "Attribute for the FEN short code. A comma separated list of highlighted squares. Default color is set with the css class dhtml-chess-highlight-square. You
                 can override this value in your theme's css", "wordpresschess" ),
				"example" => 'arrows="e2,e4;#ff0000;e5"'
			),
			"sound"       => array(
				"desc"    => __( "Set to 1 to enable sound effects (default = 0)", "wordpresschess" ),
				"example" => '[chess game="100" sound=1]'
			),
			"standings"   => array(
				"desc"    => __( "Used to render a standings grid or table for a database", "wordpresschess" ),
				"example" => '[chess standings="1" tpl="1"]'
			),
			"comp_toggle" => array(
				"desc"    => __( "Computer toggle button. Let you play against StockfishJS from the position shown on the board. Available for all short codes.", "wordpresschess" ),
				"example" => '[fen comp_toggle="1"]..fen position...[/fen]'
			)

		);

		return $attributes;
	}

	private static $views;


	public static function getAvailableTags() {
		if ( ! isset( self::$views ) ) {
			self::$views = array(
				array(
					"script"     => "WPFen",
					"title"      => __( "[fen] shortcode", "wordpresschess" ),
					"type"       => "fen",
					"desc"       => __( "Display a FEN position using on of the game templates", "wordpresschess" ),
					"shortcode"  => "fen",
					"attributes" => array( "tpl" => '&lt;game template>' ),
					"help"       => __( "Insert fen string between the tags. Default game template is 6", "wordpresschess" ),
					'enclosing'  => '&lt;fen string>',
					'pro'        => false
				),
				array(
					"script"     => "WPFen",
					"title"      => __( "[pgn] short code", "wordpresschess" ),
					"type"       => "pgn",
					"desc"       => __( "PGN text template", "wordpresschess" ),
					"shortcode"  => "pgn",
					"attributes" => array( "tpl" => '&lt;game template>' ),
					"help"       => __( "Insert pgn of ONE game between the tags. The <strong>tpl</strong> attribute can be used to choose a Game Template.<br><em>Tip! It's safest to enter this tag from the Text Mode of the WordPress Text editor</em>", "wordpresschess" ),
					'enclosing'  => '&lt;pgn string>',
					'pro'        => false
				),
				array(
					"script"     => "WPFen",
					"title"      => __( "[pgn] short code with tactics", "wordpresschess" ),
					"type"       => "pgn",
					"desc"       => __( "One game tactics board from [pgn] shortcode", "wordpresschess" ),
					"shortcode"  => "pgn",
					"attributes" => array( "tactics" => '1', "theme" => "&lt;optional theme>", "wordpresschess" ),
					"help"       => __( "Insert pgn of one game between the tags. <br><em>Tip! It's safest to enter this tag from the Text Mode of the WordPress Text editor</em>", "wordpresschess" ),
					'enclosing'  => '&lt;pgn string>',
					'pro'        => false
				),
				array(
					"script"     => "WPGame1",
					"title"      => __( "Game Template 1", "wordpresschess" ),
					"type"       => "g",
					"shortcode"  => "chess",
					"attributes" => array( "tpl" => 1, "game" => '&lt;gameId>' ),
					"help"       => __( 'Replace the value inside the angle brackets with a game id found in the game editor.' ),
					'pro'        => true
				),
				array(
					"script"     => "WPGame2",
					"title"      => __( "Game Template 2", "wordpresschess" ),
					"type"       => "g",
					"shortcode"  => "chess",
					"attributes" => array( "tpl" => 2, "game" => '&lt;gameId>' ),
					"help"       => __( 'Replace the value inside the angle brackets with a game id found in the game editor.' ),
					'pro'        => true
				),
				array(
					"script"     => "WPGame3",
					"title"      => __( "Game Template 3", "wordpresschess" ),
					"type"       => "g",
					"shortcode"  => "chess",
					"desc"       => "No notations, but with current move displayed below the board.",
					"attributes" => array( "tpl" => 3, "game" => '&lt;gameId>' ),
					"help"       => __( "Replace the value inside the angle brackets with a game id found in the game editor.", "wordpresschess" ),
					'pro'        => true
				),
				array(
					"script"     => "WPGame4",
					"title"      => __( "Game Template 4", "wordpresschess" ),
					"type"       => "g",
					"shortcode"  => "chess",
					"desc"       => "No notations, but with current move displayed below the board.",
					"attributes" => array( "tpl" => 4, "game" => '&lt;gameId>' ),
					"help"       => __( 'Replace the value inside the angle brackets with a game id found in the game editor.' ),
					'pro'        => true
				),
				array(
					"script"     => "WPGame5",
					"title"      => __( "Game Template 5", "wordpresschess" ),
					"type"       => "g",
					"shortcode"  => "chess",
					"desc"       => __( "Notations panel to the right, nav buttons below the board", "wordpresschess" ),
					"attributes" => array( "tpl" => 5, "game" => '&lt;gameId>' ),
					"help"       => __( 'Replace the value inside the angle brackets with a game id found in the game editor.' ),
					'pro'        => true
				),
				array(
					"script"     => "WPGame6",
					"title"      => __( "Game Template 6 - For [fen]", "wordpresschess" ),
					"type"       => "g",
					"shortcode"  => "chess",
					"desc"       => __( "Designed for the [fen] short code. Board only unless comp_toggle is on. Then you will see buttons to toggle computer play mode below the board", "wordpresschess" ),
					"attributes" => array( "tpl" => 5, "game" => '&lt;gameId>' ),
					"help"       => __( 'Replace the value inside the angle brackets with a game id found in the game editor.' ),
					'pro'        => true
				),
				array(
					"script"     => "WPViewer1",
					"title"      => __( "Database Template 1", "wordpresschess" ),
					"type"       => "p",
					"shortcode"  => "chess",
					"desc"       => __( "PGN/Database View with notations below the board", "wordpresschess" ),
					"attributes" => array( "tpl" => 1, "db" => '&lt;databaseId>' ),
					"help"       => __( 'Set db attribute to the id of a database id found in the editor, example [chess db="1" tpl="1"]' ),
					'pro'        => true
				),
				array(
					"script"     => "WPViewer2",
					"title"      => __( "Database Template 2 (With standings)", "wordpresschess" ),
					"type"       => "tournament",
					"shortcode"  => "chess",
					"desc"       => __( "Tournament template", "wordpresschess" ),
					"attributes" => array( "tpl" => 2, "db" => '&lt;databaseId>' ),
					"help"       => __( 'Set db attribute to the id of a database id found in the editor, example [chess db="1" tpl="2"]' ),
					'pro'        => true
				),
				array(
					"script"     => "WPViewer3",
					"title"      => __( "Database Template 3", "wordpresschess" ),
					"type"       => "tournament",
					"shortcode"  => "chess",
					"desc"       => __( "Tournament template", "wordpresschess" ),
					"attributes" => array( "tpl" => 3, "db" => '&lt;databaseId>' ),
					"help"       => __( 'Set db attribute to the id of a database id found in the editor, example [chess db="1" tpl="3"]' ),
					'pro'        => true
				),
				array(
					"script"     => "WPTactics1",
					"title"      => __( "Tactic Template", "wordpresschess" ),
					"type"       => "t",
					"desc"       => __( "Tactics Trainer board", "wordpresschess" ),
					"shortcode"  => "chess",
					"attributes" => array( "tpl" => 1, "tactics" => true, "db" => '&lt;databaseId>' ),
					"help"       => __( 'Example: [chess tactics=true db="2" tpl="1"] to show games from database id 2.' ),
					'pro'        => true
				),
				array(
					"script"     => "WPComp1",
					"title"      => __( "Computer Play", "wordpresschess" ),
					"type"       => "comp",
					"desc"       => __( "For playing games against StockfishJS", "wordpresschess" ),
					"shortcode"  => "chess",
					"attributes" => array( "tpl" => 1, "comp" => true ),
					"help"       => __( 'Example: [chess comp=1 theme="wood7"] for computer play using one of the wooden themes.' ),
					'pro'        => true
				),

				array(
					"script"     => "WPStandings1",
					"title"      => __( "Standings Grid", "wordpresschess" ),
					"type"       => "standings_grid",
					"desc"       => __( "Displays standings grid for a database", "wordpresschess" ),
					"shortcode"  => "chess",
					"attributes" => array( "leaderboard" => 1, "tpl" => 1 ),
					"help"       => __( 'Example: [chess leaderboard=1 tpl="1"]' ),
					'pro'        => true
				),
				array(
					"script"     => "WPStandings2",
					"title"      => __( "Standings Table", "wordpresschess" ),
					"type"       => "standings_table",
					"desc"       => __( "Displays standings for a database as a plain HTML table", "wordpresschess" ),
					"shortcode"  => "chess",
					"attributes" => array( "leaderboard" => 1, "tpl" => 2 ),
					"help"       => __( 'Example: [chess leaderboard=1 tpl="2"]' ),
					'pro'        => true
				),


			);
		}

		return self::$views;
	}

	public function hasTags( $content ) {

		if ( strstr( $content, '[DC' ) ) {
			return true;
		}


		$patterns = array( '/\[fen:([0-9prnbqkw\/\s\-]+?)\]/si' );

		foreach ( $patterns as $pattern ) {
			if ( preg_match( $pattern, $content ) ) {
				return true;
			}
		}

		return false;

	}

	public function getFenTag( $tag ) {
		$start = strpos( $tag, ":" ) + 1;
		$len   = strrpos( $tag, "]" ) - $start;

		$fen = substr( $tag, $start, $len );
		$ret = new DHTMLChessView();
		$ret->setTag( $tag );
		$ret->setScript( "WPFen" );
		$ret->setParam( "fen", $fen );

		return $ret;
	}

	public function standingsAsHTML( $pgnId, $sofiaRules ) {
		$db        = new DhtmlChessDatabase();
		$standings = $db->getStandingsSortedAsArray( $pgnId, $sofiaRules );


		$ret = array( '<table class="dhtml-chess-standings-table"' );

		$ret[] = '>';
		$ret[] = "<tr><th>" . _( "Player" ) . "</th>";
		$ret[] = "<th>" . _( "w" ) . "</th>";
		$ret[] = "<th>" . _( "d" ) . "</th>";
		$ret[] = "<th>" . _( "l" ) . "</th>";
		$ret[] = "<th>" . _( "score" ) . "</th>";
		$ret[] = "</th>";

		foreach ( $standings as $entry ) {

			$ret[] = "<tr>";
			$ret[] = "<td>" . $entry["player"] . "</td>";
			$ret[] = "<td>" . $entry["w"] . "</td>";
			$ret[] = "<td>" . $entry["d"] . "</td>";
			$ret[] = "<td>" . $entry["l"] . "</td>";
			$ret[] = "<td>" . $entry["s"] . "</td>";


			$ret[] = "</tr>";
		}
		$ret[] = "</table>";

		return implode( "", $ret );

	}

	private function sanitizePgn( $pgn ) {
		$pgn = html_entity_decode( $pgn );
		$pgn = str_replace( "<br />", "", $pgn );
		$pgn = preg_replace( '/<\/?p>/si', "\n", $pgn );
		$pgn = strip_tags( $pgn );
		$pgn = str_replace( '”', '"', $pgn );
		$pgn = str_replace( '“', '"', $pgn );

		return $pgn;
	}

	public function getParsedTagFromAttributes( $tag, $attributes = array(), $content = null ) {
		$view = new DHTMLChessView();

		if ( $tag == 'fen' && empty( $attributes["tpl"] ) ) {
			$attributes["tpl"] = 6;
		}

		$tpl = isset( $attributes["tpl"] ) ? $attributes["tpl"] : 1;

		if ( $tag == "chess" && isset( $attributes["leaderboard"] ) && ! empty( $attributes["db"] ) ) {
			if ( $attributes["tpl"] == 1 ) {
				$view->setScript( "WPStandings1" );
			}
		} elseif ( $tag == "pgn" ) {
			$content    = $this->sanitizePgn( $content );
			$gameParser = new PgnParser();
			$gameParser->setPgnContent( html_entity_decode( $content ) );
			$json = $gameParser->getGameByIndex( 0 );
			$view->setParam( "model", $json );
			if ( isset( $attributes["tactics"] ) ) {
				$view->setScript( "WPTacticsGame1" );
			} else {
				$tpl = min( $tpl, self::countGameTemplates() );
				$view->setScript( "WPGame" . $tpl );

			}
		} else if ( $tag == "fen" ) {
			$view->setParam( "fen", $content );
			$view->setScript( "WPGame" . $tpl );
			$view->setParam( "fen", $content );
		} else {
			if ( isset( $attributes['pinned'] ) ) {
				$view->setScript( "WPPinned" );
			} elseif ( isset( $attributes["comp"] ) ) {
				$view->setScript( "WPComp1" );
			} elseif ( isset( $attributes["game"] ) ) {
				$tpl = min( $tpl, self::countGameTemplates() );
				$view->setScript( "WPGame" . $tpl );
			} elseif ( isset( $attributes["tactics"] ) ) {
				$view->setScript( "WPTactics1" );
			} elseif ( isset( $attributes["pgn"] ) || isset( $attributes["db"] ) ) {
				$tpl = min( $tpl, self::countDbTemplates() );
				$view->setScript( "WPViewer" . $tpl );
			}
		}

		foreach ( $attributes as $key => $val ) {
			$attr = $this->getValidParam( $key, $val );

			if ( ! empty( $attr ) ) {
				$view->setParam( $attr["key"], $attr["val"] );
			}
		}

		return $view;
	}

	private function getValidParam( $key, $val ) {

		switch ( $key ) {

			case "tpl":
				return null;
			case "comp":
				return null;
			case "game":
				return array( "key" => "gameId", "val" => $val );
			case "db":
			case "pgn":

				$pgn = DhtmlChessPgn::instanceById( $val );

				$val = array(
					"id"   => $pgn->getId(),
					"name" => $pgn->getName()
				);

				return array( "key" => "pgn", "val" => $val );

				break;
			default:
				return array( "key" => $key, "val" => $val );
		}

	}

	/*
	public function getParsedTag($tag)
	{

		$ret = new DHTMLChessView();
		$ret->setTag($tag);
		$tag = preg_replace('/[\]\[]/s', '', $tag);
		$tokens = explode(";", $tag);

		if (count($tokens) < 2) {
			throw new DhtmlChessException("Invalid Tag");
		}

		$id = $tokens[2];

		$id = preg_replace("/[^0-9]/s", "", $id);

		if (empty($id)) {
			throw new DhtmlChessException("Missing id");
		}

		$type = substr($tokens[1], 0, 1);
		$templateId = substr($tokens[1], 1, 1);

		switch (strtoupper($type)) {
			case 'G':
				$ret->setScript('WPGame' . $templateId);
				$ret->setParam("gameId", $id);
				break;
			case 'T':
				$ret->setScript('WPTactics' . $templateId);
				$ret->setDatabaseId($id);
				break;
			case 'D':
				$ret->setScript('WPViewer' . $templateId);
				$ret->setDatabaseId($id);
				break;
		}

		for ($i = 3, $len = count($tokens); $i < $len; $i++) {
			$t = $tokens[$i];
			if (strstr($t, "=")) {
				$parts = explode("=", $t);
				$ret->setParam($parts[0], $parts[1]);
			}
		}

		return $ret;
	}

	*/

	public static function getTranslatedJSStrings( $plugin_name ) {

		$jsWords = array();
		$words   = array(
			"1 to enable sound effects . Default = 0 (no sounds)",
			"A PGN String is required",
			"Add comment",
			"Add comment after",
			"Add comment before",
			"Annotate",
			"Append Line",
			"Archive Database",
			"Archived Databases",
			"Are you sure you want to discard this draft?",
			"As new database",
			"As you can see, the game has a custom start position(fen) and contains all the moves required for a correct solution. In this example, there are two available checkmate moves in the end. This is indicated by the variation 5. Rdxd8# (5. Rexd8#).",
			"Black",
			"Cancel",
			"Castling",
			"Clear",
			"Click on all ",
			"Click squares to solve the puzzles",
			"Computer Eval",
			"Could not import pgn string",
			"Could not load game. Try again later",
			"Country",
			"DHTML Chess Forums",
			"Database",
			"Database Renamed",
			"Database name",
			"Databases can be archived from the editor by swiping right from the database list",
			"Date",
			"Default Database Template",
			"Default Database(Many games) template. See the shortcodes page for preview.",
			"Default Game Template",
			"Default Theme",
			"Delete",
			"Delete Move",
			"Delete a Database",
			"Discard",
			"Discard draft",
			"Draft Saved",
			"Draft discarded",
			"Draw",
			"E-mail",
			"Edit metadata",
			"En passant",
			"Engine stopped",
			"Enter Comment",
			"Event",
			"Everything is up to date",
			"Example",
			"Exit",
			"FEN",
			"For large PGN files, the import may take some time",
			"For more help, visit",
			"From elo",
			"Full name",
			"Game",
			"Game Comment",
			"Game Drafts",
			"Game Drawn",
			"Game Editor",
			"Game Saved",
			"Game Template",
			"Game published",
			"Game saved successfully",
			"Games",
			"Games in Database:",
			"Good job! You have solved this puzzle. Click OK to load next game.",
			"Good move",
			"Here are some of the key features of the editor",
			"Hint",
			"How to Use",
			"If name is left empty, the pgn file name will be the name of the database",
			"If you want to permanently delete a database, you will first have to archive it, then delete it from the list of archived databases by swiping left on the database in the list",
			"Import",
			"Import PGN",
			"Import games(PGN)",
			"Import into ",
			"Importing",
			"Increment",
			"Insert short tags into your posts using the format below. You can preview the tags from the<strong>Shorttags<\/strong> menu item",
			"Into database",
			"Into folder",
			"Invalid Fen",
			"Invalid command",
			"Invalid game",
			"Invalid grade",
			"Invalid move",
			"Invalid position",
			"Last updated",
			"License",
			"Load fen",
			"Loading Stockfish JS",
			"Loading drafts...",
			"Loading game",
			"Loading games...",
			"Loss",
			"Metadata",
			"Move updated to",
			"Moving",
			"My profile",
			"Name of new database",
			"New Database",
			"New Database created",
			"New Game",
			"New Game Database",
			"New Position",
			"New name",
			"New rating",
			"Next",
			"Next Game",
			"No Databases found",
			"No Drafts Found",
			"No archived databases",
			"No database selected",
			"No games",
			"Not able to delete",
			"Not able to restore",
			"OK",
			"Online Annotations - The Game Editor has a feature for annotating the games",
			"Opening training",
			"Opponent rating:",
			"Optional CSS styling",
			"Optional attribute for positioning the board when width is less than 100%. This option is also only applied to large screens",
			"Optional attributes",
			"Optional db name",
			"Optional property for Tactic Puzzles. If set, random games will be pulled from the database. The default behaviour is to show the games in sequence. For opening training, this could be a useful setting.",
			"Optional property which lets you override default theme",
			"Optional width which is only set on large screens",
			"Other Options",
			"Overwrite",
			"PGN Databases",
			"PGN archived",
			"PGN deleted",
			"PGN files can be imported from the <strong>Import PGN<\/strong> menu item. The PGN will be saved on the server as a game database which you can render games from using the [chess] shorttag",
			"PGN restored",
			"PGN:",
			"PRO version",
			"Password",
			"Paste fen into the text box below",
			"Paste your PGN here",
			"Pgn File",
			"Pgn files",
			"Play computer from any game position",
			"Play computer mode (StockfishJS)",
			"Player",
			"Player Black",
			"Player White",
			"Ply",
			"Poor move",
			"Position setup",
			"Preview",
			"Previous",
			"Properties",
			"Publish",
			"Publish Game",
			"Publish game in",
			"Questionable move",
			"Rated",
			"Register",
			"Rematch",
			"Remember me",
			"Rename Database",
			"Repeat password",
			"Replace the value inside the angle brackets with the numeric id found in the game editor",
			"Restore",
			"Result",
			"Round",
			"Same as above, but override default template",
			"Samples",
			"Save",
			"Save Draft",
			"Save Eval",
			"Save all changes",
			"Save game",
			"Score",
			"Search",
			"Select PGN",
			"Select Shortcode",
			"Select from the list below to see preview of the templates and the tags you can use in your posts.",
			"Selected",
			"Set this property to show tactic puzzles using the games defined in the db property.",
			"Settings",
			"Shortcodes",
			"Show board with this",
			"Show game with id 100, using game template 5",
			"Show games from database with the [chess] shortcode",
			"Show games from pgn database 1 using view template 1",
			"Side to move",
			"Sign in",
			"Sign out",
			"Signed in as",
			"Site",
			"Solution",
			"Speculative move",
			"Standings",
			"Start",
			"StockFish.JS Engine",
			"Stockfish Ready",
			"StockfishJS loaded. Loading Opening Book",
			"Styles separated by semicolon, eg. fill:#f00;stroke:blue",
			"Styling Options",
			"Support",
			"Swipe right to restore, Swipe left to permanently delete",
			"Tactic Puzzles",
			"Tag Example",
			"Template",
			"The Game Editor",
			"The easiest way to show tactic puzzles is to upload a PGN containing a collection of games like above. ",
			"The fonts in the preview may appear different on your website depending on your css styles",
			"There are {0} pinned pieces",
			"These are the available properties",
			"This are the available tags",
			"Time",
			"To elo",
			"To use this board, insert the tag below into your posts",
			"True to enable Sofia Rules when generating leaderboards for tournaments (3 points for 1, 1 point for draw)",
			"Undo",
			"Update",
			"Upgrade to PRO version to unlock these features",
			"Usage",
			"Use default theme",
			"Username",
			"Variation",
			"Very good move",
			"Very poor move",
			"Well done - Puzzle complete",
			"Which template to choose when rendering the board. There are different templates to choose from for game and database views. Example: to show a game using the fifth game template, set tpl to 5. The different templates can be previews from the shorttags menu item",
			"White",
			"Wins",
			"WordPressChess PRO",
			"WordPressChess Support",
			"WordPressChess is a plugin based on DHTML Chess from dhtmlchess.com",
			"Wrong move - please try again",
			"You Won",
			"You archive a database using swipe right gestures from the list of databases in the game editor",
			"You have unsaved changed. ",
			"You have unsaved game data. Do you want to discard these?",
			"You lost",
			"You play black",
			"You play white",
			"You play {color} vs StockFishJS",
			"Your color:",
			"Your country",
			"Your rating",
			"black",
			"commandWelcome",
			"command_",
			"ex: 1400",
			"fen position",
			"loading StockfishJS",
			"min",
			"sec",
			"signedInAs",
			"to move",
			"white",
			"{0} of {1} games imported"
		);
		foreach ( $words as $word ) {
			$jsWords[] = 'dl["' . $word . '"] = "' . str_replace( '"', '&quot;', __( $word, $plugin_name ) ) . '";';
		}
		$content = '<script type="text/javascript">jQuery(document).ready(function(){var dl = chess.language;' . implode( "", $jsWords ) . '});</script>';

		return $content;
	}

	public static function getThemes() {

		return array(
			array( 'brown', __( 'Brown', "wordpresschess" ) ),
			array( 'grey', __( 'Grey', "wordpresschess" ) ),
			array( 'blue', __( 'Blue', "wordpresschess" ) ),
			array( 'light-grey', __( 'Light Grey', "wordpresschess" ) ),
			array( 'green', __( 'Green', "wordpresschess" ) ),
			array( 'wood1', __( 'Wood 1', "wordpresschess" ) ),
			array( 'wood2', __( 'Wood 2', "wordpresschess" ) ),
			array( 'wood3', __( 'Wood 3', "wordpresschess" ) ),
			array( 'wood4', __( 'Wood 4', "wordpresschess" ) ),
			array( 'wood5', __( 'Wood 5', "wordpresschess" ) ),
			array( 'wood6', __( 'Wood 6', "wordpresschess" ) ),
			array( 'wood7', __( 'Wood 7', "wordpresschess" ) ),
			array( 'wood8', __( 'Wood 8', "wordpresschess" ) ),
		);
	}

	public static function getThemeNames() {
		$themes = self::getThemes();
		$ret    = array();
		foreach ( $themes as $i => $theme ) {
			$ret[] = $theme[0];
		}

		return $ret;
	}

}


class DHTMLChessView {

	private $script;
	private $params;
	private $tag;
	private $valid = true;
	private $id;

	public function __construct() {
		$this->id = uniqid( "dhtml_chess" );

		$this->setParam( "renderTo", '#' . $this->id );
	}

	public function setTag( $tag ) {
		$this->tag = $tag;
	}

	public function getTag() {
		return $this->tag;

	}

	public function isValid() {
		return $this->valid;
	}

	public function setInvalid() {
		$this->valid = false;
	}

	public function setParam( $key, $val ) {
		if ( empty( $this->params ) ) {
			$this->params = array();
		}
		$this->params[ $key ] = $val;
	}

	public function getParams() {
		return empty( $this->params ) ? array() : $this->params;
	}

	public function getParam( $key ) {
		return $this->params[ $key ];
	}

	public function setDatabaseId( $id ) {

		$pgn = DhtmlChessPgn::instanceById( $id );

		$this->setParam( "pgn", array(
			"id"   => $pgn->getId(),
			"name" => $pgn->getName()
		) );
	}

	public function setScript( $script ) {
		$this->script = $script;
	}

	public function getScript() {
		return $this->script;
	}


	public function getJS( $docRoot, $url = "null" ) {
		if ( ! $this->isValid() ) {
			return "";
		}

		$this->setParam( 'docRoot', $docRoot );
		$board  = '<div id="' . $this->id . '" style=""></div>';
		$params = json_encode( $this->params );
		$script = $this->getScript();

		$board .= '<script type="text/javascript"> jQuery(document).ready(function(){new chess.'
		          . $script
		          . '('
		          . $params . ')})</script>';

		return $board;

	}


}