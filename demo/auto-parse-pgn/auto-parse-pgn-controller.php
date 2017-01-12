<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 02/01/2017
 * Time: 17:49
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


    fwrite($fh, "\n\n". $moves . "\n\n");


    fclose($fh);

    $ret = array("success" => "true");
    echo json_encode($ret);
}