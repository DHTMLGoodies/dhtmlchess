<?php

error_reporting(E_ALL);
ini_set('display_errors', 'on');

class FenParser0x88
{
    private $fen;
    private $previousFen;
    private $cache;

    public function __construct($fen = null)
    {
        if (isset($fen)) {
            $this->setFen($fen);
        }
    }

    public function newGame($fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'){
        $this->validMoves = null;
        $this->setFen($fen);
    }

    private $fenParts = array();

    function setFen($fen)
    {
        $this->cache = array(
            'board' => array(),
            'white' => array(),
            'black' => array(),
            'whiteSliding' => array(),
            'blackSliding' => array(),
            'king' => array('white' => null, 'black' => null)
        );
        if($this->fen){
            $this->previousFen = $this->fen;
        }
        $this->fen = $fen;
        $this->updateFenArray();
        $this->parseFen();
    }

    private $longNotation;

    public function getLongNotation(){
        return $this->longNotation;
    }

    /**
   	 * Return long notation for a move
   	 * @method getLongNotationForAMove
   	 * @param {Object} move
   	 * @param {String} shortNotation
   	 * @return {String} long notation
   	 */
   	public function getLongNotationForAMove($move, $shortNotation) {
   		if (strstr($shortNotation, 'O-')) {
   			return $shortNotation;
   		}
   		$fromSquare = $move['from'];
   		$toSquare = $move['to'];


   		$type = $this->cache['board'][Board0x88Config::$mapping[$move['from']]];
   		$type = Board0x88Config::$typeMapping[$type];
   		$separator = strstr($shortNotation, 'x') >= 0 ? 'x' : '-';

   		$ret = $type . $fromSquare .$separator .$toSquare;

   		if (isset($move['promoteTo'])) {
   			$ret .= '=' + $move['promoteTo'];
   		}
   		return $ret;
   	}

    private function updateFenArray()
    {
        $fenParts = explode(" ", $this->fen);

        $castleCode = 0;
        for ($i = 0, $count = strlen($fenParts[2]); $i < $count; $i++) {
            $castleCode += Board0x88Config::$castle[substr($fenParts[2], $i, 1)];
        }

        $this->fenParts = array(
            'pieces' => $fenParts[0],
            'color' => $fenParts[1],
            'castle' => $fenParts[2],
            'castleCode' => $castleCode,
            'enPassant' => $fenParts[3],
            'halfMoves' => $fenParts[4],
            'fullMoves' => $fenParts[5]
        );
    }

    private function parseFen()
    {
        $pos = 0;
        $this->cache['board'] = Board0x88Config::$defaultBoard;
        $squares = Board0x88Config::$fenSquares;
        for ($i = 0, $len = strlen($this->fenParts['pieces']); $i < $len; $i++) {
            $token = $this->fenParts['pieces'][$i];

            if (isset(Board0x88Config::$fenPieces[$token])) {
                $index = Board0x88Config::$mapping[$squares[$pos]];
                $type = Board0x88Config::$pieces[$token];
                $piece = array(
                    't' => $type,
                    's' => $index
                );
                // Board array
                $this->cache['board'][$index] = $type;

                // White and black array
                $this->cache[Board0x88Config::$colorMapping[$token]][] = $piece;

                // King array
                if (Board0x88Config::$typeMapping[$type] == 'king') {
                    $this->cache['king' . ($piece['t'] & 0x8 ? 'black' : 'white')] = $piece;
                }
                $pos++;
            } else if ($i < $len - 1 && isset(Board0x88Config::$numbers[$token])) {
                $token2 = $this->fenParts['pieces'][$i + 1];
                if (preg_match("/[0-9]/", $token2)) {
                    $token = $token . $token2;
                }
                $pos += intval($token);
            }
        }

    }

    public function getPieceOnSquare($square) {
        $piece = $this->cache['board'][$square];
        if (isset($piece)) {
            return array(
                'square' => Board0x88Config::$numberToSquareMapping[$square],
                's' => $square,
                't' => $piece,
                'type'  => Board0x88Config::$typeMapping[$piece],
                'color' => $piece & 0x8 ? 'black' : 'white',
                'sliding' => $piece & 0x4
            );
        }
        return null;
    }

    public function isValid($move, $fen){
        $this->setFen($fen);
        if(!isset($move['from'])){
            $fromAndTo = $this->getFromAndToByNotation($move[CHESS_JSON::MOVE_NOTATION]);
            $move['from'] = $fromAndTo['from'];
            $move['to'] = $fromAndTo['to'];

        }
        $from = Board0x88Config::$mapping[$move['from']];
        $to = Board0x88Config::$mapping[$move['to']];

        $obj = $this->getValidMovesAndResult();
        $moves = $obj['moves'];
        if(isset($moves[$from]) && in_array($to, $moves[$from])){
            return true;
        }
        return false;
    }

    function getKing($color)
    {
        return $this->cache['king' . $color];
    }

    function getPiecesOfAColor($color)
    {
        return $this->cache[$color];
    }

    function getEnPassantSquare()
    {
        $enPassant = $this->fenParts['enPassant'];
        if ($enPassant != '-') {
            return $enPassant;
        }
        return null;
    }

    private function setEnPassantSquare($square)
    {
        $this->fenParts['enPassant'] = $square;
    }

    function getSlidingPieces($color)
    {
        return $this->cache[$color + 'Sliding'];
    }

    function getHalfMoves()
    {
        return $this->fenParts['halfMoves'];
    }

    function getFullMoves()
    {
        return $this->fenParts['fullMoves'];
    }

