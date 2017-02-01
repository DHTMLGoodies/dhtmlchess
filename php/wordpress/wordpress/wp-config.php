<?php

/**
* The base configuration for WordPress
*
* The wp-config.php creation script uses this file during the
* installation. You don't have to use the web site, you can
* copy this file to "wp-config.php" and fill in the values.
*
* This file contains the following configurations:
*
* * MySQL settings
* * Secret keys
* * Database table prefix
* * ABSPATH
*
* @link https://codex.wordpress.org/Editing_wp-config.php
*
* @package WordPress
*/

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
* Authentication Unique Keys and Salts.
*
* Change these to different unique phrases!
* You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
* You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
*
* @since 2.6.0
*/
define('AUTH_KEY',         '^fAlR~WqK)/>*J_T=PmoQ?,IbepM&Qfj+?/S%;.BNyq]vUe8|>QZ,=sy,W|e-ts`');
define('SECURE_AUTH_KEY',  'lcz,fh[+.-Uy%)T5]EG,wNU6hr7%BHj vP0~P)U3NM)*D);>BF4WS$W:qp5%ID_+');
define('LOGGED_IN_KEY',    '7s +Lt^:RAXXuF%r-0@0gjS_&~D%-Cl%~S3I~:bT<gAWd|c!7 ]ob#bq,_!%G^<<');
define('NONCE_KEY',        'Xnfy5Ogk>5XH!qwm&vXcEAK0l6kxJqI7~L3z/p1V/q5BRvBlE#gzRn^-_$QGyj!#');
define('AUTH_SALT',        'vW;h)3QJu t/TO)@zn7l~tsJp-1T=okbSVU3!<Oj$g2XB~d1>f>Y?/!L!qs2vs;r');
define('SECURE_AUTH_SALT', '9-O[u8 Q?5PA`:b-=<JZ{w4Qpzee5<Da[M@6)18NI*O>P%di$nkD9!8mxMT_DM.#');
define('LOGGED_IN_SALT',   't90RXl_[E8Uh2j_dnwKnsI*iu/5PyJGw_<p{eDitKK~)ozMR*{TAEGOn;Dhl%YnJ');
define('NONCE_SALT',       '%2p|sauXdy5(|0v(y9UPwq5s9*XVV#}0k.?Xnhyx%%8fbykKSxaP2{-Zc24U;zhJ');

/**#@-*/

/**
* WordPress Database Table prefix.
*
* You can have multiple installations in one database if you give each
* a unique prefix. Only numbers, letters, and underscores please!
*/
$table_prefix  = 'wp_';

/**
* For developers: WordPress debugging mode.
*
* Change this to true to enable the display of notices during development.
* It is strongly recommended that plugin and theme developers use WP_DEBUG
* in their development environments.
*
* For information on other constants that can be used for debugging,
* visit the Codex.
*
* @link https://codex.wordpress.org/Debugging_in_WordPress
*/
define('WP_DEBUG', true);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');

