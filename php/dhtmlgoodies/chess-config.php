<?php
date_default_timezone_set('Europe/Berlin');

$conn = mysql_connect("localhost","root","administrator");
mysql_select_db("dhtmlgds",$conn);

define("CHESS_FILE_UPLOAD_URL", "tmp/");
