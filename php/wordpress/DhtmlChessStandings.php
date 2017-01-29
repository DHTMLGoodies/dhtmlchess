<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 29/01/2017
 * Time: 02:16
 */
class DhtmlChessStandings
{
    private $wpdb;

    public function __construct()
    {
        global $wpdb;
        $this->wpdb = $wpdb;

    }

    public function getStandings($pgnName)
    {
        $pgn = DhtmlChessPgn::instanceByName($pgnName);

        $cache = new DhtmlChessCache();
        $data = $cache->getFromCache($this->cacheKey($pgnName));

        if (!empty($data) && $data->{DhtmlChessDatabase::COL_UPDATED} >= $pgn->updatedDate()) {
            return $data->{DhtmlChessDatabase::COL_CACHE_VALUE};
        }

        $standings = $this->arrayToStandings($pgn);

        $standings = json_encode($standings);

        $cache->putInCache($this->cacheKey($pgnName), $standings);

        return $standings;

    }


    /**
     * @param DhtmlChessPgn $pgn
     * @return array
     * @throws DhtmlChessException
     */
    private function arrayToStandings($pgn)
    {
        $ret = array();

        $games = $pgn->listOfGames();
        $games = json_decode($games, true);
        $players = array();
        $st = array();

        if(count($games) > 10000){
            throw new DhtmlChessException("Not generating standings. Too many games > 10000");
        }
        foreach ($games as $game) {
            if (!empty($game["white"]) && !empty($game["black"])) {

                $w = $game['white'];
                $b = $game['black'];

                if (!isset($players[$w])) {
                    $players[$w] = $w;
                    $st[$w] = array('w' => 0, 'd' => 0, 'l' => 0);
                }
                if (!isset($players[$b])) {
                    $players[$b] = $b;
                    $st[$b] = array('w' => 0, 'd' => 0, 'l' => 0);
                }


                if (isset($game["result"])) {

                    $game["result"] = preg_replace('/[^0-9\/\-]/s', "", $game["result"]);

                    switch ($game["result"]) {
                        case '1-0':
                        case '1-O':
                            $st[$w]['w']++;
                            $st[$b]['l']++;
                            break;
                        case '1/2-1/2':
                            $st[$w]['d']++;
                            $st[$b]['d']++;
                            break;
                        case '0-1':
                        case 'O-1':
                            $st[$b]['w']++;
                            $st[$w]['l']++;
                            break;

                    }
                }

            }
        }

        foreach($players as $key=>$value){
            $ret[] = array(
                'player' => $key,
                'w' => $st[$key]['w'],
                'd' => $st[$key]['d'],
                'l' => $st[$key]['l']

            );
        }

        return $ret;
    }

    private function cacheKey($pgn)
    {
        return "d_standings" . $pgn;
    }


}