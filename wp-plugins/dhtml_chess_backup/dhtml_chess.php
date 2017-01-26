<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://www.dhtmlchess.com
 * @since             1.0.0
 * @package           Dhtml_chess
 *
 * @wordpress-plugin
 * Plugin Name:       DHTML Chess
 * Plugin URI:        http://dhtml-chess.com/wp-plugins/wp-dhtml-chess
 * Description:       Display Chess Games and Chess tactic puzzles on your website.
 * Version:           1.0.0
 * Author:            Alf Magne Kalleland
 * Author URI:        http://www.dhtmlchess.com
 * License:           GPL-2.0+ or Commercial
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       dhtml_chess
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-dhtml_chess-activator.php
 */
function activate_dhtml_chess() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-dhtml_chess-activator.php';
	Dhtml_chess_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-dhtml_chess-deactivator.php
 */
function deactivate_dhtml_chess() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-dhtml_chess-deactivator.php';
	Dhtml_chess_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_dhtml_chess' );
register_deactivation_hook( __FILE__, 'deactivate_dhtml_chess' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-dhtml_chess.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_dhtml_chess() {

	$plugin = new Dhtml_chess();
	$plugin->run();

}
run_dhtml_chess();
