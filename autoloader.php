<?php

function chessAutoload($name)
{

    if ($exists = !class_exists($name) && (file_exists($class = 'php/' . $name . '.php'))) {
        require_once($class);
    } elseif ($exists = !class_exists($name) && (file_exists($class = 'php/db/' . $name . '.php'))) {
        require_once($class);
    } elseif ($exists = !class_exists($name) && (file_exists($class = 'php/engine/' . $name . '.php'))) {
        require_once($class);
    } elseif ($exists = !class_exists($name) && (file_exists($class = 'php/parser/' . $name . '.php'))) {
        require_once($class);
    } elseif ($exists = !class_exists($name) && (file_exists($class = '../../../php/' . $name . '.php'))) {
        require_once($class);
    } elseif ($exists = !class_exists($name) && (file_exists($class = '../../../php/db/' . $name . '.php'))) {
        require_once($class);
    } elseif ($exists = !class_exists($name) && (file_exists($class = '../../../php/parser/' . $name . '.php'))) {
        require_once($class);
    } elseif ($exists = !class_exists($name) && (file_exists($class = '../php/' . $name . '.php'))) {
        require_once($class);
    } elseif ($exists = !class_exists($name) && (file_exists($class = '../php/db/' . $name . '.php'))) {
        require_once($class);
    } elseif ($exists = !class_exists($name) && (file_exists($class = '../php/parser/' . $name . '.php'))) {
        require_once($class);
    }
}

spl_autoload_register('chessAutoload');