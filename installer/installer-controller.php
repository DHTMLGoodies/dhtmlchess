<?php
/**
 * Controller for the Chess installer
 */
date_default_timezone_set('Europe/Berlin');
error_reporting(E_ALL);
ini_set('display_errors','on');
require_once("ChessInstaller.php");
require_once("../php/jsonwrapper/jsonwrapper.php");
require_once("../autoloader.php");

if(isset($_POST['request'])){
    $request = $_POST['request'];

    switch($request['id']){
        case 'testConnection':
            $response = ChessInstaller::testDBConnection($request['data']);
            $data = Chess_JSON::getJSON($response['data'], true, $response['message']);
            break;
        case 'md5Validation':
            $data['value'] = strtoupper(md5(ChessLicense::getKey()));
            Chess_JSON::getJSON($data);
            break;
        case 'getConnectionDetails':
            $data = array(
               'writeAccess' => ChessInstaller::hasWriteAccessToDbConfigFile(),
               'details' => array()
           );
           Chess_JSON::getJSON($data);
            break;
        case 'getWriteAccess':
            $data = array('writeAccess' => ChessInstaller::hasWriteAccessToDbConfigFile());
            Chess_JSON::getJSON($data);
            break;
        case 'validateLicense':
            if(ChessLicense::getKey() == $request['data']['key']){
                $success = true;
            }else{
                $success = false;
            }
            Chess_JSON::getJSON(array(), $success);
            break;
        case 'chess-installer':
            error_reporting(E_ALL);
            ini_set('display_errors', 'on');
            $data = $request['data'];
            $installer = new ChessInstaller($data['installationKey']);
            $installer->install($data);

            Chess_JSON::getJSON(array(
                'message' => 'installation complete'
            ));
            break;
    }
}


