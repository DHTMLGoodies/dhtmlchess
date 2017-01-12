#DHTML Chess
This is the chess software on dhtml-chess.com.

##Installation


###Download
_The database part of DHTML Chess is until further notice disabled. DHTML Chess is now
based on pgn files only. These pgn files should be placed in the pgn folder_

If you haven't downloaded DHTML Chess, you can do that from http://www.dhtmlchess.com or via
Git using the following command

    git clone --recursive https://github.com/DHTMLGoodies/dhtmlchess.git dhtml-chess

Then, move the dhtml-chess folder to the desired location on your web server.

###Make cache writable
Make sure that your Web Server have write access to the dhtml-chess/cache folder. DHTML Chess
is using this to speed up it's parsing of pgn files.

###Testing
Open the following URL in your web browser:
    http://your-server-url/dhtml-chess/demo/tactic-training-mobile.html

in your web browser and make sure it looks ok.

If there are any problem it could be due to PHP configuration.

1. Open the developer console in Google Chrome(View->Developer->Javascript Console).
2. Look for errors in the console
3. If no errors are found, click the "Network tab"
4. You should find an entry for router.php
5. Click on it and click "Response". This will show you the response from the server and
eventual PHP errors.



##Required software
* PHP 5.3 or higher
* PHP JSON module installed, i.e. support for JSON_encode and JSON_decode.

##License
Commercial or GPL