    function canCastleKingSide($color)
    {
        $code = $color === 'white' ? Board0x88Config::$castle['K'] : Board0x88Config::$castle['k'];
        return $this->fenParts['castleCode'] & $code;
    }

    function getColor()
    {
        return Board0x88Config::$colorAbbreviations[$this->fenParts['color']];
    }

    function switchColor() {
        $this->fenParts['color'] = $this->fenParts['color'] == 'w' ? 'b' : 'w';
    }

    function getColorCode()
    {
        return $this->fenParts['color'];
    }

    function canCastleQueenSide($color)
    {
        $code = $color === 'white' ? Board0x88Config::$castle['Q'] : Board0x88Config::$castle['q'];
        return $this->fenParts['castleCode'] & $code;
    }

    function isOnSameRank($square1, $square2)
    {
        return ($square1 & 240) === ($square2 & 240);
    }

    function isOnSameFile($square1, $square2)
    {
        return ($square1 & 15) === ($square2 & 15);
    }

    function getValidMovesAndResult($color = null)
    {
        if (!$color) {
            $color = $this->getColor();
        }

        $ret = array();
        $enPassantSquare = $this->getEnPassantSquare();
        if ($enPassantSquare) {
            $enPassantSquare = Board0x88Config::$mapping[$enPassantSquare];
        }

        $kingSideCastle = $this->canCastleKingSide($color);
        $queenSideCastle = $this->canCastleQueenSide($color);
        $oppositeColor = $color === 'white' ? 'black' : 'white';

        $WHITE = $color === 'white' ? true : false;

        $protectiveMoves = $this->getCaptureAndProtectiveMoves($oppositeColor);

        $checks = $this->getCountChecks($color, $protectiveMoves);
        $validSquares = null;
        $pinned = array();
        if ($checks === 2) {
            $pieces = array($this->getKing($color));
        } else {
            $pieces = $this->cache[$color];
            $pinned = $this->getPinned($color);
            if ($checks === 1) {
                $validSquares = $this->getValidSquaresOnCheck($color);
            }
        }

        $totalCountMoves = 0;
        for ($i = 0, $count = count($pieces); $i < $count; $i++) {
            $piece = $pieces[$i];
            $paths = array();

            switch ($piece['t']) {
                // pawns
                case 0x01:
                    if (!isset($pinned[$piece['s']]) || ($pinned[$piece['s']] && $this->isOnSameFile($piece['s'], $pinned[$piece['s']]['by']))) {
                        if (!$this->cache['board'][$piece['s'] + 16]) {
                            $paths[] = $piece['s'] + 16;
                            if ($piece['s'] < 32) {
                                if (!$this->cache['board'][$piece['s'] + 32]) {
                                    $paths[] = $piece['s'] + 32;
                                }
                            }
                        }
                    }
                    if (!isset($pinned[$piece['s']]) || ($pinned[$piece['s']] && $pinned[$piece['s']]['by'] === $piece['s'] + 15)) {
                        if ($enPassantSquare == $piece['s'] + 15 || $this->cache['board'][$piece['s'] + 15] & 0x8) {
                            $paths[] = $piece['s'] + 15;
                        }
                    }
                    if (!isset($pinned[$piece['s']]) || ($pinned[$piece['s']] && $pinned[$piece['s']]['by'] === $piece['s'] + 17)) {
                        if ($enPassantSquare == $piece['s'] + 17 || ($this->cache['board'][$piece['s'] + 17]) && $this->cache['board'][$piece['s'] + 17] & 0x8) {
                            $paths[] = $piece['s'] + 17;
                        }
                    }
                    break;
                case 0x09:
                    if (!isset($pinned[$piece['s']]) || ($pinned[$piece['s']] && $this->isOnSameFile($piece['s'], $pinned[$piece['s']]['by']))) {
                        if (!$this->cache['board'][$piece['s'] - 16]) {
                            $paths[] = $piece['s'] - 16;
                            if ($piece['s'] > 87) {
                                if (!$this->cache['board'][$piece['s'] - 32]) {
                                    $paths[] = $piece['s'] - 32;
                                }
                            }
                        }
                    }
                    if (!isset($pinned[$piece['s']]) || ($pinned[$piece['s']] && $pinned[$piece['s']]['by'] === $piece['s'] - 15)) {
                        if ($enPassantSquare == $piece['s'] - 15 || ($this->cache['board'][$piece['s'] - 15]) && !($this->cache['board'][$piece['s'] - 15] & 0x8)) {
                            $paths[] = $piece['s'] - 15;
                        }
                    }
                    if($piece['s'] - 17 >= 0){
                        if (!isset($pinned[$piece['s']]) || ($pinned[$piece['s']] && $pinned[$piece['s']]['by'] === $piece['s'] - 17)) {
                            if ($enPassantSquare == $piece['s'] - 17 || ($this->cache['board'][$piece['s'] - 17]) && !($this->cache['board'][$piece['s'] - 17] & 0x8)) {
                                $paths[] = $piece['s'] - 17;
                            }
                        }
                    }
                    break;
                // Sliding pieces
                case 0x05:
                case 0x07:
                case 0x06:
                case 0x0D:
                case 0x0E:
                case 0x0F:
                    $directions = Board0x88Config::$movePatterns[$piece['t']];
                    if (isset($pinned[$piece['s']])) {
                        if (array_search($pinned[$piece['s']]['direction'], $directions) !== FALSE) {
                            $directions = array($pinned[$piece['s']]['direction'], $pinned[$piece['s']]['direction'] * -1);
                        } else {
                            $directions = array();
                        }
                    }
                    for ($a = 0, $len = count($directions); $a < $len; $a++) {
                        $square = $piece['s'] + $directions[$a];
                        while (($square & 0x88) === 0) {
                            if ($this->cache['board'][$square]) {
                                if (($WHITE && $this->cache['board'][$square] & 0x8) || (!$WHITE && !($this->cache['board'][$square] & 0x8))) {
                                    $paths[] = $square;
                                }
                                break;
                            }
                            $paths[] = $square;
                            $square += $directions[$a];
                        }
                    }
                    break;
                // Knight
                case 0x02:
                case 0x0A:
                    if (isset($pinned[$piece['s']])) {
                        break;
                    }
                    $directions = Board0x88Config::$movePatterns[$piece['t']];
                    for ($a = 0, $lenD = count($directions); $a < $lenD; $a++) {
                        $square = $piece['s'] + $directions[$a];

                        if (($square & 0x88) === 0) {
                            if ($this->cache['board'][$square]) {
                                if (($WHITE && $this->cache['board'][$square] & 0x8) || (!$WHITE && !($this->cache['board'][$square] & 0x8))) {
                                    $paths[] = $square;
                                }
                            } else {
                                $paths[] = $square;
                            }
                        }
                    }
                    break;
                // White king
                // Black king
                case 0X03:
                case 0X0B:
                    $directions = Board0x88Config::$movePatterns[$piece['t']];
                    for ($a = 0, $lenD = count($directions); $a < $lenD; $a++) {
                        $square = $piece['s'] + $directions[$a];
                        if (($square & 0x88) === 0) {
                            if (!strstr($protectiveMoves, Board0x88Config::$keySquares[$square])) {
                                #if ($protectiveMoves.indexOf(Board0x88Config::$keySquares[$square]) == -1) {
                                if ($this->cache['board'][$square]) {
                                    if (($WHITE && $this->cache['board'][$square] & 0x8) || (!$WHITE && !($this->cache['board'][$square] & 0x8))) {
                                        $paths[] = $square;
                                    }
                                } else {
                                    $paths[] = $square;
                                }
                            }
                        }
                    }

                    if ($kingSideCastle
                        && !strstr($protectiveMoves, Board0x88Config::$keySquares[$piece['s']])
                        && ($piece['s'] < 118 && !strstr($protectiveMoves, Board0x88Config::$keySquares[$piece['s'] + 1]) )
                        && ($piece['s'] < 117 && !strstr($protectiveMoves, Board0x88Config::$keySquares[$piece['s'] + 2]))) {
                        $paths[] = $piece['s'] + 2;
                    }
                    if ($queenSideCastle && !strstr($protectiveMoves, Board0x88Config::$keySquares[$piece['s']]) && !strstr($protectiveMoves, Board0x88Config::$keySquares[$piece['s'] - 1]) && !strstr($protectiveMoves, Board0x88Config::$keySquares[$piece['s'] - 2])) {
                        $paths[] = $piece['s'] - 2;
                    }
                    break;
            }
            if ($validSquares && $piece['t'] != 0x03 && $piece['t'] != 0x0B) {
                $paths = $this->excludeInvalidSquares($paths, $validSquares);
            }
            $ret[$piece['s']] = $paths;
            $totalCountMoves += count($paths);
        }
        $result = 0;
        if ($checks && !$totalCountMoves) {
            $result = $color === 'black' ? 1 : -1;
        }
        else if (!$checks && !$totalCountMoves) {
            $result = .5;
        }
        $this->validMoves = array('moves' => $ret, 'result' => $result, 'check' => $checks);
        return $this->validMoves;
    }

