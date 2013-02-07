<?php
/**
 * Created by JetBrains PhpStorm.
 * User: xait0020
 * Date: 07.02.13
 * Time: 22:14
 */
class FS_TestBase extends PHPUnit_Framework_TestCase
{
    public function setUp(){
        ChessRegistry::setCacheFolder("/tmp");
    }
}
