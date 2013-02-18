// TODO refactor use of language so that it's possible to include a custom language file later and get it's values.
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
    'goodMove':'Good move',
    'poorMove':'Poor move',
    'veryGoodMove':'Very good move',
    'veryPoorMove':'Very poor move',
    'questionableMove':'Questionable move',
    'speculativeMove':'Speculative move',
    'positionSetup':'Position Setup',
    'castling':'Castling',
    'sideToMove':'Side to move',
    'addCommentBefore':'Add comment before',
    'addCommentAfter':'Add comment after',

    'ok':'OK',
    'cancel':'Cancel',
    'login':'Sign in',
    'logout':'Sign out',
    'email':'Email address',
    'username':'Username',
    'fullname':'Full name',
    'password':'Password',
    'repeatPassword':'Repeat password',
    'rememberMe':'Remember me',
    'register':'Register',
    'invalidUserNameOrPassword':'Invalid username or password',
    'InvalidUsername':'This username is taken',
    'invalidEmail':'Invalid email address',
    'myProfile':'My profile',
    'country':'Country',
    'changesSaved':'Changes saved successfully',
    'signedInAs':'Signed in as',

    'gameImport':'Import games(PGN)',
    'saveGame':'Save game',
    'Game':'Game',

    'tacticPuzzleSolvedTitle' : 'Well done - Puzzle complete',
    'tacticPuzzleSolvedMessage':'Good job! You have solved this puzzle. Click OK to load next game',


	'commandWelcome' : 'Type in your commands. For help, type help (+ enter).',
	'command_help' : 'Displays help screen',
	'command_move' : 'Type "move + notation" or notation only(e.g. "e4") to add moves',
	'command_cls' : 'Clear screen',
	'command_load' : 'Load a specific game with this id from the database',
	'command_flip' : 'Flip board',
	'command_grade' : 'Grade current move',
	'command_forward' : 'Go to next move',
	'command_back' : 'Go to previous move',
	'command_fen' : 'Loads a fen position, example "fen 6k1/8/6p1/8/8/1P6/2b5/5K2 w - - 0 1"',

	"invalid game": "Invalid game",
	"invalid position": "Invalid game",
	"invalid move": "Invalid move",
	"Moving": "Moving",
	"Move updated to": "Move updated to"
};

chess.getPhrase = function(phrase){
	return chess.language[phrase] !== undefined ? chess.language[phrase] : phrase;
};