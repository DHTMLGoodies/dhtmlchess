<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Alf Magne
 * Date: 19.05.12
 * Time: 13:37
 * To change this template use File | Settings | File Templates.
 */
require_once("TableInstaller.php");

class ChessInstaller
{
    private $classes = array(
        'ChessDatabase', 'ChessFolder', 'ChessSeek', 'ChessGame', 'ChessPlayer', 'ChessEco',
        'ChessMove', 'ChessFen', 'ChessMetadata', 'ChessGameMetadata', 'ChessJSONCache',
        'ChessProgressBar', 'ChessProgressBarTemplate', 'ChessProgressBarCompletedStep', 'ChessProgressBarTplStep',
        'FileUpload', 'ChessSession', 'ChessCountry'
    );

    private $licenseKey;

    public function __construct()
    {
        #$this->licenseKey = $licenseKey;
    }

    public function install($data)
    {
        if ($this->isLocked()) {
            return;
        }
        $this->createLockFile();
        $this->connectToDb($data);
        $this->updateDbConnectionConfig($data);
        if ($this->isInstalled($data) && !$data['forceNewInstall']) {
            $this->update();
        } else {
            $this->newInstall();
        }

        $this->createAdminUser($data['adminUserName'], $data['adminPassword']);

    }

    private function connectToDb($data)
    {
        global $conn;
        $conn = mysql_connect($data['host'], $data['username'], $data['password']);
        if (!$this->dbExists($data['db'])) {
            mysql_query("create database " . $data['db']);
        }
        mysql_select_db($data['db'], $conn);
    }

    private function createAdminUser($username, $password){
        mysql_query("insert into chess_player(full_name, username,password,user_access,active)values('Administrator', '" . $username . "','" . md5($password) . "','" . bindec('11111111111') . "','1')")or die(mysql_error());
    }

    private function isInstalled($data)
    {
        $db = $data['db'];
        if (!$this->dbExists($db) || !$this->tableExists($db)) return false;
        return true;
    }

    private function dbExists($dbName)
    {
        $res = mysql_query("SELECT COUNT(*) as count FROM information_schema.tables where table_schema='" . $dbName . "'") or die(mysql_error());
        $row = mysql_fetch_array($res);
        if ($row['count']) {
            mysql_query("create database " . $dbName);
        }
        return $row['count'] > 0;
    }

    private function tableExists($dbName)
    {
        $res = mysql_query("SELECT COUNT(*) as count FROM information_schema.tables where table_schema='" . $dbName . "' and table_name='chess_player'") or die(mysql_error());
        $row = mysql_fetch_array($res);
        return $row['count'] > 0;
    }

    public function newInstall()
    {
        if ($this->isValidLicenseKey($this->licenseKey)) {
            $this->installTables();
            $this->importDefaultPgns();
            $this->importEco();
        }
    }

    public function update()
    {
        if ($this->isValidLicenseKey($this->licenseKey)) {
            $this->updateTables();
        }
    }

    private function installTables()
    {
        foreach ($this->classes as $class) {
            $obj = new $class;
            $obj->dropTable();
            $obj->createTable();
        }
    }

    private function updateTables()
    {
        foreach ($this->classes as $class) {
            $obj = new $class;
            $tableInstaller = new TableInstaller($obj);
            $tableInstaller->update();
        }
    }

    private function importEco()
    {
        $obj = new EcoImport();
        $obj->importFromFile("eco.pgn");
    }

    private function importDefaultPgns(){
        $obj= new GameImport();
        $obj->importFromFile('../pgn/Morphy.pgn', 1);
        $obj->importFromFile('../pgn/1001-brilliant-checkmates.pgn', 4);

    }

    public function getTableDefinition($name)
    {
        $obj = new $name;
        return $obj->getDefinition();

    }

    public function getLicenseKey()
    {
        return ChessLicense::getKey();
    }

    private function isValidLicenseKey($key)
    {
        return true;
        # return $key == $this->getLicenseKey();
    }

    public static function hasWriteAccessToDbConfigFile()
    {
        return is_writable("../db-connection.php");
    }

    private function updateDbConnectionConfig($data)
    {
        $fh = fopen("../db-connection.php", 'w');
        if ($fh) {
            fwrite($fh, "<?php\n");

            $keys = array(
                'host' => 'chess_db_host',
                'username' => 'chess_db_username',
                'password' => 'chess_db_password',
                'db' => 'chess_db_database'
            );

            foreach ($keys as $key => $value) {
                fwrite($fh, '$' . $value . "='" . $data[$key] . "';\n");
            }

            fclose($fh);
        }
    }

    public static function testDBConnection($data){

        $data['host'] = mysql_real_escape_string($data['host']);
        $data['username'] = mysql_real_escape_string($data['username']);
        $data['password'] = mysql_real_escape_string($data['password']);
        ob_start();
        $link = mysql_connect($data['host'], $data['username'], $data['password']);
        $error = ob_get_contents();
        ob_end_clean();
        $msg = '';
        if($link === FALSE){
            $success = false;
            $msg = 'Error:' . $error;
        }else{
            $success = true;
            mysql_close($link);
        }

        return array('data' => array('connection' => $success), 'message' => $msg);

    }

    private function isLocked()
    {
        return file_exists("chess.lock");
    }

    private function createLockFile()
    {
        $fh = fopen('chess.lock', 'w');
        fwrite($fh, date("Y-m-d H:i:s"));
        fclose($fh);
    }
}