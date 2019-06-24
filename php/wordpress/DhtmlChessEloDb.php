<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 08/04/2017
 * Time: 15:01
 */
class DhtmlChessEloDb
{

    const KEY_PUZZLES = "puzzles";
    const KEY_MULTIPLAYER = "multiplayer";
    const KEY_PUZZLE_ELO = "puzzle_elo"; // Elo of a puzzle

    /**
     * @var wpdb
     */
    private $wpdb;

    public function __construct()
    {
        global $wpdb;
        $this->wpdb = $wpdb;
    }

    public function getList($key, $len = 10)
    {
        $ret = array();
        $len = preg_replace('/[^0-9]/s', '', $len);
        if (!$len) $len = 10;

        $query = $this->wpdb->prepare("select "
            . " p." . DhtmlChessDatabase::COL_ELO . ","
            . " p." . DhtmlChessDatabase::COL_USER_ID . ","
            . " u.display_name "
            . "from " . DhtmlChessDatabase::TABLE_ELO . " p left join " .
            "wp_users u on p." . DhtmlChessDatabase::COL_USER_ID . "=u.ID"
            . " where p." . DhtmlChessDatabase::COL_KEY . "=%s"
            . " order by p." . DhtmlChessDatabase::COL_ELO . " desc limit " . $len, $key);
        $results = $this->wpdb->get_results($query);

        $key = "display_name";
        foreach ($results as $user) {
            $nick = $user->{$key};
            if (empty($nick)) $nick = "NN";
            $ret[] = array(
                "id" => $user->{DhtmlChessDatabase::COL_USER_ID},
                "user" => $nick,
                "elo" => round($user->{DhtmlChessDatabase::COL_ELO})
            );
        }
        return $ret;
    }

    public function getUserList($userId, $key, $max = 10)
    {

        $list = $this->getlist($key, 99999999);

        $index = 0;
        $found = false;
        $len = count($list);

        while (!$found && $index < $len) {
            if ($list[$index]["id"] == $userId) $found = true;
            if (!$found) $index++;
        }

        $start = max(0, $index - round($max / 2));

        $ret = array();
        for ($i = 0; $i < $max; $i++) {
            $index = $i + $start;
            if ($index < $len) {
                $ret[] = $list[$index];
            }
        }

        return $ret;
    }

    public function upsertEloOfPuzzle($puzzleid, $elo){
        $this->upsert($puzzleid, self::KEY_PUZZLE_ELO, $elo);
    }

    public function upsertPuzzle($userId, $elo)
    {
        $this->upsert($userId, self::KEY_PUZZLES, $elo);
    }

    public function upsertMultiplayer($userId, $elo)
    {
        $this->upsert($userId, self::KEY_MULTIPLAYER, $elo);
    }

    public function upsert($userId, $key, $elo)
    {
        $existing = $this->get($key, $userId);
        if (empty($existing)) {
            $this->insert($userId, $key, $elo);
        } else {
            $this->update($userId, $key, $elo);
        }
    }

    private function update($userId, $key, $elo)
    {
        #echo $userId." " . $key
        $this->wpdb->update(
            DhtmlChessDatabase::TABLE_ELO,
            array(
                DhtmlChessDatabase::COL_ELO => $elo
            ),
            array(
                DhtmlChessDatabase::COL_KEY => $key,
                DhtmlChessDatabase::COL_USER_ID => $userId
            ),
            array(
                '%d'
            ),
            array()
        );

    }

    private function insert($userId, $key, $elo)
    {
        $this->wpdb->insert(
            DhtmlChessDatabase::TABLE_ELO,
            array(
                DhtmlChessDatabase::COL_USER_ID => $userId,
                DhtmlChessDatabase::COL_KEY => $key,
                DhtmlChessDatabase::COL_ELO => $elo
            ),
            array(
                '%d', '%s', '%.2f'
            )
        );

    }

    public function getEloOfPuzzle($puzzleId){
        return $this->getElo(self::KEY_PUZZLE_ELO, $puzzleId, 1600);
    }

    public function getPuzzleElo($userId)
    {
        return $this->getElo(self::KEY_PUZZLES, $userId);
    }

    public function getMultiplayerElo($userId)
    {
        return $this->getElo(self::KEY_MULTIPLAYER, $userId);
    }

    public function getElo($key, $userId, $defaultElo = 1400)
    {
        $elo = $this->get($key, $userId);
        return empty($elo) ? $defaultElo : $elo;
    }


    private function get($key, $userId)
    {
        $key = esc_sql($key);

        $query = $this->wpdb->prepare("select "
            . DhtmlChessDatabase::COL_ELO
            . " from " . DhtmlChessDatabase::TABLE_ELO
            . " where " . DhtmlChessDatabase::COL_USER_ID . "=%s and " . DhtmlChessDatabase::COL_KEY . " = %s", $userId, $key);

        return $this->wpdb->get_var($query);

    }


}