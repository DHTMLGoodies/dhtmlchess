/**
 This is an abstract class for documentation purpose only. It describes the structure of a move in chess.model.Game
 @module Model
 @namespace chess.model
 @class Move
 */
chess.model.Move = new Class({
	/**
	 from square, example "e2"
	 @property from
	 @type String
	 @example
		 {
			 from:'e7',
			 to:'e8',
			 promoteTo:'queen',
			 comment:'My comment',
			 m:'e8=Q',
			 lm:'e7-e8=Q'
		 }
	 */
	from:undefined,

	/**
	 to square, example "e4"
	 @property to
	 @type String
	 @example
	 	"to" : "e4"
	 */
	to:undefined,

	/**
	 Promotion info
	 @property promoteTo
	 @type String
	 @optional
	 @example
	 	"promoteTo": "queen"
	 */
	promoteTo:undefined,

	/**
	 Short notation
	 @property m
	 @type String
	 @example
	 	m: 'e4'
	 */
	 m:undefined,
	/**
	 Long notation
	 @property lm
	 @type String
	 @optional
	 @example
	 	lm: 'e2-e4'
	 */
	 lm:undefined,
	 /**
	 Comment
	 @property comment
	 @type String
	 @optional
	 @example
	 	"comment":"This is my comment"
	 */
	comment:undefined,

	/**
	 Array of variations. Each item in the array is an array of moves in that variation.
	 @property variations
	 @type Array
	 @optional
	 */
	variations:undefined,

	/**
	 Action - To be implemented
	 @property action
	 @type String
	 @optional
	 @example
	 	"action": "startAutoPlay"
	 */
	action:undefined,

	/**
	 * Internal move index property
	 * @property index
	 * @type Number
	 */
	index:undefined,

	/**
	 * Internal id property
	 * @property id
	 * @type String
	 */
	id:undefined


});