    function excludeInvalidSquares($squares, $validSquares)
    {
        $ret = array();
        for ($i = 0, $len = count($squares); $i < $len; $i++) {
            if (in_array($squares[$i], $validSquares)) {
                $ret[] = $squares[$i];
            }
        }
        return $ret;
    }

    /* This method returns a commaseparated string of moves since it's faster to work with than arrays*/
    function getCaptureAndProtectiveMoves($color)
    {
        $ret = array();

        $pieces = $this->cache[$color];

        $oppositeKing = $this->getKing($color === 'white' ? 'black' : 'white');
        $oppositeKingSquare = $oppositeKing['s'];
        for ($i = 0, $len = count($pieces); $i < $len; $i++) {
            $piece = $pieces[$i];
            switch ($piece['t']) {
                // pawns
                case 0x01:
                    if ((($piece['s'] + 15) & 0x88) === 0) $ret[] = $piece['s'] + 15;
                    if ((($piece['s'] + 17) & 0x88) === 0) $ret[] = $piece['s'] + 17;
                    break;
                case 0x09:
                    if ((($piece['s'] - 15) & 0x88) === 0) $ret[] = $piece['s'] - 15;
                    if ((($piece['s'] - 17) & 0x88) === 0) $ret[] = $piece['s'] - 17;
                    break;
                // Sliding pieces
                case 0x05:
                case 0x07:
                case 0x06:
                case 0x0D:
                case 0x0E:
                case 0x0F:
                    $directions = Board0x88Config::$movePatterns[$piece['t']];
                    for ($a = 0, $lenA = count($directions); $a < $lenA; $a++) {
                        $square = $piece['s'] + $directions[$a];
                        while (($square & 0x88) === 0) {
                            if ($this->cache['board'][$square] && $square !== $oppositeKingSquare) {
                                $ret[] = $square;
                                break;
                            }
                            $ret[] = $square;
                            $square += $directions[$a];
                        }
                    }
                    break;
                // knight
                case 0x02:
                case 0x0A:
                    // White knight
                    $directions = Board0x88Config::$movePatterns[$piece['t']];
                    for ($a = 0, $lenA = count($directions); $a < $lenA; $a++) {
                        $square = $piece['s'] + $directions[$a];

                        if (($square & 0x88) === 0) {
                            $ret[] = $square;
                        }
                    }
                    break;
                // king
                case 0X03:
                case 0X0B:
                    $directions = Board0x88Config::$movePatterns[$piece['t']];
                    for ($a = 0, $lenD = count($directions); $a < $lenD; $a++) {
                        $square = $piece['s'] + $directions[$a];
                        if (($square & 0x88) === 0) {
                            $ret[] = $square;
                        }
                    }
                    break;
            }

        }
        return ',' . implode(",", $ret) . ',';
    }

