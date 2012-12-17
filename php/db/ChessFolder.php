<?php


class ChessFolder extends ChessDbModel {
    protected $dbTableName = 'chess_folder';

    protected $definition = array(
        'fields' => array(
            'id' => 'int(11) auto_increment not null primary key',
            'title' => 'varchar(512)',
            'description' => 'text',
            'parentFolderId' => 'int(11)',
            'sort' => 'int(11)'
        ),
        'indexes' => array('parentFolderId'),
        'defaultData' => array(
              array('id' => 1, 'title' => 'Historic games', 'description' => '', 'parentFolderId' => 0, 'sort' => 1),
              array('id' => 2, 'title' => 'Before 1950', 'description' => '', 'parentFolderId' => 1, 'sort' => 1),
              array('id' => 3, 'title' => '1950 - 2000', 'description' => '', 'parentFolderId' => 2, 'sort' => 2),
              array('id' => 4, 'title' => 'After 2000', 'description' => '', 'parentFolderId' => 2, 'sort' => 3),
              array('id' => 5, 'title' => 'Opening database', 'description' => '', 'parentFolderId' => 0, 'sort' => 1),
              array('id' => 6, 'title' => 'Tactics', 'description' => '', 'parentFolderId' => 0, 'sort' => 1),
        )
    );


}

