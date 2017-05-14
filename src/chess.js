ludo.factory.createNamespace('chess');
var _w = (function () {
    return this || (0, eval)('this');
}());

_w.chess = {
    language: {},
    action:{},
    plugins: {},
    pgn: {},
    wordpress: {},
    computer: {},
    sound: {},
    view: {
        popup:{},
        seek: {},
        board: {},
        highlight: {},
        notation: {},
        gamelist: {},
        folder: {},
        user: {},
        metadata: {},
        buttonbar: {},
        dialog: {},
        message: {},
        button: {},
        eco: {},
        pgn: {},
        tree: {},
        position: {},
        installer: {},
        command: {},
        menuItems: {},
        score: {}
    },
    parser: {},
    controller: {},
    model: {},
    remote: {},
    dataSource: {}
};

chess.UserRoles = {
    EDIT_GAMES: 1,
    GAME_IMPORT: 2,
    EDIT_FOLDERS: 4,
    MY_HISTORY: 8
};

chess.Views = {
    buttonbar: {
        game: 'buttonbar.game',
        bar: 'buttonbar.bar'
    },
    board: {
        board: 'board'
    },
    lists: {
        game: 'gameList'
    }
};

ludo.config.setDocumentRoot('../');
_w.chess.COOKIE_NAME = 'chess_cookie';

_w.chess.isWordPress = false;

_w.chess.events = {
    game: {
        clearActions: 'clearActions',
        action: 'action',
        loadGame: 'loadGame',
        setPosition: 'setPosition',
        invalidMove: 'invalidMove',
        newMove: 'newMove',
        newMoves: 'newMoves',
        noMoves: 'noMoves',
        deleteMove: 'deleteMove',
        newaction: 'newaction',
        deleteAction: 'deleteAction',
        newVariation: 'newVariation',
        deleteVariation: 'deleteVariation',
        startOfGame: 'startOfGame',
        notStartOfGame: 'notStartOfGame',
        endOfBranch: 'endOfBranch',
        notEndOfBranch: 'notEndOfBranch',
        endOfGame: 'endOfGame',
        notEndOfGame: 'notEndOfGame',
        updatecomment: 'updatecomment',
        updateMetadata: 'updateMetadata',
        newGame: 'newGame',
        clearCurrentMove: 'clearCurrentMove',
        nextmove: 'nextmove',
        verifyPromotion: 'verifyPromotion',
        overwriteOrVariation: 'overwriteOrVariation',
        updateMove: 'updateMove',
        colortomove: 'colortomove',
        correctGuess: 'correctGuess',
        wrongGuess: 'wrongGuess',
        startAutoplay: 'startAutoplay',
        stopAutoplay: 'stopAutoplay',
        gameSaved: 'gameSaved',
        beforeLoad: 'beforeLoad',
        afterLoad: 'afterLoad',
        fen: 'fen'
    },

    view: {
        buttonbar: {
            game: {
                play: 'play',
                start: 'tostart',
                end: 'toend',
                previous: 'previous',
                next: 'next',
                pause: 'pause',
                flip: 'flip'
            }
        }
    }
};

ludo.config.setUrl('../router.php');
ludo.config.setFileUploadUrl('../router.php');
ludo.config.setDocumentRoot('../');
ludo.config.disableModRewriteUrls();