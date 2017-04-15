<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 15/04/2017
 * Time: 18:45
 */
class DhtmlChessMultiPlayerGame
{
    private $seekObj;

    /**
     * @var wpdb $wpdb
     */
    private $wpdb;

    public function __construct($createdBy = null, $createdByName = null)
    {

        /**
         * var wpdb $wpdb
         */
        global $wpdb;
        $this->wpdb = $wpdb;

        if (empty($createdBy)) {
            $createdBy = get_current_user_id();
        }
        if (empty($createdByName)) {
            $createdByName = DhtmlChessMultiplayerGameHandler::getUserName();
        }

        $this->seekObj = array(
            DhtmlChessDatabase::COL_SEEK_CREATED_BY => $createdBy,
            DhtmlChessDatabase::COL_SEEK_CREATED_BY_NAME => $createdByName
        );
    }


    public function fromElo($fromElo = null)
    {
        return $this->addProperty(DhtmlChessDatabase::COL_MIN_ELO, $fromElo, 0);
    }


    public function toElo($toElo = null)
    {
        return $this->addProperty(DhtmlChessDatabase::COL_MAX_ELO, $toElo, 9999);
    }

    public function againstOpponent($opponentId = null)
    {
        return $this->addProperty(DhtmlChessDatabase::COL_SEEK_OPPONENT_ID, $opponentId);
    }

    private function addProperty($key, $value = null, $defaultValue = null)
    {
        if (!empty($value)) {
            $this->seekObj[$key] = $value;
        } else if (isset($defaultValue)) {
            $this->seekObj[$key] = $defaultValue;
        }
        return $this;
    }

    public function getParams()
    {
        return $this->seekObj;
    }

    public function __toString()
    {
        return json_encode($this->seekObj);
    }

    public function setSeekColor($color)
    {
        if ($color == DhtmlChessDatabase::COLOR_WHITE
            || $color == DhtmlChessDatabase::COLOR_BLACK
            || $color == DhtmlChessDatabase::COLOR_RANDOM
        ) {
            $this->set(DhtmlChessDatabase::COL_SEEK_COLOR, $color);
        }
        return $this;
    }

    public function setDaysPerMove($days)
    {
        $days = min(14, max(1, $days));
        $this->set(DhtmlChessDatabase::COL_DAYS_PER_MOVE, $days);
        return $this;
    }

