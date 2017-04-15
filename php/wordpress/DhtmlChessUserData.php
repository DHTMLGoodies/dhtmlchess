<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 08/04/2017
 * Time: 23:53
 */
class DhtmlChessUserData {

	private $store;

	const KEY_PUZZLE_DATA = "puzzle_data";

	public function __construct(){
		$this->store = new DhtmlChessKeyValue();
	}

	/**
	 * @param int $userId
	 * @return object
	 */
	public function puzzleStatus($userId){
		$key = self::KEY_PUZZLE_DATA . "_" . $userId;
		$ret = $this->store->get($key, "{}");
		return json_decode($ret, true);
	}

	public function setPuzzleStatus($userId, $pgn, $gameId, $index){
		$key = self::KEY_PUZZLE_DATA . "_" . $userId;
		$data = array(
			"pgn" => $pgn, "gameId" => $gameId, "index" => $index
		);
		$this->store->upsert($key, json_encode($data));
	}

}