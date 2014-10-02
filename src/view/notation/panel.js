/**
  Game notation panel.
  @namespace chess.view.notation
  @class Panel
  @extends View
  @constructor
  @param {Object} config
  @example
 	children:[
 	...
 	{
		 type:'chess.view.notation.Panel',
		 notations:'long',
		 showContextMenu:true
	 }
 	...
 */
chess.view.notation.Panel = new Class({
    Extends:ludo.View,
    type:'chess.view.notation.Panel',
    module:'chess',
    submodule:'notation',
    css : {
        'overflow-y' : 'auto'
    },
    highlightedMove:undefined,
    moveMap:{},
    moveMapNotation:{},
    notationKey:'m',
	/**
	 * Long or short notations. Example of long: "e2-e4". Example of short: "e4".
	 * Valid values : "short" and "long"
	 * @config notations
	 * @type {String}
	 * @default 'short'
	 */
    notations:'short',
    contextMenuMove:undefined,
    currentMoveIndex:0,
    moveIdPrefix:'',
    tactics:false,
    comments:true,
    currentModelMoveId:undefined,

	/**
	 * Show context menu for grading of moves, comments etc
	 * @config showContextMenu
	 * @type {Boolean}
	 * @default false
	 */
    showContextMenu : false,

    setController:function (controller) {
        this.parent(controller);
        this.controller = controller;
        this.controller.addEvent('startOfGame', this.goToStartOfBranch.bind(this));
        this.controller.addEvent('newGame', this.showMoves.bind(this));
        this.controller.addEvent('deleteMove', this.showMoves.bind(this));
        this.controller.addEvent('setPosition', this.setCurrentMove.bind(this));
        this.controller.addEvent('nextmove', this.setCurrentMove.bind(this));
        this.controller.addEvent('updateMove', this.updateMove.bind(this));
        this.controller.addEvent('newMove', this.appendMove.bind(this));
		this.controller.addEvent('beforeLoad', this.beforeLoad.bind(this));
		this.controller.addEvent('afterLoad', this.afterLoad.bind(this));
        // this.controller.addEvent('newVariation', this.createNewVariation.bind(this));
    },


	beforeLoad:function(){
		this.shim().show(chess.getPhrase('Loading game'));
	},

	afterLoad:function(){
		this.shim().hide();
	},

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['notations','showContextMenu','comments']);

        if(this.showContextMenu)this.contextMenu = this.getContextMenuConfig();

        this.notationKey = this.notations === 'long' ? 'lm' : 'm';
        this.moveIdPrefix = 'move-' + String.uniqueID() + '-';
    },

    showPlayedOnly:function () {
        this.tactics = true;
    },

    getContextMenuConfig:function () {
        return {
            listeners:{
                click:function (el) {
                    switch (el.action) {
                        case 'grade':
                            this.fireEvent('gradeMove', [this.getContextMenuMove(), el.icon]);
                            break;
                        case 'commentBefore':
                            this.fireEvent('commentBefore', [this.getContextMenuMove(), el.icon]);
                            break;
                        case 'commentAfter':
                            this.fireEvent('commentAfter', [this.getContextMenuMove(), el.icon]);
                            break;
                    }
                }.bind(this),
                selectorclick:function (el) {
                    this.setContextMenuMove(el);
                }.bind(this)
            },
            selector:'notation-chess-move',
            children:[
                { label:chess.getPhrase('Add comment before'), action : 'commentBefore' },
                { label:chess.getPhrase('Add comment after'), action : 'commentAfter'},
                { label:'Grade', children:[
                    { icon:'', label:chess.getPhrase('Clear'), action:'grade' },
                    { icon:'!', label:chess.getPhrase('Good move'), action:'grade' },
                    { icon:'?', label:chess.getPhrase('Poor move'), action:'grade' },
                    { icon:'!!', label:chess.getPhrase('Very good move'), action:'grade' },
                    { icon:'??', label:chess.getPhrase('Very poor move'), action:'grade' },
                    { icon:'?!', label:chess.getPhrase('Questionable move'), action:'grade' },
                    { icon:'!?', label:chess.getPhrase('Speculative move'), action:'grade' }
                ]},
                { label:'Delete remaining moves'}
            ]
        };
    },
    ludoEvents:function () {
        this.getBody().addEvent('click', this.clickOnMove.bind(this));
    },

    ludoDOM:function () {
        this.parent();
        this.getEl().addClass('chess-notation-panel');
    },

    setContextMenuMove:function (el) {
        this.contextMenuMove = { uid:el.getProperty('moveId')}
    },

    getContextMenuMove:function () {
        return this.contextMenuMove;
    },

    clickOnMove:function (e) {
        if (e.target.hasClass('notation-chess-move')) {
            this.fireEvent('setCurrentMove', { uid:e.target.getProperty('moveId')});
            this.highlightMove(e.target);
        }
    },
    goToStartOfBranch:function () {
        this.clearHighlightedMove();
    },

    setCurrentMove:function (model) {
        var move = model.getCurrentMove();

        if (move) {
            this.highlightMove(document.id(this.moveMapNotation[move.uid]));
        } else {
            this.clearHighlightedMove();
        }
    },
    highlightMove:function (move) {
        this.clearHighlightedMove();

        if(move == undefined)return;

        move.addClass('notation-chess-move-highlighted');

        this.highlightedMove = move.id;
        this.scrollMoveIntoView(move);
    },

    clearHighlightedMove:function () {
        var el;
        if (el = document.getElementById(this.highlightedMove)) {
            ludo.dom.removeClass(el, 'notation-chess-move-highlighted');
        }
    },

    scrollMoveIntoView:function (move) {
        var scrollTop = this.getBody().scrollTop;
        var bottomOfScroll = scrollTop + this.getBody().clientHeight;

        if ((move.offsetTop + 40) > bottomOfScroll) {
            this.getBody().scrollTop = scrollTop + 40;
        } else if (move.offsetTop < scrollTop) {
            this.getBody().scrollTop = move.offsetTop - 5;
        }
    },

    showMoves:function (model) {
        var move = model.getCurrentMove();
        if(move != undefined){
            this.currentModelMoveId = move.uid;
        }
        this.getBody().set('html', '');
        var moves = this.getMovesInBranch(model.getMoves(), 0, 0, 0, 0);
        this.getBody().set('html', moves.join(' '))
    },

    getMovesInBranch:function (branch, moveCounter, depth, branchIndex, countBranches) {
        var moves = [];

        if(this.tactics && !this.currentModelMoveId)return moves;

        if(this.tactics)depth = 0;

        moves.push('<span class="notation-branch-depth-' + depth + '">');
        if (depth) {
            switch (depth) {
                case 1:
                    if (branchIndex === 0) {
                        moves.push('[');
                    }
                    break;
                default:
                    moves.push('(');
            }
        }
        moves.push('<span class="notation-branch">');
        for (var i = 0; i < branch.length; i++) {
            var notation = branch[i][this.notationKey];
            if (i == 0 && moveCounter % 2 != 0 && notation) {
                moves.push('..' + Math.ceil(moveCounter / 2));
            }
            if (moveCounter % 2 === 0 && notation) {
                var moveNumber = (moveCounter / 2) + 1;
                moves.push(moveNumber + '. ');
            }
            if (notation) {
                moveCounter++;
            }
            this.currentMoveIndex++;
            moves.push('<span class="chess-move-container-' + branch[i].uid + '">');
            moves.push(this.getDomTextForAMove(branch[i]));
            moves.push('</span>');

            if(this.tactics && branch[i].uid === this.currentModelMoveId){
                i = branch.length;
            }else{
                if(!this.tactics || this.isCurrentMoveInVariation(branch[i])){
                    this.addVariations(branch[i], moves, moveCounter, depth);
                }
            }
        }
        moves.push('</span>');
        if (depth) {
            switch (depth) {
                case 1:
                    if (branchIndex == countBranches - 1) {
                        moves.push(']');
                    }
                    break;
                default:
                    moves.push(')');
            }
        }
        moves.push('</span>');
        return moves;
    },

    addVariations:function(move, moves, moveCounter, depth){
        if (move.variations && move.variations.length > 0) {
            for (var j = 0; j < move.variations.length; j++) {
                if (move.variations[j].length > 0) {
                    moves.push(this.getMovesInBranch(move.variations[j], moveCounter - 1, depth + 1, j, move.variations.length).join(' '));
                }
            }
        }
    },

    isCurrentMoveInVariation:function(move){
        if (move.variations && move.variations.length > 0) {
            for (var j = 0; j < move.variations.length; j++) {
                if (move.variations[j].length > 0) {
                    var m = move.variations[j];
                    if(m.uid == this.currentModelMoveId)return true;
                    if(m.variations)return this.isCurrentMoveInVariation(m);
                }
            }
        }
        return false;
    },

    getDomTextForAMove:function (move) {
        var ret = [];

        ret.push('<span id="' + move.uid + '" class="notation-chess-move-c ' + move.uid + '" moveId="' + move.uid + '">');
        if (move[this.notationKey]) {
            ret.push('<span id="move-' + move.uid + '" class="notation-chess-move chess-move-' + move.uid + '" moveId="' + move.uid + '">' + move[this.notationKey] + '</span>');
        }
        if (this.comments && move.comment) {
            ret.push('<span class="notation-comment">' + move.comment + '</span>')
        }
        ret.push('</span>');

        this.moveMap[move.uid] = move.uid;
        this.moveMapNotation[move.uid] = 'move-' + move.uid;

        return ret.join(' ');
    },


    updateMove:function (model, move) {
        var domEl = this.getEl().getElement('.chess-move-container-' + move.uid);
        if(domEl){
            domEl.set('html', this.getDomTextForAMove(move));
        }else{
            this.showMoves(model);
        }
        this.setCurrentMove(model);
    },

    appendMove:function (model, move) {

        var previousMove = model.getPreviousMoveInBranch(move);
        if (previousMove) {
            var branch = this.getDomBranch(previousMove);
            var id = this.moveIdPrefix + this.currentMoveIndex;
            this.currentMoveIndex++;

            var moveString = '';
            var moveCounter = model.getBranch(move).length - 1 || 0;
            if (moveCounter % 2 === 0 && moveCounter > 0) {
                var moveNumber = (moveCounter / 2) + 1;
                moveString = moveNumber + '. ';
            }
            moveString += this.getDomTextForAMove(move, id);
            branch.set('html', branch.get('html') + moveString);

        } else {
            this.showMoves(model);
        }
        this.setCurrentMove(model);
    },

    getDomBranch:function (move) {
        var domEl = document.id(this.moveMap[move.uid]);
        return domEl.getParent('.notation-branch');
    },

    getFirstBranch:function () {
        return this.getBody().getElement('.notation-branch');
    }
});