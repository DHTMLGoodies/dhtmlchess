<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 19/01/2017
 * Time: 15:27
 */

if(isset($_POST['save'])){
    
    file_put_contents( $_POST['save'], $_POST['data'] );
}else{
    echo "NO CONTENT";
}