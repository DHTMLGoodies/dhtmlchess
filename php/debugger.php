<?php
error_reporting(E_ALL);
ini_set('display_errors', 'on');

function microtime_float(){
    list($usec, $sec) = explode(" ", microtime());
    return ((float)$usec + (float)$sec);
}
$start = microtime_float();
function outputTime(){
    global $start;
    echo "<br>TIME USED: ". (microtime_float() - $start) . "<br>";
}

$timers = array();
$totalTime = array();
$counters = array();
function startTimer($key){
    global $timers;
    $timers[$key] = microtime_float();
}

function endTimer($key){
    global $timers;
    global $totalTime;
    global $counters;
    if(!isset($totalTime[$key])){
        $totalTime[$key] = 0;
        $counters[$key] = 0;
    }
    $counters[$key]++;
    $totalTime[$key] += (microtime_float() - $timers[$key]);

}

function outputTotalTime($key){
    global $totalTime;
    global $counters;
    $total = 0;
    foreach($totalTime as $key=>$time){
        echo "<br>TOTAL TIME($key) - calls : ". $counters[$key]." : ". $time."";
        $total+=$time;
    }
    echo "<br>= TOTAL : $total";

}