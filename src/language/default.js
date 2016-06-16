/**
 * Default language specification
 * @type {Object}
 */
chess.language = {
    pieces:{
        'pawn':'',
        'bishop':'B',
        'rook':'R',
        'knight':'N',
        'queen':'Q',
        'king':'K'
    },
    'clear':'Clear',
    'Good move':'Good move',
    'Poor move':'Poor move',
    'Very good move':'Very good move',
    'Very poor move':'Very poor move',
    'Questionable move':'Questionable move',
    'Speculative move':'Speculative move',
    'Position Setup':'Position Setup',
    'Castling':'Castling',
    'Side to move':'Side to move',
    'Add comment before':'Add comment before',
    'Add comment after':'Add comment after',

    'OK':'OK',
    'Cancel':'Cancel',
    'Sign in':'Sign in',
    'Sign out':'Sign out',
    'E-mail':'Email address',
    'Username':'Username',
    'Full name':'Full name',
    'Password':'Password',
    'Repeat password':'Repeat password',
    'rememberMe':'Remember me',
    'register':'Register',
    'invalidUserNameOrPassword':'Invalid username or password',
    'InvalidUsername':'This username is taken',
    'invalidEmail':'Invalid email address',
    'My profile':'My profile',
    'country':'Country',
    'Changes saved successfully':'Changes saved successfully',
    'Signed in as':'Signed in as',

    'Import games(PGN)':'Import games(PGN)',
    'saveGame':'Save game',
    'Game':'Game',

    'tacticPuzzleSolvedTitle':'Well done - Puzzle complete',
    'tacticPuzzleSolvedMessage':'Good job! You have solved this puzzle. Click OK to load next game',


    'commandWelcome':'Type in your commands. For help, type help (+ enter).',
    'command_help':'Displays help screen',
    'command_move':'Type "move + notation" or notation only(e.g. "e4") to add moves',
    'command_cls':'Clear screen',
    'command_load':'Load a specific game with this id from the database',
    'command_flip':'Flip board',
    'command_grade':'Grade current move',
    'command_forward':'Go to next move',
    'command_back':'Go to previous move',
    'command_fen':'Loads a fen position, example "fen 6k1/8/6p1/8/8/1P6/2b5/5K2 w - - 0 1"',

    "invalid game":"Invalid game",
    "invalid position":"Invalid game",
    "invalid move":"Invalid move",
    "Moving":"Moving",
    "Move updated to":"Move updated to",
    "Time":"Time",
    "From elo":"From elo",
    "To elo":"To elo",
    "Rated":"Rated",
    "Pgn File" : "Pgn File"
};

chess.getPhrase = function (phrase) {
    return chess.language[phrase] !== undefined ? chess.language[phrase] : phrase;
};