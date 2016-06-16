<?php

class ChessProgressBar extends ChessDbModel {

    protected $dbTableName = 'chess_progress_bar';
     protected $definition = array(
         'fields' => array(
             'progressId' => 'varchar(64) not null primary key',
             'totalSteps' => 'int',
             'currentStep' => 'int',
             'message' => 'varchar(1024)',
             'templateId' => 'varchar(64)',
             'createdDate' => 'timestamp',
             'createdBy' => 'int',
          ),
         'indexes' => array(),
         'defaultData' => array(
         )
     );


     private $message;
     private $progressId;
     private $currentStep;
     private $totalSteps;
     private $templateId;
     private static $currentProgressId = null;

     public function __construct($progressId = null){
         if($progressId){
             $res = mysql_query("select progressId, message, templateId, currentStep, totalSteps from chess_progress_bar where progressId='". $progressId . "'") or die(mysql_error());
             if($row = mysql_fetch_assoc($res)){

                 $this->progressId = $row['progressId'];
                 $this->templateId = $row['templateId'];
                 $this->currentStep = $row['currentStep'];
                 $this->totalSteps = $row['totalSteps'];
                 $this->message = $row['message'];
             }
         }
     }


     public static function getInstance($progressId){
         self::setCurrentProgressBarId($progressId);
         $obj = new  ChessProgressBar($progressId);
         if($obj->getProgressId()){
             return $obj;
         }
         ChessProgressBar::createBar($progressId);
         return new  ChessProgressBar($progressId);;
     }

    public static function createBar($progressId, $templateId = null){
        $userId = 0;
        mysql_query("insert into chess_progress_bar(progressId, createdBy, createdDate, totalSteps, currentStep, templateId )values('". $progressId . "', '". $userId . "','". date("Y-m-d H:i:s") . "',100,0, '". $templateId . "')") or die('Create bar ' . mysql_error());
        return mysql_insert_id();;
    }


     public function getProgressId(){
         return $this->progressId;
     }

     public function getTemplateId(){
         return $this->templateId;
     }

     public function getMessage(){
         return $this->message ? $this->message : '';
     }
     public function getPercent(){
         if(!$this->totalSteps){
             return 0;
         }
         return min(100, round(($this->currentStep / $this->totalSteps) * 100));
     }
     public static function getStatus($progressId){

         $progressObj = new ChessProgressBar($progressId ? $progressId : self::getCurrentProgressBarId());
         $ret = array(
             'text' => $progressObj->getMessage(),
             'percent' => $progressObj->getPercent()
         );
         return $ret;
     }



     public static function setTotalSteps($totalSteps){
         $progressId = self::getCurrentProgressBarId();
         mysql_query("update chess_progress_bar set totalSteps='". $totalSteps ."' where progressId='". $progressId . "'") or die(mysql_error());
     }

     public static function increment($message, $incrementBy = 1){
         $progressId = self::getCurrentProgressBarId();
         mysql_query("update chess_progress_bar set currentStep = currentStep+" . $incrementBy . ", message='". $message . "' where progressId='". $progressId . "'");
     }

     public static function incrementBy($message, $incrementBy){
         self::increment($message, $incrementBy);
     }

     public static function finishStep($stepKey){
         $progressId = self::getCurrentProgressBarId();
         $statusObj = new ChessProgressBar($progressId);
         $templateId = $statusObj->getTemplateId();

         $res = mysql_query("select ID from chess_progress_bar_Tpl_step where templateId=? and step_key=?", array($templateId, $stepKey));
         if($row = mysql_fetch_assoc($res)){
             $data = array($progressId, $row['ID']);
             mysql_query("insert into progress_bar_completed_step(progressId, step_id)values(?,?)", $data);
         }
     }

     public static function setCurrentProgressBarId($progressId){
         self::$currentProgressId = $progressId;

     }

     public static function getCurrentProgressBarId(){
         return self::$currentProgressId;
     }

}
