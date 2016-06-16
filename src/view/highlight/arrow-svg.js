chess.view.board.ArrowSVG = new Class({
	Extends:ludo.canvas.Canvas,

	squareSize:60,
	/*
	 * Width of arrow head
	 */
	arrowWidth:24,
	/*
	 * Height of arrow head
	 */
	arrowHeight:35,
	/*
	 * Width of arrow line
	 */
	lineWidth:10,
	/*
	 * Offset at arrow end(+ value = smaller arrow, measured from center of square)
	 */
	offsetEnd:15,
	/*
	 * Offset at start of arrow (positive value = smaller arrow - measured from center of square)
	 */
	offsetStart:0,
	/*
	 * Size of rounded edge
	 */
	roundEdgeSize:8,
	/*
	 * 0 = 90 degrees from line to left and right tip of arrow, positive value = less than 90 degrees
	 */
	arrowOffset:0,

	/**
	 @config arrowPaint
	 @type {ludo.canvas.Paint}
	 @example
	 */
	arrowPaint:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.arrowPaint !== undefined){
			this.arrowPaint = config.arrowPaint;
			this.adoptDef(this.arrowPaint);
		}
		this.createArrow();
	},

	createArrow:function () {
		var pathConfig = {};
		if(this.arrowPaint)pathConfig['class'] = this.arrowPaint;
		this.pathEl = new ludo.canvas.Node('path', pathConfig);
		this.adopt(this.pathEl);
		this.set('width', '100%');
		this.set('height', '100%');
	},

	getCoordinates:function (coordinates) {
		var ret = {
			width:coordinates.squares.width * this.squareSize,
			height:coordinates.squares.height * this.squareSize,
			start:{
				x:coordinates.arrow.start.x * this.squareSize,
				y:coordinates.arrow.start.y * this.squareSize
			},
			end:{
				x:coordinates.arrow.end.x * this.squareSize,
				y:coordinates.arrow.end.y * this.squareSize
			},
			squares:coordinates.squares
		};

		ret.oposite = (ret.start.y - ret.end.y);
		ret.adjacent = (ret.end.x - ret.start.x);
		ret.hyp = Math.sqrt(ret.oposite * ret.oposite + ret.adjacent * ret.adjacent);
		ret.cos = this.getCos(ret);
		ret.sin = this.getSin(ret);


		if (ret.cos < 0 && ret.sin >= 0) {
			ret.angle = Math.acos(ret.cos);
		} else {
			if (ret.cos < 0) {
				ret.angle = Math.acos(ret.cos) * -1
			} else {
				ret.angle = Math.asin(ret.sin);
			}
		}

		if (this.offsetEnd != 0) {
			ret.end.x -= this.offsetEnd * Math.cos(ret.angle);
			ret.end.y += this.offsetEnd * Math.sin(ret.angle);
		}
		if (this.offsetStart != 0) {
			ret.start.x += this.offsetStart * Math.cos(ret.angle);
			ret.start.y -= this.offsetStart * Math.sin(ret.angle);
		}


		return ret;
	},

	newPath:function (coordinates) {
		coordinates = this.getCoordinates(coordinates);
		this.setViewBox(coordinates.width, coordinates.height);
		this.pathEl.set('d', this.getPath(coordinates));
	},

	getPath:function (coordinates) {

		var points = this.getPoints(coordinates);
		var path = '';
		for (var i = 0; i < points.length; i++) {
			path += points[i].tag ? points[i].tag + ' ' : '';
			path += Math.round(points[i].x) + ',' + Math.round(points[i].y) + ' ';
		}
		return path;
	},

	getPoints:function (c) {
		var ret = [];
		ret.push({x:c.end.x, y:c.end.y, tag:'M'});
		var cos2 = Math.cos(c.angle + Math.PI / 2);
		var sin2 = Math.sin(c.angle + Math.PI / 2);

		ret.push(
			{
				tag:'L',
				x:c.end.x - this.arrowHeight * c.cos + (this.arrowWidth / 2 * cos2),
				y:c.end.y + this.arrowHeight * c.sin - (this.arrowWidth / 2 * sin2)
			});


		ret.push(
			{
				x:c.end.x - (this.arrowHeight - this.arrowOffset) * c.cos + (this.lineWidth / 2 * cos2),
				y:c.end.y + (this.arrowHeight - this.arrowOffset) * c.sin - (this.lineWidth / 2 * sin2)
			});


		ret.push(
			{
				x:c.start.x + (this.lineWidth / 2 * cos2),
				y:c.start.y - (this.lineWidth / 2 * sin2)
			});

		var nextTag = 'L';
		if (this.roundEdgeSize > 0) {
			ret.push({
				tag:'C',
				x:c.start.x - (this.roundEdgeSize * c.cos) + (this.lineWidth / 2 * cos2),
				y:c.start.y + (this.roundEdgeSize * c.sin) - (this.lineWidth / 2 * sin2)
			});
			ret.push({
				x:c.start.x - (this.roundEdgeSize * c.cos) - (this.lineWidth / 2 * cos2),
				y:c.start.y + (this.roundEdgeSize * c.sin) + (this.lineWidth / 2 * sin2)
			});
			ret.push(
				{
					x:c.start.x - (this.lineWidth / 2 * cos2),
					y:c.start.y + (this.lineWidth / 2 * sin2)
				});
			nextTag = 'M';
		}

		ret.push(
			{
				tag:nextTag,
				x:c.start.x - (this.lineWidth / 2 * cos2),
				y:c.start.y + (this.lineWidth / 2 * sin2)
			});


		ret.push(
			{
				tag:'L',
				x:c.end.x - (this.arrowHeight - this.arrowOffset) * c.cos - (this.lineWidth / 2 * cos2),
				y:c.end.y + (this.arrowHeight - this.arrowOffset) * c.sin + (this.lineWidth / 2 * sin2)
			});

		ret.push(
			{
				x:c.end.x - this.arrowHeight * c.cos - (this.arrowWidth / 2 * cos2),
				y:c.end.y + this.arrowHeight * c.sin + (this.arrowWidth / 2 * sin2)
			});
		ret.push({x:c.end.x, y:c.end.y});

		return ret;
	},

	toDegrees:function (radians) {
		return radians * 180 / Math.PI;
	},

	toRadians:function (degrees) {
		return degrees / 180 * Math.PI;
	},

	getLineSize:function (c) {
		var w = c.width - this.squareSize;
		var h = c.height - this.squareSize;
		return Math.sqrt(w * w + h * h);
	},

	getAngles:function (c) {
		return {
			line:c.angle,
			arrow1:c.angle + Math.PI / 2,
			arrow2:c.angle - Math.PI / 2
		};
	},

	getSin:function (c) {
		return (c.start.y - c.end.y) / c.hyp;
	},

	getCos:function (c) {
		return (c.end.x - c.start.x) / c.hyp;
	}
});