    function getSlidingPiecesAttackingKing($color)
    {
        $ret = array();
        $king = $this->cache['king' . ($color === 'white' ? 'black' : 'white')];
        $pieces = $this->cache[$color];
        for ($i = 0, $len = count($pieces); $i < $len; $i++) {
            $piece = $pieces[$i];
            if ($piece['t'] & 0x4) {
                $numericDistance = $king['s'] - $piece['s'];
                $boardDistance = ($king['s'] - $piece['s']) / $this->getDistance($king['s'], $piece['s']);

                switch ($piece['t']) {
                    // Bishop
                    case 0x05:
                    case 0x0D:
                        if ($numericDistance % 15 === 0 || $numericDistance % 17 === 0) {
                            $ret[] = (array('s' => $piece['s'], 'p' => $boardDistance));
                        }
                        break;
                    // Rook
                    case 0x06:
                    case 0x0E:
                        if ($numericDistance % 16 === 0) {
                            $ret[] = array('s' => $piece['s'], 'p' => $boardDistance);
                        }
                        else if (($piece['s'] & 240) == ($king['s'] & 240)) {
                            $ret[] = array('s' => $piece['s'], 'p' => $numericDistance > 0 ? 1 : -1);
                        }
                        break;
                    // Queen
                    case 0x07:
                    case 0x0F:
                        if ($numericDistance % 15 === 0 || $numericDistance % 17 === 0 || $numericDistance % 16 === 0) {
                            $ret[] = array('s' => $piece['s'], 'p' => $boardDistance);
                        }
                        else if (($piece['s'] & 240) == ($king['s'] & 240)) {
                            $ret[] = (array('s' => $piece['s'], 'p' => $numericDistance > 0 ? 1 : -1));
                        }
                        break;
                }
            }
        }
        return $ret;
    }

    function getPinned($color)
    {
        $ret = array();
        $pieces = $this->getSlidingPiecesAttackingKing(($color === 'white' ? 'black' : 'white'));
        $WHITE = $color === 'white' ? true : false;
        $king = $this->cache['king' . $color];
        $i = 0;
        $countPieces = count($pieces);
        while ($i < $countPieces) {
            $piece = $pieces[$i];
            $square = $piece['s'] + $piece['p'];
            $countOpposite = 0;

            $squares = array($piece['s']);
            $pinning = '';
            while ($square !== $king['s'] && $countOpposite < 2) {
                $squares[] = $square;

                if ($this->cache['board'][$square]) {
                    $countOpposite++;
                    if ((!$WHITE && $this->cache['board'][$square] & 0x8) || ($WHITE && !($this->cache['board'][$square] & 0x8))) {

                        $pinning = $square;
                    } else {
                        break;
                    }
                }
                $square += $piece['p'];
            }
            if ($countOpposite === 1) {
                $ret[$pinning] = array('by' => $piece['s'], 'direction' => $piece['p']);
            }
            $i++;
        }
        if (count($ret) === 0) {
            return null;
        }
        return $ret;
    }

    public function getBoardCache(){
        return $this->cache['board'];
    }
    /**
     * Return valid squares for other pieces than king to move to when in check, i.e. squares
     * which avoids the check
     * @method getValidSquaresOnCheck
     * @param $color
     * @return array|null
     */
    function getValidSquaresOnCheck($color)
    {
        $king = $this->cache['king' . $color];
        $pieces = $this->cache[$color === 'white' ? 'black' : 'white'];

        for ($i = 0, $len = count($pieces); $i < $len; $i++) {
            $piece = $pieces[$i];

            switch ($piece['t']) {
                case 0x01:
                    if ($king['s'] === $piece['s'] + 15 || $king['s'] === $piece['s'] + 17) {
                        return array($piece['s']);
                    }
                    break;
                case 0x09:
                    if ($king['s'] === $piece['s'] - 15 || $king['s'] === $piece['s'] - 17) {
                        return array($piece['s']);
                    }
                    break;
                // knight
                case 0x02:
                case 0x0A:
                    if ($this->getDistance($piece['s'], $king['s']) === 2) {
                        $directions = Board0x88Config::$movePatterns[$piece['t']];
                        for ($a = 0, $lenD = count($directions); $a < $lenD; $a++) {
                            $square = $piece['s'] + $directions[$a];
                            if ($square === $king['s']) {
                                return array($piece['s']);
                            }
                        }
                    }
                    break;
                // Bishop
                case 0x05:
                case 0x0D:
                    $checks = $this->getBishopCheckPath($piece, $king);
                    if (isset($checks) && is_array($checks)) {
                        return $checks;
                    }
                    break;
                // Rook
                case 0x06:
                case 0x0E:
                    $checks = $this->getRookCheckPath($piece, $king);
                    if (isset($checks) && is_array($checks)) {
                        return $checks;
                    }
                    break;
                case 0x07:
                case 0x0F:
                    $checks = $this->getRookCheckPath($piece, $king);
                    if (isset($checks) && is_array($checks)) {
                        return $checks;
                    }
                    $checks = $this->getBishopCheckPath($piece, $king);
                    if (isset($checks) && is_array($checks)) {
                        return $checks;
                    }
                    break;
            }

        }

        return null;
    }

