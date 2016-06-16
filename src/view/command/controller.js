/**
 * Controller for the command line view
 * @namespace chess.view.command
 * @class Controller
 * @extends controller.Controller
 */
chess.view.command.Controller = new Class({
	Extends:ludo.controller.Controller,
	type:'chess.view.command.Controller',
	singleton:true,
	useController:true,
	validCommands:['help', 'move', 'cls', 'fen','load','flip','grade','back','forward'],
	module:'chess',
	submodule:'commandLine',
	addView:function (view) {
		view.addEvent('sendMessage', this.receiveMessage.bind(this));

	},

	receiveMessage:function (message) {
		if(!message)return;
		var command = this.getValidCommand(message);
		if (command) {
			this.execute(command, this.getCommandArguments(command, message));
		} else {
			this.errorMessage('Invalid command: "' + message + '"');
		}
	},

    /**
     * Add listeners to the controller
     * @method addControllerEvents
     */
	addControllerEvents:function () {
		this.controller.addEvent('invalidMove', this.onInvalidMove.bind(this));
		this.controller.addEvent('newMove', this.receiveMove.bind(this));
		this.controller.addEvent('updateMove', this.receiveMoveUpdate.bind(this));
	},

    /**
     * Return valid command name
     * @method getValidCommand
     * @param {String} command
     * @return {String|undefined}
     * @private
     */
	getValidCommand:function (command) {
		var c = command.split(/\s/)[0];
		if (this.validCommands.indexOf(c) !== -1)return c;
		if (this.isChessMove(command))return 'move';
		return undefined;
	},

    /**
     Extract command arguments from command message. The whole message would be returned
     when message is not a valid command.
     @method getCommandArguments
     @param {String} command
     @param {String} message
     @return {String}
     @private
     @example
        var args = controller.getCommandArguments('move', 'move e4');
        // will return "e4"
     */
	getCommandArguments:function (command, message) {
		var c = message.split(/\s/)[0];
		if (this.validCommands.indexOf(c) !== -1) {
			message = message.split(/\s/);
			message.splice(0, 1);
			return message.join(' ');
		}
        if(command === 'move'){
            message = message.replace(/o/g,'O');
            message = message.replace(/([nrqb])(x|[a-h])/, function(c){ return c.substr(0,1).toUpperCase() + c.substr(1); });
        }
		return message;
	},

    /**
     * Execute a command
     * @method execute
     * @param {String} command
     * @param {String} arg
     */
	execute:function (command, arg) {
		switch (command) {
			case 'help':
				this.showHelp();
				break;
			case 'cls':
				this.fireEvent('clear');
				break;
			case 'load':
				if(!isNaN(arg)){
					this.fireEvent(command,{ id : arg });
				}else{
					this.errorMessage(chess.getPhrase('Invalid game') + ': ' + arg);
				}
				break;
			case 'grade':
				arg = arg || '';
				if(this.isValidGrade(arg)){
					this.fireEvent(command, arg);
				}else{
					this.errorMessage(chess.getPhrase('Invalid grade') + ': ' + arg);
				}
				break;
			case 'fen':
				try {
					this.fireEvent('setPosition', arg);
				} catch (e) {
					this.errorMessage(chess.getPhrase('Invalid position') + ': ' + arg);
				}
				break;
			default:
				this.fireEvent(command, arg);
		}

	},

	helpMessage:undefined,
    /**
     * Show command line help screen
     * @method showHelp
     */
	showHelp:function () {
		if (this.helpMessage === undefined) {
			var msg = [];
			for (var i = 0; i < this.validCommands.length; i++) {
				var c = this.validCommands[i];
				msg.push(['<span class="chess-command-help-label">', c, '</span>: ', chess.getPhrase('command_' + c)].join(''));
			}
			this.helpMessage = msg.join('<br>');
		}

		this.message(this.helpMessage);
	},
    /**
     * Show invalid move message
     * @method onInvalidMove
     */
	onInvalidMove:function () {
		this.errorMessage(chess.getPhrase('Invalid move'));
	},
    /**
     * Using RegEx to validate a chess move.
	 * @method isChessMove
     * @param {String} move
     * @return {Boolean}
     */
	isChessMove:function (move) {
		return /([PNBRQK]?[a-h]?[1-8]?x?[a-h][1-8](?:\=[PNBRQK])?|[Oo](-?[Oo]){1,2})[\+#]?(\s*[\!\?]+)?/g.test(move)
	},
    /**
     * Receive move from main controller and display move message on screen
     * @method receiveMove
     * @param {chess.controller.Controller} controller
     * @param {chess.model.Move} move
     * @private
     */
	receiveMove:function (controller, move) {
		this.message(chess.getPhrase('Moving') + ' ' + move.lm);
	},

    /**
     * Fire a "sendMessage" event. Listening views may display this message on screen
     * (example a chess.view.command.Panel view).
     * @method message
     * @param {String} msg
     */
	message:function (msg) {
		this.fireEvent('sendMessage', msg);
	},
    /**
     * Fire a "sendErrorMessage" event. A chess.view.command.Panel view will listen to
     * this event and display the error message on screen
     * @method errorMessage
     * @param {String} msg
     */
	errorMessage:function (msg) {
		this.fireEvent('sendErrorMessage', msg);
	},

    /**
     * Returns true if passed argument is a valid move grade/short comment, i.e.
     * !,?,!!,??,!? or ?!
	 * @method isValidGrade
     * @param arg
     * @return {Boolean}
     */
	isValidGrade:function(arg){
		return ['','?','??','!','!!','?!','!?'].indexOf(arg) !== -1;
	},
    /**
     * Receive move update from main controller and fire a message event which will
     * be displayed by a chess.view.command.Panel view
     * @method recieveMoveUpdate
     * @param {chess.model.Game} model
     * @param {chess.model.Move} move
     */
	receiveMoveUpdate:function(model, move){
		this.message(chess.getPhrase('Move updated to') + ': ' + move.lm);
	}
});