<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Alf Magne
 * Date: 19.05.12
 * Time: 13:37
 * To change this template use File | Settings | File Templates.
 */

require_once("../../../installer/ChessInstaller.php");
require_once("../../../autoloader.php");
require_once("../../../db-connection.php");
require_once("../../../php/chess-config.php");

class InstallerTest extends PHPUnit_Framework_TestCase
{

    public function tearDown(){
        $this->dropDummyColumn();
        $this->revertTable();
    }

    /**
     * @test
     */
    public function testShouldReadLicenseKey(){
        // given
        $installer = new ChessInstaller('dhtml-chess.com');
        // when
        $lk = $installer->getLicenseKey();
        // then
        $this->assertEquals('dhtml-chess.com', $lk);
    }


    public function testShouldValidateLicenseKey(){

    }

    public function testShouldFindIfATableExists(){
        // given
        // when
        $tableInstaller = new TableInstaller(new ChessFolder);
        // then
        $this->assertTrue($tableInstaller->tableExists());

    }

    public function testShouldFindIfATableDoesNotExists(){
        // given
        $chessFolder = $this->getMock('ChessFolder', array('getTableName'));
        $chessFolder->expects($this->any())->method('getTableName')->will($this->returnValue('testDummyTable'));
        // when
        $tableInstaller = new TableInstaller($chessFolder);
        // then
        $this->assertFalse($tableInstaller->tableExists());
    }

    public function testShouldFindAddedColumns()
    {
        // given
        $chessFolder = $this->getMockWithColumnAdded();
        $tableInstaller = new TableInstaller($chessFolder);

        // when
        $addedColumns = $tableInstaller->getAddedColumns();

        // then
        $this->assertEquals(1, count($addedColumns));
        $this->assertEquals('test_field', $addedColumns[0]['Field']);
        $this->assertEquals('int(11)', $addedColumns[0]['Type']);

    }

    private function getMockWithColumnAdded(){
        $this->dropDummyColumn();
        $chessFolder = $this->getMock('ChessFolder', array('getTableColumns'));

        $newColumn = array('test_field' => 'int(11)');
        $chessFolder->expects($this->any())->method('getTableColumns')->will($this->returnValue($this->getTableWithColumnAdded($newColumn)));
        return $chessFolder;
    }

    private function getTableWithColumnAdded($column)
    {
        $obj = new ChessFolder;
        $def = $obj->getTableColumns();
        $def = array_merge($def, $column);

        return $def;
    }

    public function testShouldFindModifiedColumns(){
        // given
        $chessFolder = $this->getMockWithColumnModified();
        $tableInstaller = new TableInstaller($chessFolder);

        // when
        $modifiedColumns = $tableInstaller->getModifiedColumns();

        $expectedCol1 = array('Field' => 'title', 'Type' => 'varchar(255)');
        $expectedCol2 = array('Field' => 'parent_folder_id', 'Type' => 'int(9)');
        // then
        $this->assertEquals(2, count($modifiedColumns));
        $this->assertContains($expectedCol1, $modifiedColumns);
        $this->assertContains($expectedCol2, $modifiedColumns);
    }

    public function testShouldBeAbleToUpdateModifiedColumns(){
        // given
        $chessFolder = $this->getMockWithColumnModified();
        $tableInstaller = new TableInstaller($chessFolder);
        // when
        $tableInstaller->update();

        // then
        $this->assertTrue($this->isTitleColumnModified());
        $this->assertTrue($this->isParentIdColumnModified());
    }


    private function getMockWithColumnModified(){
        $this->revertTable();


        $chessFolder = $this->getMock('ChessFolder', array('getTableColumns'));

        $obj = new ChessFolder;
        $columns = $obj->getTableColumns();
        $columns['title'] = 'varchar(255)';
        $columns['parent_folder_id'] = 'int(9)';


        $chessFolder->expects($this->any())->method('getTableColumns')->will($this->returnValue($columns));
        return $chessFolder;
    }

    public function testShouldBeAbleToAddMissingTableColumns(){
        // given
        $chessFolder = $this->getMockWithColumnAdded();
        $tableInstaller = new TableInstaller($chessFolder);
        // when
        $tableInstaller->update();

        // then
        $this->assertTrue($this->isDummyColumnAddedToDb());

    }

    private function dropDummyColumn(){
        @mysql_query("alter table chess_folder drop test_field");
    }

    private function revertTable(){
        mysql_query("alter table chess_folder modify title varchar(512)");
        mysql_query("alter table chess_folder modify parent_folder_id int(11)");
    }

    private function isDummyColumnAddedToDb(){
        $res = mysql_query("SHOW FULL COLUMNS FROM  chess_folder") or die(mysql_error());
        while($row = mysql_fetch_assoc($res)){
            if($row['Field'] == 'test_field')return true;
        }
        return false;
    }

    private function isTitleColumnModified(){
        return $this->isColumnModifiedTo('title', 'varchar(255)');
    }
    private function isParentIdColumnModified(){
        return $this->isColumnModifiedTo('parent_folder_id', 'int(9)');
    }
    private function isColumnModifiedTo($name, $type){
        $res = mysql_query("SHOW FULL COLUMNS FROM  chess_folder") or die(mysql_error());
        while($row = mysql_fetch_assoc($res)){
            if($row['Field'] == $name && $row['Type'] == $type)return true;
        }
        return false;
    }
}
