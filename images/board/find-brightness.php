<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 21/01/2017
 * Time: 19:30
 */


$dir = ".";

$filenames = array();
if ($handle = opendir($dir)) {
    while (false !== ($entry = readdir($handle))) {
        if (!is_dir($dir . $entry)) {

            if (strstr($entry, ".png")) {
                $filenames[] = array(
                    'file' => $entry
                );
            }
        }
    }

}
// loop though each file
foreach ($filenames as $index => $filename) {
    $hsv = getAvgHSV($filename["file"], 10);
    $filenames[$index]["h"] = $hsv["h"];
    $filenames[$index]["s"] = $hsv["s"];
    $filenames[$index]["v"] = $hsv["v"];
}

file_put_contents("files.json", json_encode($filenames));

exit;

function RGBtoHSV($R, $G, $B)    // RGB values:    0-255, 0-255, 0-255
{                                // HSV values:    0-360, 0-100, 0-100
    // Convert the RGB byte-values to percentages
    $R = ($R / 255);
    $G = ($G / 255);
    $B = ($B / 255);

    // Calculate a few basic values, the maximum value of R,G,B, the
    //   minimum value, and the difference of the two (chroma).
    $maxRGB = max($R, $G, $B);
    $minRGB = min($R, $G, $B);
    $chroma = $maxRGB - $minRGB;

    // Value (also called Brightness) is the easiest component to calculate,
    //   and is simply the highest value among the R,G,B components.
    // We multiply by 100 to turn the decimal into a readable percent value.
    $computedV = 100 * $maxRGB;

    // Special case if hueless (equal parts RGB make black, white, or grays)
    // Note that Hue is technically undefined when chroma is zero, as
    //   attempting to calculate it would cause division by zero (see
    //   below), so most applications simply substitute a Hue of zero.
    // Saturation will always be zero in this case, see below for details.
    if ($chroma == 0)
        return array(0, 0, $computedV);

    // Saturation is also simple to compute, and is simply the chroma
    //   over the Value (or Brightness)
    // Again, multiplied by 100 to get a percentage.
    $computedS = 100 * ($chroma / $maxRGB);

    // Calculate Hue component
    // Hue is calculated on the "chromacity plane", which is represented
    //   as a 2D hexagon, divided into six 60-degree sectors. We calculate
    //   the bisecting angle as a value 0 <= x < 6, that represents which
    //   portion of which sector the line falls on.
    if ($R == $minRGB)
        $h = 3 - (($G - $B) / $chroma);
    elseif ($B == $minRGB)
        $h = 1 - (($R - $G) / $chroma);
    else // $G == $minRGB
        $h = 5 - (($B - $R) / $chroma);

    // After we have the sector position, we multiply it by the size of
    //   each sector's arc (60 degrees) to obtain the angle in degrees.
    $computedH = 60 * $h;

    return array("h" => $computedH, "s" => $computedS, "v" =>$computedV);
}


// get average luminance, by sampling $num_samples times in both x,y directions
function getAvgHSV($filename, $num_samples = 10)
{
    $img = imagecreatefrompng($filename);

    $width = imagesx($img);
    $height = imagesy($img);

    $x_step = intval($width / $num_samples);
    $y_step = intval($height / $num_samples);

    $total_lum = 0;

    $sample_no = 1;

    $sumR = 0;
    $sumG = 0;
    $sumB = 0;
    
    for ($x = 0; $x < $width; $x += $x_step) {
        for ($y = 0; $y < $height; $y += $y_step) {

            $rgb = imagecolorat($img, $x, $y);
            $r = ($rgb >> 16) & 0xFF;
            $g = ($rgb >> 8) & 0xFF;
            $b = $rgb & 0xFF;
            
            $sumR += $r;
            $sumB += $g;
            $sumB += $b;

            // choose a simple luminance formula from here
            // http://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
            $lum = ($r + $r + $b + $g + $g + $g) / 6;

            $total_lum += $lum;

            // debugging code
            //           echo "$sample_no - XY: $x,$y = $r, $g, $b = $lum<br />";
            $sample_no++;
        }
    }

    
    $sumR /= $sample_no;
    $sumG /= $sample_no;
    $sumB /= $sample_no;
    
    // work out the average
    $avg_lum = $total_lum / $sample_no;
    
    return RGBtoHSV($sumR, $sumG, $sumB);

    return $avg_lum;
}
