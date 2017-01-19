<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       http://www.dhtmlchess.com
 * @since      1.0.0
 *
 * @package    Dhtml_chess
 * @subpackage Dhtml_chess/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Dhtml_chess
 * @subpackage Dhtml_chess/includes
 * @author     Alf Magne Kalleland <alf.magne.kalleland@gmail.com>
 */
class Dhtml_chess_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'dhtml_chess',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
