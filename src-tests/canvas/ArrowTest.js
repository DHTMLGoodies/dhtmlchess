TestCase("ArrowTest", {
	"test_Should_Be_Able_To_Retrieve_Parent_Component" :function() {
	    // given
	    var arrow = new chess.view.highlight.Arrow({
	        view:new chess.view.board.Board()
	    });
	
	
	    // then
	    assertNotUndefined(arrow.view);
	},
	
	"test_should_create_DOM_and_insert_it_as_child_of_board" :function() {
	    // given
	    var arrow = new chess.view.highlight.Arrow({
	        view:new chess.view.board.Board()
	    });
	
	    // then
	    assertNotUndefined(arrow.getEl());
	    assertEquals(arrow.view.getBody(), document.id(arrow.getEl()).getParent('.ludo-body'));
	},
	
	"test_should_return_correct_coordinates_for_squares" :function() {
	    // given
	    var arrow = new chess.view.highlight.Arrow({
			view:new chess.view.board.Board()
	    });
	
	    // when
	    var coords = arrow.getCoordinates({
	        from:'e2', to:'e4'
	    });
	
	    // then
	    assertEquals(50, coords.x);
	    assertEquals(50, coords.y);
	    assertEquals(37.5, coords.height);
	    assertEquals(12.5, coords.width);
	    assertEquals(.5, coords.arrow.start.x);
	    assertEquals('s.y', 2.5, coords.arrow.start.y);
	    assertEquals('e.y', .5, coords.arrow.end.x);
	
	    // when
	    coords = arrow.getCoordinates({
	        from:'f1', to:'d1'
	    });
	
	    // then
	    assertEquals(37.5, coords.x);
	    assertEquals(7*12.5, coords.y);
	    assertEquals(12.5, coords.height);
	    assertEquals(37.5, coords.width);
	    assertEquals('s.x', 2.5, coords.arrow.start.x);
	    assertEquals('e.x', .5, coords.arrow.end.x);
	    assertEquals('s.y', .5, coords.arrow.start.y);
	    assertEquals('e.x', .5, coords.arrow.end.x);
	
	
	    coords = arrow.getCoordinates({
	        from:'g8', to:'f8'
	    });
	
	    // then
	
	    assertEquals(12.5, coords.height);
	    assertEquals(25, coords.width);
	
	
	    // when
	    coords = arrow.getCoordinates({
	        from:'g1', to:'f3'
	    });
	
	    // then
	    assertEquals(62.5, coords.x);
	    assertEquals(62.5, coords.y);
	    assertEquals(37.5, coords.height);
	    assertEquals(25, coords.width);
	    assertEquals('s.x', 1.5, coords.arrow.start.x);
	    assertEquals('e.x', .5, coords.arrow.end.x);
	    assertEquals('s.y', 2.5, coords.arrow.start.y);
	    assertEquals('e.y', .5, coords.arrow.end.y);
	
	    // when
	    coords = arrow.getCoordinates({
	        from:'a1', to:'h8'
	    });
	
	    // then
	    assertEquals('s.x', .5, coords.arrow.start.x);
	    assertEquals('s.y', 7.5, coords.arrow.start.y);
	    assertEquals('e.x', 7.5, coords.arrow.end.x);
	    assertEquals('e.y', .5, coords.arrow.end.y);
	
	
	},
	
	"test_should_return_correct_coordinates_for_black_moves" :function() {
	    // given
	    var arrow = new chess.view.highlight.Arrow({
	        view:new chess.view.board.Board()
	    });
	
	    // when
	    var coords = arrow.getCoordinates({
	        from:'e4', to:'e2'
	    });
	
	    // then
	    assertEquals(50, coords.x);
	    assertEquals(50, coords.y);
	    assertEquals(37.5, coords.height);
	    assertEquals(12.5, coords.width);
	    assertEquals('arrow.start.x wrong', .5, coords.arrow.start.x);
	    assertEquals('arrow.start.y wrong', .5, coords.arrow.start.y);
	    assertEquals('arrow.end.y wrong', 2.5, coords.arrow.end.y);
	
	},
	
	"test_should_find_coordinates_when_board_is_flipped" :function() {
	    // given
	    var board = new chess.view.board.Board();
	    var arrow = new chess.view.highlight.Arrow({
			view:board
	    });
	    board.flip();
	
	    // when
	    var coords = arrow.getCoordinates({
	        from:'e2', to:'e4'
	    });
	
	    // then
	    assertTrue(arrow.view.isFlipped());
	    assertEquals(37.5, coords.x);
	    assertEquals(12.5, coords.y);
	    assertEquals(37.5, coords.height);
	    assertEquals(12.5, coords.width);
	    assertEquals('s.x', .5, coords.arrow.start.x);
	    assertEquals('s.y', .5, coords.arrow.start.y);
	    assertEquals(.5, coords.arrow.end.x);
	    assertEquals(2.5, coords.arrow.end.y);
	
	
	    // when
	    coords = arrow.getCoordinates({
	        from:'g1', to:'f3'
	    });
	
	    // then
	
	    assertEquals(12.5, coords.x);
	    assertEquals(0, coords.y);
	    assertEquals(37.5, coords.height);
	    assertEquals(25, coords.width);
	    assertEquals('a.s.x', .5, coords.arrow.start.x);
	    assertEquals(.5, coords.arrow.start.y);
	    assertEquals(1.5, coords.arrow.end.x);
	    assertEquals(2.5, coords.arrow.end.y);
	},
	
	"test_should_get_correct_number_of_squares" :function() {
	    // given
	    var arrow = new chess.view.highlight.Arrow({
			view:new chess.view.board.Board()
	    });
	
	    // when
	    var coords = arrow.getCoordinates({
	        from:'g1', to:'f3'
	    });
	
	    // then
	    assertEquals(2, coords.squares.width);
	    assertEquals(3, coords.squares.height);
	
	},
	

	"test_should_get_correct_viewBox_size" :function() {
	    // given
	    var svg = new chess.view.board.ArrowSVG();
	
	    // when
	    var size = svg.getCoordinates({
	        squares:{
	            width:2,
	            height:3
	        },
	        arrow:{
	            start:{
	                x:.5,
	                y:.5
	            },
	            end:{
	                x:1.5,
	                y:1.5
	            }
	        }
	
	    });
	
	    // then
	    assertEquals(120, size.width);
	    assertEquals(180, size.height);
	
	},
	
	"test_should_get_correct_start_coordinates_for_arrow" :function() {
	    // given
	    var svg = new chess.view.board.ArrowSVG();
		svg.offsetEnd = 0;
	    // when
	    var c = svg.getCoordinates({
	        squares:{
	            width:2,
	            height:3
	        },
	        arrow:{
	            start:{
	                x:.5,
	                y:.5
	            },
	            end:{
	                x:1.5,
	                y:2.5
	            }
	        }
	    });
	
	    // then
	    assertEquals(30, c.start.x);
	    assertEquals(30, c.start.y);
	    assertEquals(150, c.end.y);
	    assertEquals(90, c.end.x);
	},
	
	getCoordinates : function(coords) {
	    var x1 = coords.s.x;
	    var y1 = coords.s.y;
	    var x2 = coords.e.x;
	    var y2 = coords.e.y;
	    return {
	        squares:{
	            width:Math.abs(x2 - x1) + 1,
	            height:Math.abs(y2 - y1) + 1
	        },
	        arrow:{
	            start:{
	                x:x1,
	                y:y1
	            },
	            end:{
	                x:x2,
	                y:y2
	            }
	        }
	    }
	},
	
	toDegrees : function(radians){
	    var ret = radians / Math.PI * 180;
	    if(ret < 0)ret +=360;
	    if(ret > 360)ret-=360;
	    return ret;
	},
	
	getAngle : function(from,to){
	    var arrow = new chess.view.highlight.Arrow({
			view:new chess.view.board.Board()
	    });
	    var coords = arrow.getCoordinates({
	        from:from, to:to
	    });
	
	    var svg = new chess.view.board.ArrowSVG();
	    var ret = svg.getCoordinates(coords);
	    return Math.round(svg.toDegrees(ret.angle));
	
	},
	
	"test_should_find_correct_angles" :function() {
	    // given
	    var angle = this.getAngle('e2','e4');
	    assertEquals(90, angle);
	
	    angle = this.getAngle('a1','h1');
	    assertEquals(0, angle);
	
	    angle = this.getAngle('h1','a1');
	    assertEquals(180, angle);
	
	    angle = this.getAngle('a1','b2');
	    assertEquals(45, angle);
	
	    angle = this.getAngle('f1','g3');
	    assertEquals(63, angle);
	
	    angle = this.getAngle('g1','f3');
	    assertEquals(90+27, angle);
	
	    angle = this.getAngle('g7','g5');
	    assertEquals(-90, angle);
	
	    angle = this.getAngle('g8','f6');
	    assertEquals(-90-27, angle);
	
	},
	
	"test_should_get_correct_line_size" :function() {
	    // given
	    var svg = new chess.view.board.ArrowSVG();
	    var coords = this.getCoordinates({s:{x:.5, y:.5}, e:{x:1.5, y:2.5}});
	
	    // when
	    var lineSize = svg.getLineSize(svg.getCoordinates(coords));
	
	    var expected = Math.sqrt(60 * 60 + 120 * 120);
	    // then
	    assertEquals(expected, lineSize);
	}


});