    public function getBishopCheckPath($piece, $king)
    {
        if (($king['s'] - $piece['s']) % 15 === 0 || ($king['s'] - $piece['s']) % 17 === 0) {
            $direction = ($king['s'] - $piece['s']) / $this->getDistance($piece['s'], $king['s']);
            $square = $piece['s'] + $direction;
            $pieceFound = false;
            $squares = array($piece['s']);
            while ($square !== $king['s'] && !$pieceFound) {
                $squares[] = $square;
                if (isset($this->cache['board'][$square]) && $this->cache['board'][$square]) {
                    $pieceFound = true;
                }
                $square += $direction;
            }
            if (!$pieceFound) {
                return $squares;
            }
        }
        return null;
    }

    function getRookCheckPath($piece, $king)
    {
        $direction = null;
        if ($this->isOnSameFile($piece['s'], $king['s'])) {
            $direction = ($king['s'] - $piece['s']) / $this->getDistance($piece['s'], $king['s']);
        } else if ($this->isOnSameRank($piece['s'], $king['s'])) {
            $direction = $king['s'] > $piece['s'] ? 1 : -1;
        }

        if ($direction) {
            $square = $piece['s'] + $direction;
            $pieceFound = false;
            $squares = array($piece['s']);
            while ($square !== $king['s'] && !$pieceFound) {
                $squares[] = $square;
                if ($this->cache['board'][$square]) {
                    $pieceFound = true;
                }
                $square += $direction;
            }
            if (!$pieceFound) {
                return $squares;
            }
        }
        return null;
    }

    function getCountChecks($kingColor, $moves)
    {
        $king = $this->cache['king' . $kingColor];
        $index = strpos($moves, Board0x88Config::$keySquares[$king['s']]);
        if ($index > 0) {
            if (strpos($moves, Board0x88Config::$keySquares[$king['s']], $index + 1) > 0) {
                return 2;
            }
            return 1;
        }
        return 0;
    }

    function getDistance($sq1, $sq2)
    {
        return Board0x88Config::$distances[$sq2 - $sq1 + ($sq2 | 7) - ($sq1 | 7) + 240];
    }

    function getPiecesInvolvedInMove($move)
    {
        $ret = array(
            array('from' => $move['from'], 'to' => $move['to'])
        );
        $move = array(
            'from' => Board0x88Config::$mapping[$move['from']],
            'to' => Board0x88Config::$mapping[$move['to']],
            'promoteTo' => isset($move['promoteTo']) ? $move['promoteTo'] : null
        );

        $color = ($this->cache['board'][$move['from']] & 0x8) ? 'black' : 'white';

        if ($this->isEnPassantMove($move)) {
            if ($color == 'black') {
                $square = $move['to'] + 16;

            } else {
                $square = $move['to'] - 16;
            }
            $ret[] = array('capture' => Board0x88Config::$numberToSquareMapping[$square]);
        }

        if ($this->isCastleMove($move)) {
            if (($move['from'] & 15) < ($move['to'] & 15)) {
                $ret[] = (array(
                    'from' => 'h' . ($color == 'white' ? 1 : 8),
                    'to' => 'f' . ($color == 'white' ? 1 : 8)
                ));
            } else {
                $ret[] = (array(
                    'from' => 'a' . ($color == 'white' ? 1 : 8),
                    'to' => 'd' . ($color == 'white' ? 1 : 8)
                ));
            }
        }

        if ($move['promoteTo']) {
            $ret[] = (array(
                'promoteTo' => $move['promoteTo'], 'square' => Board0x88Config::$numberToSquareMapping[$move['to']]
            ));
        }
        return $ret;
    }

    function isEnPassantMove($move)
    {
        if (($this->cache['board'][$move['from']] === 0x01 || $this->cache['board'][$move['from']] == 0x09)) {
            if (
                !$this->cache['board'][$move['to']] &&
                (($move['from'] - $move['to']) % 17 === 0 || ($move['from'] - $move['to']) % 15 === 0)
            ) {
                return true;
            }
        }
        return false;
    }

    function isCastleMove($move)
    {
        if (($this->cache['board'][$move['from']] === 0x03 || $this->cache['board'][$move['from']] == 0x0B)) {
            if ($this->getDistance($move['from'], $move['to']) === 2) {
                return true;
            }
        }
        return false;
    }

    function makeMoveByNotation($notation)
    {
        $this->makeMove($this->getFromAndToByNotation($notation));
    }

    function makeMove($move)
    {
        $this->updateBoardData($move);
        $this->fen = null;
    }


    public function getParsed($move){
        if($move['m'] == '--'){
            $this->fen = null;
            $this->switchColor();
            return array(
                'm' => $move['m']    ,
                'fen' => $this->getFen()
            );
        }
        $fromAndTo = $this->getFromAndToByNotation($move['m']);
        $this->makeMove($fromAndTo);
        $newProperties = array(
            'from' => $fromAndTo['from'],
            'to' => $fromAndTo['to'],
            'fen' => $this->getFen()
        );
        return array_merge($move, $newProperties);
    }


