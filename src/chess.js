ludo.factory.createNamespace('chess');
window.chess = {
    language:{},
    addons:{
    },
    view:{
        board:{ },
        highlight:{},
        notation:{},
        gamelist:{},
        folder:{},
        user:{},
        metadata:{},
        buttonbar:{},
        dialog:{},
        message:{},
        button : {},
        eco : {},
        tree : {},
        position : {},
        installer : {},
        command : {},
        menuItems : {}
    },
    parser:{

    },
    controller:{

    },
    model:{

    },
    remote:{

    },
    dataSource:{}
};

chess.UserRoles = {
    EDIT_GAMES : 1,
    GAME_IMPORT : 2,
    EDIT_FOLDERS : 4,
    MY_HISTORY : 8
};

chess.Views = {
    buttonbar:{
        game:'buttonbar.game'
    },
    board:{
        board:'board'
    },
    lists:{
        game:'gameList'
    }
};
window.chess.URL = '../chess-controller.php';
window.chess.ROOT = '../';
window.chess.IMAGE_FOLDER = '../images/';
window.chess.COOKIE_NAME = 'chess_cookie';
ludo_USER_CONFIG = {
    fileupload: {
        url : window.chess.URL
    },
    remote:{
        url : window.chess.URL
    },
    model : {
        save : {
            url : window.chess.URL
        },
        load : {
            url : window.chess.URL
        }
    }
};


window.chess.events = {
    game:{
        setPosition:'setPosition',
        invalidMove:'invalidMove',
        newMove:'newMove',
        noMoves:'noMoves',
        deleteMove:'deleteMove',
        newaction:'newaction',
        deleteAction:'deleteAction',
        newVariation:'newVariation',
        deleteVariation:'deleteVariation',
        startOfGame:'startOfGame',
        notStartOfGame:'notStartOfGame',
        endOfBranch:'endOfBranch',
        notEndOfBranch:'notEndOfBranch',
        endOfGame:'endOfGame',
        notEndOfGame:'notEndOfGame',
        updatecomment:'updatecomment',
        updateMetadata:'updateMetadata',
        newGame:'newGame',
        clearCurrentMove:'clearCurrentMove',
        nextmove:'nextmove',
        verifyPromotion:'verifyPromotion',
        overwriteOrVariation:'overwriteOrVariation',
        updateMove:'updateMove',
        colortomove:'colortomove',
        correctGuess:'correctGuess',
        wrongGuess:'wrongGuess',
        startAutoplay:'startAutoplay',
        stopAutoplay:'stopAutoplay'
    },

    view:{
        buttonbar:{
            game:{
                play:'play',
                start:'tostart',
                end:'toend',
                previous:'previous',
                next:'next',
                pause:'pause',
                flip:'flip'
            }
        }
    }
};

