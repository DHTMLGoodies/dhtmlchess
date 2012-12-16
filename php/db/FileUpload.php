<?php

/**
create table file_upload(
ID number(11) NOT NULL primary key,
pathOnServer varchar2(4000),
displayName varchar2(512),
userId number(11) references employee(ID) on delete cascade,
fileSize number(11),
createdDate DATE
);

 */

class FileUpload extends ChessDbModel
{
    protected $dbTableName = 'file_upload';
    protected $objectType = 'FileUpload';

    protected $definition = array(
        'fields' => array(
            'id' => 'int auto_increment not null primary key',
            'pathOnServer' => 'varchar(512)',
            'displayName' => 'varchar(512)',
            'userId' => 'int',
            'fileSize' => 'int',
            'createdDate' => 'datetime'
        ),
        'indexes' => array('userId')
    );

    private static $validExtensions = array('pgn');

    public static function setValidExtensions($extensions)
    {
        if (!is_array($extensions)) {
            $extensions = implode(",", $extensions);
        }
        self::$validExtensions = $extensions;
    }

    private static function getTempPathAndNameOnServer($extension){
        return CHESS_FILE_UPLOAD_URL."/pgn". date("YmdHis").'-'. rand(1000,9999). ".". $extension;
    }

    private static function getUserId(){
        return 1;
    }
    /**
     * @static
     * @param Object $file, record in $_FILES array
     */
    public static function uploadFile($file)
    {
        if(!file_exists(CHESS_FILE_UPLOAD_URL)){
            mkdir(CHESS_FILE_UPLOAD_URL, 0775);
        }
        if(!self::isValidExtension($file['name'])){
            return array(
                'success' => false,
                'message' => 'Invalid extension'
            );
        }
        $pathOnServer = self::getTempPathAndNameOnServer(self::getExtension($file['name']));

        copy($file['tmp_name'], $pathOnServer);

        mysql_query("insert into file_upload(pathOnServer, displayName,fileSize, userId, createdDate)
            values('$pathOnServer','". $file['name'] . "','".$file['size']."','". self::getUserId() . "','". date("Y-m-d H:i:s"). "')") or die(mysql_error());
        $id = mysql_insert_id();
        return array(
            'success' => true,
            'id' => $id,
            'value' => $id,
            'pathOnServer' => $pathOnServer,
            'displayName' => $file['name'],
            'size' => $file['size']
        );
    }

    public static function getFileInfo($id)
    {
        $res = mysql_query("select * from file_upload where ID='". $id. "'");
        if ($row = mysql_fetch_assoc($res)) {
            if (self::getUserId() == $row['userId']) {
                return array(
                    'success' => true,
                    'id' => $id,
                    'value' => $id,
                    'path' => $row['pathOnServer'],
                    'displayName' => $row['displayName'],
                    'size' => $row['fileSize']
                );
            } else {
                return array('success' => false, 'message' => 'access denied');
            }
        } else {
            return array('success' => false, 'message' => 'file does not exists');
        }
    }

    public static function isValidExtension($fileName)
    {
        if (!self::$validExtensions) {
            return true;
        }
        return in_array(self::getExtension($fileName), self::$validExtensions);

    }

    public static function getExtension($filename)
    {
        if (!strstr($filename, '.')) {
            return strtolower($filename);
        }
        $posPeriod = strrpos($filename, ".");
        return strtolower(substr($filename, $posPeriod + 1));
    }

}