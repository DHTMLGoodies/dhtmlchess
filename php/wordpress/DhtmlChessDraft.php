<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 26/01/2017
 * Time: 07:44
 */
class DhtmlChessDraft
{

    /**
     * @var wpdb $wpdb
     */
    private $wpdb;

    public function __construct()
    {
        global $wpdb;
        $this->wpdb = $wpdb;
    }

    /**
     * @param int $id
     * @param array $game
     * @return mixed
     * @throws Exception
     */
    public function update($id, $game)
    {
        
        $title = $game["white"] . " - " . $game["black"];

        $updated = $this->wpdb->update(
            DhtmlChessDatabase::TABLE_DRAFT,
            array(
                DhtmlChessDatabase::COL_TITLE => $title,
                DhtmlChessDatabase::COL_GAME => json_encode($game)
            ),
            array(DhtmlChessDatabase::COL_ID => $id),
            array(
                '%s','%s'
            ),
            array()
        );

        if(empty($updated)){
            throw new DhtmlChessException("Nothing to update");
        }

        return $id;
    }

    public function save($game)
    {

        $title = $game["white"] . " - " . $game["black"];

        $count = $this->wpdb->insert(
            DhtmlChessDatabase::TABLE_DRAFT,
            array(
                DhtmlChessDatabase::COL_TITLE => $title
            ),
            array(
                '%s'
            )
        );

        if (!$count) {
            throw new DhtmlChessException("Unable to save game draft");
        }

        $id = $this->wpdb->insert_id;

        $game[DhtmlChessDatabase::KEY_DRAFT_ID] = $id;

        $this->wpdb->update(
            DhtmlChessDatabase::TABLE_DRAFT,
            array(
                DhtmlChessDatabase::COL_GAME => json_encode($game)
            ),
            array(DhtmlChessDatabase::COL_ID => $id),
            array(
                '%s'
            ),
            array()
        );

        return $id;


    }

    public function getDraft($draftId){
        $query = $this->wpdb->prepare("select " . DhtmlChessDatabase::COL_GAME . " from " . DhtmlChessDatabase::TABLE_DRAFT
            . " where " . DhtmlChessDatabase::COL_ID . "= %d", $draftId);

        $game = $this->wpdb->get_col($query, 0);
        if(empty($game)){
            throw new DhtmlChessException("Unable to load draft");
        }
        return $game[0];
    }

    public function deleteDraft($draftId)
    {
        $draftId = preg_replace("/[^0-9]/si", "", $draftId);
        if(empty($draftId)){
            throw new Exception("Unable to delete draft - invalid draft id");
        }
        $res = $this->wpdb->delete(
            DhtmlChessDatabase::TABLE_DRAFT,
            array(DhtmlChessDatabase::COL_ID => $draftId),
            array('%d')
        );

        return !empty($res);
    }

    public function countDrafts()
    {
        $query = "SELECT COUNT(" . DhtmlChessDatabase::COL_ID . ") as count FROM " . DhtmlChessDatabase::TABLE_DRAFT;
        $row = $this->wpdb->get_row($query);
        return isset($row) && $row->count > 0 ? $row->count : 0;
    }

    public function allDrafts()
    {
        $query = "select " 
            . DhtmlChessDatabase::COL_TITLE. ", "
            . DhtmlChessDatabase::COL_UPDATED. ", "
            .  DhtmlChessDatabase::COL_GAME 
            . " from " . DhtmlChessDatabase::TABLE_DRAFT . "  order by " . DhtmlChessDatabase::COL_UPDATED . " desc, ". DhtmlChessDatabase::COL_UPDATED . " asc";
        $results = $this->wpdb->get_results($query);
        $ret = array();
        foreach ($results as $game) {
            $gameObject = json_decode($game->{DhtmlChessDatabase::COL_GAME}, true);
            $gameObject['last_moves'] = DhtmlChessPgnUtil::lastMoves($gameObject['moves']);

            unset($gameObject["moves"]);
            unset($gameObject["metadata"]);
            $ret[] = array(
                "updated" => $game->{DhtmlChessDatabase::COL_UPDATED},
                "title" => $game->{DhtmlChessDatabase::COL_TITLE},
                "game" =>  $gameObject);
        }
        $ret = json_encode($ret);
        return $ret;
    }
}