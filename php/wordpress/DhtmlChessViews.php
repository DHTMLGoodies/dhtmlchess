<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 01/02/2017
 * Time: 22:56
 */
class DhtmlChessViews
{

    private static $views = array(

        "WPGame1" => array(
            "description" => "Single Game viewer with notations in a table next to the board"
        ),
        "WPGame2" => array(
            "description" => "Single Game Viewer with notations in a table below the board"
        ),
        "WPGame3" => array(
            "description" => "Single Game Viewer with notations next to the board and stockfish JS engine below the board."
        ),

        "tactics" => array(
            "name" => "Tactics Viewer",
            "preview_link" => "",
            "description" => "",
            "options" => array(
                array("label" => "pgn", "name" => "pgn"),
                array("label" => "theme", "name" => "theme")
            )
        ),
        "viewer" => array(
            "name" => "Game Viewer",
            "preview_link" => "",
            "description" => "",
            "options" => array(
                array("label" => "pgn", "name" => "pgn"),
                array("label" => "theme", "name" => "theme")
            )
        ),


    );

}