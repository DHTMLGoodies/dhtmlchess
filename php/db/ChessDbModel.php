<?php


class ChessDbModel extends ChessDbAdapter
{

    private static $dbTableKeys = array();
    private $properties = array();
    protected $childrenSql = '';

    public function __construct($id = "")
    {
        if ($id) {
            $databaseKeys = $this->getDatabaseKeys();
            $sql = "select " . implode(",", $databaseKeys) . " from " . $this->dbTableName . " where ID='" . $id ."'";
            $row = $this->getOne($sql);
            foreach ($row as $key => $value) {
                $this->{$key} = $value;
            }
        }
    }

    public function getId(){
        return isset($this->id) ? $this->id : null;
    }
    public function commit(){
        $databaseKeys = $this->getDatabaseKeys();
        $sql = "update ". $this->dbTableName . " set ";

        $delim = '';
        foreach($databaseKeys as $key){
            if($key != 'id'){
                $sql.= $delim . $key . "='". ChessDbAdapter::getSafeValue($this->{$key}) . "'";
                $delim = ',';
            }
        }
        $sql.=" where ID=". $this->getId();
        $this->executeQuery($sql);


    }

    protected function getDatabaseKeys(){
        if(!isset(self::$dbTableKeys[$this->dbTableName])){
            $this->createDbTableKeys();
        }
        return self::$dbTableKeys[$this->dbTableName];
    }

    public function getJSON(){
        $json = ChessJSONCache::getFromCache($this);
        if($json){
            return $json;
        }

        $json = $this->buildJSON();
        return $json;
    }

    protected function buildJSON(){
        return '';
    }

    public function save($gameData){
        if(!$this->getId()){
            $obj = &$this->getNewInstance();
            $this->id = $obj->getId();
        }else{
            $obj = &$this;
        }
        return $obj->update($gameData);
    }

    protected function getNewInstance(){
        mysql_query("insert into ". $this->dbTableName."(id)values('')");
        $className = $this->className;
        return new $className(mysql_insert_id());
    }


    private function createDbTableKeys(){
        $dbTableKeys = array_keys($this->definition['fields']);
        self::$dbTableKeys[$this->dbTableName] = $dbTableKeys;
        foreach ($dbTableKeys as $key) {
            $this->properties[$key] = '';
        }
    }

    public function __call($method, $arguments)
    {
        if (substr($method, 0, 3) === 'get') {
            $property = $this->from_camel_case(substr($method, 3, strlen($method) - 3));
            return isset($this->{$property}) ? $this->{$property} : null;
        }
    }

    private function from_camel_case($str)
    {
        $str[0] = strtolower($str[0]);
        $func = create_function('$c', 'return "_" . strtolower($c[1]);');
        return preg_replace_callback('/([A-Z])/', $func, $str);
    }

    public function getType(){
        return $this->objectType;
    }

    public function getChildren(){
        if(ChessJSONCache::isInCache($this, ChessJSONCache::TYPE_CHILDREN)){
           return ChessJSONCache::getFromCache($this, ChessJSONCache::TYPE_CHILDREN);
        }
        $ret = array();
        if($this->childrenSql){
            $sql = str_replace("<id>", $this->getId(), $this->childrenSql);
            $res = mysql_query($sql) or die(mysql_error());
            while($row = mysql_fetch_assoc($res)){
                $ret[] = $row;
            }
        }
        ChessJSONCache::saveCache($this,ChessJSONCache::TYPE_CHILDREN, $ret);

        return $ret;
    }

    public function getTableDefinition(){
        return $this->definition;
    }

    public function getTableColumns(){
        return $this->definition['fields'];
    }

    public function getTableName(){
        return $this->dbTableName;
    }
}