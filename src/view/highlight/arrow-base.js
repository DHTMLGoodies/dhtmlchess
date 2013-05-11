chess.view.highlight.ArrowBase = new Class({
	Extends:chess.view.highlight.Base,
	module:'chess',
	submodule:'arrowHiglight',
	canvas:undefined,
	files:['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
	arrowPaint:undefined,

	currentMove:undefined,

	arrowStyles:{
		'stroke-linejoin':'round',
		stroke:'none',
		fill:'#a7311e',
		'stroke-opacity':.8,
		'fill-opacity':.6
	},
	ludoConfig:function (config) {
		this.parent(config);
		if (config.styles !== undefined) {
			this.arrowStyles = Object.merge(this.arrowStyles, config.styles);
		}
		this.arrowPaint = new ludo.canvas.Paint(Object.clone(this.arrowStyles));
		this.createDOM();

		this.getParent().addEvent('flip', this.flip.bind(this));

        this.el.addEvent(ludo.util.getDragStartEvent(), this.initDragPiece.bind(this));
	},

	initDragPiece:function (e) {
		if (this.getParent().ddEnabled) {
			var pos = this.getParent().getBoard().getPosition();
			var coords = {
				x:e.page.x - pos.x,
				y:e.page.y - pos.y
			};

			var ss = this.getParent().getSquareSize();

            coords.x -= (coords.x % ss);
            coords.y -= (coords.y % ss);

			var square = Board0x88Config.numberToSquareMapping[this.getParent().getSquareByCoordinates(coords.x, coords.y)];
			var piece = this.getParent().getPieceOnSquare(square);

			if (piece) {
				piece.initDragPiece(e);
			}
		}
	},

	createDOM:function () {
		var el = this.el = new Element('div');
		el.style.position = 'absolute';
		el.style.display = 'none';
		this.getParent().getBoard().adopt(el);
		this.arrow = new chess.view.board.ArrowSVG({
			renderTo:this.el,
			arrowPaint:this.arrowPaint
		});
	},

	flip:function () {
		if (this.currentMove) {
			this.showMove(this.currentMove);
		}
	},

	showMove:function (move) {

		this.currentMove = move;
		var coordinates = this.getCoordinates(move);
		this.show();
		this.increaseZIndex();
		this.el.setStyles({
			left:coordinates.x + '%',
			top:coordinates.y + '%',
			width:coordinates.width + '%',
			height:coordinates.height + '%'
		});
		this.arrow.newPath(coordinates);

	},
	increaseZIndex:function () {
		ludo_CHESS_PIECE_GLOBAL_Z_INDEX++;
		this.el.style.zIndex = ludo_CHESS_PIECE_GLOBAL_Z_INDEX;
	},

	getEl:function () {
		return this.el;
	},

	hide:function () {
		this.currentMove = undefined;
		this.el.style.display = 'none';
	},
	show:function () {
		this.el.style.display = '';
	},

	getCoordinates:function (move) {
		var fromRank = (Board0x88Config.mapping[move.from] & 240) / 16;
		var toRank = (Board0x88Config.mapping[move.to] & 240) / 16;

		var fromFile = (Board0x88Config.mapping[move.from] & 15);
		var toFile = (Board0x88Config.mapping[move.to] & 15);

		if (this.getParent().isFlipped()) {
			fromRank = 7 - fromRank;
			toRank = 7 - toRank;
			fromFile = 7 - fromFile;
			toFile = 7 - toFile;
		}

		var squares = {
			width:Math.abs(fromFile - toFile) + 1,
			height:Math.abs(fromRank - toRank) + 1
		};

		return {
			x:Math.min(fromFile, toFile) * 12.5,
			y:87.5 - (Math.max(fromRank, toRank) * 12.5),
			height:12.5 + Math.abs(fromRank - toRank) * 12.5,
			width:12.5 + Math.abs(fromFile - toFile) * 12.5,
			arrow:{
				start:{
					x:fromFile < toFile ? .5 : squares.width - .5,
					y:fromRank > toRank ? .5 : squares.height - .5
				}, end:{
					x:fromFile > toFile ? .5 : squares.width - .5,
					y:fromRank < toRank ? .5 : squares.height - .5
				}
			},
			squares:{
				width:Math.abs(fromFile - toFile) + 1,
				height:Math.abs(fromRank - toRank) + 1
			}
		};
	}
});

