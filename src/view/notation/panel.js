/**
 Chess notation panel

 CSS Classes used by the notation panel:

 div.dhtml-chess-notation-panel - for the entire panel
 span.notation-chess-move - css for a move, example: e4
 span.notation-chess-move-highlighted - css for highlighted(current) move
 span.notation-result - css for the result at the end (1-0, 1/2-1/2, 0-1)
 div.notation-branch - css for a line of moves(main line or variation)
 div.notation-branch-depth-0 - css for a lines of moves- main line has 0 at the end. A variation has 1, sub variation 2 and so on
 span.dhtml-chess-move-group - css for a pair of moves(example: 1. e4 e5)
 span.dhtml-chess-move-number - css for the move number in front of a move, example: 1.
 span.notation-comment - css for a comment

 Some css rules have default rules, so you may want to add !important; after your css settings,
 example:
 span-notation-chess-move-highlighted{
    color:#FFF; !important;
    background-color:#fff; important;
    border-radius:5px;
 }

 @namespace chess.view.notation
 @class Panel
 @extends View
 @constructor
 @param {Object} config
 @param {String} config.figurine For use of figurines(images). The chess pieces are located inside the images folder. The first characters in the file name describe their
 types, example: 'svg_alpha_bw'. It is recommended to use the files starting with 'svg' for this since these are small vector based image files.
 @param {Number} config.figurineHeight - Optional height of figurines in pixels, default: 18
 @param {Boolean} config.interactive - Boolean to allow game navigation by clicking on the moves(default: true). For tactics puzzles, the value should be false.
 @param {String} config.notations - 'short' or 'long'. Short format is 'e4'. Long format is 'e2-e4'. When using figurines, short format will always be used.
 @param {String} config.showContextMenu - True to support context menu for editing moves(grade, add comments etc). default: false
 @param {Boolean} config.showResult - Show result after last move, example: 1-0. Default: true
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
    Extends: ludo.View,
    type: 'chess.view.notation.Panel',
    module: 'chess',
    submodule: 'notation',
    css: {
        'overflow-y': 'auto'
    },
    highlightedMove: undefined,
    moveMap: {},
    moveMapNotation: {},
    notationKey: 'm',
    figurineHeight: 18,

    notations: 'short',
    contextMenuMove: undefined,
    currentMoveIndex: 0,
    moveIdPrefix: '',
    tactics: false,
    comments: true,
    currentModelMoveId: undefined,
    interactive: true,
    figurines: false,

    /**
     * Show context menu for grading of moves, comments etc
     * @config showContextMenu
     * @type {Boolean}
     * @default false
     */
    showContextMenu: false,

    showResult: false,

    setController: function (controller) {
        this.parent(controller);
        var c = this.controller = controller;
        c.on('startOfGame', this.goToStartOfBranch.bind(this));
        c.on('newGame', this.showMoves.bind(this));
        c.on('newMoves', this.showMoves.bind(this));
        c.on('deleteMove', this.showMoves.bind(this));
        c.on('setPosition', this.setCurrentMove.bind(this));
        c.on('nextmove', this.setCurrentMove.bind(this));
        c.on('correctGuess', this.setCurrentMove.bind(this));
        c.on('updateMove', this.updateMove.bind(this));
        c.on('newMove', this.appendMove.bind(this));
        c.on('beforeLoad', this.beforeLoad.bind(this));
        c.on('afterLoad', this.afterLoad.bind(this));
        // this.controller.addEvent('newVariation', this.createNewVariation.bind(this));
    },


    beforeLoad: function () {
        this.shim().show(chess.getPhrase('Loading game'));
    },

    afterLoad: function () {
        this.shim().hide();
    },

    __construct: function (config) {
        this.parent(config);
        if (!this.tactics) {
            this.showResult = true;
        }
        this.setConfigParams(config, ['showEval', 'notations', 'showContextMenu', 'comments', 'interactive', 'figurines', 'figurineHeight', 'showResult']);


        if (this.showContextMenu)this.contextMenu = this.getContextMenuConfig();

        this.notationKey = this.notations === 'long' ? 'lm' : 'm';
        this.moveIdPrefix = 'move-' + String.uniqueID() + '-';
    },

    showPlayedOnly: function () {
        this.tactics = true;
    },

    getContextMenuConfig: function () {
        return {
            listeners: {
                click: function (el) {
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
                        case 'deleteMove':
                            this.fireEvent('deleteMove', this.getContextMenuMove());
                            break;
                    }
                }.bind(this),
                selectorclick: function (el) {
                    this.setContextMenuMove(el);
                }.bind(this)
            },
            selector: '.notation-chess-move',
            children: [
                {label: chess.getPhrase('Add comment before'), action: 'commentBefore'},
                {label: chess.getPhrase('Add comment after'), action: 'commentAfter'},
                {
                    label: 'Grade', children: [
                    {icon: '', label: chess.getPhrase('Clear'), action: 'grade'},
                    {icon: '!', label: chess.getPhrase('Good move'), action: 'grade'},
                    {icon: '?', label: chess.getPhrase('Poor move'), action: 'grade'},
                    {icon: '!!', label: chess.getPhrase('Very good move'), action: 'grade'},
                    {icon: '??', label: chess.getPhrase('Very poor move'), action: 'grade'},
                    {icon: '?!', label: chess.getPhrase('Questionable move'), action: 'grade'},
                    {icon: '!?', label: chess.getPhrase('Speculative move'), action: 'grade'}
                ]
                },
                {label: chess.getPhrase('Delete Move'), action: 'deleteMove'}
            ]
        };
    },
    ludoEvents: function () {
        if (this.interactive) {
            this.$b().on('click', this.clickOnMove.bind(this));
        }
    },

    ludoDOM: function () {
        this.parent();
        this.getEl().addClass('dhtml-chess-notation-panel');
    },

    setContextMenuMove: function (el) {
        this.contextMenuMove = {uid: jQuery(el).attr('moveId')}
    },

    getContextMenuMove: function () {
        return this.contextMenuMove;
    },

    clickOnMove: function (e) {
        var el = e.target;
        if (el.tagName.toLowerCase() == 'img')el = el.parentNode;
        if (jQuery(el).hasClass('notation-chess-move')) {
            this.fireEvent('setCurrentMove', {uid: jQuery(el).attr('moveId')});
            this.highlightMove(el);
        }
    },
    goToStartOfBranch: function () {
        this.clearHighlightedMove();
        this.$b().scrollTop(0);
    },

    setCurrentMove: function (model) {

        var move = model.getCurrentMove();
        if (move) {
            this.highlightMove(jQuery("#" + this.moveMapNotation[move.uid]));
        } else {
            this.clearHighlightedMove();
        }
    },
    highlightMove: function (move) {
        this.clearHighlightedMove();
        if (move == undefined)return;
        jQuery(move).addClass('notation-chess-move-highlighted');
        this.highlightedMove = jQuery(move).attr("id");
        this.scrollMoveIntoView(move);
    },

    clearHighlightedMove: function () {
        var el;
        if (el = jQuery("#" + this.highlightedMove)) {
            el.removeClass('notation-chess-move-highlighted');
        }
    },

    scrollMoveIntoView: function (move) {

        if (!move)return;
        if (move.position == undefined)move = jQuery(move);
        if (!move || !move.length)return;

        var b = this.$b();

        var scrollTop = b.scrollTop();
        var bottomOfScroll = scrollTop + b.height();
        var moveTop = move.position().top;
        var oh = move.outerHeight();

        if ((moveTop + oh) > bottomOfScroll) {
            b.scrollTop(moveTop + oh);
        } else if (moveTop < scrollTop) {
            b.scrollTop(Math.max(0, moveTop - 5));
        }
    },

    showMoves: function (model) {
        var move = model.getCurrentMove();
        if (move != undefined) {
            this.currentModelMoveId = move.uid;
        }
        this.$b().html('');

        var moves = this.getMovesInBranch(model.getMoves(), model.getStartPly(), 0, 0, 0);

        if (this.showResult) {
            moves.push(this.getResultDOM(model));
        }
        this.$b().html(moves.join(''));
    },

    getResultDOM: function (model) {
        var res = model.getResult();
        var r = [];
        r.push('<span class="notation-result">');
        r.push(res == -1 ? '0-1' : res == 1 ? '1-0' : res == 0.5 ? '1/2-1/2' : '*');
        r.push('</span>');
        return r.join('');

    },

    getMovesInBranch: function (branch, moveCounter, depth, branchIndex, countBranches) {
        var moves = [];

        if (this.tactics && !this.currentModelMoveId)return moves;

        if (this.tactics)depth = 0;

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

        var s;
        var e = '</span>';
        var gs = false;

        for (var i = 0; i < branch.length; i++) {
            s = i == 0 ? '<span class="dhtml-chess-move-group chess-move-group-first">' : '<span class="dhtml-chess-move-group">';
            var notation = branch[i][this.notationKey];
            if (i == 0 && moveCounter % 2 != 0 && notation) {
                if (gs) {
                    moves.push(e);
                }
                moves.push('<span class="dhtml-chess-move-number">..' + Math.ceil(moveCounter / 2) + '</span>');
                moves.push(s);
                gs = true;
            }
            if (moveCounter % 2 === 0 && notation) {
                if (gs) {
                    moves.push(e);
                }
                var moveNumber = (moveCounter / 2) + 1;
                moves.push(s);
                gs = true;
                moves.push('<span class="dhtml-chess-move-number">' + moveNumber + '.</span>');
            }
            if (notation) {
                moveCounter++;
            }
            this.currentMoveIndex++;
            moves.push('<span class="dhtml-chess-move-container-' + branch[i].uid + '">');
            moves.push(this.getDomTextForAMove(branch[i]));
            moves.push('</span>');

            if (this.tactics && branch[i].uid === this.currentModelMoveId) {
                i = branch.length;
            } else {
                if (!this.tactics || this.isCurrentMoveInVariation(branch[i])) {

                    if (gs && this.hasVars(branch[i])) {
                        gs = false;
                        moves.push(e);
                    }
                    this.addVariations(branch[i], moves, moveCounter, depth);
                }
            }
        }
        if (gs) {
            moves.push('</span>');
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

    hasVars: function (move) {
        return move.variations && move.variations.length > 0;
    },

    addVariations: function (move, moves, moveCounter, depth) {
        if (move.variations && move.variations.length > 0) {
            for (var j = 0; j < move.variations.length; j++) {
                if (move.variations[j].length > 0) {
                    moves.push(this.getMovesInBranch(move.variations[j], moveCounter - 1, depth + 1, j, move.variations.length).join(' '));
                }
            }
        }
    },

    isCurrentMoveInVariation: function (move) {
        if (this.hasVars(move)) {
            for (var j = 0; j < move.variations.length; j++) {
                if (move.variations[j].length > 0) {
                    var m = move.variations[j];
                    if (m.uid == this.currentModelMoveId)return true;
                    if (m.variations)return this.isCurrentMoveInVariation(m);
                }
            }
        }
        return false;
    },

    showEval:false,

    getDomTextForAMove: function (move) {
        var ret = [];


        ret.push('<span id="' + move.uid + '" class="notation-chess-move-c ' + move.uid + '" moveId="' + move.uid + '">');


        if (move[this.notationKey]) {
            ret.push('<span id="move-' + move.uid + '" class="notation-chess-move chess-move-' + move.uid + '" moveId="' + move.uid + '">');
            if (this.figurines && move['m'].indexOf('O') == -1 && move.p.type != 'p') {
                var p = move.p;
                var c = p.color.substr(0, 1);
                var t = p.type == 'n' ? 'n' : p.type.substr(0, 1);
                var src = ludo.config.getDocumentRoot() + '/images/' + this.figurines + '45' + c + t + '.svg';
                ret.push('<img width="' + this.figurineHeight + '" height="' + this.figurineHeight + '" style="vertical-align:text-bottom;height:' + this.figurineHeight + 'px" src="' + src + '">' + (move['m'].substr(p.type == 'p' ? 0 : 1)));
            } else {
                ret.push(move[this.notationKey]);
            }
            ret.push('</span>');
        }
        if(this.showEval && move.eval){
            ret.push('<span class="notation-chess-move-eval notation-chess-move-eval-');
            if(move.eval < 0){
                ret.push('negative');
            }else{
                ret.push('positive');
            }
            ret.push('">' + move.eval + '</span>');
        }

        if (this.comments && move.comment) {
            ret.push('<span class="notation-comment">' + move.comment + '</span>')
        }
        ret.push('</span>');

        this.moveMap[move.uid] = move.uid;
        this.moveMapNotation[move.uid] = 'move-' + move.uid;

        return ret.join('');
    },


    updateMove: function (model, move) {
        var domEl = this.getEl().find('.dhtml-chess-move-container-' + move.uid);
        if (domEl.length) {
            domEl.html(this.getDomTextForAMove(move));
        } else {
            this.showMoves(model);
        }
        this.setCurrentMove(model);
    },

    appendMove: function (model, move) {

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
            branch.html(branch.html() + moveString);

        } else {
            this.showMoves(model);
        }
        this.setCurrentMove(model);
    },

    getDomBranch: function (move) {
        var domEl = jQuery("#" + this.moveMap[move.uid]);
        return domEl.closest('.notation-branch');
    },

    getFirstBranch: function () {
        return this.$b().getElement('.notation-branch');
    }
});