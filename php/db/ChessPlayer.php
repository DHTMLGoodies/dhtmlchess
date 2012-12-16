<?php


class ChessPlayer extends ChessDbModel
{


    protected $dbTableName = 'chess_player';

    protected $definition = array(
        'fields' => array(
            'id' => 'int auto_increment not null primary key',
            'full_name' => 'varchar(512)',
            'username' => 'varchar(128)',
            'elo' => 'float(4,2)',
            'email' => 'varchar(1024)',
            'password' => 'varchar(32)',
            'online_player' => 'char(1)',
            'country' => 'int',
            'active' => 'char(1)',
            'user_access' => 'int'
        ),
        'indexes' => array('full_name', 'active', 'online_player'),
        'defaultData' => array(
            // Default password: "ludochess"
           // array('id' => 1, 'user_access' => 4095, 'full_name' => 'Administrator', 'email' => 'post@dhtmlgoodies.com', 'username' => 'administrator', 'password' => '3A272861C59C8A6F8EF9F5FEBE7B8EED', 'elo' => 0, 'active' => '1'),
        )
    );

    public static $loggedOnUser = null;

    public function getUserDetails()
    {
        return array(
            'username' => $this->getUserName(),
            'email' => $this->getEmail(),
            'full_name' => $this->getFullName(),
            'country' => $this->getCountry(),
            'user_access' => $this->getUserAccess()
        );
    }

    public function hasAccessTo($role)
    {
        return ($this->user_access & $role) ? true : false;
    }

    public static function hasLoggedOnUserAccessTo($role)
    {
        $player = self::getLoggedOnPlayer();
        if (!isset($player)) {
            return false;
        }
        return $player->hasAccessTo($role);
    }

    public static function getLoggedOnPlayer()
    {
        if (isset(self::$loggedOnUser)) {
            return self::$loggedOnUser;
        }
        if (!isset($_COOKIE['chess_cookie'])) {
            return null;
        }

        $playerId = ChessSession::getPlayerIdByToken($_COOKIE['chess_cookie']);
        if ($playerId) {
            self::$loggedOnUser = new ChessPlayer($playerId);
            return self::$loggedOnUser;
        }
        return null;
    }

    public function getUserName()
    {
        return $this->username;
    }

    public function getCountry()
    {
        return $this->country;
    }

    public function getUserAccess()
    {
        return $this->user_access;
    }

    public static function getPlayerId($playerName)
    {
        $playerName = str_replace(" GM", "", $playerName);
        $playerName = str_replace(" IM", "", $playerName);
        $playerName = str_replace(" FM", "", $playerName);
        $playerName = str_replace(" WGN", "", $playerName);
        $playerName = ChessDbAdapter::getSafeValue($playerName);

        $res = mysql_query("select ID from chess_player where full_name='" . $playerName . "'") or die(mysql_error());
        if ($row = mysql_fetch_array($res)) {
            return $row['ID'];
        }

        mysql_query("insert into chess_player(full_name, username)values('" . $playerName . "','" . $playerName . "')") or die(mysql_error());

        return mysql_insert_id();
    }

    public static function authenticate($username, $password)
    {
        $res = mysql_query("select ID from chess_player where username='" . $username . "' and password='" . $password . "'") or die(mysql_error());
        if ($row = mysql_fetch_assoc($res)) {
            return ChessSession::newToken($row['ID']);
        }
        return null;
    }

    public static function isValidUserName($username = '')
    {
        if (strlen($username) < 5) {
            return false;
        }
        $res = mysql_query("select ID from chess_player where username='" . $username . "'") or die(mysql_error());
        if ($row = mysql_fetch_assoc($res)) {
            return false;
        }
        return true;
    }

    public static function isValidEmail($email)
    {
        $res = mysql_query("select ID from chess_player where email='" . $email . "'") or die(mysql_error());
        if ($row = mysql_fetch_assoc($res)) {
            return false;
        }
        return true;
    }

    public static function register($userDetails)
    {
        if (!self::isValidUserName($userDetails['username'])) {
            $token = self::authenticate($userDetails['username'], $userDetails['password']);
            if ($token) {
                return array(
                    'success' => true,
                    'message' => 'User already registered',
                    'data' => array('token' => $token)
                );
            }
            return array(
                'success' => false,
                'message' => 'InvalidUsername'
            );
        }

        if (!self::isValidEmail($userDetails['email'])) {
            return array(
                'success' => false,
                'message' => 'invalidEmail'
            );
        }
        mysql_query("insert into chess_player(username,email,password,online_player,active)values('" . $userDetails['username'] . "','" . $userDetails['email'] . "','" . $userDetails['password'] . "','1','1')")or die(mysql_error());
        return array(
            'success' => true,
            'message' => '',
            'data' => array(
                'token' => self::authenticate($userDetails['username'], $userDetails['password'])
            )
        );
    }

    public function update($userDetails)
    {
        $this->username = $userDetails['username'];
        $this->full_name = $userDetails['full_name'];
        if(isset($userDetails['country']))$this->country = preg_replace("/[^0-9]/s", "", $userDetails['country']);

        if(isset($userDetails['password']) && isset($userDetails['repeatpassword'])){
            if($userDetails['password'] == $userDetails['repeatpassword']){
                $this->password = $userDetails['password'];
            }
        }
        $this->commit();


    }
}

