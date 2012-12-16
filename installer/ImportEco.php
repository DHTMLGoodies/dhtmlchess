<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Alf Magne
 * Date: 19.05.12
 * Time: 14:40
 * To change this template use File | Settings | File Templates.
 */
class ImportEco
{

    public function import(){
        $obj = new EcoImport();
        $obj->import("eco.pgn");
    }
}