    function getFromAndToByNotation($notation)
    {

        $ret = array('promoteTo' => $this->getPromoteByNotation($notation));
        $color = $this->getColor();
        $offset = 0;
        if ($color === 'black') {
            $offset = 112;
        }

        $foundPieces = array();
        $fromRank = $this->getFromRankByNotation($notation);
        $fromFile = $this->getFromFileByNotation($notation);

        if (strlen($notation) === 2) {
            $square = Board0x88Config::$mapping[$notation];
            $ret['to'] = Board0x88Config::$mapping[$notation];
            $direction = $color === 'white' ? -16 : 16;
            if ($this->cache['board'][$square + $direction]) {
                $foundPieces[] = $square + $direction;
            } else {
                $foundPieces[] = $square + ($direction * 2);
            }

        } else {
            $notation = preg_replace("/=[QRBN]/", "", $notation);
            $notation = preg_replace("/[\+#!\?]/s", "", $notation);
            $notation = preg_replace("/^(.*?)[QRBN]$/s", "$1", $notation);
            $pieceType = $this->getPieceTypeByNotation($notation, $color);

            $ret['to'] = $this->getToSquareByNotation($notation);
            switch ($pieceType) {

                case 0x01:
                case 0x09:
                    if ($color === 'black') {
                        $offsets = array(15, 17,16);
                        if($ret['to'] >= 64){
                            $offsets[] = 32;
                        }
                    } else {
                        $offsets = array(-15, -17,-16);
                        if($ret['to'] < 64){
                            $offsets[] = -32;
                        }
                    }

                    for ($i = 0, $lenO = count($offsets); $i < $lenO; $i++) {
                        $sq = $ret['to'] + $offsets[$i];
                        if ($this->cache['board'][$sq] && $this->cache['board'][$sq] === $pieceType) {
                            $foundPieces[] = ($sq);
                        }
                    }
                    break;
                case 0x03:
                case 0x0B:

                    if ($notation === 'O-O') {
                        $foundPieces[] = ($offset + 4);
                        $ret['to'] = $offset + 6;
                    } else if ($notation === 'O-O-O') {
                        $foundPieces[] = ($offset + 4);
                        $ret['to'] = $offset + 2;
                    } else {
                        $k = $this->getKing($color);
                        $foundPieces[] = $k['s'];
                    }
                    break;
                case 0x02:
                case 0x0A:

                    $pattern = Board0x88Config::$movePatterns[$pieceType];
                    for ($i = 0, $len = count($pattern); $i < $len; $i++) {
                        $sq = $ret['to'] + $pattern[$i];
                        if (!($sq & 0x88)) {
                            if ($this->cache['board'][$sq] && $this->cache['board'][$sq] === $pieceType) {
                                $foundPieces[] = ($sq);
                            }
                        }
                    }
                    break;
                // Sliding pieces
                default:
                    $patterns = Board0x88Config::$movePatterns[$pieceType];
                    for ($i = 0, $len = count($patterns); $i < $len; $i++) {
                        $sq = $ret['to'] + $patterns[$i];
                        while (!($sq & 0x88)) {
                            if ($this->cache['board'][$sq] && $this->cache['board'][$sq] === $pieceType) {
                                $foundPieces[] = ($sq);
                            }
                            if($this->cache['board'][$sq]){
                                break;
                            }
                            $sq += $patterns[$i];
                        }
                    }
                    break;
            }
        }

        if (count($foundPieces) === 1) {
            $ret['from'] = $foundPieces[0];
        } else {

            if ($fromRank!==null && $fromRank >= 0) {
                for ($i = 0, $len = count($foundPieces); $i < $len; $i++) {
                    if ($this->isOnSameRank($foundPieces[$i], $fromRank)) {
                        $ret['from'] = $foundPieces[$i];
                        break;
                    }
                }
            }
            else if ($fromFile !== null && $fromFile >= 0) {
                for ($i = 0, $len = count($foundPieces); $i < $len; $i++) {
                    if ($this->isOnSameFile($foundPieces[$i], $fromFile)) {
                        $ret['from'] = $foundPieces[$i];
                        break;
                    }
                }
            }
            if(!isset($ret['from'])){
                $config = $this->getValidMovesAndResult();
                $moves = $config['moves'];
                foreach($foundPieces as $piece){
                    if(in_array($ret['to'], $moves[$piece])){
                        $ret['from'] = $piece;
                        break;
                    }
                }
            }
        }

        if(!isset($ret['from'])){
            $msg = $this->fen .", ". $notation.", Rank:". $fromRank. ", File:". $fromFile.",". count($foundPieces).", ". $foundPieces[0];
            throw new Exception($msg);
        }
        $ret['from'] = Board0x88Config::$numberToSquareMapping[$ret['from']];
        $ret['to'] = Board0x88Config::$numberToSquareMapping[$ret['to']];

        return $ret;
    }

    public function hasThreeFoldRepetition($fens = array()){
        if(!count($fens))return false;
        $shortenedFens = array();
        foreach($fens as $fen){
            $fen = array_slice(explode(" ", $fen), 0, 3);
            $fen = implode(" ", $fen);
            $shortenedFens[] = $fen;

        }
        $lastFen = $shortenedFens[count($shortenedFens)-1];
        $count = array_count_values($shortenedFens);
        return $count[$lastFen] >= 2;
    }

    public function getPromoteByNotation($notation){
        if(strstr($notation,'=')){
            $piece = preg_replace("/^.*?=([QRBN]).*$/",'$1', $notation);
            return Board0x88Config::$pieceAbbr[$piece];
        }

        if(preg_match("/[a-h][18][NBRQ]/", $notation)){
            $notation = preg_replace("/[^a-h18NBRQ]/s", "", $notation);
            return Board0x88Config::$pieceAbbr[substr($notation, strlen($notation)-1, 1)];
        }
        return '';
    }

