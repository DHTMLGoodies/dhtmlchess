<?php
// @codingStandardsIgnoreFile
// @codeCoverageIgnoreStart
// this is an autogenerated file - do not edit
spl_autoload_register(
    function($class) {
        static $classes = null;
        if ($classes === null) {
            $classes = array(
                'dhtmlchessdatabase' => '/wpdb/DhtmlChessDatabase.php',
                'dhtmlchessdatabaseimportpgn' => '/wpdb/DhtmlChessDatabaseImportPgn.php',
                'dhtmlchessdatabaseinstaller' => '/wpdb/DhtmlChessDatabaseInstaller.php',
                'dhtmlchessdatabasepgnutil' => '/wpdb/DhtmlChessDatabasePgnUtil.php',
                'dhtmlchessdatabasepgn' => '/wpdb/DhtmlChessDatabasePgn.php',
                'dhtmlchesscache' => '/wpdb/DhtmlChessCache.php',
                'dhtmlchesspgnlist' => '/wpdb/DhtmlChessPgnList.php',
                'dhtmlchessexception' => '/php/wpdb/DhtmlChessException.php',
                'accessortest' => '/chessDB/ludoDB/Tests/AccessorTest.php',
                'achild' => '/chessDB/ludoDB/Tests/classes/Dependencies/AChild.php',
                'acity' => '/chessDB/ludoDB/Tests/classes/Dependencies/ACity.php',
                'allcarproperties' => '/chessDB/ludoDB/Tests/classes/AllCarProperties.php',
                'allchessfstests' => '/chessFS/tests/AllChessFSTests.php',
                'allchesstests' => '/chessDB/Tests/AllChessTests.php',
                'anotherchild' => '/chessDB/ludoDB/Tests/classes/Dependencies/AnotherChild.php',
                'aparent' => '/chessDB/ludoDB/Tests/classes/Dependencies/AParent.php',
                'asibling' => '/chessDB/ludoDB/Tests/classes/Dependencies/ASibling.php',
                'author' => '/chessDB/ludoDB/examples/mod_rewrite/Author.php',
                'board0x88config' => '/parser/Board0x88Config.php',
                'book' => '/chessDB/ludoDB/examples/mod_rewrite/Book.php',
                'bookauthor' => '/chessDB/ludoDB/examples/mod_rewrite/BookAuthor.php',
                'bookauthors' => '/chessDB/ludoDB/examples/mod_rewrite/BookAuthors.php',
                'brand' => '/chessDB/ludoDB/Tests/classes/Brand.php',
                'cachetest' => '/chessDB/ludoDB/Tests/CacheTest.php',
                'capital' => '/chessDB/ludoDB/Tests/classes/JSONCaching/Capital.php',
                'capitals' => '/chessDB/ludoDB/Tests/classes/JSONCaching/Capitals.php',
                'car' => '/chessDB/ludoDB/Tests/classes/Car.php',
                'carcollection' => '/chessDB/ludoDB/Tests/classes/CarCollection.php',
                'carproperties' => '/chessDB/ludoDB/Tests/classes/CarProperties.php',
                'carproperty' => '/chessDB/ludoDB/Tests/classes/CarProperty.php',
                'carswithproperties' => '/chessDB/ludoDB/Tests/classes/CarsWithProperties.php',
                'chat' => '/chessDB/chat/Chat.php',
                'chatmessage' => '/chessDB/chat/ChatMessage.php',
                'chatmessages' => '/chessDB/chat/ChatMessages.php',
                'chess_json' => '/CHESS_JSON.php',
                'chessdbinstaller' => '/chessDB/ChessDBInstaller.php',
                'chessengine' => '/engine/ChessEngine.php',
                'chessfileupload' => '/chessDB/ChessFileUpload.php',
                'chessfs' => '/chessFS/ChessFS.php',
                'chessfspgn' => '/chessFS/ChessFSPgn.php',
                'chesslogin' => '/chessDB/Login.php',
                'chessprogressbar' => '/db/ChessProgressBar.php',
                'chessprogressbarcompletedstep' => '/db/ChessProgressBarCompletedStep.php',
                'chessprogressbartemplate' => '/db/ChessProgressBarTemplate.php',
                'chessprogressbartplstep' => '/db/ChessProgressBarTplStep.php',
                'chessregistry' => '/ChessRegistry.php',
                'chessroles' => '/chessDB/Roles.php',
                'chesssessiontest' => '/chessDB/Tests/SessionTest.php',
                'chesstests' => '/chessDB/Tests/ChessTests.php',
                'chessuserroles' => '/ChessUserRoles.php',
                'city' => '/chessDB/ludoDB/Tests/classes/City.php',
                'client' => '/chessDB/ludoDB/Tests/classes/Client.php',
                'collectiontest' => '/chessDB/ludoDB/Tests/CollectionTest.php',
                'columnaliastest' => '/chessDB/ludoDB/Tests/ColumnAliasTest.php',
                'configparsertest' => '/chessDB/ludoDB/Tests/ConfigParserTest.php',
                'configparsertestjson' => '/chessDB/ludoDB/Tests/ConfigParserTestJSON.php',
                'countries' => '/chessDB/player/Countries.php',
                'country' => '/chessDB/player/Country.php',
                'database' => '/chessDB/Database.php',
                'databases' => '/chessDB/Databases.php',
                'democities' => '/chessDB/ludoDB/examples/cities/DemoCities.php',
                'democity' => '/chessDB/ludoDB/examples/cities/DemoCity.php',
                'democountries' => '/chessDB/ludoDB/examples/cities/DemoCountries.php',
                'democountry' => '/chessDB/ludoDB/examples/cities/DemoCountry.php',
                'demostate' => '/chessDB/ludoDB/examples/cities/DemoState.php',
                'demostates' => '/chessDB/ludoDB/examples/cities/DemoStates.php',
                'dgtgameparser' => '/parser/DGTGameParser.php',
                'eco' => '/chessDB/eco/Eco.php',
                'ecomoves' => '/chessDB/eco/EcoMoves.php',
                'ecomovesdetailed' => '/chessDB/eco/EcoMovesDetailed.php',
                'fen' => '/chessDB/Fen.php',
                'fenparser0x88' => '/parser/FenParser0x88.php',
                'fentest' => '/chessDB/Tests/FenTest.php',
                'folder' => '/chessDB/Folder.php',
                'folders' => '/chessDB/Folders.php',
                'forsqltest' => '/chessDB/ludoDB/Tests/classes/ForSQLTest.php',
                'fs_gametest' => '/chessFS/tests/FS_GameTest.php',
                'fs_testbase' => '/chessFS/tests/FS_TestBase.php',
                'game' => '/chessDB/game/Game.php',
                'gameimport' => '/chessDB/game/GameImport.php',
                'gameparser' => '/parser/GameParser.php',
                'games' => '/chessDB/game/Games.php',
                'gametest' => '/chessDB/Tests/GameTest.php',
                'grandparent' => '/chessDB/ludoDB/Tests/classes/Dependencies/GrandParent.php',
                'importtest' => '/chessDB/Tests/ImportTest.php',
                'jsontest' => '/chessDB/ludoDB/Tests/JSONTest.php',
                'leafnode' => '/chessDB/ludoDB/Tests/classes/LeafNode.php',
                'leafnodes' => '/chessDB/ludoDB/Tests/classes/LeafNodes.php',
                'ludodb' => '/chessDB/ludoDB/LudoDB.php',
                'ludodbadapter' => '/chessDB/ludoDB/LudoDBInterfaces.php',
                'ludodbadaptertest' => '/chessDB/ludoDB/Tests/LudoDBAdapterTest.php',
                'ludodbcache' => '/chessDB/ludoDB/LudoDBCache.php',
                'ludodbclassnotfoundexception' => '/chessDB/ludoDB/LudoDBExceptions.php',
                'ludodbcollection' => '/chessDB/ludoDB/LudoDBCollection.php',
                'ludodbcollectionconfigparser' => '/chessDB/ludoDB/LudoDBCollectionConfigParser.php',
                'ludodbconfigparser' => '/chessDB/ludoDB/LudoDBConfigParser.php',
                'ludodbconnectionexception' => '/chessDB/ludoDB/LudoDBExceptions.php',
                'ludodbexception' => '/chessDB/ludoDB/LudoDBExceptions.php',
                'ludodbinvalidconfigexception' => '/chessDB/ludoDB/LudoDBExceptions.php',
                'ludodbinvalidserviceexception' => '/chessDB/ludoDB/LudoDBExceptions.php',
                'ludodbiterator' => '/chessDB/ludoDB/LudoDBIterator.php',
                'ludodbmodel' => '/chessDB/ludoDB/LudoDBModel.php',
                'ludodbmodeltests' => '/chessDB/ludoDB/Tests/LudoDBModelTests.php',
                'ludodbmysql' => '/chessDB/ludoDB/LudoDBMysql.php',
                'ludodbmysqli' => '/chessDB/ludoDB/LudoDBMySqlI.php',
                'ludodbobject' => '/chessDB/ludoDB/LudoDBObject.php',
                'ludodbobjectnotfoundexception' => '/chessDB/ludoDB/LudoDBExceptions.php',
                'ludodbpdo' => '/chessDB/ludoDB/LudoDBPDO.php',
                'ludodbregistry' => '/chessDB/ludoDB/LudoDBRegistry.php',
                'ludodbrequesthandler' => '/chessDB/ludoDB/LudoDBRequestHandler.php',
                'ludodbservice' => '/chessDB/ludoDB/LudoDBInterfaces.php',
                'ludodbservicenotimplementedexception' => '/chessDB/ludoDB/LudoDBExceptions.php',
                'ludodbsql' => '/chessDB/ludoDB/LudoDBSql.php',
                'ludodbtreecollection' => '/chessDB/ludoDB/LudoDBTreeCollection.php',
                'ludodbtreecollectiontest' => '/chessDB/ludoDB/Tests/LudoDBTreeCollectionTest.php',
                'ludodbunauthorizedexception' => '/chessDB/ludoDB/LudoDBExceptions.php',
                'ludodbutility' => '/chessDB/ludoDB/LudoDBUtility.php',
                'ludodbutilitymock' => '/chessDB/ludoDB/Tests/LudoDBUtilityTest.php',
                'ludodbutilitytest' => '/chessDB/ludoDB/Tests/LudoDBUtilityTest.php',
                'manager' => '/chessDB/ludoDB/Tests/classes/Manager.php',
                'metadata' => '/chessDB/game/Metadata.php',
                'metadatacollection' => '/chessDB/game/MetadataCollection.php',
                'metadatatest' => '/chessDB/Tests/MetadataTest.php',
                'metadatavalue' => '/chessDB/game/MetadataValue.php',
                'move' => '/chessDB/game/Move.php',
                'movebuilder' => '/parser/MoveBuilder.php',
                'moves' => '/chessDB/game/Moves.php',
                'movie' => '/chessDB/ludoDB/Tests/classes/Movie.php',
                'mysqlitests' => '/chessDB/ludoDB/Tests/MysqlITests.php',
                'noludodbclass' => '/chessDB/ludoDB/Tests/classes/Dependencies/NoLudoDBClass.php',
                'parsertest' => '/parser/test/ParserTest.php',
                'pdotests' => '/chessDB/ludoDB/Tests/PDOTests.php',
                'people' => '/chessDB/ludoDB/Tests/classes/People.php',
                'peopleplain' => '/chessDB/ludoDB/Tests/classes/PeoplePlain.php',
                'performancetest' => '/chessDB/ludoDB/Tests/PerformanceTest.php',
                'person' => '/chessDB/ludoDB/Tests/classes/Person.php',
                'personforconfigparser' => '/chessDB/ludoDB/Tests/classes/PersonForConfigParser.php',
                'pgngameparser' => '/parser/PgnGameParser.php',
                'pgnparser' => '/parser/PgnParser.php',
                'phone' => '/chessDB/ludoDB/Tests/classes/Phone.php',
                'phonecollection' => '/chessDB/ludoDB/Tests/classes/PhoneCollection.php',
                'player' => '/chessDB/player/Player.php',
                'playerbyname' => '/chessDB/player/PlayerByName.php',
                'playerbyusernamepassword' => '/chessDB/player/PlayerByUsernamePassword.php',
                'playertest' => '/chessDB/Tests/PlayerTest.php',
                'profiling' => '/Profiling.php',
                'remotefilereader' => '/RemoteFileReader.php',
                'requesthandlermock' => '/chessDB/ludoDB/Tests/classes/RequestHandlerMock.php',
                'requesthandlertest' => '/chessDB/ludoDB/Tests/RequestHandlerTest.php',
                'section' => '/chessDB/ludoDB/Tests/classes/Section.php',
                'seek' => '/chessDB/Seek.php',
                'seektest' => '/chessDB/Tests/SeekTest.php',
                'services_json' => '/jsonwrapper/JSON/JSON.php',
                'services_json_assocarray_testcase' => '/jsonwrapper/JSON/Test-JSON.php',
                'services_json_empties_testcase' => '/jsonwrapper/JSON/Test-JSON.php',
                'services_json_encdec_testcase' => '/jsonwrapper/JSON/Test-JSON.php',
                'services_json_error' => '/jsonwrapper/JSON/JSON.php',
                'services_json_errorsuppression_testcase' => '/jsonwrapper/JSON/Test-JSON.php',
                'services_json_nestedarray_testcase' => '/jsonwrapper/JSON/Test-JSON.php',
                'services_json_object_testcase' => '/jsonwrapper/JSON/Test-JSON.php',
                'services_json_spaces_comments_testcase' => '/jsonwrapper/JSON/Test-JSON.php',
                'services_json_unquotedkeys_testcase' => '/jsonwrapper/JSON/Test-JSON.php',
                'session' => '/chessDB/Session.php',
                'sqltest' => '/chessDB/ludoDB/Tests/SQLTest.php',
                'testbase' => '/chessDB/ludoDB/Tests/TestBase.php',
                'testcountry' => '/chessDB/ludoDB/Tests/classes/TestCountry.php',
                'testgame' => '/chessDB/ludoDB/Tests/classes/TestGame.php',
                'testnode' => '/chessDB/ludoDB/Tests/classes/TestNode.php',
                'testnodes' => '/chessDB/ludoDB/Tests/classes/TestNodes.php',
                'testnodeswithleafs' => '/chessDB/ludoDB/Tests/classes/TestNodesWithLeafs.php',
                'testtable' => '/chessDB/ludoDB/Tests/classes/TestTable.php',
                'testtimer' => '/chessDB/ludoDB/Tests/classes/TestTimer.php',
                'timecontrol' => '/chessDB/TimeControl.php',
                'xhpprofiling' => '/profiling/XHPProfiling.php'
            );
        }
        $cn = strtolower($class);
        if (isset($classes[$cn])) {
            require __DIR__ . $classes[$cn];
        }
    }
);
// @codeCoverageIgnoreEnd