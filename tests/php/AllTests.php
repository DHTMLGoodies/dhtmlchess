<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Alf Magne
 * Date: 03.11.12
 * Time: 18:26
 * To change this template use File | Settings | File Templates.
 */
require_once 'PHPUnit/Autoload.php';
require_once 'PHPUnit/TextUI/TestRunner.php';
class AllTests {

	public static function main() {
		PHPUnit_TextUI_TestRunner::run(self::suite());
	}

	public static function suite() {
		$suite = new PHPUnit_Framework_TestSuite();
		$suite->setName('AllTests');
		$suite->addTestSuite("Installer_InstallerTest");
		$suite->addTestSuite("Installer_InstallerTest");

		return $suite;
	}
}
