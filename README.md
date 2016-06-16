#DHTML Chess
This is the chess software on dhtml-chess.com.

##Installation

From command line, run:

    git clone --recurse-submodules https://github.com/DHTMLGoodies/dhtmlchess.git dhtml-chess

copy the dhtml-chess folder to your web server.

Open one of the following URL's
    http://your-server-url/dhtml-chess/demo/analysis-board.html
    http://your-server-url/dhtml-chess/demo/pgn-games.html

in your web browser.

If you have MOD rewrite enabled on your apache server, you can install the database by following this procedure

1. Open router.php in an editor and configure a database connection

```PHP
LudoDB::setUser('root');
LudoDB::setPassword('administrator');
LudoDB::setHost('127.0.0.1');
LudoDB::setDb('PHPUnit');
```

2. Open the following url in your browser

```
http://your-server-url/ChessDBInstaller/install
```

Game import from GUI will be implemented soon. For importing games into database without GUI, follow
this procedure(Requires a correct database config in router.php and MOD_rewrite):

1. Copy the pgn file(s) you want to import into the import-queue folder
2. Open this url in your browser

```
http://your-server-url/dhtml-chess/GameImport/3/importQueued
```

where 3 is the id of the database you want to import the games into.

For overview of database id's, you can open this url in your browser:

```
http://your-server-url/dhtml-chess/Databases/read
```

##Development branch
For access to the development branch, use this Git command:

    git clone -b develop --recurse-submodules https://github.com/DHTMLGoodies/dhtmlchess.git dhtml-chess

The master branch will be updated whenever stable code is ready.

##Status

DHTML Chess contains a Javascript module and a PHP backend module. We're currently
working hard finishing the backend(called chessDB).

##Required software
* PHP 5.3 or higher
* PHP PDO MySql extension installed
* PHP JSON module installed, i.e. support for JSON_encode and JSON_decode.

##License
Until further notice, DHTML Chess is available as LGPL. 
