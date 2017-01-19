<?php

/**
 * SVG Font generator.
 *  Takes a list of char => path mapping pairs and generates a font file.
 *  The generated font can then be converted to all web formats
 *   by a tool like fontsquirrel.com/fontface/generator.
 *
 *
 * Example:
 *  $glyphs = array(
 *    array( 'file'=>'letters/a.svg#lower', 'char'=>'a', 'width'=>64, 'height'=>64 ),
 *    array( 'file'=>'letters/a.svg#upper', 'char'=>chr(65) ),
 *  );
 *
 *  $font = new SVGFont('AwesomeBold');
 *
 *  $font->add($glyphs);
 *  $font->add(array( 'file'=>'letters/b.svg#lower', 'char'=>'&#x0062;' ));
 *  $font->add('B', 'letters/b.svg#upper');
 *  $font->add('I', 'm14,2v12h4v-12z');
 *
 *  $font->glyph_width = 16;
 *  $font->glyph_height = 16;
 *  $font->glyph_descent = -2;
 *
 *  $font->save('my-font.svg');
 *
 * Note:
 *  Font Squirrel tries to round path arguments to make the file size smaller.
 *  This can really mess up your pretty glyphs. To get around this, SVGFont
 *  scales up each gylph so that paths use only int values, and Font Squirrel
 *  will then leave them alone.
 *
 * Copyright (c) 2012 Andy VanWagoner
 * Licensed under MIT and BSD Licenses
 * https://github.com/thetalecrafter/php-utils
 **/
class SVGFont
{
    public
        $name = 'font',
        $units_per_em = 2048, // determines final size and precision
        $glyph_width = 32,
        $glyph_height = 32,
        $glyph_descent = -4,
        $glyphs = array();

    public function __construct($name = 'font')
    {
        $this->name = $name;
    }

    public function add($char, $path)
    {
        if (empty($char)) return;
        if (is_array($char)) {
            $glyphs = empty($char['char']) ? $char : array($char);
        } else {
            $key = stripos($path, '.svg') === false ? 'path' : 'file';
            $glyphs = array(array('char' => $char, $key => $path));
        }
        foreach ($glyphs as $glyph) {
            $glyph['char'] = htmlentities($glyph['char'], ENT_QUOTES | ENT_XML1, 'UTF-8', false);
            $this->glyphs[] = $glyph;
        }
        return $this;
    }

    public function save_glyph($glyph)
    {
        if (!empty($glyph['file'])) {
            list($file, $id) = explode('#', $glyph['file'], 2);
            $file = implode(gzfile($glyph['file']));
            $svg = new SimpleXMLElement($file);
            $svg->registerXPathNamespace('svg', 'http://www.w3.org/2000/svg');
            $xpath = empty($id) ? '//svg:path' : "//[@id='$id']";
            $path = $svg->xpath($xpath);
            $d = $this->to_path($path[0], $svg);
        } else if (!empty($glyph['path'])) {
            $d = $glyph['path'];
        }
        $height = empty($glyph['height']) ? $this->glyph_height : $glyph['height'];
        $descent = (!empty($glyph['descent'])) ? $glyph['descent'] :
            ($this->glyph_descent * $height / $this->glyph_height);
        $scale = $this->units_per_em / $height;
        $parsed = $this->parse_path($d);
        $parsed = $this->transform_path($parsed, $height, $descent);
        $path = $this->path_string($parsed, $scale);
        echo "\t\t\t<glyph unicode=\"{$glyph['char']}\" d=\"", wordwrap($path, 150, "\n\t\t\t\t"), "\" />\n";
    }

    public function to_path($elm, $svg)
    {
        if (empty($elm)) return '';
        $tag = strtolower($elm->getName());
        if ($tag === 'path') return $elm['d'];
        $fn = $tag . '_to_path';
        if (method_exists($this, $fn)) return $this->$fn($elm, $svg);
        return '';
    }

