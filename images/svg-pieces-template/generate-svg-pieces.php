<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 11/01/2017
 * Time: 02:33
 */


if(!file_exists("output")){
    mkdir("output");
    chmod("output", 0775);
}

function parseDirectory($dir, $replacements, $prefix)
{
    echo "<h1>Parsing $dir </h1>";

    if ($handle = opendir($dir)) {
        /* This is the correct way to loop over the directory. */
        while (false !== ($entry = readdir($handle))) {



            if (!is_dir($dir . $entry)) {

                if(strstr($entry, ".svg")){

                    $filename = $prefix . substr($entry, 4);

                    $data = file_get_contents($dir.$entry);

                    foreach($replacements as $from=>$to){
                        $data = str_replace($from, $to, $data );
                    }

                    file_put_contents("output/".$filename, $data);
                    echo $filename."<br>";
                    echo "<img src='output/".$filename. "'>";
                }
            }
        }

        closedir($handle);
    }
}

$replacements = array(
    "#e5e0bf" => "#E1F5FE"
);



parseDirectory("./", $replacements, "svgblue");