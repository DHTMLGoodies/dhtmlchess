#DHTML Chess
This is the chess software on dhtml-chess.com.

##Installation

From command line, run:

    git clone --recurse-submodules https://github.com/DHTMLGoodies/dhtmlchess.git dhtml-chess

copy the dhtml-chess folder to your web server.

Open
    http://<server name>/dhtml-chess/demo/analysis-board.html


##Development branch
For access to development branch, type:

    git clone -b develop --recurse-submodules https://github.com/DHTMLGoodies/dhtmlchess.git dhtml-chess

Open
    http://<server name>/dhtml-chess/demo/pgn-games.html

To see games from static pgn files(No db installation is required).

##Status

DHTML Chess contains a Javascript module and a PHP backend module. We're currently
working hard finishing the backend(called chessDB).

##Required software
* PHP 5.3 or higher
* PHP PDO MySql extension installed
* PHP JSON module installed, i.e. support for JSON_encode and JSON_decode.

##License
License has not yet been decided, but currently available
as GPL(General Public License).