    function getFromRankByNotation($notation)
    {
        $notation = preg_replace("/^.+([0-9]).+[0-9].*$/s", '$1', $notation);
        if (strlen($notation) > 1) {
            return null;
        }
        return ($notation - 1) * 16;
    }

    function getFromFileByNotation($notation)
    {
        $notation = preg_replace("/^.*([a-h]).*[a-h].*$/s", '$1', $notation);
        if (strlen($notation) > 1) {
            return null;
        }
        return Board0x88Config::$files[$notation];
    }

    function getToSquareByNotation($notation)
    {
        $notation = preg_replace("/.*([a-h][1-8]).*/s", '$1', $notation);
        if(isset(Board0x88Config::$mapping[$notation])){
            return Board0x88Config::$mapping[$notation];
        }
        return '';
    }

    function getPieceTypeByNotation($notation, $color = null)
    {
        $notation = preg_replace("/\=[QRNB]/s", "", $notation);
        if ($notation === 'O-O-O' || $notation === 'O-O') {
            $notation = 'K';
        } else {
            $notation = preg_replace("/.*?([NRBQK]).*/s", '$1', $notation);
            if (!$notation || strlen($notation) > 1) {
                $notation = 'P';
            }
        }

        $notation = Board0x88Config::$pieces[$notation];
        if ($color === 'black') {
            $notation += 8;
        }

        return $notation;

    }

    private $piecesInvolved;
    private $notation;
    private $validMoves = null;
    function move($move)
    {
        $this->fen = null;
        $this->validMoves = null;
        $this->piecesInvolved = $this->getPiecesInvolvedInMove($move);
        $this->notation = $this->getNotationForAMove($move);
        $this->updateBoardData($move);

        $config = $this->getValidMovesAndResult();

        if ($config['result'] === 1 || $config['result'] === -1) {
            $this->notation .= '#';
        } else {
            if ($config['check'] > 0) {
                $this->notation .= '+';
            }
        }

    }

    function setNewColor()
    {
        $this->fenParts['color'] = ($this->fenParts['color'] == 'w') ? 'b' : 'w';

    }

    function setCastle($castle)
    {
        if (!$castle) {
            $castle = '-';
        }
        $this->fenParts['castle'] = $castle;
    }

    function getCastle()
    {
        return $this->fenParts['castle'];
    }

    function getCastleCode(){
        return $this->fenParts['castleCode'];
    }

    function updateBoardData($move)
    {

        $move = array(
            'from' => Board0x88Config::$mapping[$move['from']],
            'to' => Board0x88Config::$mapping[$move['to']],
            'promoteTo' => isset($move['promoteTo']) ? $move['promoteTo'] : ''
        );
        $movedPiece = $this->cache['board'][$move['from']];
        $color = ($movedPiece & 0x8) ? 'black' : 'white';
        $enPassant = '-';

        if ($this->cache['board'][$move['to']]) {
            $incrementHalfMoves = false;
        } else {
            $incrementHalfMoves = true;
        }
        if (($this->cache['board'][$move['from']] === 0x01 || $this->cache['board'][$move['from']] == 0x09)) {
            $incrementHalfMoves = false;
            if ($this->isEnPassantMove($move)) {
                if ($color == 'black') {
                    $this->cache['board'][$move['to'] + 16] = null;
                } else {
                    $this->cache['board'][$move['to'] - 16] = null;
                }
            }

            if (($move['from'] & 15) == ($move['to'] & 15) && $this->getDistance($move['from'], $move['to']) == 2) {
                if ($this->cache['board'][$move['to'] - 1] || $this->cache['board'][$move['to'] + 1]) {
                    if ($color === 'white') {
                        $enPassant = Board0x88Config::$numberToSquareMapping[$move['from'] + 16];
                    } else {
                        $enPassant = Board0x88Config::$numberToSquareMapping[$move['from'] - 16];
                    }
                }
            }
        }

        $this->setEnPassantSquare($enPassant);

        if ($this->isCastleMove(array('from' => $move['from'], 'to' => $move['to']))) {
            $castle = $this->getCastle();
            if ($color == 'white') {
                $castleNotation = '/[KQ]/s';
                $pieceType = 0x06;
                $offset = 0;
            } else {
                $castleNotation = '/[kq]/s';
                $pieceType = 0x0E;
                $offset = 112;
            }

            if ($move['from'] < $move['to']) {
                $this->cache['board'][7 + $offset] = null;
                $this->cache['board'][5 + $offset] = $pieceType;

            } else {
                $this->cache['board'][0 + $offset] = null;
                $this->cache['board'][3 + $offset] = $pieceType;
            }
            $castle = preg_replace($castleNotation, '', $castle);
            $this->setCastle($castle);
        } else {
            $this->updateCastleForMove($movedPiece, $move['from']);
        }

        if ($color === 'black') {
            $this->incrementFullMoves();
        }
        if ($incrementHalfMoves) {
            $this->incrementHalfMoves();
        } else {
            $this->resetHalfMoves();
        }
        $this->cache['board'][$move['to']] = $this->cache['board'][$move['from']];
        $this->cache['board'][$move['from']] = null;
        if ($move['promoteTo']) {
            $this->cache['board'][$move['to']] = Board0x88Config::$typeToNumberMapping[$move['promoteTo']];
            if ($color === 'black') {
                $this->cache['board'][$move['to']] += 8;
            }
        }
        $this->setNewColor();
        $this->updatePieces();


    }

