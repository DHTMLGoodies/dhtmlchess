<?php

class ChessDbAdapter {

    protected $definition = array();
    protected $sqlResources = array();

    const SKIP_ID_ON_INSERT = true;

    public function getOne($sql){

        $res = mysql_query($sql) or die(__FILE__."," . __LINE__ . " Error: ". mysql_error()."<br>sql: $sql");
        if($row = mysql_fetch_assoc($res)){
            return $row;
        }
        return null;
    }

    public function executeQuery($sql){
        mysql_query($sql) or die(__FILE__."," . __LINE__ . " Error: ". mysql_error()."<br>sql: $sql");
    }

    public function select($sql){
        $res = &mysql_query($sql) or die(__FILE__."," . __LINE__ . " Error: ". mysql_error()."<br>sql: $sql");
        return $res;
    }

    public function fetchRow(&$resource){
        return mysql_fetch_assoc($resource);
    }

    public static function getSafeValue($value){
        return mysql_real_escape_string($value);
    }

    public function dropTable(){
        mysql_query("drop table ". $this->dbTableName);
    }

    public function getInsertId(){
        return mysql_insert_id();
    }

    private function dropIndexes(){
        $indexes = $this->definition['indexes'];
        foreach($indexes as $index){
            #mysql_query("alter table ". $this->dbTableName . " drop index " . $this->getIndexName($index)) or die(__FILE__."," . __LINE__ . " Error: ". mysql_error());
        }
    }


    public function createTable(){
        $sql = 'create table ' . $this->dbTableName."(";
        $columnSql = '';

        foreach($this->definition['fields'] as $column=>$columnConfig){
            if($columnSql){
                $columnSql.=",\n";
            }
            $columnSql.=$column." ". $columnConfig;
        }
        $sql.=$columnSql .")";

        mysql_query($sql)or die(__FILE__."," . __LINE__ . " Error: ". mysql_error());
        $this->createIndexes();
        $this->insertDefaultData();
    }

    public function insertDefaultData(){
        mysql_query("delete from ". $this->dbTableName);
        if(isset($this->definition['defaultData'])){
            foreach($this->definition['defaultData'] as $row){
                $this->insertDefaultRow($row);
            }
        }
    }

    public function insertDefaultRow($data){
        $sql = "insert into ". $this->dbTableName."(". implode(',', array_keys($data)).")values('". implode("','", array_values($data))."')";
        mysql_query($sql) or die($sql."<br>". mysql_error()."<br>sql: $sql");
    }


    private function createIndexes(){
        $indexes = $this->definition['indexes'];
        foreach($indexes as $index){
            mysql_query("create index ". $this->getIndexName($index). " on ". $this->dbTableName."(". $index .")") or die(__FILE__."," . __LINE__ . " Error: ". mysql_error());
        }
    }

    private function getIndexName($field){
        return 'IND_' . md5($this->dbTableName . $field);
    }


}