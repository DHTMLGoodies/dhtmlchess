<?php

class ChessFolderCollection
{


    public static function getFoldersAndDatabases()
    {
        $ret = array();
        $res = mysql_query("select id,title,parentFolderId from chess_folder order by parentFolderId, sort, ID");
        while ($row = mysql_fetch_assoc($res)) {
            $obj = array(
                'id' => $row['id'],
                'title' => $row['title'],
                'type' => 'folder',

            );
            if ($row['parentFolderId']) {
                $obj['parent'] = array(
                    'id' => $row['parentFolderId'],
                    'type' => 'folder'
                );
            }
            $ret[] = $obj;
        }

        $res = mysql_query("select id, title, folderId from chess_database order by id");
        while ($row = mysql_fetch_assoc($res)) {
            $obj = array(
                'id' => $row['id'],
                'title' => $row['title'],
                'type' => 'database',
                'parent' => array(
                    'id' => $row['folderId'],
                    'type' => 'folder'
                )
            );
            $ret[] = $obj;
        }


        return $ret;

    }

    public static function getFilteredFolders($filter){
        $filter = mysql_real_escape_string($filter);
        $ret = array();
        $res = mysql_query("select id,title from chess_folder where title like '%". $filter . "%' order by title") or die(mysql_error());
        while($row = mysql_fetch_assoc($res)){
            $ret[] = array('id' => $row['id'], 'title' => $row['title']);
        }
        return $ret;
    }

}