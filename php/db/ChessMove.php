<?php

class ChessMove extends ChessDbModel {

    protected $dbTableName = 'chess_move';

    protected $definition = array(
        'fields' => array(
            'id' => 'int auto_increment not null primary key',
            'gameId' => 'int',
            'notation' => 'varchar(10)',
            'fromSquare' => 'varchar(10)',
            'toSquare' => 'varchar(10)',
            'fenId' => 'int',
            'fenSuffix' => 'varchar(32)',
            'parentId' => 'int',
            'comment' => 'text',
            'action' => 'varchar(512)',
            'hasChildren' => 'char(1)',
        ),
        'indexes' => array('gameId', 'fenId', 'parentId'),
        'defaultData' => array(
        )
    );
}




