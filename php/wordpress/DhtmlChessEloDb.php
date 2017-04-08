<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 08/04/2017
 * Time: 15:01
 */
class DhtmlChessEloDb {

	const KEY_PUZZLES = "puzzles";
	const KEY_MULTIPLAYER = "multiplayer";

	/**
	 * @var wpdb
	 */
	private $wpdb;

	public function __construct(){
		global $wpdb;
		$this->wpdb = $wpdb;
	}

	public function upsertPuzzle($userId, $elo){
		$this->upsert($userId, self::KEY_PUZZLES, $elo);
	}

	public function upsertMultiplayer($userId, $elo){
		$this->upsert($userId, self::KEY_MULTIPLAYER, $elo);
	}

	public function upsert($userId, $key, $elo){
		$existing = $this->get($key, $userId);
		if(empty($existing)){
			$this->insert($userId, $key, $elo);
		}else{
			$this->update($userId, $key, $elo);
		}
	}

	private function update($userId, $key, $elo){
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

	private function insert($userId, $key, $elo){
		$this->wpdb->insert(
			DhtmlChessDatabase::TABLE_ELO,
			array(
				DhtmlChessDatabase::COL_USER_ID => $userId,
				DhtmlChessDatabase::COL_KEY => $key,
				DhtmlChessDatabase::COL_ELO => $elo
			),
			array(
				'%d','%s','%d'
			)
		);

	}

	public function getPuzzleElo($userId){
		return $this->getElo(self::KEY_PUZZLES, $userId);
	}

	public function getMultiplayerElo($userId){
		return $this->getElo(self::KEY_MULTIPLAYER, $userId);
	}

	public function getElo($key, $userId){
		$elo = $this->get($key, $userId);
		return empty($elo) ? 1400 : $elo;
	}


	private function get($key, $userId){
		$key = esc_sql($key);

		$query = $this->wpdb->prepare("select "
		                              . DhtmlChessDatabase::COL_ELO
		                              . " from ". DhtmlChessDatabase::TABLE_ELO
		                              . " where ". DhtmlChessDatabase::COL_USER_ID . "=%s and ". DhtmlChessDatabase::COL_KEY . " = %s", $userId, $key);

		return $this->wpdb->get_var($query);

	}



}