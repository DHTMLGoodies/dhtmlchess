<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Alf Magne
 * Date: 19.05.12
 * Time: 14:20
 * To change this template use File | Settings | File Templates.
 */
class TableInstaller
{
    private $dbTable;

    public function __construct(ChessDbModel $dbTable){
        $this->dbTable = $dbTable;
    }

    public function getDefinition(){
        $this->dbTable->getDefinition();
    }

    public function update(){
        if(!$this->tableExists()){
            $this->dbTable->createTable();
        }else{
            $this->addColumns();
            $this->updateColumns();
        }
    }

    private function addColumns(){
        $addedColumns = $this->getAddedColumns();
        foreach($addedColumns as $addedColumn){
            $sql = "alter table ". $this->dbTable->getTableName() . ' add ' . $addedColumn['Field']. " ". $addedColumn['Type'];
            mysql_query($sql) or die($sql."\n". mysql_error());
        }
    }

    private function updateColumns(){
        $modifiedColumns = $this->getModifiedColumns();
        foreach($modifiedColumns as $column){
            $sql = "alter table ". $this->dbTable->getTableName() . ' modify ' . $column['Field']. " ". $column['Type'];
            mysql_query($sql) or die($sql."\n". mysql_error());
        }
    }

    public function getAddedColumns(){
        $ret = array();
        $fields = $this->dbTable->getTableColumns();
        $actualColumns = $this->getActualDbColumn();

        foreach($fields as $name=>$definition){
            if(!isset($actualColumns[$name])){
                $ret[] = array('Field' => $name, 'Type' => $definition);
            }
        }
        return $ret;
    }

    public function getModifiedColumns(){
        $ret = array();
        $fields = $this->dbTable->getTableColumns();
        $actualColumns = $this->getActualDbColumn();

        foreach($fields as $name=>$definition){

            if(isset($actualColumns[$name])){
                $dbCol = $actualColumns[$name];
                if($dbCol['Type'] !== $this->getActualColumnDefinition($definition)){
                    $ret[] = array('Field' => $name, 'Type' => $definition);
                }
            }
        }
        return $ret;
    }

    private function getActualColumnDefinition($definition){

        if(strstr($definition, 'auto_increment')){
            return 'int(11)';
        }
        if($definition == 'int'){
            return 'int(11)';
        }

        $tokens = explode(" ", $definition);
        return $tokens[0];
    }

    private function getActualDbColumn(){
        $ret = array();
        $res = mysql_query("SHOW FULL COLUMNS FROM  ". $this->dbTable->getTableName()) or die(mysql_error());
        while($row = mysql_fetch_assoc($res)){
            $ret[$row['Field']] = $row;
        }
        return $ret;
    }

    public function tableExists(){
        return mysql_num_rows( mysql_query("SHOW TABLES LIKE '".$this->dbTable->getTableName()."'")) > 0;
    }
}
