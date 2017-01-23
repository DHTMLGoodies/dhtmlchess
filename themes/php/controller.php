<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 21/01/2017
 * Time: 12:53
 */

if(isset($_POST['save'])){
    
    file_put_contents("out.json", $_POST['data']);
}