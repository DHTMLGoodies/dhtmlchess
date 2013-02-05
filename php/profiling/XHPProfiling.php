<?php
/**
 * xhprof profiling class
 * User: Alf Magne Kalleland
 * Date: 03.02.13
 * Time: 19:50
 */

$XHPROF_ROOT = __DIR__ .'/../../../xhprof/';

include_once $XHPROF_ROOT . "/xhprof_lib/utils/xhprof_lib.php";
include_once $XHPROF_ROOT . "/xhprof_lib/utils/xhprof_runs.php";

class XHPProfiling
{
    private $name;
    private $start;

    public function __construct($name){
        $this->start = microtime(true);
        $this->name = $name;
        xhprof_enable(XHPROF_FLAGS_CPU + XHPROF_FLAGS_MEMORY);
    }

    public function getTimeUsage(){
   		return microtime(true) - $this->start;
   	}

    public function end(){
        $xhprof_data = xhprof_disable();
        $xhprof_runs = new XHProfRuns_Default();
        $run_id = $xhprof_runs->save_run($xhprof_data, $this->name);
        return "<a href='http://localhost:8080/xhprof/xhprof_html/index.php?run=$run_id&source=". $this->name."'>See result</a>";
    }
}

