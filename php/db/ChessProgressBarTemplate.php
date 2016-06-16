<?php

class ChessProgressBarTemplate extends ChessDbModel {

    protected $dbTableName = 'chess_progress_bar_template';


    protected $definition = array(
        'fields' => array(
            'id' => 'varchar(64) not null primary key',
            'title' => 'varchar(64)',
         ),
        'indexes' => array(),
        'defaultData' => array(
        )
    );
}