    /**
     * Parse the d attribute of an svg path element.
     **/
    public function parse_path($d)
    {
        $d = trim($d);
        $l = strlen($d);
        $path = array();
        for ($i = 0; $i < $l;) {
            while ($i < $l && (ctype_space($d[$i]) || $d[$i] === ',')) ++$i;
            if (ctype_alpha($d[$i])) {
                $type = $d[$i++];
            } else if (!empty($path) && strtolower($type) === 'm') {
                $type = ($type == 'm') ? 'l' : 'L';
            }
            $args = array($type);
            $count = 0;
            $total = $this->arg_counts[strtoupper($type)];
            while ($count < $total) {
                while ($i < $l && (ctype_space($d[$i]) || $d[$i] === ',')) ++$i;
                $start = $i;
                if ($d[$i] === '-') ++$i;
                while ($i < $l && (ctype_digit($d[$i]) || $d[$i] === '.')) ++$i;
                $args[] = (float)substr($d, $start, $i - $start);
                ++$count;
            }
            $path[] = $args;
        }
        return $path;
    }

    protected $arg_counts = array('A' => 7, 'C' => 6, 'H' => 1, 'L' => 2, 'M' => 2, 'Q' => 4, 'S' => 4, 'T' => 2, 'V' => 1, 'Z' => 0);

    /**
     * Mirror and adjust to baseline
     **/
    protected function transform_path($path, $height, $descent)
    {
        $top = ($height + $descent);
        foreach ($path as $i => $args) {
            switch ($args[0]) {
                case 'A':
                    $args[3] = ($args[1] == $args[2]) ? 0 : (540 - $args[3]) % 360;
                    $args[5] = $args[5] ? 0 : 1;
                    $args[7] = $top - $args[7];
                    break;
                case 'a':
                    $args[3] = ($args[1] == $args[2]) ? 0 : (540 - $args[3]) % 360;
                    $args[5] = $args[5] ? 0 : 1;
                    $args[7] = -$args[7];
                    break;
                case 'C':
                    $args[2] = $top - $args[2];
                    $args[4] = $top - $args[4];
                    $args[6] = $top - $args[6];
                    break;
                case 'c':
                    $args[2] = -$args[2];
                    $args[4] = -$args[4];
                    $args[6] = -$args[6];
                    break;
                case 'H':
                case 'h':
                    break;
                case 'L':
                    $args[2] = $top - $args[2];
                    break;
                case 'l':
                    $args[2] = -$args[2];
                    break;
                case 'M':
                    $args[2] = $top - $args[2];
                    break;
                case 'm':
                    $args[2] = -$args[2];
                    break;
                case 'S':
                case 'Q':
                    $args[2] = $top - $args[2];
                    $args[4] = $top - $args[4];
                    break;
                case 's':
                case 'q':
                    $args[2] = -$args[2];
                    $args[4] = -$args[4];
                    break;
                case 'T':
                    $args[2] = $top - $args[2];
                    break;
                case 't':
                    $args[2] = -$args[2];
                    break;
                case 'V':
                    $args[1] = $top - $args[1];
                    break;
                case 'v':
                    $args[1] = -$args[1];
                    break;
                case 'Z':
                case 'z':
                default:
                    break;
            }
            $path[$i] = $args;
        }
        return $path;
    }

    /**
     * Scale, and turn it back into a string
     **/
    protected function path_string($path, $scale)
    {
        $d = '';
        $type = '';
        foreach ($path as $args) {
            $d .= ' ';
            if ($args[0] !== $type && !(
                    ($args[0] === 'L' && $type === 'M') ||
                    ($args[0] === 'l' && $type === 'm'))
            ) {
                $d .= $args[0];
            }
            $type = $args[0];
            $args = array_slice($args, 1);
            if (strtolower($type) == 'a') {
                $args[0] = intval($args[0] * $scale);
                $args[1] = intval($args[1] * $scale);
                //	$args[2] = ($args[0] == $args[1]) ? 0 : $args[2]; // done in transform
                $args[3] = (int)(bool)$args[4];
                $args[4] = (int)(bool)$args[5];
                $args[5] = intval($args[5] * $scale);
                $args[6] = intval($args[6] * $scale);
            } else {
                foreach ($args as $i => $v) {
                    $args[$i] = intval($v * $scale);
                }
            }
            $d .= implode(',', $args);
        }
        return trim($d);
    }

