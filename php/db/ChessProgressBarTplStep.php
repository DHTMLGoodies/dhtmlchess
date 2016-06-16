<?php

class ChessProgressBarTplStep extends ChessDbModel {

    protected $dbTableName = 'chess_progress_bar_tpl_step';


    protected $definition = array(
        'fields' => array(
            'id' => 'varchar(64) not null primary key',
            'templateId' => 'varchar(64)',
            'title' => 'varchar(256)',
         ),
        'indexes' => array(),
        'defaultData' => array(
        )
    );

}
