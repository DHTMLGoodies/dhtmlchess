<?php

/**
 * Key Value Storage
 * User: alfmagne
 * Date: 04/04/2017
 * Time: 19:16
 */

class DhtmlChessKeyValue {


	const NUMERIC = "number";
	const STRING = "string";

	/**
	 * @var wpdb
	 */
	private $wpdb;

	public function __construct(){
		global $wpdb;
		$this->wpdb = $wpdb;
	}

	public function increment($key, $increment = 1){

		$val = $this->get($key);

		if(isset($val)){
			$val += $increment;
			$this->update($key, $val);
		}else{
			$this->insert($key, $increment, self::NUMERIC);
		}
	}

	public function upsert($key, $value, $type = self::STRING){
		$val = $this->get($key);
		if(isset($val)){
			$this->update($key, $value);
		}else{
			$this->insert($key, $value, $type);
		}
	}

	private function update($key, $val){
		$this->wpdb->update(
			DhtmlChessDatabase::TABLE_KEY_VALUE_STORE,
			array(
				DhtmlChessDatabase::COL_VALUE => $val
			),
			array(
				DhtmlChessDatabase::COL_KEY => $key
			),
			array(
				'%s'
			),
			array()
		);

	}

	private function insert($key, $val, $type){
		$this->wpdb->insert(
			DhtmlChessDatabase::TABLE_KEY_VALUE_STORE,
			array(
				DhtmlChessDatabase::COL_KEY => $key,
				DhtmlChessDatabase::COL_VALUE => $val,
				DhtmlChessDatabase::COL_VALUE_TYPE => $type
			),
			array(
				'%s','%s','%s'
			)
		);
	}

	public function get($key, $defaultValue = null){

		$key = esc_sql($key);

		$query = $this->wpdb->prepare("select "
		                              . DhtmlChessDatabase::COL_VALUE . ", " . DhtmlChessDatabase::COL_VALUE_TYPE
		                              . " from ". DhtmlChessDatabase::TABLE_KEY_VALUE_STORE
		                              . " where ". DhtmlChessDatabase::COL_KEY . "=%s ", $key);
		$row = $this->wpdb->get_row($query, ARRAY_N);

		if(!empty($row)){

			$val = $row[0];
			return $row[1] == self::STRING ? $val : $val / 1;
		}

		return $defaultValue;

	}

	public function count(){
		$row = $this->wpdb->get_row("SELECT COUNT(" . DhtmlChessDatabase::COL_ID . ") as count FROM " . DhtmlChessDatabase::TABLE_KEY_VALUE_STORE);
		return isset($row) && $row->count > 0 ? $row->count : 0;
	}

	public function remove($key){
		$this->wpdb->delete(DhtmlChessDatabase::TABLE_KEY_VALUE_STORE,
			array(
				DhtmlChessDatabase::COL_KEY => $key
			), array(
				'%s'
			));
	}

}