    /**
     * Write out the font either to a file or to the output stream.
     **/
    public function save($file = null)
    {
        $scale = $this->units_per_em / $this->glyph_height;
        $height = $this->units_per_em;
        $width = intval($this->glyph_width * $scale);
        $descent = intval($this->glyph_descent * $scale);
        if ($file) ob_start();
        else header('Content-Type: image/svg+xml');
        echo '<?xml version="1.0"?>', "\n",
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">', "\n",
        '<svg xmlns="http://www.w3.org/2000/svg">', "\n",
        '	<defs>', "\n",
        '		<font id="', $this->name, '" horiz-adv-x="', $width, '">', "\n",
        '			<font-face font-family="', $this->name, '" units-per-em="', $this->units_per_em, '" ascent="', ($height + $descent), '" descent="', $descent, '" />', "\n",
        '			<missing-glyph horiz-adv-x="', ($width / 4), '" />', "\n";
        $all = '';
        foreach ($this->glyphs as $glyph) {
            $all .= $glyph['char'];
            echo $this->save_glyph($glyph);
        }
        echo '		</font>', "\n",
        '	</defs>', "\n",
        '	<text x="0" y="32" font-family="', $this->name, '" font-size="32pt">', $all, '</text>', "\n",
        '</svg>', "\n";
        if ($file) file_put_contents($file, ob_get_flush());
    }

    public static function folder($folder, $width = null, $height = null, $descent = null)
    {
        if (substr($folder, -1) == '/') $folder = substr($folder, 0, -1);
        $files = scandir($folder);
        if (empty($files)) return;
        $font = new SVGFont(basename($folder));
        if (isset($width)) $font->glyph_width = $width;
        if (isset($height)) $font->glyph_height = $height;
        if (isset($descent)) $font->glyph_descent = $descent;
        $folder .= '/';
        foreach ($files as $file) {
            if (stripos($file, '.svg') === false) continue;
            $char = reset(explode('.', $file));
            if (strlen($char) > 1) {
                if (!preg_match('/^x?[0-9a-f]+$/i', $char)) continue;
                $char = '&#' . $char . ';';
            }
            $font->add($char, $folder . $file);
        }
        $font->save();
    }
}

// command line use
if (!empty($argv) && realpath(__FILE__) === realpath($argv[0])) {
    $name = trim($argv[1]);
    $width = empty($argv[2]) ? null : (float)$argv[2];
    $height = empty($argv[3]) ? null : (float)$argv[3];
    $descent = isset($argv[4]) ? (float)$argv[4] : null;
    if ($name) SVGFont::folder($name, $width, $height, $descent);
}
// direct request use
if (empty($argv) && realpath(__FILE__) === realpath($_SERVER['SCRIPT_FILENAME'])) {
    $name = trim($_SERVER['PATH_INFO']);
    $width = empty($_GET['width']) ? null : (float)$_GET['width'];
    $height = empty($_GET['height']) ? null : (float)$_GET['height'];
    $descent = isset($_GET['descent']) ? (float)$_GET['descent'] : null;
    if ($name) SVGFont::folder($name, $width, $height, $descent);
}


$glyphs = array(
    array('file' => 'letters/a.svg#lower', 'char' => 'a', 'width' => 64, 'height' => 64),
    array('file' => 'letters/a.svg#upper', 'char' => chr(65)),
);

$font = new SVGFont('AwesomeBold');

$font->add($glyphs);
$font->add(array('file' => 'letters/b.svg#lower', 'char' => '&#x0062;'));
$font->add('B', 'letters/b.svg#upper');
$font->add('I', 'm14,2v12h4v-12z');

$font->glyph_width = 16;
$font->glyph_height = 16;
$font->glyph_descent = -2;

$font->save('my-font.svg');