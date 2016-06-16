TestCase("PositionValidatorTest", {

	getValidator : function() {
	    return new chess.parser.PositionValidator();
	},
	
	"testShouldValidateDefaultPosition" :function() {
	    // given
	    var validator = this.getValidator();
	
	    // when
	    var defaultPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
	
	    assertTrue(validator.isValid(defaultPosition));
	},
	
	"testShouldNotValidatePositionWhenBlackKingIsMissing" :function(){
	    // given
	    var validator = this.getValidator();
	    // when
	    var positionWithNoBlackKing = '8/7p/6p1/5p2/8/5P2/6PP/6K1 w KQkq d 0 1';
	    // then
	    assertFalse(validator.isValid(positionWithNoBlackKing));
	},
	
	"testShouldNotValidatePositionWhenBothKingsAreMissing" :function(){
	    // given
	    var validator = this.getValidator();
	    // when
	    var positionNoKing = '8/8/8/8/8/8/8/8 w KQkq - 0 0';
	    // then
	    assertFalse(validator.isValid(positionNoKing));
	},
	
	"testShouldNotValidatePositionWhenOppositeKingIsInCheckAndItsMyMove" :function(){
	    // given
	    var validator = this.getValidator();
	    // when
	    var posBlackKingInCheckAndWhiteToMove = '7k/7p/6p1/8/8/2B2P2/6PP/6K1 w KQkq - 0 0';
	
	    // then
	    assertFalse(validator.isValid(posBlackKingInCheckAndWhiteToMove));
	}
});