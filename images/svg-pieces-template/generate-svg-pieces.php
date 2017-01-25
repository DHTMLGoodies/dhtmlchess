<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 11/01/2017
 * Time: 02:33
 */


if (!file_exists("output")) {
    mkdir("output");
    chmod("output", 0775);
}

function clearFiles($dir)
{

    if ($handle = opendir($dir)) {
        /* This is the correct way to loop over the directory. */
        while (false !== ($entry = readdir($handle))) {


            if (!is_dir($dir . $entry)) {

                if (strstr($entry, ".svg")) {

                    unlink($dir . $entry);

                }
            }
        }

        closedir($handle);
    }
}

function parseDirectory($dir, $replacements, $prefix, $whiteToBlack = false, $bgWhite = "", $bgBlack = "")
{
    echo "<h1>Parsing $dir </h1>";

    if ($handle = opendir($dir)) {
        /* This is the correct way to loop over the directory. */
        while (false !== ($entry = readdir($handle))) {


            if (!is_dir($dir . $entry)) {

                if (strstr($entry, ".svg")) {

                    $suffix = preg_replace("/.*?45(.*+)/s", "45$1", $entry);
                    $filename = $prefix . $suffix;

                    $data = file_get_contents($dir . $entry);

                    foreach ($replacements as $from => $to) {
                        $data = str_replace($from, $to, $data);
                    }

                    if($whiteToBlack){
                        $filename = str_replace("45w", "45b", $filename);
                    }
                    file_put_contents("output/" . $filename, $data);
                    echo $filename . "<br>";
                    echo '<div style="float:left;width:90px;background-image:url('. $bgWhite . ')">';
                    echo "<img src='output/" . $filename . "' width=\"90\">";
                    echo '</div>';
                    echo '<div style="float:left;width:90px;background-image:url('. $bgBlack . ')">';
                    echo "<img src='output/" . $filename . "' width=\"90\">";
                    echo '</div>';
                    echo '<div style="clear:both"></div>';
                }
            }
        }

        closedir($handle);
    }
}

$replacementsWhite = array(
    "#e5e0bf" => "#FFFFFF",
    "#000000" => "#1a2026"
);

$replacementsBlack = array(
    "#000000" => "#1a2026",
    "#ff0000" => "#FFF",
    'stroke-width:1.5' => 'stroke-width:1'
);

clearFiles("output/");


parseDirectory("white/", $replacementsWhite, "svg_darkgrey", false, "../board/lightest-wood.png", "../board/darkest-wood.png");
parseDirectory("black/", $replacementsBlack, "svg_darkgrey", true, "../board/lightest-wood.png", "../board/darkest-wood.png");

$replacementsWhite = array(
    "#e5e0bf" => "#c3daf9",
    "#000000" => "#1a2026"
);

$replacementsBlack = array(
    "#e5e0bf" => "#c3daf9",
    "#ff0000" => "#fff",
);



parseDirectory("alpha/white/", $replacementsWhite, "svg_alpha_blue", false, "../board/lightest-wood.png", "../board/darkest-wood.png" );
parseDirectory("alpha/black/", $replacementsBlack, "svg_alpha_blue", false, "../board/lightest-wood.png", "../board/darkest-wood.png" );