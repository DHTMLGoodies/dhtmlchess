<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 05/03/2017
 * Time: 17:14
 */

if (isset($_POST['initialize']) && isset($_POST['pgn'])) {
    file_put_contents($_POST['pgn'], "");
}

if (isset($_POST['append']) && isset($_POST['pgn']) && isset($_POST['game'])) {

    $fh = fopen($_POST['pgn'], "a");
    $moves = "";
    $gameArray = array();
    foreach ($_POST["game"] as $key => $value) {
        if ($key == "moves") {
            $moves = $value;
        } else {
            fwrite($fh, '[' . $key . ' "' . $value . '"]' . "\r\n");
        }

    }


    fwrite($fh, "\n\n*\n\n");


    fclose($fh);

    if(!file_exists($_POST['pgn'])){
        die("Could not create file");
    }
    $ret = array("success" => "true");
    echo json_encode($ret);
}