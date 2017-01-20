/**
 * Displays a row of button used for navigation in a game(previous move, next move etc.)
 * @namespace chess.view.buttonbar
 * @class Game
 * @extends View
 */
chess.view.buttonbar.Game = new Class({
    Extends:ludo.View,
    type:'chess.view.buttonbar.Game',
    module:'chess',
    submodule:'buttonbar.game',
    height:25,
    buttonTheme:'dhtml-chess-button-bar-gray',
    buttons:['start', 'previous', 'play', 'pause', 'next', 'end', 'flip'],
    isAtEndOfBranch:false,

    setController:function (controller) {
        this.parent(controller);

        this.controller.addEvent('startOfGame', this.startOfGame.bind(this));
        this.controller.addEvent('notStartOfGame', this.notStartOfBranch.bind(this));
        this.controller.addEvent('endOfBranch', this.endOfBranch.bind(this));
        this.controller.addEvent('notEndOfBranch', this.notEndOfBranch.bind(this));
        this.controller.addEvent('startAutoplay', this.startAutoPlay.bind(this));
        this.controller.addEvent('stopAutoplay', this.stopAutoPlay.bind(this));
        this.controller.addEvent('newGame', this.newGame.bind(this));
    },

    __construct:function (config) {
        this.parent(config);
        this.els.chessButtons = {};
        if(config.buttons !== undefined)this.buttons = config.buttons;
        this.buttonTheme = config.buttonTheme || this.buttonTheme;
    },

    __rendered:function () {
        this.parent();

        this.getBody().css('width', '100%');

        var buttonContainer = this.els.buttonContainer = $('<div class="dhtml-chess-button-container"></div>');
        this.getBody().append(buttonContainer);

        var buttons = this.buttons;

        for (var i = 0; i < buttons.length; i++) {
            buttonContainer.append(this.getChessButtonSeparator());
            var button = this.getChessButton(buttons[i]);
            this.els.chessButtons[buttons[i]] = button;
            buttonContainer.append(button);

            this.disableButton(buttons[i]);
        }
        this.enableButton('flip');

        buttonContainer.append(this.getChessButtonSeparator());

        this.addRightedgeElement();

        this.getBody().addClass(this.buttonTheme);

        this.hideButton('pause');

        this.positionButtons();
    },
    newGame:function () {

    },
    /**
     * Method executed after moving to start of game. It will disable the "to start" and "previous" move
     * buttons
     * @method startOfGame
     * @private
     */
    startOfGame:function () {
        this.disableButton('start');
        this.disableButton('previous');
    },

    /**
     * Method executed when going from first move in a line to a move which is not the first. It will enable the "To start" and previous buttons.
     * @method notStartOfBranch
     * @private
     */
    notStartOfBranch:function () {
        this.enableButton('start');
        this.enableButton('previous');
    },

    /**
     * Method executed when going to last move in main line or a variation. It will disable the
     * "To end", "Next move", "Start autoplay" and "Pause autoplay" buttons.
     * @method endOfBranch
     * @private
     */
    endOfBranch:function () {
        this.disableButton('end');
        this.disableButton('next');
        this.disableButton('play');
        this.disableButton('pause');
        this.isAtEndOfBranch = true;
    },

    /**
     * Method executed when moving from last move in a line to a move which is not the last move in a line.
     * It will enable the "To end" and "Next move" buttons. If model is not in auto play mode, it
     * will also enable the "Play" button and hide the "Pause" button.
     * @method notEndOfBranch
     * @param {game.model.Game} model
     * @private
     */
    notEndOfBranch:function (model) {
        this.isAtEndOfBranch = false;
        this.enableButton('end');
        this.enableButton('next');
        if (!model.isInAutoPlayMode()) {
            this.showButton('play');
            this.hideButton('pause');
        }

    },

    /**
     * Method executed when auto play is started. It will enable and show the pause button and hide the play button
     * @method startAutoPlay
     * @private
     */
    startAutoPlay:function () {
        this.enableButton('pause');
        this.hideButton('play');
        this.showButton('pause');
    },

    /**
     * Method executed when auto play is stopped.
     * It will show the play button and hide the pause button. If current move on board is last move
     * in main line or a variation, the play button will be disabled
     * @method stopAutoPlay
     * @private
     */
    stopAutoPlay:function () {
        this.showButton('play');
        this.hideButton('pause');
        if(this.isAtEndOfBranch){
            this.disableButton('play');
        }
    },
    positionButtons:function () {
        var els = this.els.buttonContainer.find('> div');
        var width = 0;


        for (var i = 0, count = els.length; i < count; i++) {

            if (els[i].style.display !== 'none') {
                els[i].style.left = width + 'px';
                var el = $(els[i]);
                width += el.outerWidth();
                width += parseInt(el.css('margin-left'));
                width += parseInt(el.css('margin-right'));
            }
        }
        this.els.buttonContainer.css('width', width);
    },

    addRightedgeElement:function () {
        var rightBar = $('<div class="dhtml-chess-button-bar-right-edge"></div>');
        this.getBody().append(rightBar);

        var size = { x: rightBar.outerWidth(),y:rightBar.outerHeight() };

        var bgRightBar = $('<div></div>');
        bgRightBar.css({
            position:'absolute',
            right:'0px',
            top:0,
            width:size.x,
            height:size.y,
            'background-color':this.getBackgroundColorForRightedge()
        });
        this.getBody().append(bgRightBar);
    },

    getBackgroundColorForRightedge:function () {
        var el = this.getEl();
        var ret = el.css('background-color');
        while ((!ret || ret == 'transparent') && el.tagName.toLowerCase() !== 'body') {
            el = el.getParent();
            ret = el.getStyle('background-color');
        }
        if (ret === 'transparent') {
            ret = null;
        }

        return ret || '#FFF';
    },

    /**
     * Hide a button
     * @method hideButton
     * @param {String} buttonType
     * @private
     */
    hideButton:function (buttonType) {
        if (this.els.chessButtons[buttonType] !== undefined) {
            this.els.chessButtons[buttonType].css('display', 'none');
            this.positionButtons();
        }
    },

    /**
     * Show a button
     * @method showButton
     * @param {String} buttonType
     * @private
     */
    showButton:function (buttonType) {
        if (this.els.chessButtons[buttonType] !== undefined) {
            this.els.chessButtons[buttonType].css('display', '');
            this.enableButton(buttonType);
            this.positionButtons();
        }
    },

    /**
     * Disable a button
     * @method disableButton
     * @param {String} buttonType
     * @private
     */
    disableButton:function (buttonType) {
        if (this.els.chessButtons[buttonType] !== undefined) {
            this.els.chessButtons[buttonType].addClass('dhtml-chess-button-disabled');
            this.els.chessButtons[buttonType].removeClass('dhtml-chess-button-over');
        }
    },
    /**
     * Enable a button
     * @method enableButton
     * @param {String} buttonType
     * @private
     */
    enableButton:function (buttonType) {
        if (this.els.chessButtons[buttonType] !== undefined) {
            this.els.chessButtons[buttonType].removeClass('dhtml-chess-button-disabled');
        }
    },

    getChessButton:function (buttonType) {
        var el = $('<div></div>');
        el.attr('buttonType', buttonType);
        el.addClass('dhtml-chess-button');
        el.addClass('dhtml-chess-button-' + buttonType);
        el.mouseenter(this.enterChessButton.bind(this));
        el.mouseleave(this.leaveChessButton.bind(this));
        el.on('click', this.clickOnButton.bind(this));
        return el;

    },

    getChessButtonSeparator:function () {
        return $('<div class="dhtml-chess-button-separator"></div>');

    },

    enterChessButton:function (e) {
        if (!$(e.target).hasClass('dhtml-chess-button-disabled')) {
            $(e.target).addClass('dhtml-chess-button-over');
        }
    },
    leaveChessButton:function (e) {
        $(e.target).removeClass('dhtml-chess-button-over');
    },

    clickOnButton:function (e) {
        var button = $(e.target);
        if (!button.hasClass('dhtml-chess-button-disabled')) {
            var buttonType = button.attr('buttonType');
            if (buttonType === 'play') {
                this.enableButton('pause');
            }
            if (buttonType === 'pause') {
                this.disableButton('pause');
            }
            this.fireEvent(window.chess.events.view.buttonbar.game[buttonType]);
        }
    }
});