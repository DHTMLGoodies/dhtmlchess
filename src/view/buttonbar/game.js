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
    buttonTheme:'ludo-chess-button-bar-gray',
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

    ludoConfig:function (config) {
        this.parent(config);
        this.els.chessButtons = {};
        if(config.buttons !== undefined)this.buttons = config.buttons;
        this.buttonTheme = config.buttonTheme || this.buttonTheme;
    },

    ludoRendered:function () {
        this.parent();

        this.getBody().setStyle('width', '100%');

        var buttonContainer = this.els.buttonContainer = new Element('div');
        buttonContainer.addClass('ludo-chess-button-container');
        this.getBody().adopt(buttonContainer);

        var buttons = this.buttons;

        for (var i = 0; i < buttons.length; i++) {
            buttonContainer.adopt(this.getChessButtonSeparator());
            var button = this.getChessButton(buttons[i]);
            this.els.chessButtons[buttons[i]] = button;
            buttonContainer.adopt(button);

            this.disableButton(buttons[i]);
        }
        this.enableButton('flip');

        buttonContainer.adopt(this.getChessButtonSeparator());

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
        var els = this.els.buttonContainer.getElements('div');
        var width = 0;

        for (var i = 0, count = els.length; i < count; i++) {
            if (els[i].style.display !== 'none') {
                els[i].setStyle('left', width);
                width += parseInt(els[i].getStyle('width').replace('px', ''));
                width += ludo.dom.getMW(els[i]);
                width += ludo.dom.getPW(els[i]);
                width += ludo.dom.getBW(els[i]);
            }
        }
        this.els.buttonContainer.setStyle('width', width);
    },

    addRightedgeElement:function () {
        var rightBar = new Element('div');
        rightBar.addClass('ludo-chess-button-bar-right-edge');
        this.getBody().adopt(rightBar);

        var size = rightBar.getSize();

        var bgRightBar = new Element('div');
        bgRightBar.setStyles({
            position:'absolute',
            right:'0px',
            top:0,
            width:size.x,
            height:size.y,
            'background-color':this.getBackgroundColorForRightedge()
        });
        this.getBody().adopt(bgRightBar);
    },

    getBackgroundColorForRightedge:function () {
        var el = this.getEl();
        var ret = el.getStyle('background-color');
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
            this.els.chessButtons[buttonType].style.display = 'none';
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
            this.els.chessButtons[buttonType].style.display = '';
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
            this.els.chessButtons[buttonType].addClass('ludo-chess-button-disabled');
            this.els.chessButtons[buttonType].removeClass('ludo-chess-button-over');
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
            this.els.chessButtons[buttonType].removeClass('ludo-chess-button-disabled');
        }
    },

    getChessButton:function (buttonType) {
        var el = new Element('div');
        el.setProperty('buttonType', buttonType);
        el.addClass('ludo-chess-button');
        el.addClass('ludo-chess-button-' + buttonType);
        el.addEvent('mouseenter', this.enterChessButton.bind(this));
        el.addEvent('mouseleave', this.leaveChessButton.bind(this));
        el.addEvent('click', this.clickOnButton.bind(this));
        return el;

    },

    getChessButtonSeparator:function () {
        var el = new Element('div');
        el.addClass('ludo-chess-button-separator');
        return el;
    },

    enterChessButton:function (e) {
        if (!e.target.hasClass('ludo-chess-button-disabled')) {
            e.target.addClass('ludo-chess-button-over');
        }
    },
    leaveChessButton:function (e) {
        e.target.removeClass('ludo-chess-button-over');
    },

    clickOnButton:function (e) {
        var button = e.target;
        if (!e.target.hasClass('ludo-chess-button-disabled')) {
            var buttonType = e.target.getProperty('buttonType');
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