<?php

class RequestHandler
{

    private $success = true;
    private $message = '';

    public function __construct()
    {

    }

    public function wasSuccess()
    {
        return $this->success;
    }

    public function getMessage()
    {
        return $this->message;
    }

    public function handle($request)
    {

        switch ($request['id']) {
            case 'getFolders':
                return $this->getFolders();
            case 'validateSession':
                return $this->validateSession($request['data']);
            case 'getGames':
                return $this->getGames($request['data']);
            case 'getGame':
                return $this->getGame($request['data']);
            case 'getModelRecord':
                return $this->getModelRecord($request['data']);
            case 'saveModelRecord':
                return $this->saveModelRecord($request['data']);
            case 'saveGame':
                return $this->saveGame($request['data']);
            case 'getEngineMove':
                return $this->getEngineMove($request['data']);
            case 'getRandomGame':
                return $this->getRandomGame($request['data']);
            case 'getEco':
                return $this->getEco($request['data']);
            case 'getEcoVariations':
                return $this->getEcoVariations($request['data']);
            case 'getDatabases':
                return $this->getDatabases($request['data']);
            case 'getFolder':
                return $this->getDatabases($request['data']);
            case 'getAllCountries':
                return ChessCountry::getAll();
            case 'login':
                return $this->login($request['data']);
            case 'register':
                return $this->register($request['data']);
            case 'game-import':
                return $this->gameImport($request['data']);
            case 'getProgress':
                return $this->getProgress($request['data']);
            default:
                header('HTTP/1.1 404 Not Found');
                return array();
        }
    }

    private function getFolders()
    {
        $folders = ChessFolderCollection::getFoldersAndDatabases();
        $tree = new ChessTree();
        $tree->addItems($folders);
        return $tree->getTree();
    }

    private function validateSession($request)
    {
        $success = ChessSession::isValidToken($request['token']);
        $data = array();
        if ($success) {
            $userId = ChessSession::getPlayerIdByToken($request['token']);
            $player = new ChessPlayer($userId);
            $data = array('token' => $request['token'], 'user_access' => $player->getUserAccess());
        }
        return $data;
    }

    private function getGames($request)
    {
        $dbObj = new ChessDatabase($request['databaseId']);
        return $dbObj->getChildren();
    }

    private function getGame($request)
    {
        $gameObj = new ChessGame($request['id']);
        return $gameObj->getJSON();
    }

    private function getModelRecord($request)
    {
        switch ($request['modelName']) {

            case 'userprofile':
                $id = ChessSession::getPlayerIdByToken($request['recordId']);
                if (isset($id)) {
                    $player = new ChessPlayer($id);
                    $data = $player->getUserDetails();
                    $data['token'] = $request['recordId'];
                    Chess_JSON::getJSON($data, true);
                } else {
                    Chess_JSON::getJSON(array(), false);
                }
                break;

        }

    }

    private function saveModelRecord($request)
    {
        switch ($request['modelName']) {
            case 'userprofile':
                $id = ChessSession::getPlayerIdByToken($request['record']['token']);
                if (isset($id)) {
                    $player = new ChessPlayer($id);
                    $request['record'] = array_merge($request['record'], $request['formData']);
                    $player->update($request['record']);
                    return array();
                } else {
                    return false;
                }
                break;
        }
    }

    private function saveGame($request)
    {
        $gameObj = new ChessGame();
        return array('id' => $gameObj->save($request['game']));
    }

    private function getRandomGame($request)
    {
        $gameId = null;
        if (isset($request['databaseId'])) {
            $chessDb = new ChessDatabase($request['databaseId']);
            $gameId = $chessDb->getRandomGameId();
        }
        $gameObj = new ChessGame($gameId);
        return $gameObj->getJSON();
    }

    private function getEngineMove($request)
    {
        $engine = new ChessEngine();
        return $engine->getMove($request['fen']);
    }

    private function getEco($request)
    {
        return ChessEco::getEco($request['fen']);
    }

    private function getEcoVariations($request)
    {
        return ChessEco::getVariations($request['fen']);
    }

    private function getDatabases($request)
    {
        return ChessDatabaseCollection::getFiltered($request['getDatabases']);
    }

    private function getFolder($request)
    {
        return ChessFolderCollection::getFilteredFolders($request['getFolder']);
    }

    private function login($request)
    {

        $token = ChessPlayer::authenticate($request['username'], $request['password']);
        $data = array('token' => $token);

        if (isset($token)) {
            $userId = ChessSession::getPlayerIdByToken($token);
            $player = new ChessPlayer($userId);
            $data['user_access'] = $player->getUserAccess();
        }
        if (!isset($token)) {
            $this->success = false;

        }
        return $data;
    }

    private function register($request)
    {

        $result = ChessPlayer::register($request);
        $this->success = $result['success'];
        $this->message = $result['message'];

        if ($result['success']) {
            return $result['data'];
        } else {
            return array();
        }
    }

    private function gameImport($request)
    {
        if (!ChessPlayer::hasLoggedOnUserAccessTo(ChessUserRoles::GAME_IMPORT)) {
            Chess_JSON::getJSON(array(), false, 'Access denied');
            die();
        }

        require_once("php/GameImport.php");
        $pgnFile = FileUpload::getFileInfo($request['pgnfile']);

        if ($request['importAsNew']) {
            $request['database'] = ChessDatabase::createNew($request['newDatabase'], $request['folder']);
        }

        $import = new GameImport();
        $import->importFromFile($pgnFile['path'], $request['database']);


        $data = array('databaseId' => $request['database']);
        Chess_JSON::getJSON($data, true);
    }

    private function getProgress($request){
        return ChessProgressBar::getStatus($request['progressBarId']);
    }
}