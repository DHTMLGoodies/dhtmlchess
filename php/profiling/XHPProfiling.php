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
    public function __construct($name){
        xhprof_enable();
        $this->name = $name;
    }

    public function end(){
        $xhprof_data = xhprof_disable();
        $xhprof_runs = new XHProfRuns_Default();
        $run_id = $xhprof_runs->save_run($xhprof_data, $this->name);
        return "<a href='http://localhost:8080/xhprof/xhprof_html/index.php?run=$run_id&source=". $this->name."'>See result</a>";
    }
}