    function updateCastleForMove($movedPiece, $from)
    {
        switch ($movedPiece) {
            case 0x03:
                $this->setCastle(preg_replace("/[KQ]/s", "", $this->getCastle()));
                break;
            case 0x0B:
                $this->setCastle(preg_replace("/[kq]/s", "", $this->getCastle()));
                break;
            case 0x06:
                if ($from === 0) {
                    $this->setCastle(preg_replace("/[Q]/s", "", $this->getCastle()));
                }
                if ($from === 7) {
                    $this->setCastle(preg_replace("/[K]/s", "", $this->getCastle()));
                }
                break;
            case 0x0E:
                if ($from === 112) {
                    $this->setCastle(preg_replace("/[q]/s", "", $this->getCastle()));
                }
                if ($from === 119) {
                    $this->setCastle(preg_replace("/[k]/s", "", $this->getCastle()));
                }
                break;
        }

    }

    function updatePieces()
    {
        $this->cache['white'] = array();
        $this->cache['black'] = array();
        $piece = null;
        for ($i = 0; $i < 120; $i++) {
            if ($i & 0x88) {
                $i += 8;
            }
            if ($piece = $this->cache['board'][$i]) {
                $color = $piece & 0x8 ? 'black' : 'white';
                $obj = array(
                    't' => $piece,
                    's' => $i
                );
                $this->cache[$color][] = $obj;

                if ($piece == 0x03 || $piece == 0x0B) {
                    $this->cache['king' . $color] = $obj;
                }
            }
        }
    }

    function incrementFullMoves()
    {
        $this->fenParts['fullMoves']++;
    }

    function incrementHalfMoves()
    {
        $this->fenParts['halfMoves']++;
    }

    function resetHalfMoves()
    {
        $this->fenParts['halfMoves'] = 0;
    }

    function getPiecesInvolvedInLastMove()
    {
        return $this->piecesInvolved;
    }

    function getNotation()
    {
        return $this->notation;
    }

    function getFen()
    {
        if (!$this->fen) {
            $this->fen = $this->setNewFen();
        }
        return $this->fen;
    }

    function getNotationForAMove($move)
    {
        $move['from'] = Board0x88Config::$mapping[$move['from']];
        $move['to'] = Board0x88Config::$mapping[$move['to']];
        $type = $this->cache['board'][$move['from']];

        $ret = Board0x88Config::$notationMapping[$this->cache['board'][$move['from']]];

        switch ($type) {
            case 0x01:
            case 0x09:
                if ($this->isEnPassantMove($move) || $this->cache['board'][$move['to']]) {
                    $ret += Board0x88Config::$fileMapping[$move['from'] & 15] + 'x';
                }

                $ret += Board0x88Config::$fileMapping[$move['to'] & 15] + '' + Board0x88Config::$rankMapping[$move['to'] & 240];

                if (isset($move['promoteTo']) && $move['promoteTo']) {
                    $numType = Board0x88Config::$typeToNumberMapping[$move['promoteTo']];
                    $ret .= '=' . Board0x88Config::$notationMapping[$numType];
                }
                break;
            case 0x02:
            case 0x05:
            case 0x06:
            case 0x07:
            case 0x0A:
            case 0x0D:
            case 0x0E:
            case 0x0F:
                $config = $this->getValidMovesAndResult();
                $configMoves = $config['moves'];
                foreach ($configMoves as $square => $moves) {
                    if ($square != $move['from'] && $this->cache['board'][$square] === $type) {
                        if (array_search($move['to'], $moves) >= 0) {
                            if (($square & 15) != ($move['from'] & 15)) {
                                $ret += Board0x88Config::$fileMapping[$move['from'] & 15];
                            }
                            else if (($square & 240) != ($move['from'] & 240)) {
                                $ret += Board0x88Config::$rankMapping[$move['from'] & 240];
                            }
                        }
                    }
                }

                if ($this->cache['board'][$move['to']]) {
                    $ret .= 'x';
                }
                $ret .= Board0x88Config::$fileMapping[$move['to'] & 15] . '' . Board0x88Config::$rankMapping[$move['to'] & 240];
                break;
            case 0x03:
            case 0x0B:
                if ($this->isCastleMove($move)) {
                    if ($move['to'] > $move['from']) {
                        $ret = 'O-O';
                    } else {
                        $ret = 'O-O-O';
                    }
                } else {
                    if ($this->cache['board'][$move['to']]) {
                        $ret .= 'x';
                    }
                    $ret .= Board0x88Config::$fileMapping[$move['to'] & 15] + '' + Board0x88Config::$rankMapping[$move['to'] & 240];
                }
                break;

        }
        return $ret;

    }

    function setNewFen()
    {

        $board = $this->cache['board'];
        $fen = '';
        $emptyCounter = 0;

        for ($rank = 7; $rank >= 0; $rank--) {

            for ($file = 0; $file < 8; $file++) {
                $index = ($rank * 8) + $file;

                if ($board[Board0x88Config::$numericMapping[$index]]) {
                    if ($emptyCounter) {
                        $fen .= $emptyCounter;
                    }
                    $fen .= Board0x88Config::$pieceMapping[$board[Board0x88Config::$numericMapping[$index]]];
                    $emptyCounter = 0;
                } else {
                    $emptyCounter++;
                }
            }
            if ($rank) {
                if ($emptyCounter) {
                    $fen .= $emptyCounter;
                }
                $fen .= '/';
                $emptyCounter = 0;
            }
        }

        if ($emptyCounter) {
            $fen .= $emptyCounter;
        }

        return implode(" ", array($fen, $this->getColorCode(), $this->getCastle(), $this->fenParts['enPassant'], $this->getHalfMoves(), $this->getFullMoves()));
    }

}
