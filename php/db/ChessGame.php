<?php

class ChessGame extends ChessDbModel {

    protected $dbTableName = 'chess_game';
    protected $className = 'ChessGame';
    protected $objectType = 'Game';


    protected $definition = array(
        'fields' => array(
            'id' => 'int auto_increment not null primary key',
            'event' => 'varchar(512)',
            'site' => 'varchar(512)',
            'date' => 'varchar(128)',
            'round' => 'varchar(512)',
            'eco' => 'varchar(128)',
            'whiteId' => 'int',
            'blackId' => 'int',
            'white' => 'varchar(512)',
            'black' => 'varchar(512)',
            'annotator' => 'varchar(512)',
            'timecontrol' => 'varchar(64)',
            'time' => 'varchar(64)',
            'mode' => 'varchar(64)',
            'eloWhite' => 'varchar(16)',
            'eloBlack' => 'varchar(16)',
            'pgn' => 'text',
            'fenId' => 'int',
            'fenSuffix' => 'varchar(32)',
            'databaseId' => 'int',
            'result' => 'varchar(64)',
            'created' => 'timestamp',
            'plycount' => 'int',
            'lastMoves' => 'varchar(4000)',
            'comment' => 'text'
        ),
        'indexes' => array('whiteId', 'blackId', 'databaseId', 'fenId', 'result'),
        'defaultData' => array(

        )
    );

    public function getJSON(){
        $json = ChessJSONCache::getFromCache($this);
        return $json;
    }

    public function buildJSON(){
        $obj = array();
        $obj[CHESS_JSON::GAME_METADATA] = $this->getMetadata();
        $obj[CHESS_JSON::MOVE_MOVES] = $this->getMoves();
        return $obj;
    }
    private function getMetadata(){
        return ChessGameMetadata::getMetadata($this->getId());
    }

    private function getMoves(){

    }


    public function save($gameData){
        if(isset($gameData['id']) && $this->isValidId($gameData['id'])){
            $game = new ChessGame($gameData['id']);
            ChessJSONCache::clearFromCache($game);
            $ret = $game->update($gameData);
            ChessJSONCache::clearFromCache($game->getDatabase());
            return $ret;
        }else{
            $id =  parent::save($gameData);
            $game = new ChessGame($id);
            ChessJSONCache::clearFromCache($game->getDatabase());
            return $id;
        }
    }

    private function isValidId($id){
        return preg_match("/^[0-9]+$/", $id) ? true : false;
    }

    protected function update($gameData = array()){
        $gameData['id'] = $this->getId();
        $gameData['databaseId'] = $this->getDatabaseId();
        $this->updateMetadata($gameData);
        $this->saveMoves($gameData);
        $this->updateLastMoves();

        ChessJSONCache::saveCache($this,ChessJSONCache::TYPE_OBJECT, $gameData);
        return $this->getId();
    }

    public function getDatabaseId(){
        return $this->databaseId;
    }

    public function getDatabase(){
        return new ChessDatabase($this->getDatabaseId());
    }

    private function updateMetadata($gameData){
        if(isset($gameData[CHESS_JSON::GAME_METADATA])){
            $metadata = $gameData[CHESS_JSON::GAME_METADATA];

            ChessMetadata::clearGameMetadata($this->getId());

            foreach($metadata as $key=>$value){
                if(isset($this->definition['fields'][$key])){
                    $this->{$key} = $metadata[$key];
                }else{
                    if($key !== CHESS_JSON::FEN){
                        ChessMetadata::insertGameMetadata($this->getId(), $key, $value);
                    }
                }
            }
            $this->fenId = ChessFen::getFenId($metadata[CHESS_JSON::FEN]);
            $this->whiteId = ChessPlayer::getPlayerId($metadata['white']);
            $this->blackId = ChessPlayer::getPlayerId($metadata['black']);
            $this->fenSuffix = $this->getSuffixFromFen($metadata[CHESS_JSON::FEN]);


            $keys = array('event', 'whiteId','blackId','pgn','eco','json','databaseId','fenSuffix');
            foreach($keys as $key){
                if(isset($metadata[$key])){
                    $this->{$key} = $metadata[$key];
                }
            }
        }

        $this->commit();
    }

    private function getSuffixFromFen($fen){
        $parts = explode(" ", $fen);
        return trim(implode(" ", array_slice($parts,1)));
    }

    private function saveMoves($gameData){
        $this->deleteMoves();
        if(isset($gameData[CHESS_JSON::MOVE_MOVES])){
            $moves = $gameData[CHESS_JSON::MOVE_MOVES];
            $this->addMoves($moves, 0);
        }
    }

