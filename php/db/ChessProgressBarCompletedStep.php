<?php

class ChessProgressBarCompletedStep extends ChessDbModel {

    protected $dbTableName = 'chess_progress_bar_completed_step';


    protected $definition = array(
        'fields' => array(
            'progressId' => 'varchar(64)',
            'stepId' => 'varchar(64)',
         ),
        'indexes' => array('stepId'),
        'defaultData' => array(
        )
    );

}
