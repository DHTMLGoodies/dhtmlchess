/**
 Class for move validation. This class is used by chess.model.Game
 @namespace chess.parser
 @class Move0x88
 @uses chess.parser.FenParser0x88
 @constructor
 @example
 	var validator = new chess.parser.Move0x88();
 	var valid = validator.isValid(
 		{ from : 'h7', to : 'h6' },
 		'r1bq1rk1/ppppbppp/2n2n2/4p3/2B1P3/2N2N1P/PPPP1PP1/R1BQ1RK1 b - 2 6'
 	);
 	if(valid){ alert('Move is valid') } else { alert('Move is invalid') };
 */
chess.parser.Move0x88 = new Class({

    newFen:'',
    originalFen:'',
    removedSquares:[],
	parser:undefined,
    initialize:function () {
        this.parser = new chess.parser.FenParser0x88();
    },

    moveConfig:{
        added:{},
        removed:{}
    },

	hasThreeFoldRepetition:function(fens){
		return this.parser.hasThreeFoldRepetition(fens);
	},

	/**
	 * @method getMoveByNotation
	 * @param {String} notation
	 * @param {String} pos
	 * @return {chess.model.Move}
	 */
	getMoveByNotation:function(notation, pos){
		this.parser.setFen(pos);
		return this.parser.getFromAndToByNotation(notation);
	},

	/**
	 * Returns true if a move is valid
	 * @method isValid
	 * @param {Object} move
	 * @param fen
	 * @return {Boolean}
	 */
    isValid:function (move, fen) {
        if (move.fen) {
            return true;
        }
        this.parser.setFen(fen);
        var obj = this.parser.getValidMovesAndResult();

        if (obj.result !== 0) {
            return false;
        }

        var moves = obj.moves[this.getNumSquare(move.from)];

        return moves && moves.indexOf(this.getNumSquare(move.to)) >= 0;

    },

    getNumSquare:function (square) {
        return Board0x88Config.mapping[square];
    },


    getMoveConfig:function (move, fen) {

        if(move.m !== undefined && move.m && move.m === '--'){
            var newFen = this.getFenWithColorSwitched(fen);
            this.parser.setFen(newFen);
            return {
                notation : move.m,
                moves : [],
                fen : newFen
            }
        }
        this.parser.setFen(fen);

        this.parser.move(move);
        return {
            fen:move.fen ? move.fen : this.parser.getFen(),
            m: this.parser.getNotation(),
            lm: this.parser.getLongNotation(),
            moves:this.parser.getPiecesInvolvedInLastMove(),
            from:move.from,
            promoteTo : move.promoteTo,
            comment : move.comment,
            to:move.to,
            variations:move.variations || []
        };
    },

    getFenWithColorSwitched : function(fen){
        if(fen.indexOf(' w ')>=0){
            fen = fen.replace(' w ', ' b ');
        }else{
            fen = fen.replace(' b ', ' w ');
        }
        return fen;
    },

	/**
	 * Returns true if a move is promotion move
	 * @method isPromotionMove
	 * @param {Object} move
	 * @param {String} fen
	 * @return {Boolean} valid
	 */
    isPromotionMove:function (move, fen) {
        this.parser.setFen(fen);
        var squareFrom = this.getNumSquare(move.from);
        var squareTo = this.getNumSquare(move.to);

        var color = this.parser.getColor();

        if (color === 'white' && (squareFrom & 240) / 16 == 6 && (squareTo & 240) / 16 == 7) {
            return this.isPawnOnSquare(squareFrom);
        }

        if (color === 'black' && (squareFrom & 240) / 16 == 1 && (squareTo & 240) / 16 == 0) {
            return this.isPawnOnSquare(squareFrom);
        }

        return false;
    },

    isPawnOnSquare : function(square) {
        var piece = this.parser.getPieceOnSquare(square);
        return piece.type === 'pawn';
    }
});