    private function deleteMoves(){
        mysql_query("delete from chess_move where gameId='". $this->getId() . "'");
    }

    public function addMoves($moves, $parentId){
        foreach($moves as $move){
            $this->addMoveToDb($move, $parentId);
            if(isset($move[CHESS_JSON::MOVE_VARIATIONS])){
                $parentId = mysql_insert_id();
                foreach($move[CHESS_JSON::MOVE_VARIATIONS] as $variation){
                    $this->addMoves($variation, $parentId);
                }
            }
        }
        unset($moves);
    }

    private function addMoveToDb($move, $parentId = 0){
        $data = array(
            'gameId' => $this->getId(),
            'notation' => isset($move[CHESS_JSON::MOVE_NOTATION])? self::getSafeValue($move[CHESS_JSON::MOVE_NOTATION]) : '',
            'fromSquare' => isset($move[CHESS_JSON::MOVE_FROM]) ?  $move[CHESS_JSON::MOVE_FROM] : '',
            'toSquare' => isset($move[CHESS_JSON::MOVE_TO]) ? $move[CHESS_JSON::MOVE_TO] : '',
            'fenId' => isset($move[CHESS_JSON::FEN]) ? ChessFen::getFenId($move[CHESS_JSON::FEN]) : 0,
            'fenSuffix' => isset($move[CHESS_JSON::FEN]) ? $this->getSuffixFromFen($move[CHESS_JSON::FEN]) : 0,
            'action' => isset($move[CHESS_JSON::MOVE_ACTION]) ? serialize($move[CHESS_JSON::MOVE_ACTION]) : '',
            'comment' => isset($move[CHESS_JSON::MOVE_COMMENT]) ? self::getSafeValue($move[CHESS_JSON::MOVE_COMMENT]) : '',
            'hasChildren' => isset($move[CHESS_JSON::MOVE_VARIATIONS]) ? '1' : '',
            'parentId' => $parentId
        );
        $sql = "insert into chess_move(" . implode(',', array_keys($data)) . ")values('" . implode("','", array_values($data))."')";
        $this->executeQuery($sql);
    }

    public function addMove($move){
        if(!is_array($move)){
            $move = array(CHESS_JSON::MOVE_NOTATION => $move);
        }
        $moveParser = new FenParser0x88();

        if($moveParser->isValid($move, $this->getlastFen())){
            $move = $moveParser->getParsed($move);
            $this->addMoveToDb($move);
        }else{

        }
    }

    private function getLastFen(){
        $fen = ChessFen::getLastFenInGame($this->getId());
        $res = mysql_query("select fenSuffix from chess_move where gameId='". $this->getId() . "' order by id desc");
        if($row = mysql_fetch_assoc($res)){
            $suffix = $row['fenSuffix'];
        }else{
            $suffix = 'w KQkq - 0 1';
        }
        return $fen . " ". $suffix;
    }

    private function updateLastMoves(){
        $countMoves = 0;
        $moves = array();
        $res = mysql_query("select m.notation, m.fenSuffix, f.fen from chess_move m, chess_fen f where m.fenId = f.id and m.parentId=0 and gameId='". $this->getId() . "' order by m.id desc") or die(mysql_error());
        while($countMoves<3 && $row = mysql_fetch_assoc($res)){
            $moves[] = array(
                CHESS_JSON::MOVE_NOTATION => $row['notation'],
                CHESS_JSON::FEN => $row['fen']. " ". $row['fenSuffix']
            );
            $countMoves++;
        }
        $moves = array_reverse($moves);
        $lastMoves = $this->getLastMovesAsString($moves);
        $this->executeQuery("update chess_game set lastMoves='".$lastMoves."' where id='". $this->getId(). "'");

    }

    private function getLastMovesAsString($moves){

        $ret = '';
        $count = count($moves);
        for($i=0;$i<$count;$i++){
            $ret.=$this->getMoveNotationFromFen($moves[$i][CHESS_JSON::FEN], ($i==0 ? true : false))." ". $moves[$i][CHESS_JSON::MOVE_NOTATION];
        }
        return $ret;
    }

    private function getMoveNotationFromFen($fen, $isFirst){
        $tokens = explode(" ", $fen);
        $color = $tokens[1];
        $moveNumber = $tokens[5];

        if($color ==='w'){  // Fen describes the position after the move
            if($isFirst){
                return ".. ".$moveNumber.". ";
            }else{
                return '';
            }
        }
        return ' '. $moveNumber.".";
    }
}




