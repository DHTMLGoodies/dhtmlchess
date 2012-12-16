<?php
if(!strstr($_SERVER['PHP_SELF'],"connect.php")){
	$conn = mysql_connect("localhost","root","administrator");
	mysql_select_db("dhtmlgds",$conn);
}

