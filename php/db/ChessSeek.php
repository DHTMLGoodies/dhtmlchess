<?php

class ChessSeek extends ChessDbModel {

    protected $dbTableName = 'chess_seek';

    protected $definition = array(
        'fields' => array(
            'id' => 'int auto_increment not null primary key',
            'playerId' => 'int',
            'fromElo' => 'int',
            'toElo' => 'int',
            'time' => 'int',
            'increment' => 'int',
            'correspondence' => 'char(1)',
            'created' => 'timestamp',
        ),
        'indexes' => array(),
        'defaultData' => array(
            array('id' => 1, 'playerId' => 1, 'fromElo' => 1, 'toElo' => 3000, 'time' => 3, 'increment' =>2)

        )
    );


}




