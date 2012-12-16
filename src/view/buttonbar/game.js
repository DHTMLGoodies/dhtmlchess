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
    startOfGame:function () {
        this.disableButton('start');
        this.disableButton('previous');
    },

    notStartOfBranch:function () {
        this.enableButton('start');
        this.enableButton('previous');

    },

    endOfBranch:function () {
        this.disableButton('end');
        this.disableButton('next');
        this.disableButton('play');
        this.disableButton('pause');
        this.isAtEndOfBranch = true;
    },

    notEndOfBranch:function (model) {
        this.isAtEndOfBranch = false;
        this.enableButton('end');
        this.enableButton('next');
        if (!model.isInAutoPlayMode()) {
            this.showButton('play');
            this.hideButton('pause');
        }

    },
    startAutoPlay:function () {
        this.enableButton('pause');
        this.hideButton('play');
        this.showButton('pause');
    },
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
                width += els[i].getStyle('width').replace('px', '') / 1;
                width += ludo.dom.getBW(els[i]);
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
        var ret = null;
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

    hideButton:function (buttonType) {
        if (this.els.chessButtons[buttonType] !== undefined) {
            this.els.chessButtons[buttonType].style.display = 'none';
            this.positionButtons();
        }
    },

    showButton:function (buttonType) {
        if (this.els.chessButtons[buttonType] !== undefined) {
            this.els.chessButtons[buttonType].style.display = '';
            this.enableButton(buttonType);
            this.positionButtons();
        }
    },

    disableButton:function (buttonType) {
        if (this.els.chessButtons[buttonType] !== undefined) {
            this.els.chessButtons[buttonType].addClass('ludo-chess-button-disabled');
            this.els.chessButtons[buttonType].removeClass('ludo-chess-button-over');
        }
    },

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