    public function acceptSeek($userId = null, $username = null)
    {
        if (empty($userId)) {
            $userId = get_current_user_id();
        }
        if (empty($username)) {
            $username = DhtmlChessMultiplayerGameHandler::getUserName();
        }

        $opponentId = $this->val(DhtmlChessDatabase::COL_SEEK_OPPONENT_ID);
        if (!empty($opponentId) && $opponentId != $userId) {
            return $this;
        }

        $color = $this->val(DhtmlChessDatabase::COL_SEEK_COLOR);

        if ($color == DhtmlChessDatabase::COLOR_RANDOM) {
            $rnd = rand(0, 1);
            $color = $rnd == 0 ? DhtmlChessDatabase::COLOR_WHITE : DhtmlChessDatabase::COLOR_BLACK;
        }

        if ($color == DhtmlChessDatabase::COLOR_WHITE) {

            $this->set(DhtmlChessDatabase::COL_WHITE_ID, $this->val(DhtmlChessDatabase::COL_SEEK_CREATED_BY));
            $this->set(DhtmlChessDatabase::COL_WHITE_NAME, $this->val(DhtmlChessDatabase::COL_SEEK_CREATED_BY_NAME));
            $this->set(DhtmlChessDatabase::COL_BLACK_ID, $userId);
            $this->set(DhtmlChessDatabase::COL_BLACK_NAME, $username);

        } else if ($color == DhtmlChessDatabase::COLOR_BLACK) {
            $this->set(DhtmlChessDatabase::COL_BLACK_ID, $this->val(DhtmlChessDatabase::COL_SEEK_CREATED_BY));
            $this->set(DhtmlChessDatabase::COL_BLACK_NAME, $this->val(DhtmlChessDatabase::COL_SEEK_CREATED_BY_NAME));
            $this->set(DhtmlChessDatabase::COL_WHITE_ID, $userId);
            $this->set(DhtmlChessDatabase::COL_WHITE_NAME, $username);

        }

        $this->set(DhtmlChessDatabase::COL_USER_ID_TO_MOVE, $this->val(DhtmlChessDatabase::COL_WHITE_ID));
        $this->set(DhtmlChessDatabase::COL_CURRENT_FEN, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

        $gameBuilder = new DhtmlChessGameBuilder();
        $gameBuilder->setMetadata("white_id", $this->val(DhtmlChessDatabase::COL_WHITE_ID));
        $gameBuilder->setMetadata("white", $this->val(DhtmlChessDatabase::COL_WHITE_NAME));
        $gameBuilder->setMetadata("black_id", $this->val(DhtmlChessDatabase::COL_BLACK_ID));
        $gameBuilder->setMetadata("black", $this->val(DhtmlChessDatabase::COL_BLACK_NAME));
        $gameBuilder->setMetadata("result", "*");

        $this->set(DhtmlChessDatabase::COL_GAME, $gameBuilder->__toString());

        return $this;
    }

    /**
     * @param string $from
     * @param string $to
     * @param null|int $userId
     */

    public function addMove($from, $to, $userId = null)
    {

        if (empty($userId)) $userId = get_current_user_id();

        $idToMove = $this->val(DhtmlChessDatabase::COL_USER_ID_TO_MOVE);

        if ($idToMove == $userId) {

            $builder = new DhtmlChessGameBuilder($this->val(DhtmlChessDatabase::COL_GAME));

            $count = $builder->countMoves();

            $builder->addMove($from, $to);

            $countAfter = $builder->countMoves();

            $this->setTimestamp(DhtmlChessDatabase::COL_TS_LAST_MOVE);
            if ($countAfter > $count) {
                $this->toggleUserToMove();
                $this->set(DhtmlChessDatabase::COL_GAME, $builder->__toString());
            }

            $result = $builder->getResult();
            if (isset($result)) {
                $this->onGameEnd($result);
            }
        }

        return $this;
    }

    public function setTimestamp($key)
    {
        $this->set($key, date('Y-m-d G:i:s'));
    }

    public function isFinished()
    {
        return !!$this->val(DhtmlChessDatabase::COL_FINISHED);
    }

    private function onGameEnd($result)
    {
        $this->setResult($result);
        $this->set(DhtmlChessDatabase::COL_FINISHED, 1);
        $elo = new DhtmlChessElo();
        $elo->onGameEnd($this->whiteId(), $this->blackId(), $result);
    }

    private function whiteId()
    {
        return $this->val(DhtmlChessDatabase::COL_WHITE_ID);
    }

    private function blackId()
    {
        return $this->val(DhtmlChessDatabase::COL_BLACK_ID);
    }

    private function setResult($result)
    {
        $this->set(DhtmlChessDatabase::COL_RESULT, $result);
    }

    public function getResult()
    {
        return $this->val(DhtmlChessDatabase::COL_RESULT);
    }

    public function getUserIdToMove()
    {
        return $this->val(DhtmlChessDatabase::COL_USER_ID_TO_MOVE);
    }

    public function getGame()
    {
        return $this->val(DhtmlChessDatabase::COL_GAME);
    }

    private function toggleUserToMove()
    {

        $idToMove = $this->val(DhtmlChessDatabase::COL_USER_ID_TO_MOVE);

        $white = $this->val(DhtmlChessDatabase::COL_WHITE_ID);
        $black = $this->val(DhtmlChessDatabase::COL_BLACK_ID);

        $id = $idToMove == $white ? $black : $white;
        $this->set(DhtmlChessDatabase::COL_USER_ID_TO_MOVE, $id);

    }

    public function id()
    {
        return $this->val(DhtmlChessDatabase::COL_ID);
    }

    private function set($key, $val)
    {
        $this->seekObj[$key] = $val;
    }

    public static function getInstance($params = array())
    {
        $instance = new DhtmlChessMultiPlayerGame();

        if (!empty($params)) {
            foreach ($params as $key => $value) {
                $instance->set($key, $value);
            }
        }


        return $instance;
    }

    public function val($key, $defaultValue = null)
    {
        return !empty($this->seekObj[$key]) ? $this->seekObj[$key] : $defaultValue;
    }

    public function save()
    {


        $this->wpdb->update(DhtmlChessDatabase::TABLE_MULTI_GAME,
            $this->getParams(),
            array(DhtmlChessDatabase::COL_ID => $this->id())
        );

    }

    /**
     * @return int
     */
    public function create()
    {
        $color = $this->val(DhtmlChessDatabase::COL_SEEK_COLOR);
        if (empty($color)) {
            $this->setSeekColor(DhtmlChessDatabase::COLOR_RANDOM);
        }
        $days = $this->val(DhtmlChessDatabase::COL_DAYS_PER_MOVE);
        if(empty($days)){
            $days = 3;
        }
        $this->setTimestamp(DhtmlChessDatabase::COL_CREATED);
        $this->setDaysPerMove($days);

        $this->wpdb->insert(
            DhtmlChessDatabase::TABLE_MULTI_GAME,
            $this->getParams()
        );

        return $this->wpdb->insert_id;
    }

}